import type {
  Exercise,
  ExercisePrimaryMuscleGroup,
  ExerciseSecondaryMuscleGroup,
  MuscleGroup,
} from '../../prisma-client';
import { prisma } from '../../utils/prisma';

export type ExerciseWithMuscleGroups = Exercise & {
  primaryMuscleGroups: (ExercisePrimaryMuscleGroup & { muscleGroup: MuscleGroup })[];
  secondaryMuscleGroups: (ExerciseSecondaryMuscleGroup & { muscleGroup: MuscleGroup })[];
};

export async function getExercisesWithMuscleGroups(): Promise<ExerciseWithMuscleGroups[]> {
  return await prisma.exercise.findMany({
    include: {
      primaryMuscleGroups: {
        include: {
          muscleGroup: true,
        },
      },
      secondaryMuscleGroups: {
        include: {
          muscleGroup: true,
        },
      },
    },
  });
}

export async function searchExercises(search: string): Promise<ExerciseWithMuscleGroups[]> {
  return await prisma.exercise.findMany({
    where: {
      label: {
        contains: search,
        mode: 'insensitive',
      },
    },
    include: {
      primaryMuscleGroups: {
        include: {
          muscleGroup: true,
        },
      },
      secondaryMuscleGroups: {
        include: {
          muscleGroup: true,
        },
      },
    },
    orderBy: { label: 'asc' },
  });
}
