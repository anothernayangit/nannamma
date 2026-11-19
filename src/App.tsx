import React from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { Header } from './components/Header';
import { MainCounter } from './components/MainCounter';
import { HeartDivider } from './components/HeartDivider';
import { ManualAddition } from './components/ManualAddition';
import { LastProposalInfo } from './components/LastProposalInfo';
import { MilestoneCard } from './components/MilestoneCard';
import { MilestoneModal } from './components/MilestoneModal';
import { BackgroundMusic } from './components/BackgroundMusic';
import { Footer } from './components/Footer';
import { DevTestingToolbar } from './components/DevTestingToolbar';
import { useProposalCounter } from './hooks/useProposalCounter';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const {
    counter,
    isLoading,
    isSubmitting,
    error,
    activeMilestone,
    incrementMain,
    addManual,
    dismissMilestone,
    setCounterForTesting,
  } = useProposalCounter();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-amber-200 selection:text-emerald-950">
      {/* Floating particles (rings, stars, golden hearts) */}
      <FloatingHearts />

      {/* Background audio player for "mujhse shaadi karogi.mp3" */}
      <BackgroundMusic />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
        {/* Header */}
        <Header />

        {/* Global Error Banner */}
        {error && (
          <div
            data-testid="global-error"
            className="relative z-20 w-full max-w-xl mx-auto mb-4 p-3 rounded-2xl bg-red-100/90 border border-red-300 text-red-800 text-sm flex items-center gap-2 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Main Proposal Counter Section (no messages on every click, only increments) */}
        <MainCounter
          count={counter.count}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onIncrement={incrementMain}
        />

        {/* Divider with small heart */}
        <HeartDivider />

        {/* 2. Manual Addition Section */}
        <ManualAddition
          isSubmitting={isSubmitting}
          onAddManual={addManual}
        />

        {/* Below Everything */}
        <LastProposalInfo
          lastProposalAt={counter.last_proposal_at}
          count={counter.count}
        />

        {/* Milestone Celebration Card */}
        <MilestoneCard
          currentCount={counter.count}
          celebratedMilestones={counter.celebrated_milestones}
          lastMilestone={counter.last_milestone}
          lastMilestoneMessage={counter.last_milestone_message}
        />

        {/* Developer Testing Presets Toolbar */}
        <DevTestingToolbar onSetCount={setCounterForTesting} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Animated Milestone Popup Modal (triggers strictly at every 10th proposal) */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={dismissMilestone}
      />
    </div>
  );
};

export default App;
