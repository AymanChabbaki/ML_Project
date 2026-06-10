# Project Explanation: From attempt0 to Deployment

This document explains the full Tox21 project path, starting from the early exploratory notebook work and ending with the deployed application.

## 1. Project Goal

The goal of the project is to predict toxicity across the 12 Tox21 endpoints using molecular structure as input. A SMILES string is converted into a fixed molecular fingerprint, then passed through endpoint-specific machine learning models to estimate whether a compound is active or inactive for each biological assay.

The 12 endpoints cover nuclear receptor and stress-response biology:

- NR-AR
- NR-AR-LBD
- NR-AhR
- NR-Aromatase
- NR-ER
- NR-ER-LBD
- NR-PPAR-gamma
- SR-ARE
- SR-ATAD5
- SR-HSE
- SR-MMP
- SR-p53

## 2. attempt0: First Exploration Phase

The first notebook, [attempt0.ipynb](attempt0.ipynb), is the exploratory starting point. It contains the earliest version of the workflow and is where the project begins to turn raw chemistry data into something modelable.

At this stage, the work is focused on:

- loading the Tox21 dataset
- checking the structure and quality of the data
- converting SMILES strings into RDKit-based molecular fingerprints
- trying initial model ideas
- inspecting outputs and failure cases

The notebook includes many executed cells with intermediate outputs, which suggests it was used as an experimental sandbox. That is typical for the first stage of a modeling project: the main objective is to understand the data and discover which modeling choices are viable before any production pipeline is finalized.

## 3. attempt1: Refinement and Cleaner Modeling

The second notebook, [attempt1.ipynb](attempt1.ipynb), is a refinement pass. It is still exploratory, but it is more structured than the first attempt and serves as a transition between raw experimentation and a production-ready pipeline.

In practical terms, this phase is about tightening the workflow around the ideas that proved useful in the first attempt:

- stronger preprocessing discipline
- clearer fingerprint-based feature engineering
- more systematic evaluation of classification results
- preparing the modeling logic for serialization and reuse

This is the point where the project starts moving away from notebook-only experimentation and toward a repeatable pipeline.

## 4. bestapproach: Final Training Pipeline

The final modeling notebook, [bestapproach.ipynb](bestapproach.ipynb), is the production training pipeline. The companion summary in [bestapproach_summary.md](bestapproach_summary.md) describes the full design in detail.

The final approach uses:

- RDKit Morgan fingerprints with radius 2 and 1024 bits
- endpoint-specific variance thresholding
- endpoint-specific feature selection
- Bernoulli Naive Bayes
- XGBoost
- weighted consensus scoring
- per-endpoint threshold optimization using MCC

The key idea is that no single threshold or single model is ideal for all endpoints. Each assay behaves differently, so the project learns an endpoint-specific pipeline instead of forcing a one-size-fits-all classifier.

### Why this approach was chosen

The final model design is intended to be:

- biologically interpretable
- robust to class imbalance
- practical to serialize
- reusable for inference
- easier to explain than a black-box deep learning system

### What gets saved

The notebook writes production model bundles into `tox21_production_models/`. Each saved artifact contains the pieces needed for inference:

- variance threshold selector
- feature selector
- BernoulliNB model
- XGBoost model
- consensus weights
- optimal threshold
- endpoint metadata and summary metrics

That means the training notebook is not only for analysis. It also produces the exact artifacts used later by the backend.

## 5. Backend API

The backend lives in [tox-api](tox-api) and exposes the inference layer through FastAPI.

The main application is in [tox-api/main.py](tox-api/main.py). It provides:

- `GET /health`
- `POST /predict`
- `GET /structure`
- `GET /structure3d`

The prediction route accepts a list of SMILES strings, runs them through the saved models, and returns endpoint-level toxicity predictions. The backend also includes a global predictor instance that loads the serialized model bundles at startup.

### How inference works

1. The request sends one or more SMILES strings.
2. Each SMILES string is converted to a Morgan fingerprint.
3. The fingerprint is filtered through the saved feature pipeline.
4. BernoulliNB and XGBoost each produce a probability.
5. The probabilities are combined using endpoint-specific weights.
6. The result is compared to the optimized threshold.
7. The API returns a structured JSON response for each molecule and endpoint.

This logic is implemented in [tox-api/predictor.py](tox-api/predictor.py).

## 6. Frontend UI

The frontend is a React + Vite app in [frontend](frontend). It uses [frontend/src/api.js](frontend/src/api.js) to call the backend through an `/api` base path.

The main prediction page is [frontend/src/pages/Predict.jsx](frontend/src/pages/Predict.jsx). It:

- lets the user enter a SMILES string
- calls `POST /predict`
- displays the endpoint predictions
- fetches 2D structure renderings
- optionally shows a 3D structure
- falls back to a mock sandbox mode if the backend is unavailable

That fallback behavior makes the UI resilient during development and deployment checks.

## 7. Local and Production Routing

There are two request-routing layers:

- During local development, [frontend/vite.config.js](frontend/vite.config.js) proxies `/api` to `http://localhost:8000`.
- In the deployed container stack, [docker/nginx.conf](docker/nginx.conf) proxies traffic to the backend service.

This means the frontend can keep using `/api/predict` while the actual backend can stay on its own internal port and deployment topology.

## 8. Deployment

The deployment setup is container-based and is defined by [docker-compose.yml](docker-compose.yml) and the backend Docker image in [tox-api/Dockerfile](tox-api/Dockerfile).

### Backend container

The backend container:

- installs Python dependencies
- installs the system libraries needed by RDKit and XGBoost
- copies the backend source into the image
- launches Uvicorn through [tox-api/start.sh](tox-api/start.sh)

### Reverse proxy

The Nginx proxy handles routing and security headers. In the compose setup it forwards requests to the backend service and keeps the public surface clean.

### Model volume

The production model directory is mounted into the backend container, so the saved `pkl` files produced by the notebook are the same artifacts used at inference time.

## 9. End-to-End Story

The project progression is:

1. Start with [attempt0.ipynb](attempt0.ipynb) to explore the dataset and establish the baseline modeling path.
2. Use [attempt1.ipynb](attempt1.ipynb) to refine the modeling workflow.
3. Finalize the training logic in [bestapproach.ipynb](bestapproach.ipynb).
4. Save reusable endpoint models into `tox21_production_models/`.
5. Load those models in the FastAPI backend.
6. Expose prediction and structure endpoints.
7. Connect the React frontend to the API.
8. Package everything in Docker for deployment.

## 10. What the User Sees

From the user’s point of view, the deployed app is simple:

- enter a SMILES string
- click predict
- see toxicity probabilities for all 12 Tox21 endpoints
- inspect 2D and 3D molecular views

Behind the scenes, the app is using the notebook-trained consensus pipeline and the production container stack.

## 11. Related Files

- [attempt0.ipynb](attempt0.ipynb)
- [attempt1.ipynb](attempt1.ipynb)
- [bestapproach.ipynb](bestapproach.ipynb)
- [bestapproach_summary.md](bestapproach_summary.md)
- [tox-api/main.py](tox-api/main.py)
- [tox-api/predictor.py](tox-api/predictor.py)
- [frontend/src/pages/Predict.jsx](frontend/src/pages/Predict.jsx)
- [docker-compose.yml](docker-compose.yml)
