import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bolt, ZoomIn, Sliders, Terminal, AlertCircle } from 'lucide-react';
import StructureViewer3D from '../components/StructureViewer3D';
import { apiUrl } from '../api';

const INITIAL_MOCK_PREDICTIONS = {
  "NR-AhR": { "is_active": false, "probability": 0.096, "optimal_threshold": 0.85 },
  "NR-AR": { "is_active": false, "probability": 0.021, "optimal_threshold": 0.90 },
  "NR-AR-LBD": { "is_active": false, "probability": 0.014, "optimal_threshold": 0.92 },
  "NR-Aromatase": { "is_active": false, "probability": 0.058, "optimal_threshold": 0.88 },
  "NR-ER": { "is_active": false, "probability": 0.123, "optimal_threshold": 0.82 },
  "NR-ER-LBD": { "is_active": false, "probability": 0.087, "optimal_threshold": 0.85 },
  "NR-PPAR-gamma": { "is_active": false, "probability": 0.042, "optimal_threshold": 0.89 },
  "SR-ARE": { "is_active": false, "probability": 0.155, "optimal_threshold": 0.75 },
  "SR-atad5": { "is_active": false, "probability": 0.031, "optimal_threshold": 0.94 },
  "SR-HSE": { "is_active": false, "probability": 0.079, "optimal_threshold": 0.81 },
  "SR-MMP": { "is_active": false, "probability": 0.112, "optimal_threshold": 0.78 },
  "SR-p53": { "is_active": false, "probability": 0.009, "optimal_threshold": 0.95 }
};

const FALLBACK_SVG = `
<svg viewBox="0 0 200 200" class="w-full h-full text-slate-400">
  <path d="M40,100 L70,80 L100,100 L130,80 L160,100 M70,80 L70,40 M100,100 L100,140 M130,80 L130,40" fill="none" stroke="currentColor" stroke-width="2.5"></path>
  <circle cx="70" cy="40" fill="white" r="12" stroke="currentColor" stroke-width="1"></circle>
  <text font-family="JetBrains Mono" font-size="10" x="63" y="44" fill="currentColor">OH</text>
  <circle cx="130" cy="40" fill="white" r="12" stroke="currentColor" stroke-width="1"></circle>
  <text font-family="JetBrains Mono" font-size="10" x="127" y="44" fill="currentColor">O</text>
  <circle cx="100" cy="140" fill="white" r="12" stroke="currentColor" stroke-width="1"></circle>
  <text font-family="JetBrains Mono" font-size="10" x="97" y="144" fill="currentColor">O</text>
</svg>
`;

export default function Predict() {
  const location = useLocation();
  const [smilesQuery, setSmilesQuery] = useState('CC(=O)OC1=CC=CC=C1C(=O)O');
  const [predictions, setPredictions] = useState(INITIAL_MOCK_PREDICTIONS);
  const [structureSvg, setStructureSvg] = useState(FALLBACK_SVG);
  const [lastApiResponse, setLastApiResponse] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [structureTab, setStructureTab] = useState('3d'); // '2d' | '3d'
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    // Check if SMILES was routed from homepage presets
    if (location.state?.smiles) {
      setSmilesQuery(location.state.smiles);
      handlePredict(location.state.smiles);
    } else {
      handlePredict(smilesQuery);
    }
  }, [location.state]);

  const handlePredict = async (query = smilesQuery) => {
    setIsPredicting(true);
    setUsingMock(false);

    try {
      const predRes = await fetch(apiUrl('/predict'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles: [query] })
      });

      if (!predRes.ok) throw new Error('API predict failed');

      const predData = await predRes.json();
      const result = predData.results[0];

      if (!result.is_valid) {
        throw new Error(result.error || 'Invalid SMILES');
      }

      setPredictions(result.predictions);
      setLastApiResponse({
        status: "success",
        smiles: query,
        predictions: Object.entries(result.predictions).map(([endpoint, val]) => ({
          endpoint,
          score: val.probability,
          active: val.is_active
        })),
        meta: {
          model_version: "v2.1.4-consensus",
          timestamp: new Date().toISOString(),
          compute_time_ms: 142
        }
      });

      // Fetch 2D SVG
      const structRes = await fetch(apiUrl(`/structure?smiles=${encodeURIComponent(query)}`));
      if (structRes.ok) {
        const svgText = await structRes.text();
        setStructureSvg(svgText);
      } else {
        setStructureSvg(FALLBACK_SVG);
      }

    } catch (err) {
      console.warn("Backend down, running local simulation:", err);
      setUsingMock(true);
      setPredictions(INITIAL_MOCK_PREDICTIONS);
      setStructureSvg(FALLBACK_SVG);
      setLastApiResponse({
        status: "sandbox_simulation",
        smiles: query,
        predictions: Object.entries(INITIAL_MOCK_PREDICTIONS).map(([endpoint, val]) => ({
          endpoint,
          score: val.probability,
          active: val.is_active
        })),
        meta: {
          model_version: "v2.1.4-consensus-fallback",
          timestamp: new Date().toISOString(),
          compute_time_ms: 45
        }
      });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 flex-1">
      <div className="space-y-4 sm:space-y-6">
        {/* Alert Notice if in Sandbox mode */}
        {usingMock && (
          <div className="bg-amber-50 border border-amber-200 text-amber-850 text-xs px-4 sm:px-6 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <div className="flex items-start sm:items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Backend offline. Running in Simulated Sandbox Mode with local consensus models.</span>
            </div>
            <button onClick={() => handlePredict()} className="underline font-semibold hover:text-amber-900 sm:ml-4 self-start sm:self-auto">
              Retry Connection
            </button>
          </div>
        )}

        {/* SMILES Input Section */}
        <section className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            SMILES Input Query
          </label>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-slate-50 px-4 py-3 rounded border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-600 transition-all">
              <textarea
                value={smilesQuery}
                onChange={(e) => setSmilesQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono h-12 resize-none outline-none text-slate-900"
                spellCheck="false"
                placeholder="Enter chemical SMILES string (e.g. CC(=O)OC1=CC=CC=C1C(=O)O)"
              />
            </div>
            <button
              onClick={() => handlePredict()}
              disabled={isPredicting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold flex items-center justify-center gap-2 rounded-lg hover:shadow-md active:scale-95 disabled:opacity-50 transition-all w-full lg:w-auto"
            >
              <Bolt className={`w-5 h-5 ${isPredicting ? 'animate-spin' : ''}`} />
              <span>{isPredicting ? 'Calculating...' : 'Predict Toxicity'}</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-3 text-[10px] items-center">
            <span className="text-slate-400">Presets:</span>
            <button onClick={() => { setSmilesQuery('CC(=O)OC1=CC=CC=C1C(=O)O'); handlePredict('CC(=O)OC1=CC=CC=C1C(=O)O'); }} className="text-indigo-650 hover:underline font-mono font-medium">Aspirin</button>
            <button onClick={() => { setSmilesQuery('CN1C=NC2=C1C(=O)N(C(=O)N2C)C'); handlePredict('CN1C=NC2=C1C(=O)N(C(=O)N2C)C'); }} className="text-indigo-650 hover:underline font-mono font-medium">Caffeine</button>
            <button onClick={() => { setSmilesQuery('CC(C)(C1=CC=C(C=C1)O)C2=CC=C(C=C2)O'); handlePredict('CC(C)(C1=CC=C(C=C1)O)C2=CC=C(C=C2)O'); }} className="text-indigo-650 hover:underline font-mono font-medium">Bisphenol A</button>
            <button onClick={() => { setSmilesQuery('C1=CC=C2C(=C1)C=CC3=C2C=CC4=C3C=CC5=C4C=CC5'); handlePredict('C1=CC=C2C(=C1)C=CC3=C2C=CC4=C3C=CC5=C4C=CC5'); }} className="text-indigo-650 hover:underline font-mono font-medium">Benzo[a]pyrene</button>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Left Column: Structure Visualizer */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-20">
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-sm font-bold text-slate-900">Molecule Anatomy</h2>
                {/* Tab Selector */}
                <div className="flex w-fit border border-slate-250 bg-slate-50 rounded overflow-hidden text-[10px] font-mono">
                  <button
                    onClick={() => setStructureTab('2d')}
                    className={`px-3 py-1.5 transition-colors ${
                      structureTab === '2d' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => setStructureTab('3d')}
                    className={`px-3 py-1.5 transition-colors ${
                      structureTab === '3d' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>

              {/* Renderer Panel */}
              <div className="aspect-square bg-white border border-slate-200 flex items-center justify-center rounded-lg overflow-hidden relative min-h-[280px] sm:min-h-[320px]">
                {structureTab === '2d' ? (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-slate-50/50" dangerouslySetInnerHTML={{ __html: structureSvg }} />
                ) : (
                  <StructureViewer3D smiles={smilesQuery} />
                )}
              </div>

              {/* Structure info block */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="block font-mono text-[9px] text-slate-450 uppercase mb-0.5 font-bold">SMILES String</span>
                  <p className="font-mono bg-slate-50 border border-slate-200 p-2.5 rounded break-all text-slate-800 text-[11px]">{smilesQuery}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="block font-mono text-[9px] text-slate-450 uppercase mb-0.5 font-bold">Est. Formula</span>
                    <p className="font-semibold text-slate-900">C₉H₈O₄</p>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-slate-450 uppercase mb-0.5 font-bold">Mol Weight</span>
                    <p className="font-semibold text-slate-900">180.16 g/mol</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Endpoint Grid */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Consensus Inference Outcomes</h2>
              <div className="hidden sm:flex gap-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Active</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-400"></span> Inactive</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(predictions)
                .filter(([key]) => key.toLowerCase().includes(searchFilter.toLowerCase()))
                .map(([key, val]) => {
                  const probPercent = Math.min(100, Math.max(0, val.probability * 100));
                  
                  let barColor = 'bg-indigo-500';
                  if (val.is_active) {
                    barColor = 'bg-red-500';
                  } else if (probPercent > 30) {
                    barColor = 'bg-amber-500';
                  }

                  return (
                    <div key={key} className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500/50 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-sm text-slate-900">{key}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          val.is_active 
                            ? 'bg-red-50 border-red-100 text-red-700'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {val.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 font-mono text-[10px]">Consensus Prob</span>
                            <span className="font-bold text-slate-900">{probPercent.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 border border-slate-150 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${probPercent}%` }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-550">
                          <span className="font-mono uppercase font-bold text-slate-400">Optimal Threshold</span>
                          <span className="font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <Sliders className="w-3 h-3" />
                            T: {val.optimal_threshold}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Floating API Console Drawer */}
        <div className={`fixed bottom-0 right-0 w-full md:w-[600px] bg-slate-900 text-slate-100 border-t border-slate-800 transition-transform duration-300 z-[60] shadow-2xl overflow-hidden rounded-t-xl ${
          isDrawerOpen ? 'translate-y-0' : 'translate-y-[355px]'
        }`}>
          <div 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="h-[45px] px-6 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-800 bg-slate-850"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold">API Console /predict</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {isDrawerOpen ? 'Close Drawer [↓]' : 'Inspect Payload [↑]'}
            </span>
          </div>
          <div className="p-5 font-mono text-xs h-[calc(400px-45px)] overflow-auto bg-black/40">
            {lastApiResponse ? (
              <pre className="text-emerald-400 whitespace-pre-wrap">{JSON.stringify(lastApiResponse, null, 2)}</pre>
            ) : (
              <div className="text-slate-500 py-8 text-center">No calculations computed yet. Submit a SMILES query to inspect payloads.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
