import os

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictionRequest, PredictionResponse
from .predictor import predictor

app = FastAPI(
    title="Tox21 Prediction API",
    description="FastAPI backend serving the Tox21 Consensus Models.",
    version="1.0.0"
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://toxpredictor.techermanos.org",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _cors_response(content: str, media_type: str, request: Request) -> Response:
    headers = {}
    origin = request.headers.get("origin")
    if origin in ALLOWED_ORIGINS:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Vary"] = "Origin"
    return Response(content=content, media_type=media_type, headers=headers)

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
def get_structure(smiles: str, request: Request):
    svg_content = predictor.get_structure_svg(smiles)
    if not svg_content:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or drawing error.")
    return _cors_response(svg_content, "image/svg+xml", request)

@app.get("/structure3d", tags=["Visualization"])
def get_structure_3d(smiles: str, request: Request):
    mol_block = predictor.get_structure_3d(smiles)
    if not mol_block:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or embedding error.")
    return _cors_response(mol_block, "text/plain", request)

# To run locally: uvicorn app.main:app --reload


