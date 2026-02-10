import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import type { CreateWorkoutRequest } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import WorkoutPage from './WorkoutPage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

const mockRouterPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    params: { workoutId: 'test-workout-id' },
  }),
}));

describe('WorkoutPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(async () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('user_id', '123');
    mockRouterPush.mockClear();

    // Clear IndexedDB
    await db.workouts.clear();
  });

  afterEach(async () => {
    await db.workouts.clear();
  });

  it('should display loading state initially', () => {
    render(WorkoutPage);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display workout with exercises', async () => {
    await db.workouts.add({
      id: 'test-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeight: 75.5,
      exercisesCompleted: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
          completed: false,
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Quadriceps'],
          secondaryMuscleGroups: ['Glutes'],
          completed: true,
        },
      ],
    });

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Test Routine')).toBeInTheDocument();
    });

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
  });

  it('should display error when workout not found', async () => {
    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Error: Workout not found')).toBeInTheDocument();
    });
  });

  it('should save workout with body weight when finished', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'test-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
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
      ],
    });

    let savedWorkout: CreateWorkoutRequest | null = null;

    server.use(
      http.post(`${mockApiUrl}/users/123/workouts`, async ({ request }) => {
        savedWorkout = (await request.json()) as CreateWorkoutRequest;
        return HttpResponse.json({
          id: 1,
          userId: 123,
          ...savedWorkout,
        });
      })
    );

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Finish'));

    await waitFor(() => {
      if (savedWorkout === null) {
        throw new Error('savedWorkout should not be null');
      }
      expect(savedWorkout.bodyWeight).toBe(75.5);
      expect(savedWorkout.routineId).toBe(1);
      expect(savedWorkout.routineLabel).toBe('Test Routine');
      expect(savedWorkout.exercisesCompleted).toHaveLength(1);
      expect(savedWorkout.exercisesCompleted[0].label).toBe('Bench Press');
    });
  });

  it('should only include completed exercises when finishing', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'test-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeight: 80.0,
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
        {
          id: 3,
          label: 'Deadlift',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Lower Back'],
          secondaryMuscleGroups: ['Hamstrings'],
          completed: true,
        },
      ],
    });

    let savedWorkout: CreateWorkoutRequest | null = null;

    server.use(
      http.post(`${mockApiUrl}/users/123/workouts`, async ({ request }) => {
        savedWorkout = (await request.json()) as CreateWorkoutRequest;
        return HttpResponse.json({
          id: 1,
          userId: 123,
          ...savedWorkout,
        });
      })
    );

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Finish'));

    await waitFor(() => {
      if (savedWorkout === null) {
        throw new Error('savedWorkout should not be null');
      }
      expect(savedWorkout.exercisesCompleted).toHaveLength(2);
      expect(savedWorkout.exercisesCompleted[0].label).toBe('Bench Press');
      expect(savedWorkout.exercisesCompleted[1].label).toBe('Deadlift');
      expect(savedWorkout.exercisesCompleted[0]).not.toHaveProperty('completed');
    });
  });

  it('should remove workout from IndexedDB after successful save', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'test-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
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
      ],
    });

    server.use(
      http.post(`${mockApiUrl}/users/123/workouts`, () => {
        return HttpResponse.json({
          id: 1,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Routine',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          exercisesCompleted: [],
        });
      })
    );

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    const workoutBefore = await db.workouts.get('test-workout-id');
    expect(workoutBefore).toBeDefined();

    await user.click(screen.getByText('Finish'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/workouts');
    });

    const workoutAfter = await db.workouts.get('test-workout-id');
    expect(workoutAfter).toBeUndefined();
  });

  it('should display error when save fails', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'test-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
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
      ],
    });

    server.use(
      http.post(`${mockApiUrl}/users/123/workouts`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(WorkoutPage);

    await waitFor(() => {
      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Finish'));

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    // Workout should still be in IndexedDB
    const workout = await db.workouts.get('test-workout-id');
    expect(workout).toBeDefined();
  });
});
