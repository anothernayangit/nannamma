import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { ProposalCounterState, IncrementResponse } from '../types';
import { getMilestoneMessage } from '../constants/milestones';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key');

export const isLiveBackend = isSupabaseConfigured;

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

const STORAGE_KEY = 'mujhse_shaadi_karogi_proposal_counter_state';

function loadPersistedState(): ProposalCounterState {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.count === 'number') {
          return {
            count: parsed.count,
            last_proposal_at: parsed.last_proposal_at || new Date().toISOString(),
            celebrated_milestones: Array.isArray(parsed.celebrated_milestones) ? parsed.celebrated_milestones : [],
            last_milestone: parsed.last_milestone ?? null,
            last_milestone_message: parsed.last_milestone_message ?? null,
          };
        }
      }
    } catch (e) {
      console.warn('Could not read saved counter state from localStorage:', e);
    }
  }
  return {
    count: 0,
    last_proposal_at: new Date().toISOString(),
    celebrated_milestones: [],
    last_milestone: null,
    last_milestone_message: null,
  };
}

function persistState(state: ProposalCounterState) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save counter state to localStorage:', e);
    }
  }
}

// In-Memory & Persistent fallback state across page refreshes and open tabs
class SimulatedAtomicBackend {
  private state: ProposalCounterState = loadPersistedState();
  private broadcastChannel: BroadcastChannel | null = null;
  private subscribers: Set<(state: ProposalCounterState) => void> = new Set();
  private isProcessing = false;
  private queue: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('proposal_counter_sync_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'COUNTER_UPDATE' && event.data?.state) {
          this.state = event.data.state;
          persistState(this.state);
          this.notifySubscribers();
        }
      };
    }
  }

  public getState(): ProposalCounterState {
    return { ...this.state, celebrated_milestones: [...this.state.celebrated_milestones] };
  }

  public setState(newState: Partial<ProposalCounterState>): ProposalCounterState {
    this.state = {
      ...this.state,
      ...newState,
      celebrated_milestones: newState.celebrated_milestones
        ? [...newState.celebrated_milestones]
        : [...this.state.celebrated_milestones],
    };
    persistState(this.state);
    this.broadcast();
    this.notifySubscribers();
    return this.getState();
  }

  public subscribe(callback: (state: ProposalCounterState) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    const current = this.getState();
    this.subscribers.forEach((cb) => cb(current));
  }

  private broadcast() {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'COUNTER_UPDATE',
        state: this.getState(),
      });
    }
  }

  // Atomic increment with every-10th milestone detection and persistent storage
  public async atomicIncrement(amount: number): Promise<IncrementResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        try {
          if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error(`Increment amount must be a positive whole number (received ${amount})`);
          }

          const currentCount = this.state.count;
          const newCount = currentCount + amount;
          const now = new Date().toISOString();

          const currentCelebrated = new Set(this.state.celebrated_milestones);
          const newlyCrossed: number[] = [];
          let highestNewMilestone: number | null = null;

          // Check every 10th milestone crossed in (currentCount, newCount]
          const start10 = (Math.floor(currentCount / 10) + 1) * 10;
          for (let m = start10; m <= newCount; m += 10) {
            if (!currentCelebrated.has(m)) {
              newlyCrossed.push(m);
              currentCelebrated.add(m);
              highestNewMilestone = m;
            }
          }

          const updatedCelebrated = Array.from(currentCelebrated).sort((a, b) => a - b);
          const milestoneMsg = highestNewMilestone ? getMilestoneMessage(highestNewMilestone) : null;

          this.state = {
            count: newCount,
            last_proposal_at: now,
            celebrated_milestones: updatedCelebrated,
            last_milestone: highestNewMilestone ?? this.state.last_milestone,
            last_milestone_message: milestoneMsg ?? this.state.last_milestone_message,
          };

          // Save state so page refresh always picks up exactly where it was left!
          persistState(this.state);
          this.broadcast();
          this.notifySubscribers();

          resolve({
            count: newCount,
            last_proposal_at: now,
            celebrated_milestones: updatedCelebrated,
            newly_crossed_milestone: highestNewMilestone,
            milestone_message: milestoneMsg,
            all_newly_crossed: newlyCrossed,
          });
        } catch (err) {
          reject(err);
        } finally {
          this.processNext();
        }
      });

      if (!this.isProcessing) {
        this.processNext();
      }
    });
  }

  private processNext() {
    if (this.queue.length > 0) {
      this.isProcessing = true;
      const nextFn = this.queue.shift();
      if (nextFn) nextFn();
    } else {
      this.isProcessing = false;
    }
  }
}

export const fallbackBackend = new SimulatedAtomicBackend();

export const proposalService = {
  getInitialState(): ProposalCounterState {
    return fallbackBackend.getState();
  },

  async getCounter(): Promise<ProposalCounterState> {
    if (supabase) {
      const { data, error } = await supabase
        .from('proposal_counter')
        .select('count, last_proposal_at, celebrated_milestones, last_milestone, last_milestone_message')
        .eq('id', 'global')
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetch error, using persistent local state:', error.message);
        return fallbackBackend.getState();
      }

      if (data) {
        const state: ProposalCounterState = {
          count: data.count,
          last_proposal_at: data.last_proposal_at,
          celebrated_milestones: Array.isArray(data.celebrated_milestones) ? data.celebrated_milestones : [],
          last_milestone: data.last_milestone,
          last_milestone_message: data.last_milestone_message,
        };
        persistState(state);
        return state;
      }
    }

    return fallbackBackend.getState();
  },

  async incrementCounter(amount: number, source: 'button' | 'manual'): Promise<IncrementResponse> {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error(`Invalid increment amount: ${amount}. Must be a positive whole number.`);
    }

    if (supabase) {
      const { data, error } = await supabase.rpc('increment_proposal_counter', {
        amount_to_add: amount,
        p_source: source,
      });

      if (error) {
        console.error('Supabase RPC increment error:', error.message);
        throw new Error(error.message);
      }

      const result = data as IncrementResponse;
      if (result.newly_crossed_milestone && !result.milestone_message) {
        result.milestone_message = getMilestoneMessage(result.newly_crossed_milestone);
      }

      persistState({
        count: result.count,
        last_proposal_at: result.last_proposal_at,
        celebrated_milestones: result.celebrated_milestones,
        last_milestone: result.newly_crossed_milestone,
        last_milestone_message: result.milestone_message,
      });

      return result;
    }

    return await fallbackBackend.atomicIncrement(amount);
  },

  subscribeToChanges(onUpdate: (state: ProposalCounterState) => void): () => void {
    let realtimeChannel: RealtimeChannel | null = null;

    if (supabase) {
      realtimeChannel = supabase
        .channel('realtime_proposal_counter')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'proposal_counter', filter: 'id=eq.global' },
          (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              const updated = payload.new as {
                count: number;
                last_proposal_at: string;
                celebrated_milestones: number[];
                last_milestone: number | null;
                last_milestone_message?: string | null;
              };
              const state: ProposalCounterState = {
                count: updated.count,
                last_proposal_at: updated.last_proposal_at,
                celebrated_milestones: updated.celebrated_milestones || [],
                last_milestone: updated.last_milestone || null,
                last_milestone_message: updated.last_milestone_message || null,
              };
              persistState(state);
              onUpdate(state);
            }
          }
        )
        .subscribe();
    }

    const unsubFallback = fallbackBackend.subscribe(onUpdate);

    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
      unsubFallback();
    };
  },

  async setCounterState(targetCount: number): Promise<ProposalCounterState> {
    if (targetCount < 0) throw new Error('Count cannot be negative');

    const celebrated: number[] = [];
    let lastM: number | null = null;
    for (let m = 10; m <= targetCount; m += 10) {
      celebrated.push(m);
      lastM = m;
    }

    const lastMsg = lastM ? getMilestoneMessage(lastM) : null;

    if (supabase) {
      await supabase.rpc('set_proposal_counter', { target_count: targetCount });
    }

    return fallbackBackend.setState({
      count: targetCount,
      last_proposal_at: new Date().toISOString(),
      celebrated_milestones: celebrated,
      last_milestone: lastM,
      last_milestone_message: lastMsg,
    });
  },
};
