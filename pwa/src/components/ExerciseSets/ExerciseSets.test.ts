import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import type { LocalWorkoutExercise } from '../../lib/db';
import ExerciseSets from './ExerciseSets.vue';

HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

describe('ExerciseSets', () => {
  const baseExercise: LocalWorkoutExercise = {
    id: 1,
    label: 'Bench Press',
    recordSetsType: 'WEIGHT',
    isIsometric: false,
    isUnilateral: false,
    bwFactor: null,
    primaryMuscleGroups: ['Pectoralis Major'],
    secondaryMuscleGroups: ['Triceps'],
    tertiaryMuscleGroups: [],
    completed: false,
  };

  const exerciseWithSets: LocalWorkoutExercise = {
    ...baseExercise,
    startedAt: '2025-01-15T14:00:00.000Z',
    sets: [
      { id: 's1', setType: 'Warmup', completed: false },
      { id: 's2', setType: 'Standard', completed: false },
    ],
  };

  describe('collapsed state', () => {
    it('shows exercise label and down chevron', () => {
      render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    it('does not show set inputs when collapsed', () => {
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      expect(screen.queryByPlaceholderText('Kg')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Reps')).not.toBeInTheDocument();
    });

    it('does not show Add Set button when collapsed', () => {
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      expect(screen.queryByText('Add Set')).not.toBeInTheDocument();
    });

    it('does not show Start, Finish, Discard, or Change buttons', () => {
      render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      expect(screen.queryByText('Start')).not.toBeInTheDocument();
      expect(screen.queryByText('Finish')).not.toBeInTheDocument();
      expect(screen.queryByText('Discard')).not.toBeInTheDocument();
      expect(screen.queryByText('Change')).not.toBeInTheDocument();
    });
  });

  describe('panel toggle', () => {
    it('opens panel when header row is clicked', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(screen.getByText('Add Set')).toBeInTheDocument();
    });

    it('closes panel when header row is clicked again', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      const header = screen.getByRole('button', { name: /bench press/i });
      await user.click(header);
      await user.click(header);

      expect(screen.queryByText('Add Set')).not.toBeInTheDocument();
    });

    it('emits start when first opened and exercise has no startedAt', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(emitted().start).toHaveLength(1);
      expect(emitted().start[0]).toEqual([1]);
    });

    it('does not emit start when exercise already has startedAt', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(emitted().start).toBeUndefined();
    });

    it('does not emit start on subsequent opens after the first', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      const header = screen.getByRole('button', { name: /bench press/i });
      await user.click(header);
      await user.click(header);
      await user.click(header);

      expect(emitted().start).toHaveLength(1);
    });
  });

  describe('open panel with sets', () => {
    it('shows set rows with inputs when opened', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(screen.getAllByPlaceholderText('Kg')).toHaveLength(2);
      expect(screen.getAllByPlaceholderText('Reps')).toHaveLength(2);
    });

    it('shows Add Set button when open', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(screen.getByRole('button', { name: 'Add Set' })).toBeInTheDocument();
    });

    it('emits addSet event when Add Set is clicked', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));
      await user.click(screen.getByRole('button', { name: 'Add Set' }));

      expect(emitted().addSet).toHaveLength(1);
      expect(emitted().addSet[0]).toEqual([1]);
    });

    it('shows full set type labels for non-WEIGHT_AND_TIME exercises', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      const select = screen.getByRole('combobox', { name: /set type for set 1/i });
      const options = Array.from(select.querySelectorAll('option'));
      expect(options.map((o) => o.textContent)).toEqual(['Warmup', 'Standard', 'Failure']);
    });

    it('emits changeSetType when dropdown changes', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[1], 'Failure');

      expect(emitted().changeSetType).toHaveLength(1);
      expect(emitted().changeSetType[0]).toEqual([1, 's2', 'Failure']);
    });

    it('includes bwFactor contribution in header total weight', () => {
      const reverseLunge: LocalWorkoutExercise = {
        ...baseExercise,
        label: 'Reverse Lunge',
        bwFactor: 0.5,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [{ id: 's1', setType: 'Standard', weightKg: 10, reps: 10, completed: false }],
      };

      render(ExerciseSets, {
        props: { exercise: reverseLunge, bodyWeightKg: 80 },
      });

      // (10kg added + 80 * 0.5 bw contribution) * 10 reps = (10 + 40) * 10 = 500kg
      expect(
        screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '500kg')
      ).toBeInTheDocument();
    });

    it('shows total weight based on entered values, not completion status', () => {
      const exerciseWithValues: LocalWorkoutExercise = {
        ...baseExercise,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: false },
          { id: 's2', setType: 'Standard', weightKg: 60, reps: 10, completed: false },
        ],
        completed: true,
      };

      render(ExerciseSets, {
        props: { exercise: exerciseWithValues, bodyWeightKg: 80 },
      });

      expect(
        screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '1200kg')
      ).toBeInTheDocument();
    });

    it('allows 0 weight to be entered', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));
      const weightInputs = screen.getAllByPlaceholderText('Kg');
      await user.clear(weightInputs[0]);
      await user.type(weightInputs[0], '0');

      expect(emitted().updateSet).toHaveLength(1);
      expect(emitted().updateSet[0]).toEqual([1, 's1', { weightKg: 0 }]);
    });

    it('allows 0 reps to be entered', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));
      const repsInputs = screen.getAllByPlaceholderText('Reps');
      await user.clear(repsInputs[0]);
      await user.type(repsInputs[0], '0');

      expect(emitted().updateSet).toHaveLength(1);
      expect(emitted().updateSet[0]).toEqual([1, 's1', { reps: 0 }]);
    });
  });

  describe('TIME exercise type', () => {
    const timeExercise: LocalWorkoutExercise = {
      id: 2,
      label: 'Dead Hang',
      recordSetsType: 'TIME',
      primaryMuscleGroups: ['Forearms'],
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [{ id: 's1', setType: 'Standard', timeSeconds: 60, completed: false }],
    };

    it('shows minutes and seconds inputs but not weight or reps inputs', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));

      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Sec')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Kg')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Reps')).not.toBeInTheDocument();
    });

    it('emits updateSet with combined timeSeconds when minutes input changes', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));
      const minInput = screen.getByPlaceholderText('Min');
      await user.clear(minInput);
      await user.type(minInput, '2');
      const updates = emitted().updateSet;
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate).toEqual([2, 's1', { timeSeconds: 120 }]);
    });

    it('emits updateSet with combined timeSeconds when seconds input changes', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));
      const secInput = screen.getByPlaceholderText('Sec');
      await user.clear(secInput);
      await user.type(secInput, '30');
      const updates = emitted().updateSet;
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate).toEqual([2, 's1', { timeSeconds: 90 }]);
    });

    it('displays minutes and seconds values separately', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));

      const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
      const secInput = screen.getByPlaceholderText('Sec') as HTMLInputElement;
      expect(minInput.value).toBe('1');
      expect(secInput.value).toBe('0');
    });
  });

  describe('completed time-based exercise header summary', () => {
    it('shows total time in header when TIME exercise is completed', () => {
      const completedDeadHang: LocalWorkoutExercise = {
        id: 2,
        label: 'Dead Hang',
        recordSetsType: 'TIME',
        primaryMuscleGroups: ['Forearms'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        completed: true,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Standard', timeSeconds: 60, completed: true },
          { id: 's2', setType: 'Standard', timeSeconds: 30, completed: true },
        ],
      };

      render(ExerciseSets, { props: { exercise: completedDeadHang, bodyWeightKg: 80 } });

      expect(screen.getByText('1m 30s')).toBeInTheDocument();
    });

    it('does not show time in header when TIME exercise is not completed', () => {
      const incompleteDeadHang: LocalWorkoutExercise = {
        id: 2,
        label: 'Dead Hang',
        recordSetsType: 'TIME',
        primaryMuscleGroups: ['Forearms'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        completed: false,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [{ id: 's1', setType: 'Standard', timeSeconds: 60, completed: true }],
      };

      render(ExerciseSets, { props: { exercise: incompleteDeadHang, bodyWeightKg: 80 } });

      expect(screen.queryByText('1m')).not.toBeInTheDocument();
    });

    it('shows weight and total time in header when WEIGHT_AND_TIME exercise is completed', () => {
      const completedFarmersCarry: LocalWorkoutExercise = {
        id: 3,
        label: "Farmer's Carry",
        recordSetsType: 'WEIGHT_AND_TIME',
        primaryMuscleGroups: ['Forearms'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        completed: true,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Standard', weightKg: 20, timeSeconds: 45, completed: true },
          { id: 's2', setType: 'Standard', weightKg: 20, timeSeconds: 45, completed: true },
        ],
      };

      render(ExerciseSets, { props: { exercise: completedFarmersCarry, bodyWeightKg: 80 } });

      expect(
        screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '20kg')
      ).toBeInTheDocument();
      expect(screen.getByText('1m 30s')).toBeInTheDocument();
    });

    it('does not show time summary for completed non-time exercises', () => {
      const completedBenchPress: LocalWorkoutExercise = {
        ...baseExercise,
        completed: true,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
      };

      render(ExerciseSets, { props: { exercise: completedBenchPress, bodyWeightKg: 80 } });

      expect(screen.queryByText(/\dm/)).not.toBeInTheDocument();
      expect(
        screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === '600kg')
      ).toBeInTheDocument();
    });
  });

  describe('REPS exercise type', () => {
    const repsExercise: LocalWorkoutExercise = {
      id: 4,
      label: 'Reverse Crunch',
      recordSetsType: 'REPS',
      primaryMuscleGroups: ['Obliques'],
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [{ id: 's1', setType: 'Standard', reps: 12, completed: false }],
    };

    it('shows only reps input, not weight or time inputs', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: repsExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /reverse crunch/i }));

      expect(screen.getByPlaceholderText('Reps')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Kg')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Min')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Sec')).not.toBeInTheDocument();
    });

    it('shows total reps in header as values are entered', () => {
      const repsExerciseWithSets: LocalWorkoutExercise = {
        id: 4,
        label: 'Reverse Crunch',
        recordSetsType: 'REPS',
        primaryMuscleGroups: ['Obliques'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        completed: false,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Standard', reps: 12, completed: true },
          { id: 's2', setType: 'Standard', reps: 10, completed: true },
          { id: 's3', setType: 'Standard', reps: 8, completed: false },
        ],
      };

      render(ExerciseSets, {
        props: { exercise: repsExerciseWithSets, bodyWeightKg: 80 },
      });

      expect(screen.getByText('30 reps')).toBeInTheDocument();
    });

    it('does not show reps summary in header when no reps are entered', () => {
      render(ExerciseSets, {
        props: {
          exercise: {
            ...repsExercise,
            sets: [{ id: 's1', setType: 'Standard', completed: false }],
          },
          bodyWeightKg: 80,
        },
      });

      expect(screen.queryByText(/reps/)).not.toBeInTheDocument();
    });
  });

  describe('WEIGHT_AND_TIME exercise type', () => {
    const weightTimeExercise: LocalWorkoutExercise = {
      id: 3,
      label: "Farmer's Carry",
      recordSetsType: 'WEIGHT_AND_TIME',
      primaryMuscleGroups: ['Forearms'],
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [{ id: 's1', setType: 'Standard', completed: false }],
    };

    it('shows abbreviated set type labels (Std, Wrm) in dropdown', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: weightTimeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /farmer/i }));

      const select = screen.getByRole('combobox', { name: /set type for set 1/i });
      const options = Array.from(select.querySelectorAll('option'));
      expect(options.map((o) => o.textContent)).toEqual(['W', 'S', 'F']);
    });

    it('shows weight, minutes and seconds inputs but not reps', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, {
        props: { exercise: weightTimeExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /farmer/i }));

      expect(screen.getByPlaceholderText('Kg')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Sec')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Reps')).not.toBeInTheDocument();
    });
  });

  describe('stopwatch button and exercise timer', () => {
    const timeExerciseWithSets: LocalWorkoutExercise = {
      id: 2,
      label: 'Dead Hang',
      recordSetsType: 'TIME',
      primaryMuscleGroups: ['Forearms'],
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [
        { id: 's1', setType: 'Standard', completed: false },
        { id: 's2', setType: 'Standard', completed: false },
      ],
    };

    const weightExercise: LocalWorkoutExercise = {
      id: 1,
      label: 'Bench Press',
      recordSetsType: 'WEIGHT',
      primaryMuscleGroups: ['Pectoralis Major'],
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [{ id: 's1', setType: 'Standard', completed: false }],
    };

    it('shows stopwatch button for TIME exercises', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, { props: { exercise: timeExerciseWithSets, bodyWeightKg: 80 } });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));

      expect(screen.getAllByRole('button', { name: /open timer for set/i })).toHaveLength(2);
    });

    it('does not show stopwatch button for WEIGHT exercises', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, { props: { exercise: weightExercise, bodyWeightKg: 80 } });

      await user.click(screen.getByRole('button', { name: /bench press/i }));

      expect(screen.queryByRole('button', { name: /open timer for set/i })).not.toBeInTheDocument();
    });

    it('shows stopwatch button for WEIGHT_AND_TIME exercises', async () => {
      const user = userEvent.setup();
      const weightTimeExercise: LocalWorkoutExercise = {
        id: 3,
        label: "Farmer's Carry",
        recordSetsType: 'WEIGHT_AND_TIME',
        primaryMuscleGroups: ['Forearms'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        completed: false,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [{ id: 's1', setType: 'Standard', completed: false }],
      };
      render(ExerciseSets, { props: { exercise: weightTimeExercise, bodyWeightKg: 80 } });

      await user.click(screen.getByRole('button', { name: /farmer/i }));

      expect(screen.getByRole('button', { name: /open timer for set 1/i })).toBeInTheDocument();
    });

    it('opens the timer modal when stopwatch button is clicked', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, { props: { exercise: timeExerciseWithSets, bodyWeightKg: 80 } });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));
      await user.click(screen.getByRole('button', { name: /open timer for set 1/i }));

      expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
    });

    it('emits updateSet with timeSeconds when timer Finish is clicked', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { emitted } = render(ExerciseSets, {
        props: { exercise: timeExerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));
      await user.click(screen.getByRole('button', { name: /open timer for set 1/i }));
      await user.click(screen.getByRole('button', { name: 'Start timer' }));
      vi.advanceTimersByTime(45000);
      await user.click(screen.getByRole('button', { name: 'Finish' }));

      vi.useRealTimers();

      const updates = emitted().updateSet as unknown[][];
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate).toEqual([2, 's1', { timeSeconds: 45 }]);
    });

    it('does not show a Cancel button in the timer', async () => {
      const user = userEvent.setup();
      render(ExerciseSets, { props: { exercise: timeExerciseWithSets, bodyWeightKg: 80 } });

      await user.click(screen.getByRole('button', { name: /dead hang/i }));
      await user.click(screen.getByRole('button', { name: /open timer for set 1/i }));

      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });
});
