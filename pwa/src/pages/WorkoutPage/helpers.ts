import type { CreateWorkoutRequest, UserWorkout, WorkoutExercise } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import type { LocalWorkout, LocalWorkoutExercise } from '../../lib/db';

export async function saveWorkout(
  userId: number,
  workout: CreateWorkoutRequest
): Promise<UserWorkout> {
  return await authFetchJson<UserWorkout>(`/users/${userId}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workout),
  });
}

export function formatStartTime(startedAt: string): string {
  const date = new Date(startedAt);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function getCompletedExercises(exercises: LocalWorkoutExercise[]): WorkoutExercise[] {
  return exercises.filter((ex) => ex.completed).map(({ completed, ...exercise }) => exercise);
}

export function createWorkoutPayload(
  workout: LocalWorkout,
  finishedAt: string
): CreateWorkoutRequest {
  return {
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt,
    finishedAt,
    exercisesCompleted: getCompletedExercises(workout.exercisesCompleted),
    bodyWeight: workout.bodyWeight,
  };
}
