/**
 * Shared types exported for use across the monorepo
 */

export type { RecordSetsType, User } from './prisma-client/index.js';

import type { Exercise as PrismaExercise } from './prisma-client/index.js';
import type { MuscleGroupDisplayName } from './utils/display-names';

/**
 * Exercise type returned by the API with muscle groups as display name strings
 */
export type Exercise = Pick<PrismaExercise, 'id' | 'label' | 'recordSetsType'> & {
  primaryMuscleGroups: MuscleGroupDisplayName[];
  secondaryMuscleGroups: MuscleGroupDisplayName[];
};
