/**
 * Shared types exported for use across the monorepo
 */

export type { RecordSetsType, User } from './prisma-client/index.js';

import type {
  Exercise as PrismaExercise,
  Routine as PrismaRoutine,
} from './prisma-client/index.js';
import type { MuscleGroupDisplayName } from './utils/display-names';

/**
 * Exercise type returned by the API with muscle groups as display name strings
 */
export type Exercise = Pick<PrismaExercise, 'id' | 'label' | 'recordSetsType'> & {
  primaryMuscleGroups: MuscleGroupDisplayName[];
  secondaryMuscleGroups: MuscleGroupDisplayName[];
};

/**
 * Routine summary returned by GET /routines
 */
export type RoutineSummary = Pick<PrismaRoutine, 'id' | 'label'> & {
  exerciseCount: number;
};

/**
 * Routine detail returned by GET /routines/:routineId
 */
export type RoutineDetail = Pick<PrismaRoutine, 'id' | 'label'> & {
  exercises: Exercise[];
};
