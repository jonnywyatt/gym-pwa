import type { RoutineDetail, UserProfile } from 'gym-pwa-api/types';
import { toRaw } from 'vue';
import { authFetch, authFetchJson } from '../../lib/api/client';
import type { LocalWorkout, LocalWorkoutExercise } from '../../lib/db';

export async function fetchUserBodyWeight(userId: number): Promise<number> {
  const userProfile = await authFetchJson<UserProfile>(`/users/${userId}`);

  if (!userProfile.latestBodyWeight) {
    throw new Error('MISSING_BODY_WEIGHT');
  }

  return userProfile.latestBodyWeight.weightKg;
}

export async function fetchRoutine(routineId: string | string[]): Promise<RoutineDetail> {
  return await authFetchJson<RoutineDetail>(`/routines/${routineId}`);
}

export async function deleteRoutine(routineId: string | string[]): Promise<void> {
  const response = await authFetch(`/routines/${routineId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete routine: ${response.status}`);
  }
}

export async function copyRoutine(routineId: string | string[]): Promise<number> {
  const response = await authFetch(`/routines/${routineId}/copy`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to copy routine: ${response.status}`);
  }
  const data = (await response.json()) as { id: number };
  return data.id;
}

export function mapExercisesToWorkoutExercises(routine: RoutineDetail): LocalWorkoutExercise[] {
  return routine.exercises.map((ex) => {
    const rawEx = toRaw(ex);
    return {
      id: rawEx.id,
      label: rawEx.label,
      recordSetsType: rawEx.recordSetsType,
      isIsometric: rawEx.isIsometric,
      isUnilateral: rawEx.isUnilateral,
      primaryMuscleGroups: [...rawEx.primaryMuscleGroups],
      secondaryMuscleGroups: [...rawEx.secondaryMuscleGroups],
      tertiaryMuscleGroups: [...rawEx.tertiaryMuscleGroups],
      completed: false,
    };
  });
}

export function createWorkoutFromRoutine(
  userId: number,
  routineId: number,
  routine: RoutineDetail,
  bodyWeightKg: number
): LocalWorkout {
  return {
    id: crypto.randomUUID(),
    userId,
    routineId,
    routineLabel: routine.label ?? '',
    startedAt: new Date().toISOString(),
    exercisesCompleted: mapExercisesToWorkoutExercises(routine),
    bodyWeightKg,
  };
}

export type StartWorkoutAction =
  | { type: 'navigate-to-existing'; workoutId: string }
  | { type: 'navigate-to-user-page'; userId: number; error: string }
  | { type: 'create-new-workout'; workout: LocalWorkout }
  | { type: 'error'; error: string };

export async function prepareWorkoutStart(
  userId: number,
  routineId: number,
  routine: RoutineDetail,
  getActiveWorkout: (userId: number) => Promise<LocalWorkout | undefined>
): Promise<StartWorkoutAction> {
  // Check for existing active workout
  const existingWorkout = await getActiveWorkout(userId);
  if (existingWorkout) {
    return { type: 'navigate-to-existing', workoutId: existingWorkout.id };
  }

  // Fetch user's body weight
  let bodyWeightKg: number;
  try {
    bodyWeightKg = await fetchUserBodyWeight(userId);
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_BODY_WEIGHT') {
      return {
        type: 'navigate-to-user-page',
        userId,
        error: 'Please set your body weight first',
      };
    }
    return { type: 'error', error: e instanceof Error ? e.message : 'Unknown error' };
  }

  // Create workout
  const workout = createWorkoutFromRoutine(userId, routineId, routine, bodyWeightKg);
  return { type: 'create-new-workout', workout };
}
