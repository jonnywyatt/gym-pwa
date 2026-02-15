import type { RoutineDetail, RoutineSummary, UserWorkout } from 'gym-pwa-api/types';
import { describe, expect, it, vi } from 'vitest';
import type { LocalWorkout } from '../../lib/db';
import {
  fetchLatestWorkout,
  fetchRoutines,
  handleNewWorkout,
  loadDashboardData,
  startWorkoutForRoutine,
} from './helpers';

vi.mock('../../lib/api/client', () => ({
  authFetchJson: vi.fn(),
  authFetch: vi.fn(),
}));

import { authFetch, authFetchJson } from '../../lib/api/client';

const mockAuthFetchJson = vi.mocked(authFetchJson);
const mockAuthFetch = vi.mocked(authFetch);

describe('fetchRoutines', () => {
  it('should return at most 3 routines', async () => {
    const fiveRoutines: RoutineSummary[] = [
      { id: 1, label: 'Routine A', exerciseCount: 3 },
      { id: 2, label: 'Routine B', exerciseCount: 4 },
      { id: 3, label: 'Routine C', exerciseCount: 2 },
      { id: 4, label: 'Routine D', exerciseCount: 5 },
      { id: 5, label: 'Routine E', exerciseCount: 1 },
    ];
    mockAuthFetchJson.mockResolvedValue(fiveRoutines);

    const result = await fetchRoutines();

    expect(result).toHaveLength(3);
    expect(result[0].label).toBe('Routine A');
    expect(result[2].label).toBe('Routine C');
  });

  it('should return all routines when fewer than 3', async () => {
    const twoRoutines: RoutineSummary[] = [
      { id: 1, label: 'Routine A', exerciseCount: 3 },
      { id: 2, label: 'Routine B', exerciseCount: 4 },
    ];
    mockAuthFetchJson.mockResolvedValue(twoRoutines);

    const result = await fetchRoutines();

    expect(result).toHaveLength(2);
  });
});

describe('fetchLatestWorkout', () => {
  const mockWorkout: UserWorkout = {
    id: 1,
    userId: 1,
    routineId: 1,
    routineLabel: 'Strength',
    startedAt: '2024-01-15T10:00:00Z',
    finishedAt: '2024-01-15T11:00:00Z',
    durationSeconds: 3600,
    exercisesCompleted: [],
    bodyWeightKg: 80,
    totalWeightKg: 2500,
  };

  it('should return workout data on success', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockWorkout),
    } as Response);

    const result = await fetchLatestWorkout(1);

    expect(result).toEqual(mockWorkout);
  });

  it('should return null on 404', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'No workouts found' }),
    } as Response);

    const result = await fetchLatestWorkout(1);

    expect(result).toBeNull();
  });

  it('should throw on other error status codes', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    } as Response);

    await expect(fetchLatestWorkout(1)).rejects.toThrow('HTTP error: 500');
  });
});

describe('startWorkoutForRoutine', () => {
  const mockRoutine: RoutineDetail = {
    id: 1,
    label: 'Upper Body',
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
      exercisesCompleted: [],
    });

    const result = await startWorkoutForRoutine(1, 1, getActiveWorkout);

    expect(result.type).toBe('navigate-to-existing');
    if (result.type === 'navigate-to-existing') {
      expect(result.workoutId).toBe('existing-id');
    }
  });
});

describe('loadDashboardData', () => {
  const mockRoutines: RoutineSummary[] = [{ id: 1, label: 'Upper Body', exerciseCount: 3 }];

  const mockWorkout: UserWorkout = {
    id: 1,
    userId: 1,
    routineId: 1,
    routineLabel: 'Strength',
    startedAt: '2024-01-15T10:00:00Z',
    finishedAt: '2024-01-15T11:00:00Z',
    durationSeconds: 3600,
    exercisesCompleted: [],
    bodyWeightKg: 80,
    totalWeightKg: 2500,
  };

  it('should return routines and latest workout on success', async () => {
    mockAuthFetchJson.mockResolvedValue(mockRoutines);
    mockAuthFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockWorkout),
    } as Response);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.latestWorkout).toEqual(mockWorkout);
    expect(result.routinesError).toBeNull();
    expect(result.workoutError).toBeNull();
  });

  it('should return routinesError when routines fetch fails', async () => {
    mockAuthFetchJson.mockRejectedValue(new Error('Network error'));
    mockAuthFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockWorkout),
    } as Response);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual([]);
    expect(result.routinesError).toBe('Network error');
    expect(result.latestWorkout).toEqual(mockWorkout);
    expect(result.workoutError).toBeNull();
  });

  it('should return workoutError when workout fetch fails', async () => {
    mockAuthFetchJson.mockResolvedValue(mockRoutines);
    mockAuthFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    } as Response);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.routinesError).toBeNull();
    expect(result.latestWorkout).toBeNull();
    expect(result.workoutError).toBe('HTTP error: 500');
  });

  it('should return null workout with no error when userId is null', async () => {
    mockAuthFetchJson.mockResolvedValue(mockRoutines);

    const result = await loadDashboardData(null);

    expect(result.routines).toEqual(mockRoutines);
    expect(result.latestWorkout).toBeNull();
    expect(result.workoutError).toBeNull();
  });

  it('should return both errors when both fetches fail', async () => {
    mockAuthFetchJson.mockRejectedValue(new Error('Routines error'));
    mockAuthFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as Response);

    const result = await loadDashboardData(1);

    expect(result.routines).toEqual([]);
    expect(result.routinesError).toBe('Routines error');
    expect(result.latestWorkout).toBeNull();
    expect(result.workoutError).toBe('HTTP error: 500');
  });
});

describe('handleNewWorkout', () => {
  const mockRoutine: RoutineDetail = {
    id: 1,
    label: 'Upper Body',
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
      exercisesCompleted: [],
    });

    const result = await handleNewWorkout(1, 1, getActiveWorkout, vi.fn());

    expect(result).toEqual({ type: 'navigate', path: '/workouts/existing-id' });
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
      expect(result.path).toBe(`/workouts/${createdWorkout.id}`);
    }
  });

  it('should return error when startWorkoutForRoutine throws', async () => {
    mockAuthFetchJson.mockRejectedValueOnce(new Error('Fetch failed'));

    const result = await handleNewWorkout(1, 1, vi.fn(), vi.fn());

    expect(result).toEqual({ type: 'error', error: 'Fetch failed' });
  });
});
