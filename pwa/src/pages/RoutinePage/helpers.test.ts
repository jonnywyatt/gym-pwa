import type { RoutineDetail } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LocalWorkout } from '../../lib/db';
import { server } from '../../test/msw';
import {
  copyRoutine,
  createWorkoutFromRoutine,
  deleteRoutine,
  fetchRoutine,
  fetchUserBodyWeight,
  mapExercisesToWorkoutExercises,
  prepareWorkoutStart,
} from './helpers';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

describe('RoutinePage helpers', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  describe('fetchUserBodyWeight', () => {
    it('returns body weight when user has one', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/1`, () => {
          return HttpResponse.json({
            id: 1,
            name: 'Test User',
            latestBodyWeight: { weightKg: 75.5 },
          });
        })
      );

      const weight = await fetchUserBodyWeight(1);
      expect(weight).toBe(75.5);
    });

    it('throws MISSING_BODY_WEIGHT error when user has no body weight', async () => {
      server.use(
        http.get(`${mockApiUrl}/users/1`, () => {
          return HttpResponse.json({
            id: 1,
            name: 'Test User',
            latestBodyWeight: null,
          });
        })
      );

      await expect(fetchUserBodyWeight(1)).rejects.toThrow('MISSING_BODY_WEIGHT');
    });
  });

  describe('deleteRoutine', () => {
    it('sends DELETE request to the correct endpoint', async () => {
      let deleteCalled = false;
      server.use(
        http.delete(`${mockApiUrl}/routines/1`, () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        })
      );

      await deleteRoutine('1');
      expect(deleteCalled).toBe(true);
    });

    it('throws an error when the DELETE request fails', async () => {
      server.use(
        http.delete(`${mockApiUrl}/routines/1`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(deleteRoutine('1')).rejects.toThrow('Failed to delete routine: 500');
    });
  });

  describe('copyRoutine', () => {
    it('sends POST request to the copy endpoint and returns the new routine id', async () => {
      server.use(
        http.post(`${mockApiUrl}/routines/1/copy`, () => {
          return HttpResponse.json({ id: 42 }, { status: 201 });
        })
      );

      const newId = await copyRoutine('1');
      expect(newId).toBe(42);
    });

    it('throws an error when the copy request fails', async () => {
      server.use(
        http.post(`${mockApiUrl}/routines/1/copy`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(copyRoutine('1')).rejects.toThrow('Failed to copy routine: 500');
    });
  });

  describe('fetchRoutine', () => {
    it('fetches routine by id', async () => {
      const mockRoutine = {
        id: 1,
        label: 'Test Routine',
        exercises: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            isIsometric: false,
            isUnilateral: false,
            primaryMuscleGroups: ['Pectoralis Major'],
            secondaryMuscleGroups: ['Triceps'],
            tertiaryMuscleGroups: [],
          },
        ],
      };

      server.use(
        http.get(`${mockApiUrl}/routines/1`, () => {
          return HttpResponse.json(mockRoutine);
        })
      );

      const routine = await fetchRoutine('1');
      expect(routine).toEqual(mockRoutine);
    });
  });

  describe('mapExercisesToWorkoutExercises', () => {
    it('maps exercises to workout exercises format', () => {
      const routine: RoutineDetail = {
        id: 1,
        label: 'Test Routine',
        userId: 1,
        exercises: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            isIsometric: false,
            isUnilateral: false,
            primaryMuscleGroups: ['Pectoralis Major', 'Triceps'],
            secondaryMuscleGroups: ['Front Deltoids'],
            tertiaryMuscleGroups: [],
          },
          {
            id: 2,
            label: 'Squats',
            recordSetsType: 'WEIGHT',
            isIsometric: false,
            isUnilateral: false,
            primaryMuscleGroups: ['Quadriceps'],
            secondaryMuscleGroups: ['Glutes'],
            tertiaryMuscleGroups: [],
          },
        ],
      };

      const result = mapExercisesToWorkoutExercises(routine);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        isIsometric: false,
        isUnilateral: false,
        primaryMuscleGroups: ['Pectoralis Major', 'Triceps'],
        secondaryMuscleGroups: ['Front Deltoids'],
        tertiaryMuscleGroups: [],
        completed: false,
      });
      expect(result[1]).toEqual({
        id: 2,
        label: 'Squats',
        recordSetsType: 'WEIGHT',
        isIsometric: false,
        isUnilateral: false,
        primaryMuscleGroups: ['Quadriceps'],
        secondaryMuscleGroups: ['Glutes'],
        tertiaryMuscleGroups: [],
        completed: false,
      });
    });

    it('creates new arrays for muscle groups (not references)', () => {
      const routine: RoutineDetail = {
        id: 1,
        label: 'Test Routine',
        userId: 1,
        exercises: [
          {
            id: 1,
            label: 'Test Exercise',
            recordSetsType: 'WEIGHT',
            isIsometric: false,
            isUnilateral: false,
            primaryMuscleGroups: ['Muscle 1'],
            secondaryMuscleGroups: ['Muscle 2'],
            tertiaryMuscleGroups: [],
          },
        ],
      };

      const result = mapExercisesToWorkoutExercises(routine);

      // Modify the result arrays
      result[0].primaryMuscleGroups.push('New Muscle');
      result[0].secondaryMuscleGroups.push('Another Muscle');

      // Original should be unchanged
      expect(routine.exercises[0].primaryMuscleGroups).toEqual(['Muscle 1']);
      expect(routine.exercises[0].secondaryMuscleGroups).toEqual(['Muscle 2']);
    });
  });

  describe('createWorkoutFromRoutine', () => {
    it('creates a workout object with all required fields', () => {
      const routine: RoutineDetail = {
        id: 1,
        label: 'Test Routine',
        userId: 1,
        exercises: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            isIsometric: false,
            isUnilateral: false,
            primaryMuscleGroups: ['Pectoralis Major'],
            secondaryMuscleGroups: ['Triceps'],
            tertiaryMuscleGroups: [],
          },
        ],
      };

      const workout = createWorkoutFromRoutine(123, 1, routine, 75.5);

      expect(workout.userId).toBe(123);
      expect(workout.routineId).toBe(1);
      expect(workout.routineLabel).toBe('Test Routine');
      expect(workout.bodyWeightKg).toBe(75.5);
      expect(workout.id).toBeTruthy(); // UUID
      expect(workout.startedAt).toBeTruthy(); // ISO date string
      expect(workout.exercisesCompleted).toHaveLength(1);
      expect(workout.exercisesCompleted[0].label).toBe('Bench Press');
      expect(workout.exercisesCompleted[0].completed).toBe(false);
    });

    it('generates a unique id for each workout', () => {
      const routine: RoutineDetail = {
        id: 1,
        label: 'Test Routine',
        userId: 1,
        exercises: [],
      };

      const workout1 = createWorkoutFromRoutine(123, 1, routine, 75.5);
      const workout2 = createWorkoutFromRoutine(123, 1, routine, 75.5);

      expect(workout1.id).not.toBe(workout2.id);
    });
  });

  describe('prepareWorkoutStart', () => {
    const mockRoutine: RoutineDetail = {
      id: 1,
      label: 'Test Routine',
      userId: 1,
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          isIsometric: false,
          isUnilateral: false,
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          tertiaryMuscleGroups: [],
        },
      ],
    };

    it('returns navigate-to-existing when active workout exists', async () => {
      const mockGetActiveWorkout = vi.fn().mockResolvedValue({
        id: 'existing-workout-id',
        userId: 123,
      } as LocalWorkout);

      server.use(
        http.get(`${mockApiUrl}/users/123`, () => {
          return HttpResponse.json({
            id: 123,
            name: 'Test User',
            latestBodyWeight: { weightKg: 75.5 },
          });
        })
      );

      const result = await prepareWorkoutStart(123, 1, mockRoutine, mockGetActiveWorkout);

      expect(result).toEqual({
        type: 'navigate-to-existing',
        workoutId: 'existing-workout-id',
      });
      expect(mockGetActiveWorkout).toHaveBeenCalledWith(123);
    });

    it('returns navigate-to-user-page when body weight is missing', async () => {
      const mockGetActiveWorkout = vi.fn().mockResolvedValue(undefined);

      server.use(
        http.get(`${mockApiUrl}/users/123`, () => {
          return HttpResponse.json({
            id: 123,
            name: 'Test User',
            latestBodyWeight: null,
          });
        })
      );

      const result = await prepareWorkoutStart(123, 1, mockRoutine, mockGetActiveWorkout);

      expect(result).toEqual({
        type: 'navigate-to-user-page',
        userId: 123,
        error: 'Please set your body weight first',
      });
    });

    it('returns create-new-workout when everything is valid', async () => {
      const mockGetActiveWorkout = vi.fn().mockResolvedValue(undefined);

      server.use(
        http.get(`${mockApiUrl}/users/123`, () => {
          return HttpResponse.json({
            id: 123,
            name: 'Test User',
            latestBodyWeight: { weightKg: 75.5 },
          });
        })
      );

      const result = await prepareWorkoutStart(123, 1, mockRoutine, mockGetActiveWorkout);

      expect(result.type).toBe('create-new-workout');
      if (result.type === 'create-new-workout') {
        expect(result.workout.userId).toBe(123);
        expect(result.workout.routineId).toBe(1);
        expect(result.workout.routineLabel).toBe('Test Routine');
        expect(result.workout.bodyWeightKg).toBe(75.5);
        expect(result.workout.exercisesCompleted).toHaveLength(1);
      }
    });

    it('returns error when fetching body weight fails', async () => {
      const mockGetActiveWorkout = vi.fn().mockResolvedValue(undefined);

      server.use(
        http.get(`${mockApiUrl}/users/123`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const result = await prepareWorkoutStart(123, 1, mockRoutine, mockGetActiveWorkout);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error).toContain('HTTP error');
      }
    });
  });
});
