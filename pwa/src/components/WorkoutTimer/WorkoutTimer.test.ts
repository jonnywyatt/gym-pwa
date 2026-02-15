import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import WorkoutTimer from './WorkoutTimer.vue';

describe('WorkoutTimer', () => {
  it('displays formatted time correctly', () => {
    render(WorkoutTimer, {
      props: {
        elapsedSeconds: 3661,
        isPaused: false,
      },
    });

    expect(screen.getByText('01:01:01')).toBeInTheDocument();
  });

  it('displays zero time correctly', () => {
    render(WorkoutTimer, {
      props: {
        elapsedSeconds: 0,
        isPaused: false,
      },
    });

    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('displays large durations correctly', () => {
    render(WorkoutTimer, {
      props: {
        elapsedSeconds: 36000,
        isPaused: false,
      },
    });

    expect(screen.getByText('10:00:00')).toBeInTheDocument();
  });

  it('shows pause button when not paused', () => {
    render(WorkoutTimer, {
      props: {
        elapsedSeconds: 100,
        isPaused: false,
      },
    });

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('shows resume button when paused', () => {
    render(WorkoutTimer, {
      props: {
        elapsedSeconds: 100,
        isPaused: true,
      },
    });

    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });

  it('emits pause event when pause button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = render(WorkoutTimer, {
      props: {
        elapsedSeconds: 100,
        isPaused: false,
      },
    });

    const button = screen.getByRole('button', { name: 'Pause' });
    await user.click(button);

    expect(emitted().pause).toHaveLength(1);
  });

  it('emits resume event when resume button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = render(WorkoutTimer, {
      props: {
        elapsedSeconds: 100,
        isPaused: true,
      },
    });

    const button = screen.getByRole('button', { name: 'Resume' });
    await user.click(button);

    expect(emitted().resume).toHaveLength(1);
  });

  it('updates display when elapsed seconds changes', async () => {
    const { rerender } = render(WorkoutTimer, {
      props: {
        elapsedSeconds: 60,
        isPaused: false,
      },
    });

    expect(screen.getByText('00:01:00')).toBeInTheDocument();

    await rerender({
      elapsedSeconds: 120,
      isPaused: false,
    });

    expect(screen.getByText('00:02:00')).toBeInTheDocument();
  });

  it('updates button text when pause state changes', async () => {
    const { rerender } = render(WorkoutTimer, {
      props: {
        elapsedSeconds: 100,
        isPaused: false,
      },
    });

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    await rerender({
      elapsedSeconds: 100,
      isPaused: true,
    });

    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });
});
