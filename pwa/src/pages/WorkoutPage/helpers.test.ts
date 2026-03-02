import type { CompletedSet } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LocalWorkout, LocalWorkoutExercise, WorkoutSet } from '../../lib/db';
import { server } from '../../test/msw';
import {
  calculateCompletedSetsTotalWeightKg,
  calculateElapsedSeconds,
  calculateExerciseTotalWeightKg,
  calculateFinalDurationSeconds,
  calculateSetWeightKg,
  calculateWorkoutTotalWeightKg,
  createDefaultSets,
  createNewSet,
  createWorkoutPayload,
  fetchWorkout,
  formatSetDetails,
  formatStartTime,
  getCompletedExercises,
  getSetDisplayLabel,
  getSetInputFields,
  isSetFilledIn,
  saveWorkout,
  startExercise,
} from './helpers';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

describe('WorkoutPage helpers', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  describe('formatStartTime', () => {
    it('formats ISO date string to localized time', () => {
      const isoString = '2025-01-15T14:30:00.000Z';
      const result = formatStartTime(isoString);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('handles different time zones correctly', () => {
      const isoString = '2025-01-15T09:15:00.000Z';
      const result = formatStartTime(isoString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('createDefaultSets', () => {
    it('returns two standard sets for REPS exercises', () => {
      const sets = createDefaultSets('REPS');
      expect(sets).toHaveLength(2);
      expect(sets[0].setType).toBe('Standard');
      expect(sets[1].setType).toBe('Standard');
    });

    it('returns one standard set for WEIGHT_AND_TIME exercises', () => {
      const sets = createDefaultSets('WEIGHT_AND_TIME');
      expect(sets).toHaveLength(1);
      expect(sets[0].setType).toBe('Standard');
    });

    it('returns one standard set for TIME exercises', () => {
      const sets = createDefaultSets('TIME');
      expect(sets).toHaveLength(1);
      expect(sets[0].setType).toBe('Standard');
    });

    it('returns a warmup and two standard sets for WEIGHT exercises', () => {
      const sets = createDefaultSets('WEIGHT');
      expect(sets).toHaveLength(3);
      expect(sets[0].setType).toBe('Warmup');
      expect(sets[1].setType).toBe('Standard');
      expect(sets[2].setType).toBe('Standard');
    });

    it('returns a warmup and two standard sets for BODYWEIGHT_PLUS_WEIGHT exercises', () => {
      const sets = createDefaultSets('BODYWEIGHT_PLUS_WEIGHT');
      expect(sets).toHaveLength(3);
      expect(sets[0].setType).toBe('Warmup');
      expect(sets[1].setType).toBe('Standard');
      expect(sets[2].setType).toBe('Standard');
    });

    it('returns a warmup and two standard sets for BODYWEIGHT_MINUS_OFFSET exercises', () => {
      const sets = createDefaultSets('BODYWEIGHT_MINUS_OFFSET');
      expect(sets).toHaveLength(3);
      expect(sets[0].setType).toBe('Warmup');
      expect(sets[1].setType).toBe('Standard');
      expect(sets[2].setType).toBe('Standard');
    });

    it('sets all as incomplete', () => {
      const sets = createDefaultSets('WEIGHT');
      const allIncomplete = sets.every((set) => set.completed === false);
      expect(allIncomplete).toBe(true);
    });

    it('generates unique ids', () => {
      const sets = createDefaultSets('WEIGHT');
      const ids = sets.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('createNewSet', () => {
    it('returns a normal incomplete set', () => {
      const set = createNewSet();
      expect(set.setType).toBe('Standard');
      expect(set.completed).toBe(false);
      expect(set.id).toBeTruthy();
    });
  });

  describe('getSetDisplayLabel', () => {
    it('returns W for warmup sets', () => {
      const sets: WorkoutSet[] = [
        { id: '1', setType: 'Warmup', completed: false },
        { id: '2', setType: 'Standard', completed: false },
      ];
      expect(getSetDisplayLabel(sets, 0)).toBe('W');
    });

    it('numbers normal sets starting from 1', () => {
      const sets: WorkoutSet[] = [
        { id: '1', setType: 'Warmup', completed: false },
        { id: '2', setType: 'Standard', completed: false },
        { id: '3', setType: 'Standard', completed: false },
      ];
      expect(getSetDisplayLabel(sets, 1)).toBe('1');
      expect(getSetDisplayLabel(sets, 2)).toBe('2');
    });

    it('numbers failure sets as normal', () => {
      const sets: WorkoutSet[] = [
        { id: '1', setType: 'Warmup', completed: false },
        { id: '2', setType: 'Standard', completed: false },
        { id: '3', setType: 'Failure', completed: false },
      ];
      expect(getSetDisplayLabel(sets, 2)).toBe('2');
    });

    it('skips warmups in numbering', () => {
      const sets: WorkoutSet[] = [
        { id: '1', setType: 'Warmup', completed: false },
        { id: '2', setType: 'Warmup', completed: false },
        { id: '3', setType: 'Standard', completed: false },
      ];
      expect(getSetDisplayLabel(sets, 2)).toBe('1');
    });
  });

  describe('getSetInputFields', () => {
    it('returns weight and reps for WEIGHT type', () => {
      const result = getSetInputFields('WEIGHT');
      expect(result).toEqual({
        showWeight: true,
        showReps: true,
        showTime: false,
        weightLabel: 'Kg',
      });
    });

    it('returns weight and reps for BODYWEIGHT_PLUS_WEIGHT', () => {
      const result = getSetInputFields('BODYWEIGHT_PLUS_WEIGHT');
      expect(result).toEqual({
        showWeight: true,
        showReps: true,
        showTime: false,
        weightLabel: 'Kg',
      });
    });

    it('returns weight (offset) and reps for BODYWEIGHT_MINUS_OFFSET', () => {
      const result = getSetInputFields('BODYWEIGHT_MINUS_OFFSET');
      expect(result).toEqual({
        showWeight: true,
        showReps: true,
        showTime: false,
        weightLabel: 'Kg',
      });
    });

    it('returns weight and time for WEIGHT_AND_TIME', () => {
      const result = getSetInputFields('WEIGHT_AND_TIME');
      expect(result).toEqual({
        showWeight: true,
        showReps: false,
        showTime: true,
        weightLabel: 'Kg',
      });
    });

    it('returns time only for TIME', () => {
      const result = getSetInputFields('TIME');
      expect(result).toEqual({
        showWeight: false,
        showReps: false,
        showTime: true,
        weightLabel: '',
      });
    });

    it('returns reps only for REPS', () => {
      const result = getSetInputFields('REPS');
      expect(result).toEqual({
        showWeight: false,
        showReps: true,
        showTime: false,
        weightLabel: '',
      });
    });
  });

  describe('calculateSetWeightKg', () => {
    it('calculates WEIGHT type: weight * reps', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 60,
        reps: 10,
        completed: true,
      };
      expect(calculateSetWeightKg('WEIGHT', 80, set)).toBe(600);
    });

    it('calculates BODYWEIGHT_PLUS_WEIGHT type', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 20,
        reps: 8,
        completed: true,
      };
      expect(calculateSetWeightKg('BODYWEIGHT_PLUS_WEIGHT', 80, set)).toBe(800);
    });

    it('calculates BODYWEIGHT_MINUS_OFFSET type', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 30,
        reps: 5,
        completed: true,
      };
      expect(calculateSetWeightKg('BODYWEIGHT_MINUS_OFFSET', 80, set)).toBe(250);
    });

    it('calculates WEIGHT_AND_TIME type: weight only', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 40,
        timeSeconds: 60,
        completed: true,
      };
      expect(calculateSetWeightKg('WEIGHT_AND_TIME', 80, set)).toBe(40);
    });

    it('returns 0 for TIME type', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', timeSeconds: 120, completed: true };
      expect(calculateSetWeightKg('TIME', 80, set)).toBe(0);
    });

    it('returns 0 for REPS type', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', reps: 15, completed: true };
      expect(calculateSetWeightKg('REPS', 80, set)).toBe(0);
    });

    it('handles missing weight/reps as 0', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', completed: true };
      expect(calculateSetWeightKg('WEIGHT', 80, set)).toBe(0);
    });
  });

  describe('isSetFilledIn', () => {
    it('returns true for WEIGHT set with weightKg and reps', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 60,
        reps: 10,
        completed: false,
      };
      expect(isSetFilledIn(set, 'WEIGHT')).toBe(true);
    });

    it('returns false for WEIGHT set missing reps', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', weightKg: 60, completed: false };
      expect(isSetFilledIn(set, 'WEIGHT')).toBe(false);
    });

    it('returns false for WEIGHT set missing weightKg', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', reps: 10, completed: false };
      expect(isSetFilledIn(set, 'WEIGHT')).toBe(false);
    });

    it('returns true for TIME set with timeSeconds', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', timeSeconds: 60, completed: false };
      expect(isSetFilledIn(set, 'TIME')).toBe(true);
    });

    it('returns false for TIME set missing timeSeconds', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', completed: false };
      expect(isSetFilledIn(set, 'TIME')).toBe(false);
    });

    it('returns true for REPS set with reps', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', reps: 10, completed: false };
      expect(isSetFilledIn(set, 'REPS')).toBe(true);
    });

    it('returns false for REPS set missing reps', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', completed: false };
      expect(isSetFilledIn(set, 'REPS')).toBe(false);
    });

    it('returns true for WEIGHT_AND_TIME set with weightKg and timeSeconds', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 20,
        timeSeconds: 60,
        completed: false,
      };
      expect(isSetFilledIn(set, 'WEIGHT_AND_TIME')).toBe(true);
    });

    it('returns false for WEIGHT_AND_TIME set missing timeSeconds', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', weightKg: 20, completed: false };
      expect(isSetFilledIn(set, 'WEIGHT_AND_TIME')).toBe(false);
    });
  });

  describe('calculateExerciseTotalWeightKg', () => {
    it('sums weight from all sets regardless of completion', () => {
      const sets: WorkoutSet[] = [
        { id: '1', setType: 'Standard', weightKg: 60, reps: 10, completed: true },
        { id: '2', setType: 'Standard', weightKg: 60, reps: 8, completed: true },
        { id: '3', setType: 'Standard', weightKg: 60, reps: 6, completed: false },
      ];
      expect(calculateExerciseTotalWeightKg('WEIGHT', 80, sets)).toBe(1440);
    });

    it('returns 0 when sets have no values', () => {
      const sets: WorkoutSet[] = [{ id: '1', setType: 'Standard', completed: false }];
      expect(calculateExerciseTotalWeightKg('WEIGHT', 80, sets)).toBe(0);
    });
  });

  describe('calculateWorkoutTotalWeightKg', () => {
    it('sums weight of completed exercises calculated from sets', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 50, reps: 10, completed: true }],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: true,
          sets: [{ id: 's2', setType: 'Standard', weightKg: 80, reps: 10, completed: true }],
        },
        {
          id: 3,
          label: 'Curls',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: false,
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(1300);
    });

    it('returns 0 when no exercises are completed', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: false,
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(0);
    });
  });

  describe('calculateCompletedSetsTotalWeightKg', () => {
    it('sums weight for all sets in a completed exercise', () => {
      const sets: CompletedSet[] = [
        { setType: 'Warmup', weightKg: 40, reps: 10 },
        { setType: 'Standard', weightKg: 60, reps: 10 },
      ];
      expect(calculateCompletedSetsTotalWeightKg('WEIGHT', 80, sets)).toBe(1000);
    });

    it('returns 0 for TIME sets', () => {
      const sets: CompletedSet[] = [{ setType: 'Standard', timeSeconds: 60 }];
      expect(calculateCompletedSetsTotalWeightKg('TIME', 80, sets)).toBe(0);
    });

    it('returns 0 for empty sets', () => {
      expect(calculateCompletedSetsTotalWeightKg('WEIGHT', 80, [])).toBe(0);
    });
  });

  describe('startExercise', () => {
    it('sets startedAt and creates default sets for WEIGHT exercises', () => {
      const exercise: LocalWorkoutExercise = {
        id: 1,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        completed: false,
      };
      const result = startExercise(exercise);
      expect(result.startedAt).toBeTruthy();
      expect(result.sets).toHaveLength(3);
      if (result.sets === undefined) throw new Error('sets should be defined');
      expect(result.sets[0].setType).toBe('Warmup');
      expect(result.sets[1].setType).toBe('Standard');
      expect(result.sets[2].setType).toBe('Standard');
    });

    it('creates two standard sets for REPS exercises', () => {
      const exercise: LocalWorkoutExercise = {
        id: 1,
        label: 'Sit Ups',
        recordSetsType: 'REPS',
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        completed: false,
      };
      const result = startExercise(exercise);
      expect(result.sets).toHaveLength(2);
      if (result.sets === undefined) throw new Error('sets should be defined');
      expect(result.sets[0].setType).toBe('Standard');
      expect(result.sets[1].setType).toBe('Standard');
    });

    it('creates one standard set for WEIGHT_AND_TIME exercises', () => {
      const exercise: LocalWorkoutExercise = {
        id: 1,
        label: 'Plank Hold',
        recordSetsType: 'WEIGHT_AND_TIME',
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        completed: false,
      };
      const result = startExercise(exercise);
      expect(result.sets).toHaveLength(1);
      if (result.sets === undefined) throw new Error('sets should be defined');
      expect(result.sets[0].setType).toBe('Standard');
    });

    it('creates one standard set for TIME exercises', () => {
      const exercise: LocalWorkoutExercise = {
        id: 1,
        label: 'Plank',
        recordSetsType: 'TIME',
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        completed: false,
      };
      const result = startExercise(exercise);
      expect(result.sets).toHaveLength(1);
      if (result.sets === undefined) throw new Error('sets should be defined');
      expect(result.sets[0].setType).toBe('Standard');
    });

    it('does not mutate the original exercise', () => {
      const exercise: LocalWorkoutExercise = {
        id: 1,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        completed: false,
      };
      startExercise(exercise);
      expect(exercise.startedAt).toBeUndefined();
      expect(exercise.sets).toBeUndefined();
    });
  });

  describe('getCompletedExercises', () => {
    it('filters only completed exercises and strips local fields', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Quadriceps'],
          secondaryMuscleGroups: ['Glutes'],
          completed: false,
        },
      ];
      const result = getCompletedExercises(exercises);
      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('completed');
      expect(result[0]).not.toHaveProperty('startedAt');
      expect(result[0].sets[0]).not.toHaveProperty('id');
      expect(result[0].sets[0]).not.toHaveProperty('completed');
    });

    it('filters out sets missing required inputs from completed exercises', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: true,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [
            { id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: false },
            { id: 's2', setType: 'Standard', completed: false },
          ],
        },
      ];
      const result = getCompletedExercises(exercises);
      expect(result[0].sets).toHaveLength(1);
    });

    it('returns empty array when no exercises are completed', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          completed: false,
        },
      ];
      expect(getCompletedExercises(exercises)).toHaveLength(0);
    });
  });

  describe('createWorkoutPayload', () => {
    it('creates correct workout payload with completed exercises', () => {
      const workout: LocalWorkout = {
        id: 'workout-123',
        userId: 456,
        routineId: 1,
        routineLabel: 'Strength Training',
        startedAt: '2025-01-15T14:00:00.000Z',
        bodyWeightKg: 75.5,
        exercisesCompleted: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            primaryMuscleGroups: ['Pectoralis Major'],
            secondaryMuscleGroups: ['Triceps'],
            completed: true,
            sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
          },
          {
            id: 2,
            label: 'Squats',
            recordSetsType: 'WEIGHT',
            primaryMuscleGroups: ['Quadriceps'],
            secondaryMuscleGroups: ['Glutes'],
            completed: false,
          },
        ],
      };

      const result = createWorkoutPayload(workout, '2025-01-15T15:30:00.000Z', 5400);
      expect(result.exercisesCompleted).toHaveLength(1);
      expect(result.totalWeightKg).toBe(600);
      expect(result.bodyWeightKg).toBe(75.5);
      expect(result.durationSeconds).toBe(5400);
    });

    it('includes all required fields', () => {
      const workout: LocalWorkout = {
        id: 'workout-123',
        userId: 456,
        routineId: 2,
        routineLabel: 'Cardio',
        startedAt: '2025-01-15T10:00:00.000Z',
        bodyWeightKg: 80.0,
        exercisesCompleted: [],
      };

      const result = createWorkoutPayload(workout, '2025-01-15T11:00:00.000Z', 3600);
      expect(result.routineId).toBe(2);
      expect(result.routineLabel).toBe('Cardio');
      expect(result.totalWeightKg).toBe(0);
      expect(result.exercisesCompleted).toEqual([]);
    });
  });

  describe('saveWorkout', () => {
    it('sends POST request with workout data', async () => {
      const mockResponse = {
        id: 1,
        userId: 123,
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:00:00.000Z',
        exercisesCompleted: [],
      };

      server.use(
        http.post(`${mockApiUrl}/users/123/workouts`, async ({ request }) => {
          const body = await request.json();
          expect(body).toHaveProperty('routineId');
          expect(body).toHaveProperty('bodyWeightKg');
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await saveWorkout(123, {
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:00:00.000Z',
        exercisesCompleted: [],
        bodyWeightKg: 75.5,
        totalWeightKg: 0,
      });

      expect(result).toEqual(mockResponse);
    });

    it('throws error when API call fails', async () => {
      server.use(
        http.post(`${mockApiUrl}/users/123/workouts`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(
        saveWorkout(123, {
          routineId: 1,
          routineLabel: 'Test Routine',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          exercisesCompleted: [],
          bodyWeightKg: 75.5,
          totalWeightKg: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe('calculateElapsedSeconds', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calculates elapsed time without pauses', () => {
      const startedAt = '2025-01-15T14:00:00.000Z';
      vi.setSystemTime(new Date('2025-01-15T14:05:00.000Z'));
      expect(calculateElapsedSeconds(startedAt, 0, false)).toBe(300);
    });

    it('calculates elapsed time with total paused seconds', () => {
      const startedAt = '2025-01-15T14:00:00.000Z';
      vi.setSystemTime(new Date('2025-01-15T14:10:00.000Z'));
      expect(calculateElapsedSeconds(startedAt, 120, false)).toBe(480);
    });

    it('calculates elapsed time when currently paused', () => {
      const startedAt = '2025-01-15T14:00:00.000Z';
      const pausedAt = '2025-01-15T14:05:00.000Z';
      vi.setSystemTime(new Date('2025-01-15T14:07:00.000Z'));
      expect(calculateElapsedSeconds(startedAt, 0, true, pausedAt)).toBe(300);
    });

    it('calculates elapsed time with previous pauses and currently paused', () => {
      const startedAt = '2025-01-15T14:00:00.000Z';
      const pausedAt = '2025-01-15T14:08:00.000Z';
      vi.setSystemTime(new Date('2025-01-15T14:10:00.000Z'));
      expect(calculateElapsedSeconds(startedAt, 60, true, pausedAt)).toBe(420);
    });
  });

  describe('calculateFinalDurationSeconds', () => {
    it('calculates duration between start and finish', () => {
      expect(
        calculateFinalDurationSeconds('2025-01-15T14:00:00.000Z', '2025-01-15T15:00:00.000Z')
      ).toBe(3600);
    });

    it('calculates duration with paused time', () => {
      expect(
        calculateFinalDurationSeconds('2025-01-15T14:00:00.000Z', '2025-01-15T15:00:00.000Z', 300)
      ).toBe(3300);
    });

    it('handles short durations', () => {
      expect(
        calculateFinalDurationSeconds('2025-01-15T14:00:00.000Z', '2025-01-15T14:00:45.000Z')
      ).toBe(45);
    });
  });

  describe('formatSetDetails', () => {
    it('formats WEIGHT set with setType, weight, and reps', () => {
      const set: CompletedSet = { setType: 'Standard', weightKg: 60, reps: 10 };
      expect(formatSetDetails(set, 'WEIGHT')).toBe('Standard · 60kg · 10 reps');
    });

    it('formats BODYWEIGHT_PLUS_WEIGHT set', () => {
      const set: CompletedSet = { setType: 'Standard', weightKg: 20, reps: 8 };
      expect(formatSetDetails(set, 'BODYWEIGHT_PLUS_WEIGHT')).toBe('Standard · 20kg · 8 reps');
    });

    it('formats BODYWEIGHT_MINUS_OFFSET set with offset label', () => {
      const set: CompletedSet = { setType: 'Standard', weightKg: 30, reps: 5 };
      expect(formatSetDetails(set, 'BODYWEIGHT_MINUS_OFFSET')).toBe(
        'Standard · 30kg offset · 5 reps'
      );
    });

    it('formats WEIGHT_AND_TIME set with weight and time', () => {
      const set: CompletedSet = { setType: 'Standard', weightKg: 40, timeSeconds: 90 };
      expect(formatSetDetails(set, 'WEIGHT_AND_TIME')).toBe('Standard · 40kg · 1m 30s');
    });

    it('formats TIME set with time only', () => {
      const set: CompletedSet = { setType: 'Standard', timeSeconds: 120 };
      expect(formatSetDetails(set, 'TIME')).toBe('Standard · 2m');
    });

    it('formats Warmup set type', () => {
      const set: CompletedSet = { setType: 'Warmup', weightKg: 40, reps: 10 };
      expect(formatSetDetails(set, 'WEIGHT')).toBe('Warmup · 40kg · 10 reps');
    });

    it('handles missing weight as 0', () => {
      const set: CompletedSet = { setType: 'Standard', reps: 10 };
      expect(formatSetDetails(set, 'WEIGHT')).toBe('Standard · 0kg · 10 reps');
    });

    it('handles missing reps as 0', () => {
      const set: CompletedSet = { setType: 'Standard', weightKg: 60 };
      expect(formatSetDetails(set, 'WEIGHT')).toBe('Standard · 60kg · 0 reps');
    });

    it('formats time in seconds only when less than a minute', () => {
      const set: CompletedSet = { setType: 'Standard', timeSeconds: 45 };
      expect(formatSetDetails(set, 'TIME')).toBe('Standard · 45s');
    });

    it('formats REPS set with reps only', () => {
      const set: CompletedSet = { setType: 'Standard', reps: 15 };
      expect(formatSetDetails(set, 'REPS')).toBe('Standard · 15 reps');
    });

    it('handles missing reps as 0 for REPS type', () => {
      const set: CompletedSet = { setType: 'Standard' };
      expect(formatSetDetails(set, 'REPS')).toBe('Standard · 0 reps');
    });
  });

  describe('fetchWorkout', () => {
    it('fetches a single workout from the API', async () => {
      const mockResponse = {
        id: 1,
        userId: 123,
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:00:00.000Z',
        durationSeconds: 3600,
        exercisesCompleted: [],
        totalWeightKg: 500,
        bodyWeightKg: 75.5,
      };

      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/1`, () => {
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await fetchWorkout(123, 1);
      expect(result).toEqual(mockResponse);
    });

    it('throws error when API call fails', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/123/workouts/999`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(fetchWorkout(123, 999)).rejects.toThrow();
    });
  });
});
