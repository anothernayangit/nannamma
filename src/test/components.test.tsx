import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MainCounter } from '../components/MainCounter';
import { ManualAddition } from '../components/ManualAddition';
import { MilestoneModal } from '../components/MilestoneModal';
import { Footer } from '../components/Footer';

describe('UI Components Unit Tests', () => {
  it('renders MainCounter with large count and button text', () => {
    const onIncrement = vi.fn();
    render(
      <MainCounter
        count={47}
        isLoading={false}
        isSubmitting={false}
        onIncrement={onIncrement}
      />
    );

    expect(screen.getByTestId('proposal-count-display')).toHaveTextContent('47');
    expect(screen.getByText('Phirse puch liya isne.')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('main-proposal-button'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('renders ManualAddition section with correct heading, text, placeholder, and button', async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<ManualAddition isSubmitting={false} onAddManual={onAdd} />);

    expect(screen.getByText('Were there proposals we missed? 👀')).toBeInTheDocument();
    expect(
      screen.getByText("Add the ones that happened when you weren't here to click!")
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter number of times...') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Add to our count ❤️')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toBe('5');

    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith(5);
    });

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('rejects invalid inputs in ManualAddition', async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<ManualAddition isSubmitting={false} onAddManual={onAdd} />);

    const input = screen.getByPlaceholderText('Enter number of times...');

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.submit(input.closest('form')!);
    expect(await screen.findByTestId('manual-input-error')).toHaveTextContent('Please enter a number greater than 0.');
    expect(onAdd).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '4.5' } });
    fireEvent.submit(input.closest('form')!);
    expect(await screen.findByTestId('manual-input-error')).toHaveTextContent('Only positive whole numbers are allowed (no decimals or symbols).');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('renders MilestoneModal with exact milestone message and closes properly', () => {
    const onClose = vi.fn();
    render(
      <MilestoneModal
        milestone={{ count: 20, message: 'haa keh diya tha?' }}
        onClose={onClose}
      />
    );

    expect(screen.getByTestId('milestone-message-text')).toHaveTextContent('"haa keh diya tha?"');
    expect(screen.getByText('Proposal #20 Milestone!')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-milestone-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders Footer with exact quote', () => {
    render(<Footer />);
    expect(
      screen.getByText('Some questions are worth asking a thousand times. ❤️')
    ).toBeInTheDocument();
  });
});
