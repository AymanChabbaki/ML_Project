import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FlaskConical, Zap, Volume2, VolumeX, Home, Activity, LayoutGrid, BookOpen } from 'lucide-react';

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
    <>
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 sm:px-6 lg:px-12">
      {/* Audio element for background music */}
      <audio ref={audioRef} src="/msc.mp3" loop />

      <div className="flex items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate('/')}> 
            <FlaskConical className="w-6 h-6 text-indigo-600 mr-2.5 animate-pulse" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">Tox21 Portal</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-4 whitespace-nowrap text-sm font-medium pb-0 lg:justify-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-2 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) =>
              `py-2 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Predict
          </NavLink>
          <NavLink
            to="/performance"
            className={({ isActive }) =>
              `py-2 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Performance
          </NavLink>
          <NavLink
            to="/endpoints"
            className={({ isActive }) =>
              `py-2 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Endpoint Info
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) =>
              `py-2 border-b-2 transition-all ${
                isActive ? 'border-indigo-650 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-indigo-650'
              }`
            }
          >
            Documentation
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
          {/* Audio Toggle Button */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-650 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all shrink-0"
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-lg hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            Analyze Compound
          </button>
        </div>

      </div>
    </header>

    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(15,23,42,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 gap-1 px-2 py-2 text-[10px] font-semibold text-slate-500">
        {[
          { to: '/', label: 'Home', icon: Home },
          { to: '/predict', label: 'Predict', icon: FlaskConical },
          { to: '/performance', label: 'Perf', icon: Activity },
          { to: '/endpoints', label: 'API', icon: LayoutGrid },
          { to: '/docs', label: 'Docs', icon: BookOpen },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors ${
                isActive ? 'text-indigo-700 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="px-3 pb-3">
        <button
          onClick={() => navigate('/predict')}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
        >
          <Zap className="w-4 h-4" />
          Analyze Compound
        </button>
      </div>
    </nav>
    </>
  );
}
