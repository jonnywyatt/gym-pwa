/**
 * Shared types exported for use across the monorepo
 */

export type { RecordSetsType, User } from './prisma-client/index.js';

import type {
  Exercise as PrismaExercise,
  Routine as PrismaRoutine,
  User as PrismaUser,
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

export type UserProfile = Pick<PrismaUser, 'id' | 'name'> & {
  latestBodyWeight: {
    weightKg: number;
  } | null;
};

export type WorkoutExercise = Pick<
  Exercise,
  'id' | 'label' | 'recordSetsType' | 'primaryMuscleGroups' | 'secondaryMuscleGroups'
>;

export type SetType = 'Warmup' | 'Normal' | 'Failure';

export type CompletedSet = {
  setType: SetType;
  weightKg?: number;
  reps?: number;
  timeSeconds?: number;
};

export type CompletedWorkoutExercise = WorkoutExercise & {
  sets: CompletedSet[];
  totalWeightKg: number;
};

export type CreateWorkoutRequest = {
  routineId: number;
  routineLabel: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds?: number;
  exercisesCompleted: CompletedWorkoutExercise[];
  bodyWeightKg: number;
  totalWeightKg: number;
};

export type UserWorkout = CreateWorkoutRequest & {
  id: number;
  userId: number;
};
