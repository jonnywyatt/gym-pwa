import type { DashboardResponse, RoutineSummary, UserWorkoutSummary } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import type { LocalWorkout } from '../../lib/db';
import { fetchRoutine, prepareWorkoutStart } from '../RoutinePage/helpers';

let dashboardPrefetch: Promise<DashboardData> | null = null;

export function prefetchDashboardData(userId: number | null): void {
  if (dashboardPrefetch) return;
  dashboardPrefetch = loadDashboardData(userId);
}

export function consumeDashboardPrefetch(): Promise<DashboardData> | null {
  const promise = dashboardPrefetch;
  dashboardPrefetch = null;
  return promise;
}

export interface DashboardData {
  routines: RoutineSummary[];
  sessionHistory: UserWorkoutSummary[];
  routinesError: string | null;
  workoutError: string | null;
}

export type NewWorkoutResult =
  | { type: 'navigate'; path: string }
  | { type: 'navigate-with-error'; path: string; error: string }
  | { type: 'error'; error: string };

export async function fetchDashboard(since: Date): Promise<DashboardResponse> {
  return authFetchJson<DashboardResponse>(`/dashboard?since=${since.toISOString()}`);
}

export async function fetchRoutines(): Promise<RoutineSummary[]> {
  return authFetchJson<RoutineSummary[]>('/routines');
}

export function sortRoutinesByLastUsed(
  routines: RoutineSummary[],
  workouts: UserWorkoutSummary[]
): RoutineSummary[] {
  const lastUsedMap = new Map<number, string>();
  for (const workout of workouts) {
    const existing = lastUsedMap.get(workout.routineId);
    if (!existing || workout.startedAt > existing) {
      lastUsedMap.set(workout.routineId, workout.startedAt);
    }
  }

  return [...routines].sort((a, b) => {
    const aDate = lastUsedMap.get(a.id);
    const bDate = lastUsedMap.get(b.id);
    if (aDate && bDate) return bDate.localeCompare(aDate);
    if (aDate) return -1;
    if (bDate) return 1;
    return 0;
  });
}

export async function createRoutine(): Promise<number> {
  const response = await authFetchJson<{ id: number }>('/routines', { method: 'POST' });
  return response.id;
}

export async function startWorkoutForRoutine(
  userId: number,
  routineId: number,
  getActiveWorkout: (userId: number) => Promise<LocalWorkout | undefined>
) {
  const routine = await fetchRoutine(String(routineId));
  return prepareWorkoutStart(userId, routineId, routine, getActiveWorkout);
}

export async function loadDashboardData(userId: number | null): Promise<DashboardData> {
  const since = new Date();
  since.setDate(since.getDate() - 27);
  since.setHours(0, 0, 0, 0);

  if (userId === null) {
    try {
      const data = await fetchDashboard(since);
      return {
        routines: sortRoutinesByLastUsed(data.routines, data.recentWorkouts).slice(0, 2),
        sessionHistory: [],
        routinesError: null,
        workoutError: null,
      };
    } catch (e) {
      return {
        routines: [],
        sessionHistory: [],
        routinesError: e instanceof Error ? e.message : 'Failed to fetch routines',
        workoutError: null,
      };
    }
  }

  try {
    const data = await fetchDashboard(since);
    return {
      routines: sortRoutinesByLastUsed(data.routines, data.recentWorkouts).slice(0, 2),
      sessionHistory: data.recentWorkouts,
      routinesError: null,
      workoutError: null,
    };
  } catch (e) {
    return {
      routines: [],
      sessionHistory: [],
      routinesError: e instanceof Error ? e.message : 'Failed to fetch dashboard data',
      workoutError: e instanceof Error ? e.message : 'Failed to fetch dashboard data',
    };
  }
}

export async function handleNewWorkout(
  userId: number | null,
  routineId: number,
  getActiveWorkoutFn: (userId: number) => Promise<LocalWorkout | undefined>,
  createWorkoutFn: (workout: LocalWorkout) => Promise<unknown>
): Promise<NewWorkoutResult> {
  if (userId === null) {
    return { type: 'error', error: 'User not authenticated' };
  }

  try {
    const action = await startWorkoutForRoutine(userId, routineId, getActiveWorkoutFn);

    switch (action.type) {
      case 'navigate-to-existing':
        return { type: 'navigate', path: `/sessions/active/${action.workoutId}` };
      case 'navigate-to-user-page':
        return {
          type: 'navigate-with-error',
          path: `/users/${action.userId}`,
          error: action.error,
        };
      case 'create-new-workout':
        await createWorkoutFn(action.workout);
        return { type: 'navigate', path: `/sessions/active/${action.workout.id}` };
      case 'error':
        return { type: 'error', error: action.error };
    }
  } catch (e) {
    return { type: 'error', error: e instanceof Error ? e.message : 'Failed to start workout' };
  }
}
