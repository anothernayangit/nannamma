import React from 'react';
import { Clock, CalendarHeart } from 'lucide-react';

interface LastProposalInfoProps {
  lastProposalAt: string | null;
  count: number;
}

export const LastProposalInfo: React.FC<LastProposalInfoProps> = ({ lastProposalAt, count }) => {
  if (!lastProposalAt || count === 0) {
    return (
      <div className="relative z-10 w-full max-w-xl mx-auto mt-6 text-center text-xs text-emerald-800/80 flex items-center justify-center gap-1.5 font-medium">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Count is at 0. Click the button to pop the question! 💍</span>
      </div>
    );
  }

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      data-testid="last-proposal-info"
      className="relative z-10 w-full max-w-xl mx-auto mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xs border border-emerald-100 text-xs sm:text-sm text-slate-600 shadow-xs"
    >
      <CalendarHeart className="w-4 h-4 text-emerald-600 shrink-0" />
      <span>
        Last proposed: <strong className="font-semibold text-emerald-950">{formatTimestamp(lastProposalAt)}</strong>
      </span>
    </div>
  );
};
