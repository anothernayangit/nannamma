import { describe, it, expect, beforeEach } from 'vitest';
import { proposalService } from '../services/proposalService';
import { MILESTONE_PHRASE_LIST } from '../constants/milestones';

describe('Mujhse Shaadi Karogi??? - Every 10th Milestone Test Scenarios', () => {
  beforeEach(async () => {
    // Reset state to 0 before each test
    await proposalService.setCounterState(0);
  });

  it('Default count is reset to 0', async () => {
    const data = await proposalService.getCounter();
    expect(data.count).toBe(0);
    expect(data.celebrated_milestones).toEqual([]);
    expect(data.last_milestone).toBeNull();
  });

  it('Clicks 1-9 do NOT trigger any milestone message', async () => {
    for (let i = 1; i <= 9; i++) {
      const result = await proposalService.incrementCounter(1, 'button');
      expect(result.count).toBe(i);
      expect(result.newly_crossed_milestone).toBeNull();
      expect(result.milestone_message).toBeNull();
    }
  });

  it('Proposal 10 triggers milestone: "abhi toh aur puchenge"', async () => {
    await proposalService.setCounterState(9);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(10);
    expect(result.newly_crossed_milestone).toBe(10);
    expect(result.milestone_message).toBe('abhi toh aur puchenge');
    expect(result.celebrated_milestones).toContain(10);
  });

  it('Proposal 20 triggers milestone: "haa keh diya tha?"', async () => {
    await proposalService.setCounterState(19);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(20);
    expect(result.newly_crossed_milestone).toBe(20);
    expect(result.milestone_message).toBe('haa keh diya tha?');
  });

  it('Proposal 30 triggers milestone: "mummy se bhi puchenge"', async () => {
    await proposalService.setCounterState(29);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(30);
    expect(result.newly_crossed_milestone).toBe(30);
    expect(result.milestone_message).toBe('mummy se bhi puchenge');
  });

  it('Proposal 40 triggers milestone: "puchta rahunga"', async () => {
    await proposalService.setCounterState(39);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(40);
    expect(result.newly_crossed_milestone).toBe(40);
    expect(result.milestone_message).toBe('puchta rahunga');
  });

  it('Proposal 50 triggers milestone: "thak jaane ke baad bhi puchunga"', async () => {
    await proposalService.setCounterState(49);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(50);
    expect(result.newly_crossed_milestone).toBe(50);
    expect(result.milestone_message).toBe('thak jaane ke baad bhi puchunga');
  });

  it('Proposal 60 triggers milestone: "haan kehne ke baad bhi puchunga"', async () => {
    await proposalService.setCounterState(59);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(60);
    expect(result.newly_crossed_milestone).toBe(60);
    expect(result.milestone_message).toBe('haan kehne ke baad bhi puchunga');
  });

  it('Proposal 70 triggers milestone: "parutty ki permission bhi toh leni hai"', async () => {
    await proposalService.setCounterState(69);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(70);
    expect(result.newly_crossed_milestone).toBe(70);
    expect(result.milestone_message).toBe('parutty ki permission bhi toh leni hai');
  });

  it('Proposal 80 triggers milestone: "ab nah keh diya toh kidnap karenge"', async () => {
    await proposalService.setCounterState(79);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(80);
    expect(result.newly_crossed_milestone).toBe(80);
    expect(result.milestone_message).toBe('ab nah keh diya toh kidnap karenge');
  });

  it('Proposal 90 and above randomises from the 8 phrases', async () => {
    await proposalService.setCounterState(89);
    const result = await proposalService.incrementCounter(1, 'button');

    expect(result.count).toBe(90);
    expect(result.newly_crossed_milestone).toBe(90);
    expect(MILESTONE_PHRASE_LIST).toContain(result.milestone_message);
  });

  it('Manual addition jumping across multiple 10ths triggers the highest reached', async () => {
    await proposalService.setCounterState(15);
    // Add 25 -> jumps to 40, crosses 20, 30, 40
    const result = await proposalService.incrementCounter(25, 'manual');

    expect(result.count).toBe(40);
    expect(result.newly_crossed_milestone).toBe(40);
    expect(result.milestone_message).toBe('puchta rahunga');
    expect(result.celebrated_milestones).toEqual(expect.arrayContaining([20, 30, 40]));
  });

  it('Manual addition from 0 to 100 triggers 100 with randomized phrase', async () => {
    await proposalService.setCounterState(0);
    const result = await proposalService.incrementCounter(100, 'manual');

    expect(result.count).toBe(100);
    expect(result.newly_crossed_milestone).toBe(100);
    expect(MILESTONE_PHRASE_LIST).toContain(result.milestone_message);
  });

  it('Concurrent increments maintain atomic consistency', async () => {
    await proposalService.setCounterState(0);

    const promises = [
      proposalService.incrementCounter(2, 'manual'),
      proposalService.incrementCounter(3, 'manual'),
      proposalService.incrementCounter(5, 'manual'),
      proposalService.incrementCounter(10, 'manual'),
    ];

    await Promise.all(promises);
    const finalState = await proposalService.getCounter();
    expect(finalState.count).toBe(20);
    expect(finalState.celebrated_milestones).toEqual(expect.arrayContaining([10, 20]));
  });

  it('Rejects invalid manual inputs (0, negative, decimals, NaN)', async () => {
    await expect(proposalService.incrementCounter(0, 'manual')).rejects.toThrow();
    await expect(proposalService.incrementCounter(-4, 'manual')).rejects.toThrow();
    await expect(proposalService.incrementCounter(2.5, 'manual')).rejects.toThrow();
    await expect(proposalService.incrementCounter(NaN, 'manual')).rejects.toThrow();
  });

  it('Page refresh retains count: picks up exactly where it was left', async () => {
    await proposalService.setCounterState(47);
    await proposalService.incrementCounter(3, 'button');

    // Simulate page refresh
    const reloadedState = proposalService.getInitialState();
    expect(reloadedState.count).toBe(50);
    expect(reloadedState.celebrated_milestones).toContain(50);
    expect(reloadedState.last_milestone_message).toBe('thak jaane ke baad bhi puchunga');
  });
});
