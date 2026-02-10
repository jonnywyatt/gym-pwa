import type { RoutineDetail, UserProfile } from 'gym-pwa-api/types';
import { toRaw } from 'vue';
import { authFetchJson } from '../../lib/api/client';
import type { LocalWorkout, LocalWorkoutExercise } from '../../lib/db';

export async function fetchUserBodyWeight(userId: number): Promise<number> {
  const userProfile = await authFetchJson<UserProfile>(`/users/${userId}`);

  if (!userProfile.latestBodyWeight) {
    throw new Error('MISSING_BODY_WEIGHT');
  }

  return userProfile.latestBodyWeight.weight;
}

export async function fetchRoutine(routineId: string | string[]): Promise<RoutineDetail> {
  return await authFetchJson<RoutineDetail>(`/routines/${routineId}`);
}

export function mapExercisesToWorkoutExercises(routine: RoutineDetail): LocalWorkoutExercise[] {
  return routine.exercises.map((ex) => {
    const rawEx = toRaw(ex);
    return {
      id: rawEx.id,
      label: rawEx.label,
      recordSetsType: rawEx.recordSetsType,
      primaryMuscleGroups: [...rawEx.primaryMuscleGroups],
      secondaryMuscleGroups: [...rawEx.secondaryMuscleGroups],
      completed: false,
    };
  });
}

export function createWorkoutFromRoutine(
  userId: number,
  routineId: number,
  routine: RoutineDetail,
  bodyWeight: number
): LocalWorkout {
  return {
    id: crypto.randomUUID(),
    userId,
    routineId,
    routineLabel: routine.label,
    startedAt: new Date().toISOString(),
    exercisesCompleted: mapExercisesToWorkoutExercises(routine),
    bodyWeight,
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
  let bodyWeight: number;
  try {
    bodyWeight = await fetchUserBodyWeight(userId);
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
  const workout = createWorkoutFromRoutine(userId, routineId, routine, bodyWeight);
  return { type: 'create-new-workout', workout };
}
