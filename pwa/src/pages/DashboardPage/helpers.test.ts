import type { RoutineDetail, RoutineSummary, UserWorkoutSummary } from 'gym-pwa-api/types';
import { describe, expect, it, vi } from 'vitest';
import type { LocalWorkout } from '../../lib/db';
import {
  consumeDashboardPrefetch,
  createRoutine,
  fetchRecentWorkouts,
  fetchRoutines,
  handleNewWorkout,
  loadDashboardData,
  prefetchDashboardData,
  sortRoutinesByLastUsed,
  startWorkoutForRoutine,
} from './helpers';

vi.mock('../../lib/api/client', () => ({
  authFetchJson: vi.fn(),
  authFetch: vi.fn(),
}));

import { authFetchJson } from '../../lib/api/client';

const mockAuthFetchJson = vi.mocked(authFetchJson);

describe('createRoutine', () => {
  it('should POST to /routines and return the new routine id', async () => {
    mockAuthFetchJson.mockResolvedValue({ id: 42 });

    const result = await createRoutine();

    expect(mockAuthFetchJson).toHaveBeenCalledWith('/routines', { method: 'POST' });
    expect(result).toBe(42);
  });
});

describe('fetchRoutines', () => {
  it('should return all routines from the API', async () => {
    const fiveRoutines: RoutineSummary[] = [
      { id: 1, label: 'Routine A', userId: null, exerciseCount: 3 },
      { id: 2, label: 'Routine B', userId: null, exerciseCount: 4 },
      { id: 3, label: 'Routine C', userId: null, exerciseCount: 2 },
      { id: 4, label: 'Routine D', userId: null, exerciseCount: 5 },
      { id: 5, label: 'Routine E', userId: null, exerciseCount: 1 },
    ];
    mockAuthFetchJson.mockResolvedValue(fiveRoutines);

    const result = await fetchRoutines();

    expect(result).toHaveLength(5);
    expect(result[0].label).toBe('Routine A');
    expect(result[4].label).toBe('Routine E');
  });
});

describe('fetchRecentWorkouts', () => {
  const mockWorkout: UserWorkoutSummary = {
    id: 1,
    userId: 1,
    routineId: 1,
    routineLabel: 'Strength',
    startedAt: '2024-01-15T10:00:00Z',
    finishedAt: '2024-01-15T11:00:00Z',
    durationSeconds: 3600,
    exerciseCount: 0,
    bodyWeightKg: 80,
    totalWeightKg: 2500,
  };

  it('should return all workouts from the API', async () => {
    const fiveWorkouts: UserWorkoutSummary[] = [1, 2, 3, 4, 5].map((n) => ({
      ...mockWorkout,
      id: n,
    }));
    mockAuthFetchJson.mockResolvedValue(fiveWorkouts);

    const result = await fetchRecentWorkouts(1);

    expect(result).toHaveLength(5);
    expect(result[0].id).toBe(1);
    expect(result[4].id).toBe(5);
  });

  it('should return empty array when no workouts', async () => {
    mockAuthFetchJson.mockResolvedValue([]);

    const result = await fetchRecentWorkouts(1);

    expect(result).toHaveLength(0);
  });

  it('should append since query param when provided', async () => {
    mockAuthFetchJson.mockResolvedValue([]);
    const since = new Date('2024-01-01T00:00:00.000Z');

    await fetchRecentWorkouts(1, since);

    expect(mockAuthFetchJson).toHaveBeenCalledWith(
      `/users/1/workouts?since=${since.toISOString()}`
    );
  });

  it('should omit since query param when not provided', async () => {
    mockAuthFetchJson.mockResolvedValue([]);

    await fetchRecentWorkouts(1);

    expect(mockAuthFetchJson).toHaveBeenCalledWith('/users/1/workouts');
  });
});

describe('startWorkoutForRoutine', () => {
  const mockRoutine: RoutineDetail = {
    id: 1,
    label: 'Upper Body',
    userId: 1,
    exercises: [
      {
        id: 10,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: ['Triceps'],
      },
    ],
  };

  it('should fetch routine and return create-new-workout action when no active workout exists', async () => {
    mockAuthFetchJson
      .mockResolvedValueOnce(mockRoutine)
      .mockResolvedValueOnce({ id: 1, name: 'Test', latestBodyWeight: { weightKg: 80 } });

    const getActiveWorkout = vi.fn().mockResolvedValue(undefined);

    const result = await startWorkoutForRoutine(1, 1, getActiveWorkout);

    expect(mockAuthFetchJson).toHaveBeenCalledWith('/routines/1');
    expect(result.type).toBe('create-new-workout');
  });

  it('should return navigate-to-existing action when active workout exists', async () => {
    mockAuthFetchJson.mockResolvedValueOnce(mockRoutine);

    const getActiveWorkout = vi.fn().mockResolvedValue({
      id: 'existing-id',
      userId: 1,
      routineId: 2,
      routineLabel: 'Other',
      startedAt: '2024-01-01T00:00:00Z',
      bodyWeightKg: 75,
      exerciseCount: 0,
    });

    const result = await startWorkoutForRoutine(1, 1, getActiveWorkout);

    expect(result.type).toBe('navigate-to-existing');
    if (result.type === 'navigate-to-existing') {
      expect(result.workoutId).toBe('existing-id');
    }
  });
});

describe('sortRoutinesByLastUsed', () => {
  const makeRoutine = (id: number, label: string): RoutineSummary => ({
    id,
    label,
    userId: null,
    exerciseCount: 3,
  });

  const makeWorkout = (routineId: number, startedAt: string): UserWorkoutSummary => ({
    id: routineId,
    userId: 1,
    routineId,
    routineLabel: `Routine ${routineId}`,
    startedAt,
    finishedAt: startedAt,
    durationSeconds: 3600,
    exerciseCount: 0,
    bodyWeightKg: 80,
    totalWeightKg: 0,
  });

  it('should sort routines by most recently used when all have workouts', () => {
    const routines = [makeRoutine(1, 'A'), makeRoutine(2, 'B'), makeRoutine(3, 'C')];
    const workouts = [
      makeWorkout(2, '2024-01-15T10:00:00Z'),
      makeWorkout(3, '2024-01-14T10:00:00Z'),
      makeWorkout(1, '2024-01-13T10:00:00Z'),
    ];

    const result = sortRoutinesByLastUsed(routines, workouts);

    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(1);
  });

  it('should place used routines before unused routines', () => {
    const routines = [makeRoutine(1, 'A'), makeRoutine(2, 'B'), makeRoutine(3, 'C')];
    const workouts = [makeWorkout(3, '2024-01-10T10:00:00Z')];

    const result = sortRoutinesByLastUsed(routines, workouts);

    expect(result[0].id).toBe(3);
    expect(result[1].id).toBe(1);
    expect(result[2].id).toBe(2);
  });

  it('should preserve API order for unused routines', () => {
    const routines = [makeRoutine(1, 'A'), makeRoutine(2, 'B'), makeRoutine(3, 'C')];

    const result = sortRoutinesByLastUsed(routines, []);

    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
  });

  it('should use the most recent workout date per routine when used multiple times', () => {
    const routines = [makeRoutine(1, 'A'), makeRoutine(2, 'B')];
    const workouts = [
      makeWorkout(1, '2024-01-10T10:00:00Z'),
      makeWorkout(2, '2024-01-15T10:00:00Z'),
      makeWorkout(1, '2024-01-05T10:00:00Z'),
    ];

    const result = sortRoutinesByLastUsed(routines, workouts);

    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });
});

describe('loadDashboardData', () => {
  const mockRoutines: RoutineSummary[] = [
    { id: 1, label: 'Upper Body', userId: null, exerciseCount: 3 },
  ];

  const mockWorkout: UserWorkoutSummary = {
    id: 1,
    userId: 1,
    routineId: 1,
    routineLabel: 'Strength',
    startedAt: '2024-01-15T10:00:00Z',
    finishedAt: '2024-01-15T11:00:00Z',
    durationSeconds: 3600,
    exerciseCount: 0,
    bodyWeightKg: 80,
    totalWeightKg: 2500,
  };

  it('should return routines and session history on success', async () => {
    mockAuthFetchJson.mockResolvedValueOnce(mockRoutines).mockResolvedValueOnce([mockWorkout]);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.sessionHistory).toEqual([mockWorkout]);
    expect(result.routinesError).toBeNull();
    expect(result.workoutError).toBeNull();
  });

  it('should return routinesError when routines fetch fails', async () => {
    mockAuthFetchJson
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([mockWorkout]);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual([]);
    expect(result.routinesError).toBe('Network error');
    expect(result.sessionHistory).toEqual([mockWorkout]);
    expect(result.workoutError).toBeNull();
  });

  it('should return workoutError when workouts fetch fails', async () => {
    mockAuthFetchJson
      .mockResolvedValueOnce(mockRoutines)
      .mockRejectedValueOnce(new Error('HTTP error: 500'));

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.routinesError).toBeNull();
    expect(result.sessionHistory).toEqual([]);
    expect(result.workoutError).toBe('HTTP error: 500');
  });

  it('should return empty session history with no error when userId is null', async () => {
    mockAuthFetchJson.mockResolvedValueOnce(mockRoutines);

    const result = await loadDashboardData(null);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.sessionHistory).toEqual([]);
    expect(result.workoutError).toBeNull();
  });

  it('should sort routines by most recently used and return up to 2', async () => {
    const routines: RoutineSummary[] = [
      { id: 1, label: 'Routine A', userId: null, exerciseCount: 3 },
      { id: 2, label: 'Routine B', userId: null, exerciseCount: 4 },
      { id: 3, label: 'Routine C', userId: null, exerciseCount: 2 },
    ];
    const workouts: UserWorkoutSummary[] = [
      { ...mockWorkout, id: 1, routineId: 3, startedAt: '2024-01-15T10:00:00Z' },
      { ...mockWorkout, id: 2, routineId: 2, startedAt: '2024-01-14T10:00:00Z' },
    ];
    mockAuthFetchJson.mockResolvedValueOnce(routines).mockResolvedValueOnce(workouts);

    const result = await loadDashboardData(1);

    expect(result.routines).toHaveLength(2);
    expect(result.routines[0].id).toBe(3);
    expect(result.routines[1].id).toBe(2);
  });

  it('should return all workouts in session history without slicing', async () => {
    const workouts: UserWorkoutSummary[] = [1, 2, 3, 4].map((n) => ({ ...mockWorkout, id: n }));
    mockAuthFetchJson.mockResolvedValueOnce([mockWorkout]).mockResolvedValueOnce(workouts);

    const result = await loadDashboardData(1);

    expect(result.sessionHistory).toHaveLength(4);
  });

  it('should return both errors when both fetches fail', async () => {
    mockAuthFetchJson
      .mockRejectedValueOnce(new Error('Routines error'))
      .mockRejectedValueOnce(new Error('HTTP error: 500'));

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual([]);
    expect(result.routinesError).toBe('Routines error');
    expect(result.sessionHistory).toEqual([]);
    expect(result.workoutError).toBe('HTTP error: 500');
  });
});

describe('handleNewWorkout', () => {
  const mockRoutine: RoutineDetail = {
    id: 1,
    label: 'Upper Body',
    userId: 1,
    exercises: [
      {
        id: 10,
        label: 'Bench Press',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Pectoralis Major'],
        secondaryMuscleGroups: ['Triceps'],
      },
    ],
  };

  it('should return error when userId is null', async () => {
    const result = await handleNewWorkout(null, 1, vi.fn(), vi.fn());

    expect(result).toEqual({ type: 'error', error: 'User not authenticated' });
  });

  it('should return navigate path when active workout exists', async () => {
    mockAuthFetchJson.mockResolvedValueOnce(mockRoutine);

    const getActiveWorkout = vi.fn().mockResolvedValue({
      id: 'existing-id',
      userId: 1,
      routineId: 2,
      routineLabel: 'Other',
      startedAt: '2024-01-01T00:00:00Z',
      bodyWeightKg: 75,
      exerciseCount: 0,
    });

    const result = await handleNewWorkout(1, 1, getActiveWorkout, vi.fn());

    expect(result).toEqual({ type: 'navigate', path: '/sessions/existing-id' });
  });

  it('should call createWorkout and return navigate path for new workout', async () => {
    mockAuthFetchJson
      .mockResolvedValueOnce(mockRoutine)
      .mockResolvedValueOnce({ id: 1, name: 'Test', latestBodyWeight: { weightKg: 80 } });

    const getActiveWorkout = vi.fn().mockResolvedValue(undefined);
    const createWorkout = vi.fn().mockResolvedValue(undefined);

    const result = await handleNewWorkout(1, 1, getActiveWorkout, createWorkout);

    expect(createWorkout).toHaveBeenCalledTimes(1);
    const createdWorkout = createWorkout.mock.calls[0][0] as LocalWorkout;
    expect(createdWorkout.routineId).toBe(1);
    expect(createdWorkout.routineLabel).toBe('Upper Body');
    expect(result.type).toBe('navigate');
    if (result.type === 'navigate') {
      expect(result.path).toBe(`/sessions/${createdWorkout.id}`);
    }
  });

  it('should return error when startWorkoutForRoutine throws', async () => {
    mockAuthFetchJson.mockRejectedValueOnce(new Error('Fetch failed'));

    const result = await handleNewWorkout(1, 1, vi.fn(), vi.fn());

    expect(result).toEqual({ type: 'error', error: 'Fetch failed' });
  });
});

describe('prefetchDashboardData / consumeDashboardPrefetch', () => {
  it('consumeDashboardPrefetch returns null when no prefetch has been started', () => {
    expect(consumeDashboardPrefetch()).toBeNull();
  });

  it('prefetchDashboardData starts a fetch and consumeDashboardPrefetch returns its promise', async () => {
    mockAuthFetchJson.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    prefetchDashboardData(1);
    const promise = consumeDashboardPrefetch();

    expect(promise).toBeInstanceOf(Promise);
    if (!promise) throw new Error('Expected promise to be set');
    const data = await promise;
    expect(data).toBeDefined();
    expect(data.routines).toEqual([]);
  });

  it('consumeDashboardPrefetch clears the stored promise so subsequent calls return null', () => {
    mockAuthFetchJson.mockResolvedValue([]);

    prefetchDashboardData(1);
    consumeDashboardPrefetch();

    expect(consumeDashboardPrefetch()).toBeNull();
  });

  it('calling prefetchDashboardData twice does not start a second fetch', async () => {
    mockAuthFetchJson.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    prefetchDashboardData(1);
    prefetchDashboardData(1);

    await consumeDashboardPrefetch();

    // loadDashboardData makes 2 API calls (routines + workouts); a second prefetch would make 4
    expect(mockAuthFetchJson).toHaveBeenCalledTimes(2);
  });

  it('after consuming, prefetchDashboardData can start a new fetch', async () => {
    mockAuthFetchJson.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    prefetchDashboardData(1);
    consumeDashboardPrefetch();

    mockAuthFetchJson.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    prefetchDashboardData(1);
    const promise = consumeDashboardPrefetch();

    expect(promise).toBeInstanceOf(Promise);
  });
});
