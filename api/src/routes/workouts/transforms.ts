import type { UserWorkout } from '../../types';
import type { UserWorkoutFromDB } from './queries';

export function transformUserWorkout(workout: UserWorkoutFromDB): UserWorkout {
  if (workout.bodyWeight === null) {
    throw new Error('Workout missing required bodyWeight field');
  }

  return {
    id: workout.id,
    userId: workout.userId,
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt.toISOString(),
    finishedAt: workout.finishedAt.toISOString(),
    exercisesCompleted: workout.exercisesCompleted as UserWorkout['exercisesCompleted'],
    bodyWeight: Number(workout.bodyWeight),
  };
}

export function transformUserWorkouts(workouts: UserWorkoutFromDB[]): UserWorkout[] {
  return workouts.map(transformUserWorkout);
}
