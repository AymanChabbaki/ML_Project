from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictionRequest, PredictionResponse
from .predictor import predictor

app = FastAPI(
    title="Tox21 Prediction API",
    description="FastAPI backend serving the Tox21 Consensus Models.",
    version="1.0.0"
)

# Allow CORS for potential frontend integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "loaded_models": len(predictor.endpoints),
        "endpoints": list(predictor.endpoints.keys())
    }

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(request: PredictionRequest):
    if not predictor.endpoints:
        raise HTTPException(status_code=500, detail="Models not loaded properly.")
    
    response = predictor.predict(request.smiles)
    return response

@app.get("/structure", tags=["Visualization"])
def get_structure(smiles: str):
    svg_content = predictor.get_structure_svg(smiles)
    if not svg_content:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or drawing error.")
    return Response(content=svg_content, media_type="image/svg+xml")

@app.get("/structure3d", tags=["Visualization"])
def get_structure_3d(smiles: str):
    mol_block = predictor.get_structure_3d(smiles)
    if not mol_block:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or embedding error.")
    return Response(content=mol_block, media_type="text/plain")

# To run locally: uvicorn app.main:app --reload


