# Project Summary: Consensus Machine Learning Pipeline for Molecular Toxicity Prediction (Tox21)

**Author:** Ayman Chabbaki  
**Program:** Master DSBD  
**Date:** May 2026  

## 1. Project Overview
This document summarizes the iterative development and finalization of an end-to-end machine learning pipeline for the **Tox21** benchmark dataset. The primary objective was to accurately predict 12 distinct toxicological endpoints (e.g., NR-AR, SR-p53, SR-MMP) directly from molecular structures (SMILES). The key challenge addressed throughout this project was the extreme class imbalance and label sparsity inherent to biochemical assays.

## 2. Phase 1: Initial Exploration and Baselines
*Files Reviewed: `attempt0.ipynb`, `attempt1.ipynb`*

* **Exploratory Data Analysis (EDA):** Conducted rigorous missing-value analysis and target distribution checks across all 12 endpoints, revealing severe class skew (majority of compounds are inactive/non-toxic).
* **Feature Engineering:** Utilized **RDKit** to convert SMILES strings into machine-readable formats, specifically generating Morgan/ECFP fingerprints and computing physicochemical descriptors.
* **Baseline Modeling:** Trained initial single-task baselines using Random Forest and XGBoost.
* **Metric Selection:** Shifted evaluation from raw accuracy to **PR-AUC (Precision-Recall Area Under Curve)** and **ROC-AUC** to properly reflect model performance on the minority (toxic) classes.
* **Multi-Task Prototype:** Explored a PyTorch-based Multi-Task Learning (MTL) architecture to investigate shared representation learning across endpoints.

## 3. Phase 2: Realistic Generalization & Imbalance Handling
*File Reviewed: `approach2.ipynb`*

* **Scaffold Splitting:** Transitioned from random train/test splits to **scaffold splits**. This ensures that structurally similar chemotypes do not leak between training and testing sets, providing a realistic estimate of the model's performance on novel chemical space in drug discovery.
* **Advanced Resampling (SMOTEENN):** Addressed the extreme sparsity of active labels by applying **SMOTEENN** (Synthetic Minority Over-sampling Technique + Edited Nearest Neighbors) strictly on the training partitions. This increased minority class representation while simultaneously cleaning noisy majority class samples.
* **Hyperparameter Tuning:** Conducted aggressive tuning of Random Forest and XGBoost models using Optuna, establishing a strict, robust classical baseline for each task.

## 4. Phase 3: Final Consensus Model and Threshold Optimization
*File Reviewed: `bestapproach.ipynb`*

* **Consensus Architecture:** Finalized the modeling strategy by employing a **Consensus Machine Learning** pipeline, combining the strengths of the best-performing models to reduce variance and increase predictive confidence.
* **Dynamic MCC Thresholding:** Implemented a data-driven threshold optimization step. Instead of using the default 0.5 probability cutoff, the pipeline dynamically calculates the optimal threshold for each endpoint that maximizes the **Matthews Correlation Coefficient (MCC)**. This is a critical mathematical step to natively counter the high-imbalance nature of the tasks.
* **Production & Inference:** Serialized the optimized, endpoint-specific pipelines into `.pkl` heatmaps and models. The project concluded with a complete, production-ready inference function capable of accepting new SMILES strings and outputting calibrated toxicity probabilities and predictions.
