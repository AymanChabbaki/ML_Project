FROM python:3.10-slim

# Install system dependencies (e.g. libgomp1 for xgboost and other shared libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libxrender1 \
    libxext6 \
    libsm6 \
    libexpat1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
