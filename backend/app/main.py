import os
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware
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

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1,0.0.0.0,backend,toxpredictor.techermanos.org,*.techermanos.org",
    ).split(",")
    if host.strip()
]

RATE_LIMIT_REQUESTS_PER_MINUTE = int(os.getenv("API_RATE_LIMIT_REQUESTS_PER_MINUTE", "120"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("API_RATE_LIMIT_WINDOW_SECONDS", "60"))
_REQUEST_HISTORY = defaultdict(deque)
_REQUEST_HISTORY_LOCK = Lock()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=ALLOWED_HOSTS,
)


def _get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "").strip()
    if forwarded_for:
        first_ip = forwarded_for.split(",")[0].strip()
        if first_ip:
            return first_ip

    real_ip = request.headers.get("x-real-ip", "").strip()
    if real_ip:
        return real_ip

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


@app.middleware("http")
async def request_rate_limiter(request: Request, call_next):
    client_ip = _get_client_ip(request)
    current_time = time.monotonic()

    with _REQUEST_HISTORY_LOCK:
        request_times = _REQUEST_HISTORY[client_ip]
        cutoff = current_time - RATE_LIMIT_WINDOW_SECONDS
        while request_times and request_times[0] <= cutoff:
            request_times.popleft()

        if len(request_times) >= RATE_LIMIT_REQUESTS_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please slow down."},
            )

        request_times.append(current_time)

    return await call_next(request)


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
def get_structure(request: Request, smiles: str = Query(..., min_length=1, max_length=256)):
    svg_content = predictor.get_structure_svg(smiles)
    if not svg_content:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or drawing error.")
    return _cors_response(svg_content, "image/svg+xml", request)

@app.get("/structure3d", tags=["Visualization"])
def get_structure_3d(request: Request, smiles: str = Query(..., min_length=1, max_length=256)):
    mol_block = predictor.get_structure_3d(smiles)
    if not mol_block:
        raise HTTPException(status_code=400, detail="Invalid SMILES string or embedding error.")
    return _cors_response(mol_block, "text/plain", request)

# To run locally: uvicorn app.main:app --reload


