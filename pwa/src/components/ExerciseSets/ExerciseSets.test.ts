import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import type { LocalWorkoutExercise } from '../../lib/db';
import ExerciseSets from './ExerciseSets.vue';

describe('ExerciseSets', () => {
  const baseExercise: LocalWorkoutExercise = {
    id: 1,
    label: 'Bench Press',
    recordSetsType: 'WEIGHT',
    primaryMuscleGroups: ['Pectoralis Major'],
    secondaryMuscleGroups: ['Triceps'],
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
      expect(screen.getByText('▼')).toBeInTheDocument();
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
      expect(screen.getByText('▲')).toBeInTheDocument();
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
      expect(screen.getByText('▼')).toBeInTheDocument();
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

      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
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

    it('emits updateSet when checkbox is toggled', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: exerciseWithSets, bodyWeightKg: 80 },
      });

      await user.click(screen.getByRole('button', { name: /bench press/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(emitted().updateSet).toHaveLength(1);
      expect(emitted().updateSet[0]).toEqual([1, 's1', { completed: true }]);
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

    it('shows total weight for completed sets in header', () => {
      const exerciseWithCompletedSets: LocalWorkoutExercise = {
        ...baseExercise,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true },
          { id: 's2', setType: 'Standard', weightKg: 60, reps: 10, completed: true },
        ],
        completed: true,
      };

      render(ExerciseSets, {
        props: { exercise: exerciseWithCompletedSets, bodyWeightKg: 80 },
      });

      expect(screen.getByText('1200 Kg')).toBeInTheDocument();
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

  describe('WEIGHT_AND_TIME exercise type', () => {
    const weightTimeExercise: LocalWorkoutExercise = {
      id: 3,
      label: "Farmer's Carry",
      recordSetsType: 'WEIGHT_AND_TIME',
      primaryMuscleGroups: ['Forearms'],
      secondaryMuscleGroups: [],
      completed: false,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [{ id: 's1', setType: 'Standard', completed: false }],
    };

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
});
