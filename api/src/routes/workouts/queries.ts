import type { UserWorkout as PrismaUserWorkout } from '../../prisma-client';
import type { CreateWorkoutRequest } from '../../types';
import { prisma } from '../../utils/prisma';

export type UserWorkoutFromDB = PrismaUserWorkout;

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
      exercisesCompleted: workout.exercisesCompleted,
      totalWeightKg: workout.totalWeightKg,
      bodyWeightKg: workout.bodyWeightKg,
    },
  });
}

export async function getUserWorkouts(userId: number): Promise<UserWorkoutFromDB[]> {
  return await prisma.userWorkout.findMany({
    where: { userId },
    orderBy: { finishedAt: 'desc' },
  });
}
