import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full max-w-2xl mx-auto py-10 px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="h-px w-8 bg-amber-300" />
        <Heart className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
        <span className="h-px w-8 bg-amber-300" />
      </div>

      <p
        data-testid="footer-quote"
        className="text-base sm:text-lg font-serif italic text-emerald-950 font-medium tracking-wide"
      >
        Some questions are worth asking a thousand times. ❤️
      </p>

      <p className="mt-2 text-xs text-emerald-800/70">
        Mujhse Shaadi Karogi??? • Built with Eternal Devotion & Vite + React
      </p>
    </footer>
  );
};
