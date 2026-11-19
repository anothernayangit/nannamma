import React, { useEffect } from 'react';
import { Sparkles, Trophy, X, Heart } from 'lucide-react';

interface MilestoneModalProps {
  milestone: {
    count: number;
    message: string;
  } | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (milestone) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="milestone-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md my-auto bg-gradient-to-b from-white via-amber-50/95 to-emerald-50 rounded-3xl p-5 sm:p-8 border-2 border-amber-400 shadow-2xl shadow-emerald-950/40 text-center transform animate-scaleUp overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-testid="close-milestone-modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-amber-100 transition-colors cursor-pointer"
          aria-label="Close milestone dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating background sparkles */}
        <div className="absolute -top-10 -right-10 w-28 h-28 sm:w-32 sm:h-32 bg-amber-300/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 sm:w-32 sm:h-32 bg-emerald-300/30 rounded-full blur-xl pointer-events-none" />

        {/* Milestone Icon */}
        <div className="mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-3 sm:mb-4 animate-bounce">
          <Trophy className="w-7 h-7 sm:w-10 sm:h-10 text-yellow-100" />
        </div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 border border-amber-300 max-w-full truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Proposal #{milestone.count} Milestone!</span>
        </div>

        {/* Milestone Message Card */}
        <div className="my-3 sm:my-4 p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-emerald-200/80 shadow-xs">
          <h3
            data-testid="milestone-message-text"
            className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-emerald-950 leading-snug break-words hyphens-auto"
          >
            "{milestone.message}"
          </h3>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm font-sans mb-5 sm:mb-6 leading-relaxed">
          Kaha tha na, ek baar puchne se hum nahi maanenge! ✨
        </p>

        {/* Action button */}
        <button
          onClick={onClose}
          data-testid="milestone-continue-button"
          className="w-full py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-600/40 active:scale-98"
        >
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span className="truncate">Haan Baba, Samajh Gaye! 💍</span>
        </button>
      </div>
    </div>
  );
};
