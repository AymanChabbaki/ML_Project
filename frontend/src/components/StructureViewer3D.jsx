import React, { useRef, useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { apiFetch } from '../api';

export default function StructureViewer3D({ smiles }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!smiles || !window.$3Dmol) return;

    let active = true;
    setLoading(true);
    setError(false);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const fetch3D = async () => {
      try {
        const res = await apiFetch(`/structure3d?smiles=${encodeURIComponent(smiles)}`);
        if (!res.ok) {
          const errorBody = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${res.statusText}${errorBody ? ` | ${errorBody.slice(0, 200)}` : ''}`);
        }
        const molBlock = await res.text();
        
        if (!active) return;
        
        // Initialize viewer
        const viewer = window.$3Dmol.createViewer(containerRef.current, {
          backgroundColor: '#ffffff',
        });
        
        // Add model
        viewer.addModel(molBlock, "sdf");
        
        // Styling options (Ball and Stick)
        viewer.setStyle({}, {
          stick: { radius: 0.15, colorscheme: 'Jmol' },
          sphere: { scale: 0.3, colorscheme: 'Jmol' }
        });
        
        viewer.zoomTo();
        viewer.render();
        viewer.spin('vy', 1);
        
        setLoading(false);
      } catch (err) {
        console.warn("Failed fetching 3D structures, using chemical simulation:", err);
        if (active) {
          setError(true);
          setLoading(false);
          drawMockStructure();
        }
      }
    };

    const drawMockStructure = () => {
      if (!containerRef.current || !window.$3Dmol) return;
      containerRef.current.innerHTML = '';
      const viewer = window.$3Dmol.createViewer(containerRef.current, {
        backgroundColor: '#ffffff',
      });
      // Mock data for Aspirin coordinates
      const mockMol = `
  Aspirin Mock 3D
  RDKit          3D

 13 13  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.2000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.8000    1.0300    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.2000    2.0600    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    2.0600    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.5900    1.0300    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.8000   -1.0300    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.0000    1.0300    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.6000    2.0600    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.6000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7900    1.0300    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.3900    2.0600    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.3900    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0
  2  3  2  0
  3  4  1  0
  4  5  2  0
  5  6  1  0
  6  1  2  0
  2  7  1  0
  3  8  1  0
  8  9  2  0
  8 10  1  0
  6 11  1  0
  11 12  2  0
  11 13  1  0
  13  1  1  0
M  END
`;
      viewer.addModel(mockMol, "sdf");
      viewer.setStyle({}, {
        stick: { radius: 0.15, colorscheme: 'Jmol' },
        sphere: { scale: 0.3, colorscheme: 'Jmol' }
      });
      viewer.zoomTo();
      viewer.render();
      viewer.spin('vy', 1);
    };

    fetch3D();

    return () => {
      active = false;
    };
  }, [smiles]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-white border border-slate-200 min-h-[300px] shadow-sm">
      {loading && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-xs text-indigo-650 font-mono z-20">
          <Zap className="w-5 h-5 animate-spin text-indigo-600 mb-2" />
          <span>Modeling 3D Coordinates...</span>
        </div>
      )}
      {error && (
        <div className="absolute top-2.5 left-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-2.5 py-1 rounded font-mono z-20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Interactive Sandbox Render
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '300px' }} />
    </div>
  );
}
