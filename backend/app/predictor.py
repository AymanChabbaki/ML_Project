import os
import joblib
import numpy as np
import warnings
from rdkit import Chem
from rdkit.Chem import AllChem
from typing import List
from .schemas import PredictionResponse, MoleculePredictionResponse, EndpointPrediction

class Tox21Predictor:
    def __init__(self, models_dir: str = None):
        self.models_dir = self._resolve_models_dir(models_dir)
        self.endpoints = {}
        self.load_models()

    def _resolve_models_dir(self, models_dir: str = None) -> str:
        if models_dir:
            return os.path.abspath(models_dir)

        env_models_dir = os.getenv("TOX21_MODELS_DIR") or os.getenv("MODELS_DIR")
        if env_models_dir:
            return os.path.abspath(env_models_dir)

        candidates = [
            "/app/tox21_production_models",
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "tox21_production_models")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tox21_production_models")),
        ]

        for candidate in candidates:
            if os.path.exists(candidate):
                return candidate

        return candidates[0]

    def load_models(self):
        if not os.path.exists(self.models_dir):
            print(f"Warning: Models directory {self.models_dir} does not exist.")
            return
        
        # Suppress scikit-learn unpickle warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            for f in os.listdir(self.models_dir):
                if f.endswith(".pkl"):
                    pkl_path = os.path.join(self.models_dir, f)
                    try:
                        data = joblib.load(pkl_path)
                        ep_name = data.get("endpoint_name", f.replace(".pkl", ""))
                        self.endpoints[ep_name] = data
                    except Exception as e:
                        print(f"Failed to load {f}: {e}")

    def smiles_to_fingerprint(self, smiles: str):
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return None
        # Use Morgan fingerprint as used in training: radius 2, 1024 bits
        fp = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=1024)
        arr = np.zeros((0,), dtype=np.int8)
        Chem.DataStructs.ConvertToNumpyArray(fp, arr)
        return arr.reshape(1, -1)

    def predict(self, smiles_list: List[str]) -> PredictionResponse:
        results = []
        for smiles in smiles_list:
            fp_array = self.smiles_to_fingerprint(smiles)
            if fp_array is None:
                results.append(MoleculePredictionResponse(
                    smiles=smiles,
                    is_valid=False,
                    error="Invalid SMILES string."
                ))
                continue
            
            predictions = {}
            for ep_name, bundle in self.endpoints.items():
                try:
                    # Extract pipeline components
                    var_thresh = bundle["var_thresh"]
                    model_selector = bundle["model_selector"]
                    nb_model = bundle["nb_model"]
                    xgb_model = bundle["xgb_model"]
                    w_nb = bundle["w_nb"]
                    w_xgb = bundle["w_xgb"]
                    optimal_thresh = bundle["optimal_thresh"]

                    # Transform features
                    X_vt = var_thresh.transform(fp_array)
                    X_sel = model_selector.transform(X_vt)

                    # Model inference
                    nb_prob = nb_model.predict_proba(X_sel)[0, 1]
                    # XGBoost might require float32 depending on version
                    xgb_prob = xgb_model.predict_proba(X_sel.astype(np.float32))[0, 1]

                    # Consensus weighted sum
                    consensus_prob = float(w_nb * nb_prob + w_xgb * xgb_prob)
                    is_active = bool(consensus_prob >= optimal_thresh)

                    predictions[ep_name] = EndpointPrediction(
                        is_active=is_active,
                        probability=consensus_prob,
                        optimal_threshold=optimal_thresh
                    )
                except Exception as e:
                    print(f"Error predicting {ep_name} for {smiles}: {e}")
            
            results.append(MoleculePredictionResponse(
                smiles=smiles,
                is_valid=True,
                predictions=predictions
            ))

        return PredictionResponse(results=results)

    def get_structure_svg(self, smiles: str) -> str:
        from rdkit.Chem.Draw import rdMolDraw2D
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return ""
        try:
            Chem.rdDepictor.Compute2DCoords(mol)
            drawer = rdMolDraw2D.MolDraw2DSVG(350, 350)
            drawer.DrawMolecule(mol)
            drawer.FinishDrawing()
            return drawer.GetDrawingText()
        except Exception as e:
            print(f"Error drawing molecule {smiles}: {e}")
            return ""

    def get_structure_3d(self, smiles: str) -> str:
        from rdkit.Chem import AllChem
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return ""
        try:
            mol = Chem.AddHs(mol)
            AllChem.EmbedMolecule(mol, randomSeed=42)
            AllChem.MMFFOptimizeMolecule(mol)
            return Chem.MolToMolBlock(mol)
        except Exception as e:
            print(f"Error generating 3D structure for {smiles}: {e}")
            return ""

# Initialize a global predictor instance
predictor = Tox21Predictor()
