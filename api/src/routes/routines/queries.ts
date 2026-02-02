import type {
  Exercise,
  ExercisePrimaryMuscleGroup,
  ExerciseSecondaryMuscleGroup,
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
    };
  })[];
};

export async function getRoutinesWithExerciseCount(): Promise<RoutineWithExerciseCount[]> {
  return await prisma.routine.findMany({
    include: {
      _count: {
        select: { routineExercises: true },
      },
    },
  });
}

export async function getRoutineWithExercises(
  routineId: number
): Promise<RoutineWithExercises | null> {
  return await prisma.routine.findUnique({
    where: { id: routineId },
    include: {
      routineExercises: {
        orderBy: { position: 'asc' },
        include: {
          exercise: {
            include: {
              primaryMuscleGroups: {
                include: { muscleGroup: true },
              },
              secondaryMuscleGroups: {
                include: { muscleGroup: true },
              },
            },
          },
        },
      },
    },
  });
}
