import React from 'react';
import { Sparkles, Loader2, Heart } from 'lucide-react';

interface MainCounterProps {
  count: number;
  isLoading: boolean;
  isSubmitting: boolean;
  onIncrement: (e: React.MouseEvent) => void;
}

export const MainCounter: React.FC<MainCounterProps> = ({
  count,
  isLoading,
  isSubmitting,
  onIncrement,
}) => {
  return (
    <section className="relative z-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl p-5 sm:p-10 shadow-xl shadow-emerald-950/10 border border-emerald-100 text-center transition-all">
      {/* Decorative background ambient glows */}
      <div className="absolute -top-12 -left-12 w-32 sm:w-36 h-32 sm:h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 sm:w-36 h-32 sm:h-36 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-amber-700 block mb-1 sm:mb-2">
          Total Times Asked
        </span>

        {/* Large Counter */}
        <div className="my-2 sm:my-3 mb-6 sm:mb-8 flex items-center justify-center">
          {isLoading ? (
            <div className="h-24 sm:h-28 flex items-center justify-center">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <div className="relative inline-block max-w-full">
              <span
                data-testid="proposal-count-display"
                className="font-serif font-black text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 drop-shadow-xs select-none tracking-tight transition-transform duration-300 inline-block"
              >
                {count}
              </span>
              <Heart className="absolute -top-1 -right-4 sm:-top-2 sm:-right-6 w-5 h-5 sm:w-8 sm:h-8 text-amber-500 fill-amber-400/80 animate-bounce shrink-0" />
            </div>
          )}
        </div>

        {/* Main Proposal Button */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={onIncrement}
            disabled={isSubmitting || isLoading}
            data-testid="main-proposal-button"
            className="group relative w-full sm:w-auto px-5 py-3.5 sm:px-10 sm:py-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 hover:via-emerald-900 hover:to-teal-900 active:scale-95 text-white font-medium text-base sm:text-xl rounded-2xl shadow-lg shadow-emerald-900/25 hover:shadow-emerald-900/40 border border-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-amber-300 shrink-0" />
                <span className="text-sm sm:text-base">Recording in my heart...</span>
              </>
            ) : (
              <>
                <span className="text-xl sm:text-2xl transition-transform group-hover:scale-125 duration-200 shrink-0">💍</span>
                <span className="font-semibold tracking-wide text-amber-50 text-base sm:text-xl text-center">
                  Phirse puch liya isne.
                </span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 opacity-90 group-hover:opacity-100 transition-opacity shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
