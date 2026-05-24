import React from 'react';

export default function Docs() {
  return (
    <div className="max-w-7xl mx-auto w-full px-12 py-8 flex-1">
      <div className="bg-white border border-slate-200 p-10 rounded-xl shadow-sm space-y-8 max-w-4xl mx-auto font-sans">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tox21 Consensus Prediction Guide</h1>
          <p className="text-sm text-slate-550 leading-relaxed">
            Methodological and technical manual describing the pipeline stages, feature extraction, and ensembling models.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-650 font-mono font-bold">01.</span> ECFP4 / Morgan Fingerprint Generation
          </h2>
          <p className="text-[13px] text-slate-650 leading-relaxed">
            Compounds are represented using circular topological fingerprints, specifically <strong className="text-slate-900 font-semibold">Morgan Fingerprints</strong> with a radius of <strong className="text-slate-900 font-semibold">2</strong> (equivalent to ECFP4) mapped into a fixed-length vector of <strong className="text-slate-900 font-semibold">1024 bits</strong>. Invalid SMILES queries are caught early during parsing using RDKit's structural validation functions, returning a structured HTTP 400 parameter trace.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-650 font-mono font-bold">02.</span> Feature Reduction Pipeline
          </h2>
          <p className="text-[13px] text-slate-650 leading-relaxed">
            Because 1024-bit fingerprint vectors are sparse and highly collinear, each endpoint runs through a double-stage filtering stack:
          </p>
          <ul className="list-disc list-inside text-[13px] text-slate-650 space-y-2 pl-4">
            <li>
              <strong className="text-slate-900 font-semibold">Variance Threshold:</strong> Removes constant or near-constant features (bits that are 0 or 1 in more than 99% of sample libraries).
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Random Forest Selection:</strong> Employs a random forest estimator to compute Gini-importance coefficients. Only the top-scoring bits linked directly to structural toxicophores are retained.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-650 font-mono font-bold">03.</span> Consensus Model Ensemble
          </h2>
          <p className="text-[13px] text-slate-650 leading-relaxed">
            Predictions combine two complementary classifiers:
          </p>
          <ul className="list-disc list-inside text-[13px] text-slate-650 space-y-2 pl-4">
            <li>
              <strong className="text-slate-900 font-semibold">Bernoulli Naive Bayes (NB):</strong> Optimized for binary bit vector inputs using Laplace smoothing. Highly effective at handling sparse profiles.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">XGBoost Classifier:</strong> Captures non-linear complex bit-bit interactions using gradient-boosted decision trees.
            </li>
          </ul>
          <p className="text-[13px] text-slate-650 leading-relaxed">
            The output consensus probability is calculated as: <code className="font-mono bg-slate-50 border border-slate-200 text-indigo-700 px-1.5 py-0.5 rounded text-xs">Consensus = w₁·NB + w₂·XGBoost</code> where the weights <code className="font-mono bg-slate-50 border border-slate-200 text-indigo-700 px-1.5 py-0.5 rounded text-xs">w₁</code> and <code className="font-mono bg-slate-50 border border-slate-200 text-indigo-700 px-1.5 py-0.5 rounded text-xs">w₂</code> are optimized on the validation set according to relative ROC-AUC scores.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-650 font-mono font-bold">04.</span> Matthews Correlation Coefficient (MCC) Thresholding
          </h2>
          <p className="text-[13px] text-slate-650 leading-relaxed">
            Tox21 assays are highly imbalanced, with active rates as low as 1%. Utilizing a flat <code className="font-mono bg-slate-50 border border-slate-200 text-indigo-700 px-1.5 py-0.5 rounded text-xs">0.50</code> classification threshold results in poor sensitivity. 
            Instead, the models search a validation threshold range (from 0.10 to 0.95) to select the exact value that maximizes the <strong className="text-slate-900 font-semibold">Matthews Correlation Coefficient (MCC)</strong>, ensuring balanced prediction rates for both active and inactive substances.
          </p>
        </section>
      </div>
    </div>
  );
}
