import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Performance from './pages/Performance';
import Endpoints from './pages/Endpoints';
import Docs from './pages/Docs';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/endpoints" element={<Endpoints />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
