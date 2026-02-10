import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LocalWorkout, LocalWorkoutExercise } from '../../lib/db';
import { server } from '../../test/msw';
import {
  createWorkoutPayload,
  formatStartTime,
  getCompletedExercises,
  saveWorkout,
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

      // Should be in format like "2:30 PM" or "14:30"
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('handles different time zones correctly', () => {
      const isoString = '2025-01-15T09:15:00.000Z';
      const result = formatStartTime(isoString);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('getCompletedExercises', () => {
    it('filters only completed exercises', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Quadriceps'],
          secondaryMuscleGroups: ['Glutes'],
          completed: false,
        },
        {
          id: 3,
          label: 'Deadlift',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Lower Back'],
          secondaryMuscleGroups: ['Hamstrings'],
          completed: true,
        },
      ];

      const result = getCompletedExercises(exercises);

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('Bench Press');
      expect(result[1].label).toBe('Deadlift');
    });

    it('removes the completed property from exercises', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: true,
        },
      ];

      const result = getCompletedExercises(exercises);

      expect(result[0]).not.toHaveProperty('completed');
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('label');
    });

    it('returns empty array when no exercises are completed', () => {
      const exercises: LocalWorkoutExercise[] = [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: false,
        },
      ];

      const result = getCompletedExercises(exercises);

      expect(result).toHaveLength(0);
    });
  });

  describe('createWorkoutPayload', () => {
    it('creates correct workout payload', () => {
      const workout: LocalWorkout = {
        id: 'workout-123',
        userId: 456,
        routineId: 1,
        routineLabel: 'Strength Training',
        startedAt: '2025-01-15T14:00:00.000Z',
        bodyWeight: 75.5,
        exercisesCompleted: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            primaryMuscleGroups: ['Pectoralis Major'],
            secondaryMuscleGroups: ['Triceps'],
            completed: true,
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

      const finishedAt = '2025-01-15T15:30:00.000Z';
      const result = createWorkoutPayload(workout, finishedAt);

      expect(result).toEqual({
        routineId: 1,
        routineLabel: 'Strength Training',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:30:00.000Z',
        bodyWeight: 75.5,
        exercisesCompleted: [
          {
            id: 1,
            label: 'Bench Press',
            recordSetsType: 'WEIGHT',
            primaryMuscleGroups: ['Pectoralis Major'],
            secondaryMuscleGroups: ['Triceps'],
          },
        ],
      });
    });

    it('includes all required fields', () => {
      const workout: LocalWorkout = {
        id: 'workout-123',
        userId: 456,
        routineId: 2,
        routineLabel: 'Cardio',
        startedAt: '2025-01-15T10:00:00.000Z',
        bodyWeight: 80.0,
        exercisesCompleted: [],
      };

      const finishedAt = '2025-01-15T11:00:00.000Z';
      const result = createWorkoutPayload(workout, finishedAt);

      expect(result.routineId).toBe(2);
      expect(result.routineLabel).toBe('Cardio');
      expect(result.startedAt).toBe('2025-01-15T10:00:00.000Z');
      expect(result.finishedAt).toBe('2025-01-15T11:00:00.000Z');
      expect(result.bodyWeight).toBe(80.0);
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
          expect(body).toHaveProperty('bodyWeight');
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await saveWorkout(123, {
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: '2025-01-15T14:00:00.000Z',
        finishedAt: '2025-01-15T15:00:00.000Z',
        exercisesCompleted: [],
        bodyWeight: 75.5,
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
          bodyWeight: 75.5,
        })
      ).rejects.toThrow();
    });
  });
});
