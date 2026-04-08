import type {
  Exercise,
  ExercisePrimaryMuscleGroup,
  ExerciseSecondaryMuscleGroup,
  ExerciseTertiaryMuscleGroup,
  MuscleGroup,
} from '../../prisma-client';
import { prisma } from '../../utils/prisma';

export type ExerciseWithMuscleGroups = Exercise & {
  primaryMuscleGroups: (ExercisePrimaryMuscleGroup & { muscleGroup: MuscleGroup })[];
  secondaryMuscleGroups: (ExerciseSecondaryMuscleGroup & { muscleGroup: MuscleGroup })[];
  tertiaryMuscleGroups: (ExerciseTertiaryMuscleGroup & { muscleGroup: MuscleGroup })[];
};

const muscleGroupInclude = {
  primaryMuscleGroups: { include: { muscleGroup: true } },
  secondaryMuscleGroups: { include: { muscleGroup: true } },
  tertiaryMuscleGroups: { include: { muscleGroup: true } },
} as const;

export async function getExercisesWithMuscleGroups(): Promise<ExerciseWithMuscleGroups[]> {
  return await prisma.exercise.findMany({ include: muscleGroupInclude });
}

export async function searchExercises(search: string): Promise<ExerciseWithMuscleGroups[]> {
  return await prisma.exercise.findMany({
    where: { label: { contains: search, mode: 'insensitive' } },
    include: muscleGroupInclude,
    orderBy: { label: 'asc' },
  });
}
