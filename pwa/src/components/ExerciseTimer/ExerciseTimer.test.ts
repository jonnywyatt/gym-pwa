import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import ExerciseTimer from './ExerciseTimer.vue';

HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

describe('ExerciseTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the timer display when open', () => {
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });
    expect(screen.getByLabelText('Elapsed time')).toBeInTheDocument();
    expect(screen.getByLabelText('Elapsed time').textContent).toBe('00:00');
  });

  it('shows the exercise label as a title', () => {
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });
    expect(screen.getByText('Plank')).toBeInTheDocument();
  });

  it('shows Start timer button when not running', () => {
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('shows Finish button', () => {
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });
    expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
  });

  it('switches to Pause button after start is pressed', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Start timer' }));

    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
  });

  it('increments elapsed time while running', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Start timer' }));
    vi.advanceTimersByTime(3000);
    await nextTick();

    expect(screen.getByLabelText('Elapsed time').textContent).toBe('00:03');
  });

  it('pauses the timer when Pause is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Start timer' }));
    vi.advanceTimersByTime(5000);

    await user.click(screen.getByRole('button', { name: 'Pause timer' }));
    vi.advanceTimersByTime(5000);

    expect(screen.getByLabelText('Elapsed time').textContent).toBe('00:05');
  });

  it('emits finish with elapsed seconds when Finish is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { emitted } = render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Start timer' }));
    vi.advanceTimersByTime(90000);

    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(emitted().finish).toHaveLength(1);
    expect(emitted().finish[0]).toEqual([90]);
  });

  it('does not show a Cancel button', () => {
    render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('resets elapsed time when reopened', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Start timer' }));
    vi.advanceTimersByTime(10000);

    await rerender({ open: false });
    await rerender({ open: true });

    expect(screen.getByLabelText('Elapsed time').textContent).toBe('00:00');
  });

  it('emits finish with 0 if Finish is clicked without starting', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { emitted } = render(ExerciseTimer, { props: { open: true, exerciseLabel: 'Plank' } });

    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(emitted().finish).toHaveLength(1);
    expect(emitted().finish[0]).toEqual([0]);
  });
});
