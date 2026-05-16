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
          tertiaryMuscleGroups: muscleGroupInclude,
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

const ISOMETRIC_SECONDS_PER_EFFECTIVE_SET = 45;

const exerciseMuscleGroupSelect = {
  id: true,
  isIsometric: true,
  isUnilateral: true,
  primaryMuscleGroups: muscleGroupInclude,
  secondaryMuscleGroups: muscleGroupInclude,
  tertiaryMuscleGroups: muscleGroupInclude,
} satisfies Prisma.ExerciseSelect;

type ExerciseForStats = Prisma.ExerciseGetPayload<{ select: typeof exerciseMuscleGroupSelect }>;

function calculateMuscleGroupStats(
  exercises: CreateWorkoutRequest['exercisesCompleted'],
  exerciseData: ExerciseForStats[]
): MuscleGroupStat[] {
  const exerciseMap = new Map(exerciseData.map((e) => [e.id, e]));
  const scores = new Map<MuscleGroupLabel, { bodyArea: BodyAreaLabel; score: number }>();

  for (const workoutExercise of exercises) {
    const exercise = exerciseMap.get(workoutExercise.id);
    if (!exercise) continue;

    const { isIsometric, isUnilateral } = exercise;

    const effectiveSets = workoutExercise.sets.reduce((total, set) => {
      const qualityMultiplier = set.setType === 'Warmup' ? 0.5 : 1.0;
      const rawValue = isIsometric
        ? (set.timeSeconds ?? 0) / ISOMETRIC_SECONDS_PER_EFFECTIVE_SET
        : 1;
      return total + rawValue * qualityMultiplier;
    }, 0);

    const setCount = isUnilateral ? effectiveSets * 2 : effectiveSets;
    if (setCount === 0) continue;

    const primaryGroups = exercise.primaryMuscleGroups;
    const secondaryGroups = exercise.secondaryMuscleGroups;
    const tertiaryGroups = exercise.tertiaryMuscleGroups;
    const effectivePrimary = primaryGroups.length > 0 ? primaryGroups : secondaryGroups;
    const effectiveSecondary = primaryGroups.length > 0 ? secondaryGroups : [];
    const effectiveTertiary = primaryGroups.length > 0 ? tertiaryGroups : [];

    if (effectivePrimary.length > 0) {
      const share = (setCount * 1.0) / effectivePrimary.length;
      for (const { muscleGroup } of effectivePrimary) {
        const existing = scores.get(muscleGroup.label);
        scores.set(muscleGroup.label, {
          bodyArea: muscleGroup.bodyArea.label,
          score: (existing?.score ?? 0) + share,
        });
      }
    }

    if (effectiveSecondary.length > 0) {
      const share = (setCount * 0.5) / effectiveSecondary.length;
      for (const { muscleGroup } of effectiveSecondary) {
        const existing = scores.get(muscleGroup.label);
        scores.set(muscleGroup.label, {
          bodyArea: muscleGroup.bodyArea.label,
          score: (existing?.score ?? 0) + share,
        });
      }
    }

    if (effectiveTertiary.length > 0) {
      const share = (setCount * 0.2) / effectiveTertiary.length;
      for (const { muscleGroup } of effectiveTertiary) {
        const existing = scores.get(muscleGroup.label);
        scores.set(muscleGroup.label, {
          bodyArea: muscleGroup.bodyArea.label,
          score: (existing?.score ?? 0) + share,
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
): Promise<number> {
  const exerciseIds = workout.exercisesCompleted.map((e) => e.id);

  const [exerciseData, created] = await Promise.all([
    prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: exerciseMuscleGroupSelect,
    }),
    prisma.userWorkout.create({
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
      select: { id: true },
    }),
  ]);

  const stats = calculateMuscleGroupStats(workout.exercisesCompleted, exerciseData);
  if (stats.length > 0) {
    await prisma.workoutMuscleGroupStat.createMany({
      data: stats.map(({ muscleGroup, bodyArea, percentage }) => ({
        workoutId: created.id,
        muscleGroup,
        bodyArea,
        percentage,
      })),
    });
  }

  return created.id;
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
  muscleGroupStats: { select: { bodyArea: true, percentage: true } },
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
