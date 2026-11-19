export const BASE_MILESTONES: Record<number, string> = {
  10: "abhi toh aur puchenge",
  20: "haa keh diya tha?",
  30: "mummy se bhi puchenge",
  40: "puchta rahunga",
  50: "thak jaane ke baad bhi puchunga",
  60: "haan kehne ke baad bhi puchunga",
  70: "parutty ki permission bhi toh leni hai",
  80: "ab nah keh diya toh kidnap karenge",
};

export const MILESTONE_PHRASE_LIST: string[] = [
  "abhi toh aur puchenge",
  "haa keh diya tha?",
  "mummy se bhi puchenge",
  "puchta rahunga",
  "thak jaane ke baad bhi puchunga",
  "haan kehne ke baad bhi puchunga",
  "parutty ki permission bhi toh leni hai",
  "ab nah keh diya toh kidnap karenge",
];

/**
 * Returns the exact phrase for 10-80, or randomises from the 8 phrases for any 10th milestone above 80
 */
export function getMilestoneMessage(milestoneNumber: number): string {
  if (BASE_MILESTONES[milestoneNumber]) {
    return BASE_MILESTONES[milestoneNumber];
  }
  const randomIndex = Math.floor(Math.random() * MILESTONE_PHRASE_LIST.length);
  return MILESTONE_PHRASE_LIST[randomIndex];
}

export const MILESTONE_ORDER: number[] = [10, 20, 30, 40, 50, 60, 70, 80];
