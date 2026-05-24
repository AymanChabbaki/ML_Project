import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ENDPOINT_INFO_DATA = [
  { id: 'NR-AR', name: 'Androgen Receptor', cat: 'NR', desc: 'Crucial for identifying substances that might interfere with androgen signaling, potentially causing reproductive developmental issues.', type: 'Luciferase Reporter', reliability: 3 },
  { id: 'NR-AhR', name: 'Aryl Hydrocarbon Receptor', cat: 'NR', desc: 'Associated with metabolic activation of environmental pollutants and mediation of cellular responses to toxins like dioxins.', type: 'Transactivation', reliability: 4 },
  { id: 'NR-ER', name: 'Estrogen Receptor', cat: 'NR', desc: 'Measures the ability of a compound to bind to ERα, a primary target for endocrine disrupting chemicals in consumer products.', type: 'GeneBLAzer', reliability: 2 },
  { id: 'NR-AR-LBD', name: 'AR Ligand Binding Domain', cat: 'NR', desc: 'Identifies selective androgen receptor modulators and antagonists directly targeting the ligand-binding domain.', type: 'Co-activator Recr.', reliability: 4 },
  { id: 'NR-Aromatase', name: 'Aromatase Inhibition', cat: 'NR', desc: 'Disruption of estrogen synthesis. Critical for testing breast cancer therapeutics and environmental steroid disruptors.', type: 'Fluorescent Assay', reliability: 3 },
  { id: 'NR-ER-LBD', name: 'ER Ligand Binding Domain', cat: 'NR', desc: 'Specifically isolates estrogen-binding activity from transcription factor crosstalk, offering cleaner pathway validation.', type: 'Binding Assay', reliability: 4 },
  { id: 'NR-PPAR-gamma', name: 'PPAR-Gamma', cat: 'NR', desc: 'Linked to adipogenesis, lipid metabolism, and metabolic syndrome triggers from plasticizers or dietary additives.', type: 'Transactivation', reliability: 3 },
  { id: 'SR-ARE', name: 'Antioxidant Response Element', cat: 'SR', desc: 'Nrf2 pathway activation monitoring oxidative stress. Primary marker for inflammatory pre-toxic signaling.', type: 'ARE-bla reporter', reliability: 3 },
  { id: 'SR-atad5', name: 'ATAD5 DNA Damage Response', cat: 'SR', desc: 'Monitors genomic instability and replication stress. Strong predictive biomarker for in vivo genotoxicity.', type: 'High-content imaging', reliability: 4 },
  { id: 'SR-HSE', name: 'Heat Shock Response', cat: 'SR', desc: 'Monitors protein folding stress and proteotoxicity. High activation often correlates with acute cellular damage.', type: 'HSE-Bla', reliability: 2 },
  { id: 'SR-MMP', name: 'Mitochondrial Potential', cat: 'SR', desc: 'Measures the loss of mitochondrial potential, a key early indicator of apoptosis and metabolic dysfunction.', type: 'Mito-PT', reliability: 3 },
  { id: 'SR-p53', name: 'Tumor Suppressor p53', cat: 'SR', desc: 'Activation indicates DNA damage or cellular stress, providing a direct link to potential genotoxicity and carcinogenicity.', type: 'Cell-based Reporter', reliability: 4 },
];

export default function Endpoints() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto w-full px-12 py-8 flex-1">
      <div className="space-y-8 font-sans">
        <section className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Endpoint Reference Guide</h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              A complete dictionary of the 12 biological pathways evaluated in the Tox21 High-Throughput Screening consensus pipeline.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64 bg-white rounded-lg shadow-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-transparent border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-mono rounded-full font-bold">
              12 Pathways
            </span>
          </div>
        </section>

        {/* Biological Categories */}
        {['NR', 'SR'].map((category) => (
          <section key={category} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-6 w-1 rounded-full ${category === 'NR' ? 'bg-indigo-600' : 'bg-rose-500'}`}></div>
              <h3 className="text-md font-bold text-slate-900">
                {category === 'NR' ? 'Nuclear Receptors (NR)' : 'Stress Response (SR)'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ENDPOINT_INFO_DATA.filter((ep) => ep.cat === category && (
                ep.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                ep.name.toLowerCase().includes(searchQuery.toLowerCase())
              )).map((ep) => (
                <div key={ep.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:scale-[1.01] hover:shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-500 rounded font-semibold">{ep.id}</span>
                      <span className={`w-2 h-2 rounded-full ${category === 'NR' ? 'bg-indigo-600' : 'bg-rose-500'}`}></span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{ep.name}</h4>
                    <p className="text-xs text-slate-650 leading-relaxed mb-4">{ep.desc}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 mt-auto text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Assay Protocol</span>
                      <span className="text-slate-800 font-semibold">{ep.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Signal Strength</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((star) => (
                          <div
                            key={star}
                            className={`w-2.5 h-1.5 rounded-sm ${
                              star <= ep.reliability
                                ? category === 'NR' ? 'bg-indigo-600' : 'bg-rose-500'
                                : 'bg-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Data Verification Standards */}
        <section className="pt-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Data Verification Standards</h3>
            </div>
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-250 font-mono text-[10px] text-slate-500 uppercase">
                  <th className="px-6 py-3.5 font-bold">Standard</th>
                  <th className="px-6 py-3.5 font-bold">Assay Metric</th>
                  <th className="px-6 py-3.5 font-bold">Threshold</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { std: 'Assay Z-Factor', metric: 'Statistical robustness', val: '> 0.50', status: 'PASSED', color: 'bg-emerald-50 border border-emerald-100 text-emerald-700' },
                  { std: 'CV %', metric: 'Coefficient of variation', val: '< 15%', status: 'PASSED', color: 'bg-emerald-50 border border-emerald-100 text-emerald-700' },
                  { std: 'Replication', metric: 'Duplicate runs per plate', val: 'n=3 min', status: 'MONITORED', color: 'bg-indigo-50 border border-indigo-100 text-indigo-700' }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{item.std}</td>
                    <td className="px-6 py-3.5 text-slate-650">{item.metric}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-600 font-semibold">{item.val}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${item.color}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
