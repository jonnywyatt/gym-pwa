import type {
  Exercise,
  ExercisePrimaryMuscleGroup,
  ExerciseSecondaryMuscleGroup,
  ExerciseTertiaryMuscleGroup,
  MuscleGroup,
  Routine,
  RoutineExercise,
} from '../../prisma-client';
import { prisma } from '../../utils/prisma';

export type RoutineWithExerciseCount = Routine & {
  _count: { routineExercises: number };
};

export type RoutineWithExercises = Routine & {
  routineExercises: (RoutineExercise & {
    exercise: Exercise & {
      primaryMuscleGroups: (ExercisePrimaryMuscleGroup & { muscleGroup: MuscleGroup })[];
      secondaryMuscleGroups: (ExerciseSecondaryMuscleGroup & { muscleGroup: MuscleGroup })[];
      tertiaryMuscleGroups: (ExerciseTertiaryMuscleGroup & { muscleGroup: MuscleGroup })[];
    };
  })[];
};

export async function getRoutinesWithExerciseCount(
  userId: number
): Promise<RoutineWithExerciseCount[]> {
  return await prisma.routine.findMany({
    where: {
      OR: [{ userId: null }, { userId }],
    },
    include: {
      _count: {
        select: { routineExercises: true },
      },
    },
    orderBy: [{ userId: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }],
  });
}

const routineWithExercisesInclude = {
  routineExercises: {
    orderBy: { position: 'asc' as const },
    include: {
      exercise: {
        include: {
          primaryMuscleGroups: {
            include: { muscleGroup: true },
          },
          secondaryMuscleGroups: {
            include: { muscleGroup: true },
          },
          tertiaryMuscleGroups: {
            include: { muscleGroup: true },
          },
        },
      },
    },
  },
};

export async function getRoutineWithExercises(
  routineId: number
): Promise<RoutineWithExercises | null> {
  return await prisma.routine.findUnique({
    where: { id: routineId },
    include: routineWithExercisesInclude,
  });
}

export async function getRoutinesWithExercisesByIds(
  routineIds: number[]
): Promise<RoutineWithExercises[]> {
  return await prisma.routine.findMany({
    where: { id: { in: routineIds } },
    include: routineWithExercisesInclude,
  });
}

export async function createRoutine(userId: number): Promise<Routine> {
  return await prisma.routine.create({
    data: { userId },
  });
}

export async function updateRoutineLabel(routineId: number, label: string): Promise<Routine> {
  return await prisma.routine.update({
    where: { id: routineId },
    data: { label },
  });
}

export async function deleteRoutine(routineId: number): Promise<void> {
  await prisma.routine.delete({ where: { id: routineId } });
}

export async function getNextPosition(routineId: number): Promise<number> {
  const last = await prisma.routineExercise.findFirst({
    where: { routineId },
    orderBy: { position: 'desc' },
  });
  return (last?.position ?? -1) + 1;
}

export async function addExerciseToRoutine(
  routineId: number,
  exerciseId: number
): Promise<RoutineExercise> {
  const position = await getNextPosition(routineId);
  return await prisma.routineExercise.create({
    data: { routineId, exerciseId, position },
  });
}

export async function removeExerciseFromRoutine(
  routineId: number,
  exerciseId: number
): Promise<void> {
  await prisma.routineExercise.delete({
    where: { routineId_exerciseId: { routineId, exerciseId } },
  });
}

export async function copyRoutine(sourceRoutineId: number, userId: number): Promise<Routine> {
  const source = await prisma.routine.findUnique({
    where: { id: sourceRoutineId },
    include: {
      routineExercises: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!source) {
    throw new Error('Source routine not found');
  }

  return await prisma.$transaction(async (tx) => {
    const newRoutine = await tx.routine.create({
      data: { label: source.label ? `${source.label} (copy)` : null, userId },
    });

    if (source.routineExercises.length > 0) {
      await tx.routineExercise.createMany({
        data: source.routineExercises.map((re) => ({
          routineId: newRoutine.id,
          exerciseId: re.exerciseId,
          position: re.position,
        })),
      });
    }

    return newRoutine;
  });
}
