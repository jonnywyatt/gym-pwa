import type { RoutineSummary, UserWorkout } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import type { LocalWorkout } from '../../lib/db';
import { fetchRoutine, prepareWorkoutStart } from '../RoutinePage/helpers';

export interface DashboardData {
  routines: RoutineSummary[];
  recentWorkouts: UserWorkout[];
  routinesError: string | null;
  workoutError: string | null;
}

export type NewWorkoutResult =
  | { type: 'navigate'; path: string }
  | { type: 'navigate-with-error'; path: string; error: string }
  | { type: 'error'; error: string };

export async function fetchRoutines(): Promise<RoutineSummary[]> {
  const routines = await authFetchJson<RoutineSummary[]>('/routines');
  return routines.slice(0, 2);
}

export async function fetchRecentWorkouts(userId: number): Promise<UserWorkout[]> {
  const workouts = await authFetchJson<UserWorkout[]>(`/users/${userId}/workouts`);
  return workouts.slice(0, 2);
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
  const [routinesResult, workoutsResult] = await Promise.allSettled([
    fetchRoutines(),
    userId !== null ? fetchRecentWorkouts(userId) : Promise.resolve([]),
  ]);

  return {
    routines: routinesResult.status === 'fulfilled' ? routinesResult.value : [],
    routinesError:
      routinesResult.status === 'rejected'
        ? routinesResult.reason instanceof Error
          ? routinesResult.reason.message
          : 'Failed to fetch routines'
        : null,
    recentWorkouts: workoutsResult.status === 'fulfilled' ? workoutsResult.value : [],
    workoutError:
      workoutsResult.status === 'rejected'
        ? workoutsResult.reason instanceof Error
          ? workoutsResult.reason.message
          : 'Failed to fetch workouts'
        : null,
  };
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
        return { type: 'navigate', path: `/workouts/${action.workoutId}` };
      case 'navigate-to-user-page':
        return {
          type: 'navigate-with-error',
          path: `/users/${action.userId}`,
          error: action.error,
        };
      case 'create-new-workout':
        await createWorkoutFn(action.workout);
        return { type: 'navigate', path: `/workouts/${action.workout.id}` };
      case 'error':
        return { type: 'error', error: action.error };
    }
  } catch (e) {
    return { type: 'error', error: e instanceof Error ? e.message : 'Failed to start workout' };
  }
}
