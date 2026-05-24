import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FlaskConical, Zap, Volume2, VolumeX } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser. Click again to play.", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <header className="h-16 sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-12 z-50 shadow-sm">
      {/* Audio element for background music */}
      <audio ref={audioRef} src="/msc.mp3" loop />

      <div className="flex items-center space-x-8">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <FlaskConical className="w-6 h-6 text-indigo-600 mr-2.5 animate-pulse" />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Tox21 Portal</span>
        </div>
        <nav className="flex space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-5 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) =>
              `py-5 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Predict
          </NavLink>
          <NavLink
            to="/performance"
            className={({ isActive }) =>
              `py-5 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Performance
          </NavLink>
          <NavLink
            to="/endpoints"
            className={({ isActive }) =>
              `py-5 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Endpoint Info
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) =>
              `py-5 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Documentation
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Audio Toggle Button */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-650 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
              <span>Mute</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Music</span>
            </>
          )}
        </button>

        {/* Action Button */}
        <button
          onClick={() => navigate('/predict')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-lg hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          Analyze Compound
        </button>
      </div>
    </header>
  );
}
