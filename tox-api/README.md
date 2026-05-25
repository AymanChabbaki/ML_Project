---
title: Tox21 Backend API
emoji: "🧪"
colorFrom: blue
colorTo: green
sdk: docker
sdk_version: "1.0.0"
app_file: app.py
pinned: false
---

# Tox21 Backend on Hugging Face Spaces

This backend can run as a Hugging Face Docker Space.

## Runtime
- The container listens on `PORT`.
- Local development/default Docker compose uses `8000`.
- Hugging Face Spaces sets `PORT` automatically, typically `7860`.

## Build
The image is already ready for Docker Spaces via `backend/Dockerfile`.

## Environment Variables
Set these in the Space settings if needed:
- `CORS_ALLOW_ORIGINS` = your frontend domain, for example `https://toxpredictor.techermanos.org`
- `ALLOWED_HOSTS` = include your Space host if you access it directly
- `ENABLE_API_DOCS` = `true` if you want `/docs`

## Notes
- `start.sh` uses the `PORT` environment variable automatically.
- The backend still serves the same routes:
  - `GET /health`
  - `POST /predict`
  - `GET /structure`
  - `GET /structure3d`
