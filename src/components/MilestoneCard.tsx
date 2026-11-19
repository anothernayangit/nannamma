import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { BASE_MILESTONES, MILESTONE_ORDER, getMilestoneMessage } from '../constants/milestones';

interface MilestoneCardProps {
  currentCount: number;
  celebratedMilestones: number[];
  lastMilestone: number | null;
  lastMilestoneMessage?: string | null;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  currentCount,
  celebratedMilestones,
  lastMilestone,
  lastMilestoneMessage,
}) => {
  // Find latest achieved milestone
  const latestMilestone = lastMilestone || (celebratedMilestones.length > 0
    ? Math.max(...celebratedMilestones)
    : (currentCount >= 10 ? Math.floor(currentCount / 10) * 10 : null));

  const displayMessage = lastMilestoneMessage || (latestMilestone ? getMilestoneMessage(latestMilestone) : null);

  // Next milestone at next multiple of 10
  const nextMilestone = (Math.floor(currentCount / 10) + 1) * 10;
  const toGo = nextMilestone - currentCount;

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto mt-6 bg-white/85 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-emerald-100 shadow-lg shadow-emerald-950/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-emerald-950">
            Milestone Dialogues 💍
          </h3>
        </div>
        <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Next at {nextMilestone} ({toGo} to go)
        </span>
      </div>

      {/* Latest Milestone Highlight Card */}
      {latestMilestone ? (
        <div
          data-testid="active-milestone-card"
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/5 border border-amber-300 mb-4 sm:mb-5 text-left"
        >
          <div className="flex items-center gap-2 text-amber-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>Latest Unlocked Milestone ({latestMilestone})</span>
          </div>
          <p className="text-base sm:text-xl font-serif font-bold text-emerald-950 italic break-words">
            "{displayMessage}"
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-500 mb-4 italic">
          Keep asking! The first dialogue unlocks at 10 proposals. ✨
        </p>
      )}

      {/* Milestone Track List */}
      <div className="space-y-2 sm:space-y-2.5">
        {MILESTONE_ORDER.map((milestone) => {
          const isReached = currentCount >= milestone || celebratedMilestones.includes(milestone);
          return (
            <div
              key={milestone}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border text-xs sm:text-sm gap-2 transition-all ${
                isReached
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-stone-50/60 border-stone-200 text-slate-400'
              }`}
            >
              <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                {isReached ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5 sm:mt-0" />
                )}
                <span className="font-bold text-emerald-900 shrink-0">{milestone}th:</span>
                <span className="italic text-slate-700 break-words flex-1">
                  {BASE_MILESTONES[milestone]}
                </span>
              </div>
              <div className="flex justify-end sm:justify-normal shrink-0">
                <span
                  className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                    isReached
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-slate-400'
                  }`}
                >
                  {isReached ? 'Celebrated' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
