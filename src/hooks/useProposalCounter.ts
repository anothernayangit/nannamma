import { useState, useEffect, useCallback, useRef } from 'react';
import { ProposalCounterState } from '../types';
import { proposalService } from '../services/proposalService';
import { getMilestoneMessage } from '../constants/milestones';
import { fireProposalConfetti, fireMilestoneConfetti } from '../utils/confetti';
import { playChimeSound, playMilestoneSound } from '../utils/sound';

export function useProposalCounter() {
  // Immediately load persisted state so page refresh NEVER resets to 0!
  const [counterState, setCounterState] = useState<ProposalCounterState>(() => {
    return proposalService.getInitialState();
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active milestone popup (triggered strictly at every 10th proposal)
  const [activeMilestone, setActiveMilestone] = useState<{
    count: number;
    message: string;
  } | null>(null);

  const confirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with database/realtime on mount
  useEffect(() => {
    let isMounted = true;

    async function syncLatest() {
      try {
        setIsLoading(true);
        const data = await proposalService.getCounter();
        if (isMounted) {
          setCounterState(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch counter');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncLatest();

    const unsubscribe = proposalService.subscribeToChanges((updated) => {
      if (isMounted) {
        setCounterState(updated);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (confirmationTimerRef.current) clearTimeout(confirmationTimerRef.current);
    };
  }, []);

  // Handle Main Button Click (+1)
  const incrementMain = useCallback(async (clickEvent?: React.MouseEvent) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Trigger button confetti & chime
      if (clickEvent) {
        const rect = (clickEvent.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        fireProposalConfetti(x, y);
      } else {
        fireProposalConfetti();
      }
      playChimeSound();

      const result = await proposalService.incrementCounter(1, 'button');

      setCounterState({
        count: result.count,
        last_proposal_at: result.last_proposal_at,
        celebrated_milestones: result.celebrated_milestones,
        last_milestone: result.newly_crossed_milestone ?? counterState.last_milestone,
        last_milestone_message: result.milestone_message ?? counterState.last_milestone_message,
      });

      // ONLY trigger message at every 10th proposal (10, 20, 30...)
      if (result.newly_crossed_milestone) {
        const msg = result.milestone_message || getMilestoneMessage(result.newly_crossed_milestone);
        setActiveMilestone({
          count: result.newly_crossed_milestone,
          message: msg,
        });
        fireMilestoneConfetti();
        playMilestoneSound();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error incrementing proposal count');
    } finally {
      setIsSubmitting(false);
    }
  }, [counterState.last_milestone, counterState.last_milestone_message, isSubmitting]);

  // Handle Manual Addition (+N)
  const addManual = useCallback(async (amount: number): Promise<boolean> => {
    if (isSubmitting) return false;

    if (!Number.isInteger(amount) || amount <= 0) {
      setError('Please enter a positive whole number.');
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await proposalService.incrementCounter(amount, 'manual');

      setCounterState({
        count: result.count,
        last_proposal_at: result.last_proposal_at,
        celebrated_milestones: result.celebrated_milestones,
        last_milestone: result.newly_crossed_milestone ?? counterState.last_milestone,
        last_milestone_message: result.milestone_message ?? counterState.last_milestone_message,
      });

      fireProposalConfetti();
      playChimeSound();

      if (result.newly_crossed_milestone) {
        const msg = result.milestone_message || getMilestoneMessage(result.newly_crossed_milestone);
        setActiveMilestone({
          count: result.newly_crossed_milestone,
          message: msg,
        });
        fireMilestoneConfetti();
        playMilestoneSound();
      }

      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add proposals');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [counterState.last_milestone, counterState.last_milestone_message, isSubmitting]);

  const dismissMilestone = useCallback(() => {
    setActiveMilestone(null);
  }, []);

  const setCounterForTesting = useCallback(async (count: number) => {
    const res = await proposalService.setCounterState(count);
    setCounterState(res);
  }, []);

  return {
    counter: counterState,
    isLoading,
    isSubmitting,
    error,
    activeMilestone,
    incrementMain,
    addManual,
    dismissMilestone,
    setCounterForTesting,
  };
}
