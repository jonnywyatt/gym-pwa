import { type BodyAreaLabel, type MuscleGroupLabel, SetType } from '../../prisma-client';
import type { SetType as ApiSetType, UserWorkout, UserWorkoutSummary } from '../../types';
import { bodyAreaDisplayNames, muscleGroupDisplayNames } from '../../utils/display-names';
import type { UserWorkoutFromDB, UserWorkoutSummaryFromDB } from './queries';

const setTypeToApi: Record<SetType, ApiSetType> = {
  [SetType.WARMUP]: 'Warmup',
  [SetType.STANDARD]: 'Standard',
  [SetType.FAILURE]: 'Failure',
};

export function transformUserWorkout(workout: UserWorkoutFromDB): UserWorkout {
  return {
    id: workout.id,
    userId: workout.userId,
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt.toISOString(),
    finishedAt: workout.finishedAt.toISOString(),
    durationSeconds: workout.durationSeconds ?? undefined,
    totalWeightKg: workout.totalWeightKg ?? 0,
    totalReps: workout.totalReps ?? 0,
    bodyWeightKg: Number(workout.bodyWeightKg),
    exercisesCompleted: workout.exercises.map((we) => ({
      id: we.exercise.id,
      label: we.exercise.label,
      recordSetsType: we.exercise.recordSetsType,
      primaryMuscleGroups: we.exercise.primaryMuscleGroups.map(
        (pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label as MuscleGroupLabel]
      ),
      secondaryMuscleGroups: we.exercise.secondaryMuscleGroups.map(
        (smg) => muscleGroupDisplayNames[smg.muscleGroup.label as MuscleGroupLabel]
      ),
      sets: we.sets.map((set) => ({
        setType: setTypeToApi[set.setType],
        weightKg: set.weightKg !== null ? Number(set.weightKg) : undefined,
        reps: set.reps ?? undefined,
        timeSeconds: set.timeSeconds ?? undefined,
      })),
    })),
    muscleGroupStats: workout.muscleGroupStats.map((stat) => ({
      muscleGroup: muscleGroupDisplayNames[stat.muscleGroup as MuscleGroupLabel],
      bodyArea: bodyAreaDisplayNames[stat.bodyArea as BodyAreaLabel],
      percentage: Number(stat.percentage),
    })),
  };
}

export function transformUserWorkouts(workouts: UserWorkoutFromDB[]): UserWorkout[] {
  return workouts.map(transformUserWorkout);
}

export function transformUserWorkoutSummary(workout: UserWorkoutSummaryFromDB): UserWorkoutSummary {
  return {
    id: workout.id,
    userId: workout.userId,
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt.toISOString(),
    finishedAt: workout.finishedAt.toISOString(),
    durationSeconds: workout.durationSeconds ?? undefined,
    totalWeightKg: workout.totalWeightKg ?? 0,
    totalReps: workout.totalReps ?? 0,
    bodyWeightKg: Number(workout.bodyWeightKg),
    exerciseCount: workout._count.exercises,
  };
}

export function transformUserWorkoutSummaries(
  workouts: UserWorkoutSummaryFromDB[]
): UserWorkoutSummary[] {
  return workouts.map(transformUserWorkoutSummary);
}
