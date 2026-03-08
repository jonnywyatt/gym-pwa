import { type Prisma, SetType } from '../../prisma-client';
import type { SetType as ApiSetType, CreateWorkoutRequest } from '../../types';
import { prisma } from '../../utils/prisma';

const setTypeToDb: Record<ApiSetType, SetType> = {
  Warmup: SetType.WARMUP,
  Standard: SetType.STANDARD,
  Failure: SetType.FAILURE,
};

const workoutInclude = {
  exercises: {
    orderBy: { position: 'asc' as const },
    include: {
      exercise: {
        include: {
          primaryMuscleGroups: { include: { muscleGroup: true } },
          secondaryMuscleGroups: { include: { muscleGroup: true } },
        },
      },
      sets: { orderBy: { position: 'asc' as const } },
    },
  },
} satisfies Prisma.UserWorkoutInclude;

export type UserWorkoutFromDB = Prisma.UserWorkoutGetPayload<{ include: typeof workoutInclude }>;

export async function createUserWorkout(
  userId: number,
  workout: CreateWorkoutRequest
): Promise<UserWorkoutFromDB> {
  return await prisma.userWorkout.create({
    data: {
      userId,
      routineId: workout.routineId,
      routineLabel: workout.routineLabel,
      startedAt: new Date(workout.startedAt),
      finishedAt: new Date(workout.finishedAt),
      durationSeconds: workout.durationSeconds,
      totalWeightKg: workout.totalWeightKg,
      bodyWeightKg: workout.bodyWeightKg,
      exercises: {
        create: workout.exercisesCompleted.map((exercise, position) => ({
          exerciseId: exercise.id,
          position,
          sets: {
            create: exercise.sets.map((set, setPosition) => ({
              position: setPosition,
              setType: setTypeToDb[set.setType],
              weightKg: set.weightKg,
              reps: set.reps,
              timeSeconds: set.timeSeconds,
            })),
          },
        })),
      },
    },
    include: workoutInclude,
  });
}

export async function getUserWorkouts(userId: number, since?: Date): Promise<UserWorkoutFromDB[]> {
  return await prisma.userWorkout.findMany({
    where: {
      userId,
      ...(since ? { startedAt: { gte: since } } : {}),
    },
    orderBy: { finishedAt: 'desc' },
    include: workoutInclude,
  });
}

export async function getLatestUserWorkout(userId: number): Promise<UserWorkoutFromDB | null> {
  return await prisma.userWorkout.findFirst({
    where: { userId },
    orderBy: { finishedAt: 'desc' },
    include: workoutInclude,
  });
}

export async function getUserWorkout(
  userId: number,
  workoutId: number
): Promise<UserWorkoutFromDB | null> {
  return await prisma.userWorkout.findFirst({
    where: { id: workoutId, userId },
    include: workoutInclude,
  });
}

export async function deleteUserWorkout(
  userId: number,
  workoutId: number
): Promise<UserWorkoutFromDB | null> {
  const workout = await prisma.userWorkout.findFirst({
    where: { id: workoutId, userId },
    include: workoutInclude,
  });

  if (!workout) {
    return null;
  }

  await prisma.userWorkout.delete({ where: { id: workoutId } });

  return workout;
}
