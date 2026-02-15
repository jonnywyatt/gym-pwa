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

  describe('not started state', () => {
    it('shows exercise label and Start button', () => {
      render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('emits start event when Start button is clicked', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: baseExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByText('Start'));
      expect(emitted().start).toHaveLength(1);
      expect(emitted().start[0]).toEqual([1]);
    });
  });

  describe('in progress state', () => {
    const inProgressExercise: LocalWorkoutExercise = {
      ...baseExercise,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [
        { id: 's1', setType: 'Warmup', completed: false },
        { id: 's2', setType: 'Normal', completed: false },
      ],
    };

    it('shows set rows with inputs', () => {
      render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('Kg')).toHaveLength(2);
      expect(screen.getAllByPlaceholderText('Reps')).toHaveLength(2);
    });

    it('shows Add Set, Finish, and Discard buttons', () => {
      render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('Add Set')).toBeInTheDocument();
      expect(screen.getByText('Finish')).toBeInTheDocument();
      expect(screen.getByText('Discard')).toBeInTheDocument();
    });

    it('emits addSet event when Add Set is clicked', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByText('Add Set'));
      expect(emitted().addSet).toHaveLength(1);
      expect(emitted().addSet[0]).toEqual([1]);
    });

    it('emits finish event when Finish is clicked', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByText('Finish'));
      expect(emitted().finish).toHaveLength(1);
      expect(emitted().finish[0]).toEqual([1]);
    });

    it('emits discard event when Discard is clicked', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      await user.click(screen.getByText('Discard'));
      expect(emitted().discard).toHaveLength(1);
      expect(emitted().discard[0]).toEqual([1]);
    });

    it('emits updateSet when checkbox is toggled', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      expect(emitted().updateSet).toHaveLength(1);
      expect(emitted().updateSet[0]).toEqual([1, 's1', { completed: true }]);
    });

    it('emits changeSetType when dropdown changes', async () => {
      const user = userEvent.setup();
      const { emitted } = render(ExerciseSets, {
        props: { exercise: inProgressExercise, bodyWeightKg: 80 },
      });

      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[1], 'Failure');
      expect(emitted().changeSetType).toHaveLength(1);
      expect(emitted().changeSetType[0]).toEqual([1, 's2', 'Failure']);
    });

    it('shows running total weight when sets are completed', () => {
      const exerciseWithCompletedSets: LocalWorkoutExercise = {
        ...baseExercise,
        startedAt: '2025-01-15T14:00:00.000Z',
        sets: [
          { id: 's1', setType: 'Warmup', weightKg: 40, reps: 10, completed: true },
          { id: 's2', setType: 'Normal', weightKg: 60, reps: 10, completed: true },
        ],
      };

      render(ExerciseSets, {
        props: { exercise: exerciseWithCompletedSets, bodyWeightKg: 80 },
      });

      expect(screen.getByText('1000 Kg')).toBeInTheDocument();
    });
  });

  describe('completed state', () => {
    const completedExercise: LocalWorkoutExercise = {
      ...baseExercise,
      completed: true,
      startedAt: '2025-01-15T14:00:00.000Z',
      sets: [
        { id: 's1', setType: 'Normal', weightKg: 60, reps: 10, completed: true },
        { id: 's2', setType: 'Normal', weightKg: 60, reps: 8, completed: true },
      ],
      totalWeightKg: 1080,
    };

    it('shows exercise label and total weight', () => {
      render(ExerciseSets, {
        props: { exercise: completedExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('1080 Kg')).toBeInTheDocument();
    });

    it('shows completed summary', () => {
      render(ExerciseSets, {
        props: { exercise: completedExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByText('2 sets completed')).toBeInTheDocument();
    });

    it('does not show Start, Finish, or Discard buttons', () => {
      render(ExerciseSets, {
        props: { exercise: completedExercise, bodyWeightKg: 80 },
      });

      expect(screen.queryByText('Start')).not.toBeInTheDocument();
      expect(screen.queryByText('Finish')).not.toBeInTheDocument();
      expect(screen.queryByText('Discard')).not.toBeInTheDocument();
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
      sets: [{ id: 's1', setType: 'Normal', timeSeconds: 60, completed: false }],
    };

    it('shows time input but not weight or reps inputs', () => {
      render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByPlaceholderText('m:ss')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Kg')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Reps')).not.toBeInTheDocument();
    });

    it('displays formatted time value', () => {
      render(ExerciseSets, {
        props: { exercise: timeExercise, bodyWeightKg: 80 },
      });

      const timeInput = screen.getByPlaceholderText('m:ss') as HTMLInputElement;
      expect(timeInput.value).toBe('1:00');
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
      sets: [{ id: 's1', setType: 'Normal', completed: false }],
    };

    it('shows weight and time inputs but not reps', () => {
      render(ExerciseSets, {
        props: { exercise: weightTimeExercise, bodyWeightKg: 80 },
      });

      expect(screen.getByPlaceholderText('Kg')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('m:ss')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Reps')).not.toBeInTheDocument();
    });
  });
});
