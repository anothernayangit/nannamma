export interface ProposalCounterState {
  count: number;
  last_proposal_at: string;
  celebrated_milestones: number[];
  last_milestone: number | null;
  last_milestone_message?: string | null;
}

export interface IncrementResponse {
  count: number;
  last_proposal_at: string;
  celebrated_milestones: number[];
  newly_crossed_milestone: number | null;
  milestone_message: string | null;
  all_newly_crossed: number[];
}
