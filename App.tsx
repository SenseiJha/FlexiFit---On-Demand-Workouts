import React, { useState } from 'react';
import UserApp from './components/UserApp';
import ProviderDashboard from './components/ProviderDashboard';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.USER);

  return (
    <>
      {/* Mode Switcher (For Demo Purposes) */}
      <div className="fixed top-4 right-4 z-[100] bg-black/80 backdrop-blur-md p-1 rounded-lg flex space-x-1 shadow-2xl border border-white/10">
        <button 
          onClick={() => setMode(AppMode.USER)}
          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
            mode === AppMode.USER ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Mobile App
        </button>
        <button 
          onClick={() => setMode(AppMode.PROVIDER)}
          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
            mode === AppMode.PROVIDER ? 'bg-teal-500 text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Partner Dashboard
        </button>
      </div>

      {/* App Rendering */}
      {mode === AppMode.USER ? <UserApp /> : <ProviderDashboard />}
    </>
  );
}