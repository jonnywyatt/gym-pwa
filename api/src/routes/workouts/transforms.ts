import type { UserWorkout } from '../../types';
import type { UserWorkoutFromDB } from './queries';

export function transformUserWorkout(workout: UserWorkoutFromDB): UserWorkout {
  return {
    id: workout.id,
    userId: workout.userId,
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt.toISOString(),
    finishedAt: workout.finishedAt.toISOString(),
    durationSeconds: workout.durationSeconds ?? undefined,
    exercisesCompleted: workout.exercisesCompleted as UserWorkout['exercisesCompleted'],
    totalWeightKg: workout.totalWeightKg ?? 0,
    bodyWeightKg: Number(workout.bodyWeightKg),
  };
}

export function transformUserWorkouts(workouts: UserWorkoutFromDB[]): UserWorkout[] {
  return workouts.map(transformUserWorkout);
}
