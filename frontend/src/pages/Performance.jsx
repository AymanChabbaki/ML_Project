import React from 'react';
import { Database, Activity, Target, Info, Sliders, Layers } from 'lucide-react';

export default function Performance() {
  return (
    <div className="max-w-7xl mx-auto w-full px-12 py-8 flex-1">
      <div className="space-y-6">
        {/* Stats Summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center shadow-sm">
            <div className="w-12 h-12 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4">
              <Database className="w-6 h-6 text-indigo-650" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">Assays Modeled</p>
              <h2 className="text-xl font-bold text-slate-900">12 Endpoints</h2>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center shadow-sm">
            <div className="w-12 h-12 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4">
              <Activity className="w-6 h-6 text-indigo-650" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">Mean Pipeline ROC-AUC</p>
              <h2 className="text-xl font-bold text-slate-900">0.824</h2>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center shadow-sm">
            <div className="w-12 h-12 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-indigo-650" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">Avg Matthews Correlation</p>
              <h2 className="text-xl font-bold text-slate-900">0.452 (MCC)</h2>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-12 gap-6">
          {/* SVG Bar Chart */}
          <div className="col-span-12 md:col-span-7 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-slate-900">ROC-AUC by Endpoint</h3>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-64 flex flex-col justify-between">
              <svg className="w-full h-48" preserveAspectRatio="none" viewBox="0 0 500 200">
                <line x1="0" x2="500" y1="180" y2="180" stroke="#e2e8f0" strokeWidth="1"></line>
                <line x1="0" x2="500" y1="140" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3"></line>
                <line x1="0" x2="500" y1="100" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3"></line>
                <line x1="0" x2="500" y1="60" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3"></line>
                
                <text x="5" y="55" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">0.9</text>
                <text x="5" y="95" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">0.7</text>
                <text x="5" y="135" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">0.5</text>
                
                <rect fill="#4f46e5" height="152" rx="1.5" width="22" x="30" y="28" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="135" rx="1.5" width="22" x="70" y="45" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="162" rx="1.5" width="22" x="110" y="18" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="142" rx="1.5" width="22" x="150" y="38" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="120" rx="1.5" width="22" x="190" y="60" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="150" rx="1.5" width="22" x="230" y="30" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="110" rx="1.5" width="22" x="270" y="70" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="128" rx="1.5" width="22" x="310" y="52" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="158" rx="1.5" width="22" x="350" y="22" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="146" rx="1.5" width="22" x="390" y="34" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="135" rx="1.5" width="22" x="430" y="45" className="hover:fill-indigo-700 transition-colors"></rect>
                <rect fill="#4f46e5" height="140" rx="1.5" width="22" x="470" y="40" className="hover:fill-indigo-700 transition-colors"></rect>
              </svg>
              <div className="flex justify-between text-[9px] font-mono text-slate-550 overflow-x-auto whitespace-nowrap pt-2 font-semibold">
                <span className="w-8 text-center">NR-AR</span>
                <span className="w-8 text-center">AhR</span>
                <span className="w-8 text-center">ER</span>
                <span className="w-8 text-center">Arom</span>
                <span className="w-8 text-center">PPAR</span>
                <span className="w-8 text-center">ARE</span>
                <span className="w-8 text-center">atad5</span>
                <span className="w-8 text-center">HSE</span>
                <span className="w-8 text-center">MMP</span>
                <span className="w-8 text-center">p53</span>
                <span className="w-8 text-center">AR-LBD</span>
                <span className="w-8 text-center">ER-LBD</span>
              </div>
            </div>
          </div>

          {/* SVG Scatter Plot */}
          <div className="col-span-12 md:col-span-5 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-slate-900">MCC vs. Optimal Threshold</h3>
              <Sliders className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-64 relative flex flex-col justify-between">
              <svg className="w-full h-48" viewBox="0 0 300 200">
                <line x1="30" x2="280" y1="170" y2="170" stroke="#e2e8f0" strokeWidth="1"></line>
                <line x1="30" x2="30" y1="20" y2="170" stroke="#e2e8f0" strokeWidth="1"></line>
                <text x="260" y="184" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">Thresh</text>
                <text x="15" y="15" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">MCC</text>
                
                <circle cx="80" cy="120" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="110" cy="80" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="150" cy="100" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="180" cy="65" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="210" cy="90" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="240" cy="110" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="190" cy="130" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
                <circle cx="130" cy="140" fill="#4f46e5" r="5" className="hover:r-7 transition-all cursor-crosshair hover:fill-indigo-750"></circle>
              </svg>
              <div className="flex justify-between px-6 text-[9px] font-mono text-slate-550 font-semibold">
                <span>0.10</span>
                <span>0.50</span>
                <span>0.95</span>
              </div>
            </div>
          </div>

          {/* Feature Retention bars */}
          <div className="col-span-12 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-sm text-slate-900">Feature Retention</h3>
              <p className="text-xs text-slate-550 mt-0.5">Informative bits selected from raw 1024 ECFP4 fingerprint</p>
            </div>
            <div className="space-y-3.5">
              {[
                { name: 'NR-ER', bits: 840, pct: 82 },
                { name: 'NR-AR', bits: 462, pct: 45 },
                { name: 'SR-p53', bits: 225, pct: 22 },
                { name: 'NR-AhR', bits: 580, pct: 56 }
              ].map((item) => (
                <div key={item.name} className="flex items-center text-xs">
                  <span className="font-mono text-[10px] w-24 text-slate-500 font-semibold">{item.name}</span>
                  <div className="flex-1 h-3 bg-slate-100 border border-slate-200 rounded overflow-hidden relative">
                    <div className="h-full bg-indigo-650" style={{ width: `${item.pct}%` }}></div>
                  </div>
                  <span className="font-mono text-[10px] ml-4 text-slate-500 w-16 text-right font-semibold">{item.bits} bits</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Model Stack & Detail metrics table */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center text-sm font-bold text-slate-900">
              <Layers className="w-5 h-5 text-indigo-600 mr-2" />
              <span>Modeling Stack Configuration</span>
            </div>
            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-slate-50 border-l-4 border-indigo-600 rounded-r border-y border-r border-slate-200">
                <span className="font-mono text-[9px] block uppercase text-indigo-700 font-bold">Base Classifier 1</span>
                <p className="font-bold text-slate-900 mt-0.5">Bernoulli Naive Bayes</p>
                <p className="text-slate-650 mt-1 text-[11px]">Laplace-smoothed probabilistic classifier engineered for binary bit values.</p>
              </div>
              <div className="p-3 bg-slate-50 border-l-4 border-indigo-600 rounded-r border-y border-r border-slate-200">
                <span className="font-mono text-[9px] block uppercase text-indigo-700 font-bold">Base Classifier 2</span>
                <p className="font-bold text-slate-900 mt-0.5">XGBoost Classifier</p>
                <p className="text-slate-650 mt-1 text-[11px]">Boosted tree structures capturing complex multi-dimensional molecular bit patterns.</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded text-center font-mono text-[10px]">
                <p className="text-slate-550 uppercase font-bold mb-1">Consensus Voting</p>
                <p className="italic text-slate-550 text-[11px] font-semibold">Consensus = w₁·NB + w₂·XGBoost</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900">Endpoint Detail Metrics</h3>
              <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full uppercase font-bold">Active Consensus</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="px-6 py-3.5 font-bold">Endpoint ID</th>
                    <th className="px-6 py-3.5 font-bold">Best Performance Method</th>
                    <th className="px-6 py-3.5 font-bold">Imbalance Ratio</th>
                    <th className="px-6 py-3.5 text-right font-bold">Target ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {[
                    { id: 'NR-AR-LBD', method: 'XGBoost Weighted', ratio: '1:19', auc: '0.942' },
                    { id: 'NR-Aromatase', method: 'Consensus Stack', ratio: '1:8.3', auc: '0.887' },
                    { id: 'SR-ARE', method: 'Bernoulli Optimized', ratio: '1:5.0', auc: '0.821' },
                    { id: 'SR-MMP', method: 'XGBoost Weighted', ratio: '1:6.6', auc: '0.914' },
                    { id: 'NR-ER-LBD', method: 'Consensus Stack', ratio: '1:12.5', auc: '0.955' }
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 font-sans">{row.id}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-sans font-semibold">{row.method}</span></td>
                      <td className="px-6 py-4 text-slate-550 font-semibold">{row.ratio}</td>
                      <td className="px-6 py-4 text-right text-indigo-650 font-bold">{row.auc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
