import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { isLiveBackend } from '../services/proposalService';

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 w-full max-w-2xl mx-auto pt-8 pb-4 px-4 text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
            {isLiveBackend ? 'Supabase Live' : 'Real-Time Sync Active'}
          </span>
        </div>
      </div>

      <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-semibold mb-3 shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>NANNAMMMAAAAAAA!!!!</span>
        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
      </div>

      <h1 className="text-3xl sm:text-5xl font-serif font-black text-emerald-950 tracking-tight leading-tight">
        Mujhse Shaadi <span className="text-amber-600 italic">Karogi???</span>
      </h1>
      <p className="mt-2 text-emerald-900/80 text-sm sm:text-base font-sans max-w-md mx-auto">
        ye pagla puchta rahega.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-amber-300"></span>
        <Heart className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse-slow" />
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300"></span>
      </div>
    </header>
  );
};
