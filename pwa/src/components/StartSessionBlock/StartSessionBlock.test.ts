import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import type { RoutineSummary } from 'gym-pwa-api/types';
import { describe, expect, it } from 'vitest';
import StartSessionBlock from './StartSessionBlock.vue';

const routineA: RoutineSummary = { id: 1, label: 'Upper Body', exerciseCount: 5, userId: null };
const routineB: RoutineSummary = { id: 2, label: 'Lower Body', exerciseCount: 4, userId: null };

function renderBlock(props: {
  routines?: RoutineSummary[];
  loading?: boolean;
  error?: string | null;
  startingRoutineId?: number | null;
}) {
  return render(StartSessionBlock, {
    props: {
      routines: props.routines ?? [],
      loading: props.loading ?? false,
      error: props.error ?? null,
      startingRoutineId: props.startingRoutineId ?? null,
    },
  });
}

describe('StartSessionBlock', () => {
  it('should show loading state', () => {
    renderBlock({ loading: true });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    renderBlock({ error: 'Something went wrong' });
    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  it('should render a button for each routine', () => {
    renderBlock({ routines: [routineA, routineB] });
    expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lower Body' })).toBeInTheDocument();
  });

  it('should emit startSession with the routine id when a button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = renderBlock({ routines: [routineA, routineB] });

    await user.click(screen.getByRole('button', { name: 'Upper Body' }));

    expect(emitted('startSession')).toEqual([[1]]);
  });

  it('should disable all buttons while a routine is starting', () => {
    renderBlock({ routines: [routineA, routineB], startingRoutineId: 1 });
    expect(screen.getByRole('button', { name: 'Upper Body' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Lower Body' })).toBeDisabled();
  });

  it('should not emit startSession when a button is disabled', async () => {
    const user = userEvent.setup();
    const { emitted } = renderBlock({ routines: [routineA], startingRoutineId: 1 });

    await user.click(screen.getByRole('button', { name: 'Upper Body' }));

    expect(emitted('startSession')).toBeUndefined();
  });
});
