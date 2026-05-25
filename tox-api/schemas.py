from typing import Dict, List, Optional

from pydantic import BaseModel, Field, conlist, constr

class PredictionRequest(BaseModel):
    smiles: conlist(
        constr(strip_whitespace=True, min_length=1, max_length=256),
        min_length=1,
        max_length=64,
    ) = Field(
        ...,
        description="List of SMILES strings to predict.",
        example=["CC(=O)OC1=CC=CC=C1C(=O)O"],
    )

class EndpointPrediction(BaseModel):
    is_active: bool
    probability: float
    optimal_threshold: float

class MoleculePredictionResponse(BaseModel):
    smiles: str
    is_valid: bool
    error: Optional[str] = None
    predictions: Dict[str, EndpointPrediction] = Field(default_factory=dict)

class PredictionResponse(BaseModel):
    results: List[MoleculePredictionResponse]
