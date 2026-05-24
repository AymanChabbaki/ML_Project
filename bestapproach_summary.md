# Tox21 Consensus Pipeline Summary

This document summarizes the work implemented in [bestapproach.ipynb](bestapproach.ipynb) and the reasoning behind the pipeline design.

## Goal
Build a data-driven toxicity prediction workflow for the 12 Tox21 biological endpoints using classical machine learning, endpoint-specific feature selection, consensus modeling, and dynamic threshold optimization.

## What the 12 endpoints mean
- NR-AR: androgen receptor activity
- NR-AR-LBD: androgen receptor ligand-binding domain activity
- NR-AhR: aryl hydrocarbon receptor activity
- NR-Aromatase: aromatase inhibition / disruption
- NR-ER: estrogen receptor activity
- NR-ER-LBD: estrogen receptor ligand-binding domain activity
- NR-PPAR-gamma: PPAR-gamma activity linked to metabolic regulation
- SR-ARE: antioxidant response element stress response
- SR-ATAD5: DNA-damage / replication stress response
- SR-HSE: heat shock response
- SR-MMP: mitochondrial membrane potential disruption
- SR-p53: p53-mediated DNA-damage response

These endpoints cover nuclear receptor pathways and stress-response pathways, which are central to toxicology screening.

## Notebook structure
### 1. Opening overview
The notebook now begins with a paper-style introduction that explains:
- why Tox21 is hard
- why the endpoints matter
- why imbalance is a major issue
- why the notebook uses a consensus pipeline
- why saved-model inference is part of the workflow

### 2. Data loading and fingerprint generation
The pipeline loads the Tox21 CSV from DeepChem and builds fixed-length ECFP4 / Morgan fingerprints using RDKit.

Key choices:
- radius = 2
- fingerprint length = 1024 bits
- invalid SMILES are removed before modeling
- RDKit warnings are suppressed for clean execution

### 3. EDA and RDKit visual checks
A full EDA section was added at the top of the notebook, including:
- label-balance tables per endpoint
- active-rate bar charts
- missing-label rate charts
- example molecule grids
- endpoint-specific molecule examples for:
  - NR-ER
  - NR-AhR
  - SR-p53

Purpose:
- show how imbalanced each assay is
- make the chemistry more interpretable
- connect abstract fingerprints with real molecular structures

### 4. Endpoint-specific feature selection
For each endpoint, the notebook uses a two-stage feature reduction strategy:
- Variance thresholding to remove nearly constant fingerprint bits
- Random Forest feature selection to keep only the most informative substructures

Reason:
- fingerprint vectors are sparse and noisy
- each endpoint may depend on different substructures
- feature selection improves signal-to-noise ratio and reduces dimensionality

### 5. Consensus modeling
The model stack for each endpoint is:
- Bernoulli Naïve Bayes
- XGBoost

The two model probabilities are combined using ROC-AUC-based weights.

Reason:
- BernoulliNB is fast and strong for binary fingerprint inputs
- XGBoost captures nonlinear interactions
- weighting by test-set ROC-AUC favors the stronger branch for each endpoint

### 6. Dynamic threshold optimization
Instead of using a fixed 0.50 cutoff, the notebook searches thresholds from 0.10 to 0.95 and selects the value that maximizes Matthews Correlation Coefficient (MCC).

Reason:
- imbalance makes 0.50 a weak default
- MCC is more robust than accuracy for skewed binary tasks
- optimal thresholds vary by biological pathway

### 7. Saved pipeline artifacts
For each endpoint, the notebook saves a pipeline bundle into `tox21_production_models/`.

Each saved bundle includes:
- endpoint name
- variance threshold selector
- Random Forest feature selector
- BernoulliNB model
- XGBoost model
- ensemble weights
- optimal threshold
- final ROC-AUC
- final MCC
- number of selected features
- train/test counts
- class-balance counts

This makes the pipeline reproducible and reusable without retraining.

### 8. Charts from saved PKL artifacts
A dedicated reporting section now reads the saved PKL files and generates charts directly from the serialized model summaries.

These charts include:
- ROC-AUC by endpoint
- MCC by endpoint
- optimal threshold by endpoint
- number of retained features by endpoint
- BernoulliNB vs XGBoost consensus weights
- a heatmap of the saved summary metrics

This keeps the reporting tied to the actual saved models, not just the training log.

### 9. Saved inference
The notebook reloads the saved suite and scores new molecules.

Example molecules:
- Aspirin as a safe control
- Bisphenol A as an endocrine-disruption example
- Benzo[a]pyrene as a carcinogenic aromatic example

The inference path uses the same Morgan fingerprint generator as training, so the saved models can be reused consistently.

## Why this approach was chosen
The pipeline is designed to be:
- biologically interpretable
- robust to imbalance
- endpoint-specific instead of one-size-fits-all
- easy to serialize and redeploy
- easy to explain in a paper or report

## Output files
- Notebook: [bestapproach.ipynb](bestapproach.ipynb)
- Saved model directory: `tox21_production_models/`
- Summary document: [bestapproach_summary.md](bestapproach_summary.md)

## Notes
- The notebook now contains both the EDA narrative and the production pipeline narrative.
- The reporting cells derive charts from the saved PKL bundles, which makes the results easier to audit.
- The saved inference example demonstrates how to score new compounds after training.
