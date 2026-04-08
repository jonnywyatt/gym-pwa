import {
  type BodyAreaLabel,
  type MuscleGroupLabel,
  type Prisma,
  SetType,
} from '../../prisma-client';
import type { SetType as ApiSetType, CreateWorkoutRequest } from '../../types';
import { prisma } from '../../utils/prisma';

const setTypeToDb: Record<ApiSetType, SetType> = {
  Warmup: SetType.WARMUP,
  Standard: SetType.STANDARD,
  Failure: SetType.FAILURE,
};

const muscleGroupInclude = {
  include: { muscleGroup: { include: { bodyArea: true } } },
} as const;

const workoutInclude = {
  exercises: {
    orderBy: { position: 'asc' as const },
    include: {
      exercise: {
        include: {
          primaryMuscleGroups: muscleGroupInclude,
          secondaryMuscleGroups: muscleGroupInclude,
        },
      },
      sets: { orderBy: { position: 'asc' as const } },
    },
  },
  muscleGroupStats: true,
} satisfies Prisma.UserWorkoutInclude;

export type UserWorkoutFromDB = Prisma.UserWorkoutGetPayload<{ include: typeof workoutInclude }>;

type MuscleGroupStat = {
  muscleGroup: MuscleGroupLabel;
  bodyArea: BodyAreaLabel;
  percentage: number;
};

function calculateMuscleGroupStats(workout: UserWorkoutFromDB): MuscleGroupStat[] {
  const scores = new Map<MuscleGroupLabel, { bodyArea: BodyAreaLabel; score: number }>();

  for (const workoutExercise of workout.exercises) {
    const { exercise, sets } = workoutExercise;
    const { recordSetsType } = exercise;

    const volume = sets.reduce((total, set) => {
      switch (recordSetsType) {
        case 'WEIGHT':
        case 'BODYWEIGHT_PLUS_WEIGHT':
        case 'BODYWEIGHT_MINUS_OFFSET':
          return total + Number(set.weightKg ?? 0) * (set.reps ?? 0);
        case 'REPS':
          return total + (set.reps ?? 0);
        case 'TIME':
          return total + (set.timeSeconds ?? 0);
        case 'WEIGHT_AND_TIME':
          return total + Number(set.weightKg ?? 0) * (set.timeSeconds ?? 0);
        default:
          return total;
      }
    }, 0);

    if (volume === 0) continue;

    const primaryGroups = exercise.primaryMuscleGroups;
    const secondaryGroups = exercise.secondaryMuscleGroups;
    const effectivePrimary = primaryGroups.length > 0 ? primaryGroups : secondaryGroups;
    const effectiveSecondary = primaryGroups.length > 0 ? secondaryGroups : [];

    if (effectivePrimary.length > 0) {
      const sharePerPrimary = volume / effectivePrimary.length;
      for (const { muscleGroup } of effectivePrimary) {
        const existing = scores.get(muscleGroup.label);
        scores.set(muscleGroup.label, {
          bodyArea: muscleGroup.bodyArea.label,
          score: (existing?.score ?? 0) + sharePerPrimary,
        });
      }
    }

    if (effectiveSecondary.length > 0) {
      const sharePerSecondary = (volume * 0.5) / effectiveSecondary.length;
      for (const { muscleGroup } of effectiveSecondary) {
        const existing = scores.get(muscleGroup.label);
        scores.set(muscleGroup.label, {
          bodyArea: muscleGroup.bodyArea.label,
          score: (existing?.score ?? 0) + sharePerSecondary,
        });
      }
    }
  }

  const totalScore = Array.from(scores.values()).reduce((sum, { score }) => sum + score, 0);
  if (totalScore === 0) return [];

  return Array.from(scores.entries()).map(([muscleGroup, { bodyArea, score }]) => ({
    muscleGroup,
    bodyArea,
    percentage: Math.round((score / totalScore) * 10000) / 100,
  }));
}

export async function createUserWorkout(
  userId: number,
  workout: CreateWorkoutRequest
): Promise<UserWorkoutFromDB> {
  return await prisma.$transaction(async (tx) => {
    const created = await tx.userWorkout.create({
      data: {
        userId,
        routineId: workout.routineId,
        routineLabel: workout.routineLabel,
        startedAt: new Date(workout.startedAt),
        finishedAt: new Date(workout.finishedAt),
        durationSeconds: workout.durationSeconds,
        totalWeightKg: workout.totalWeightKg,
        totalReps: workout.totalReps,
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

    const stats = calculateMuscleGroupStats(created);
    if (stats.length > 0) {
      await tx.workoutMuscleGroupStat.createMany({
        data: stats.map(({ muscleGroup, bodyArea, percentage }) => ({
          workoutId: created.id,
          muscleGroup,
          bodyArea,
          percentage,
        })),
      });
    }

    return created;
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

const workoutSummarySelect = {
  id: true,
  userId: true,
  routineId: true,
  routineLabel: true,
  startedAt: true,
  finishedAt: true,
  durationSeconds: true,
  totalWeightKg: true,
  totalReps: true,
  bodyWeightKg: true,
  _count: { select: { exercises: true } },
} satisfies Prisma.UserWorkoutSelect;

export type UserWorkoutSummaryFromDB = Prisma.UserWorkoutGetPayload<{
  select: typeof workoutSummarySelect;
}>;

export async function getUserWorkoutSummaries(
  userId: number,
  since?: Date
): Promise<UserWorkoutSummaryFromDB[]> {
  return await prisma.userWorkout.findMany({
    where: {
      userId,
      ...(since ? { startedAt: { gte: since } } : {}),
    },
    orderBy: { finishedAt: 'desc' },
    select: workoutSummarySelect,
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
