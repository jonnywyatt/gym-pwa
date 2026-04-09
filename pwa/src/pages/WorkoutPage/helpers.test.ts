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
  calculateMuscleGroupBreakdown,
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

    it('adds bwFactor contribution to WEIGHT type: (weight + bw * factor) * reps', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 20,
        reps: 10,
        completed: true,
      };
      // 80kg BW * 1.0 factor = 80kg extra; (20 + 80) * 10 = 1000
      expect(calculateSetWeightKg('WEIGHT', 80, set, 1.0)).toBe(1000);
    });

    it('adds partial bwFactor contribution to WEIGHT type', () => {
      const set: WorkoutSet = {
        id: '1',
        setType: 'Standard',
        weightKg: 0,
        reps: 10,
        completed: true,
      };
      // 80kg BW * 0.5 factor = 40kg; (0 + 40) * 10 = 400
      expect(calculateSetWeightKg('WEIGHT', 80, set, 0.5)).toBe(400);
    });

    it('uses bwFactor contribution for REPS type', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', reps: 10, completed: true };
      // 80kg BW * 1.0 factor = 80kg; 80 * 10 = 800
      expect(calculateSetWeightKg('REPS', 80, set, 1.0)).toBe(800);
    });

    it('returns 0 for REPS type without bwFactor', () => {
      const set: WorkoutSet = { id: '1', setType: 'Standard', reps: 15, completed: true };
      expect(calculateSetWeightKg('REPS', 80, set)).toBe(0);
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
    it('sums weight of all exercises calculated from sets', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: true,
          sets: [{ id: 's1', setType: 'Standard', weightKg: 50, reps: 10, completed: true }],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: true,
          sets: [{ id: 's2', setType: 'Standard', weightKg: 80, reps: 10, completed: true }],
        },
        {
          id: 3,
          label: 'Curls',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: false,
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(1300);
    });

    it('returns 0 when no exercises have sets', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: false,
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(0);
    });

    it('includes weight from exercises that are not yet completed', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: false,
          sets: [
            { id: 's1', setType: 'Warmup', weightKg: 40, reps: 10, completed: true },
            { id: 's2', setType: 'Standard', completed: false },
          ],
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(400);
    });

    it('includes bwFactor contribution for WEIGHT type exercises', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Lunge',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: true,
          bwFactor: 1.0,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          completed: true,
          // 75kg BW * 1.0 = 75kg; no extra weight entered; 75 * 10 = 750
          sets: [{ id: 's1', setType: 'Standard', weightKg: 0, reps: 10, completed: true }],
        },
      ];
      expect(calculateWorkoutTotalWeightKg(exercises, 75)).toBe(750);
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
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
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
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
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
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
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
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
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
        isIsometric: false,
        isUnilateral: false,
        bwFactor: null,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
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
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          tertiaryMuscleGroups: [],
          completed: true,
          startedAt: '2025-01-15T14:00:00.000Z',
          sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: ['Quadriceps'],
          secondaryMuscleGroups: ['Glutes'],
          tertiaryMuscleGroups: [],
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
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
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
          isIsometric: false,
          isUnilateral: false,
          bwFactor: null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
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
            tertiaryMuscleGroups: [],
            isIsometric: false,
            isUnilateral: false,
            bwFactor: null,
            completed: true,
            sets: [{ id: 's1', setType: 'Standard', weightKg: 60, reps: 10, completed: true }],
          },
          {
            id: 2,
            label: 'Squats',
            recordSetsType: 'WEIGHT',
            primaryMuscleGroups: ['Quadriceps'],
            secondaryMuscleGroups: ['Glutes'],
            tertiaryMuscleGroups: [],
            isIsometric: false,
            isUnilateral: false,
            bwFactor: null,
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
        totalReps: 0,
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
          totalReps: 0,
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

  describe('calculateMuscleGroupBreakdown', () => {
    const baseExercise = {
      id: 1,
      label: 'Bench Press',
      recordSetsType: 'WEIGHT' as const,
      isIsometric: false,
      isUnilateral: false,
      bwFactor: null,
      completed: true,
    };

    it('returns empty arrays when there are no exercises', () => {
      const result = calculateMuscleGroupBreakdown([]);
      expect(result).toEqual({ muscleGroups: [], bodyAreas: [] });
    });

    it('returns empty arrays when all exercises have no sets', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result).toEqual({ muscleGroups: [], bodyAreas: [] });
    });

    it('returns empty arrays when sets exist but none have data filled in', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [
          { id: 'a', setType: 'Warmup', completed: false },
          { id: 'b', setType: 'Standard', completed: false },
        ],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result).toEqual({ muscleGroups: [], bodyAreas: [] });
    });

    it('returns 100% for the only muscle group when a single exercise has one primary muscle', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result.muscleGroups).toHaveLength(1);
      expect(result.muscleGroups[0].muscleGroup).toBe('Pectoralis Major');
      expect(result.muscleGroups[0].percentage).toBe(100);
      expect(result.muscleGroups[0].bodyArea).toBe('Chest');
      expect(result.bodyAreas).toHaveLength(1);
      expect(result.bodyAreas[0].bodyArea).toBe('Chest');
      expect(result.bodyAreas[0].percentage).toBe(100);
    });

    it('counts warmup sets at 0.5x effective sets', () => {
      const exerciseWithWarmup: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'w', setType: 'Warmup', completed: true, weightKg: 40, reps: 10 }],
      };
      const exerciseWorking: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Squat',
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 's', setType: 'Standard', completed: true, weightKg: 80, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exerciseWithWarmup, exerciseWorking]);
      const chest = result.muscleGroups.find((mg) => mg.muscleGroup === 'Pectoralis Major');
      const legs = result.muscleGroups.find((mg) => mg.muscleGroup === 'Quadriceps');
      if (!chest || !legs) throw new Error('Expected both muscle groups');
      // warmup = 0.5 effective sets, working = 1.0 → ratio 1:2
      expect(legs.percentage / chest.percentage).toBeCloseTo(2, 1);
    });

    it('splits score equally across multiple primary muscle groups', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major', 'Pectoralis Minor'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result.muscleGroups).toHaveLength(2);
      expect(result.muscleGroups[0].percentage).toBe(50);
      expect(result.muscleGroups[1].percentage).toBe(50);
    });

    it('weights secondary muscle groups at 0.5x primary', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: ['Triceps'],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      const chest = result.muscleGroups.find((mg) => mg.muscleGroup === 'Pectoralis Major');
      const triceps = result.muscleGroups.find((mg) => mg.muscleGroup === 'Triceps');
      if (!chest || !triceps) throw new Error('Expected both muscle groups to be present');
      // primary 1.0, secondary 0.5 → ratio 2:1
      expect(chest.percentage / triceps.percentage).toBeCloseTo(2, 1);
    });

    it('weights tertiary muscle groups at 0.2x primary', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: ['Front Deltoids'],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      const chest = result.muscleGroups.find((mg) => mg.muscleGroup === 'Pectoralis Major');
      const delts = result.muscleGroups.find((mg) => mg.muscleGroup === 'Front Deltoids');
      if (!chest || !delts) throw new Error('Expected both muscle groups to be present');
      // primary 1.0, tertiary 0.2 → ratio 5:1
      expect(chest.percentage / delts.percentage).toBeCloseTo(5, 1);
    });

    it('treats secondary groups as primary when exercise has no primary groups', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: ['Biceps'],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 20, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result.muscleGroups).toHaveLength(1);
      expect(result.muscleGroups[0].muscleGroup).toBe('Biceps');
      expect(result.muscleGroups[0].percentage).toBe(100);
    });

    it('skips exercises with no muscle groups', () => {
      const exerciseNoMuscles: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: [],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const exerciseWithMuscles: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'b', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exerciseNoMuscles, exerciseWithMuscles]);
      expect(result.muscleGroups).toHaveLength(1);
      expect(result.muscleGroups[0].muscleGroup).toBe('Quadriceps');
    });

    it('aggregates the same muscle group across multiple exercises', () => {
      const exercise1: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const exercise2: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Leg Press',
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'b', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise1, exercise2]);
      expect(result.muscleGroups).toHaveLength(1);
      expect(result.muscleGroups[0].muscleGroup).toBe('Quadriceps');
      expect(result.muscleGroups[0].percentage).toBe(100);
    });

    it('rolls up muscle group percentages into body areas', () => {
      const exercise1: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const exercise2: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Squat',
        recordSetsType: 'WEIGHT' as const,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'b', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise1, exercise2]);
      const chestArea = result.bodyAreas.find((a) => a.bodyArea === 'Chest');
      const legsArea = result.bodyAreas.find((a) => a.bodyArea === 'Legs');
      expect(chestArea?.percentage).toBe(50);
      expect(legsArea?.percentage).toBe(50);
    });

    it('sorts muscle groups and body areas by percentage descending', () => {
      const exercise1: LocalWorkoutExercise = {
        ...baseExercise,
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 60, reps: 10 }],
      };
      const exercise2: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Squat',
        recordSetsType: 'WEIGHT' as const,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [
          { id: 'b', setType: 'Standard', completed: true, weightKg: 60, reps: 10 },
          { id: 'c', setType: 'Standard', completed: true, weightKg: 60, reps: 10 },
        ],
      };
      const result = calculateMuscleGroupBreakdown([exercise1, exercise2]);
      expect(result.muscleGroups[0].muscleGroup).toBe('Quadriceps');
      expect(result.bodyAreas[0].bodyArea).toBe('Legs');
    });

    it('normalises isometric time: 45s = 1 effective set', () => {
      const isometricExercise: LocalWorkoutExercise = {
        ...baseExercise,
        recordSetsType: 'TIME' as const,
        isIsometric: true,
        primaryMuscleGroups: ['Abdominals'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, timeSeconds: 90 }],
      };
      const regularExercise: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Crunch',
        recordSetsType: 'REPS' as const,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'b', setType: 'Standard', completed: true, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([isometricExercise, regularExercise]);
      const abs = result.muscleGroups.find((mg) => mg.muscleGroup === 'Abdominals');
      const quads = result.muscleGroups.find((mg) => mg.muscleGroup === 'Quadriceps');
      if (!abs || !quads) throw new Error('Expected both muscle groups');
      // isometric: 90s / 45 = 2 effective sets; regular: 1 set → ratio 2:1
      expect(abs.percentage / quads.percentage).toBeCloseTo(2, 1);
    });

    it('doubles set count for unilateral exercises', () => {
      const unilateralExercise: LocalWorkoutExercise = {
        ...baseExercise,
        isUnilateral: true,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, weightKg: 20, reps: 10 }],
      };
      const bilateralExercise: LocalWorkoutExercise = {
        ...baseExercise,
        id: 2,
        label: 'Leg Press',
        primaryMuscleGroups: ['Glutes'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'b', setType: 'Standard', completed: true, weightKg: 20, reps: 10 }],
      };
      const result = calculateMuscleGroupBreakdown([unilateralExercise, bilateralExercise]);
      const quads = result.muscleGroups.find((mg) => mg.muscleGroup === 'Quadriceps');
      const glutes = result.muscleGroups.find((mg) => mg.muscleGroup === 'Glutes');
      if (!quads || !glutes) throw new Error('Expected both muscle groups');
      // unilateral: 2 effective sets; bilateral: 1 set → ratio 2:1
      expect(quads.percentage / glutes.percentage).toBeCloseTo(2, 1);
    });

    it('calculates correct score for REPS type exercises', () => {
      const exercise: LocalWorkoutExercise = {
        ...baseExercise,
        recordSetsType: 'REPS' as const,
        primaryMuscleGroups: ['Abdominals'],
        secondaryMuscleGroups: [],
        tertiaryMuscleGroups: [],
        sets: [{ id: 'a', setType: 'Standard', completed: true, reps: 20 }],
      };
      const result = calculateMuscleGroupBreakdown([exercise]);
      expect(result.muscleGroups[0].percentage).toBe(100);
      expect(result.muscleGroups[0].bodyArea).toBe('Core');
    });
  });
});
