from pydantic import BaseModel, Field
from typing import List, Dict

class PredictionRequest(BaseModel):
    smiles: List[str] = Field(..., description="List of SMILES strings to predict.", example=["CC(=O)OC1=CC=CC=C1C(=O)O"])

class EndpointPrediction(BaseModel):
    is_active: bool
    probability: float
    optimal_threshold: float

class MoleculePredictionResponse(BaseModel):
    smiles: str
    is_valid: bool
    error: str = None
    predictions: Dict[str, EndpointPrediction] = {}

class PredictionResponse(BaseModel):
    results: List[MoleculePredictionResponse]
