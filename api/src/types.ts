/**
 * Shared types exported for use across the monorepo
 */

export type { RecordSetsType, User } from './prisma-client/index.js';
export type { BodyAreaDisplayName, MuscleGroupDisplayName } from './utils/display-names.js';

import type {
  Exercise as PrismaExercise,
  Routine as PrismaRoutine,
  User as PrismaUser,
} from './prisma-client/index.js';
import type { BodyAreaDisplayName, MuscleGroupDisplayName } from './utils/display-names.js';

/**
 * Exercise type returned by the API with muscle groups as display name strings
 */
export type Exercise = Pick<
  PrismaExercise,
  'id' | 'label' | 'recordSetsType' | 'isIsometric' | 'isUnilateral'
> & {
  primaryMuscleGroups: MuscleGroupDisplayName[];
  secondaryMuscleGroups: MuscleGroupDisplayName[];
  tertiaryMuscleGroups: MuscleGroupDisplayName[];
};

/**
 * Routine summary returned by GET /routines
 */
export type RoutineSummary = Pick<PrismaRoutine, 'id'> & {
  label: string;
  userId: number | null;
  exerciseCount: number;
};

/**
 * Routine detail returned by GET /routines/:routineId
 */
export type RoutineDetail = Pick<PrismaRoutine, 'id' | 'label'> & {
  userId: number | null;
  exercises: Exercise[];
};

export type UserPreferences = {
  showRecommendedRoutines: boolean;
};

export type UserProfile = Pick<PrismaUser, 'id' | 'name'> & {
  latestBodyWeight: {
    weightKg: number;
  } | null;
};

export type WorkoutExercise = Pick<
  Exercise,
  | 'id'
  | 'label'
  | 'recordSetsType'
  | 'isIsometric'
  | 'isUnilateral'
  | 'primaryMuscleGroups'
  | 'secondaryMuscleGroups'
  | 'tertiaryMuscleGroups'
>;

export type SetType = 'Warmup' | 'Standard' | 'Failure';

export type CompletedSet = {
  setType: SetType;
  weightKg?: number;
  reps?: number;
  timeSeconds?: number;
};

export type CompletedWorkoutExercise = WorkoutExercise & {
  sets: CompletedSet[];
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
  totalReps: number;
};

export type WorkoutMuscleGroupStat = {
  muscleGroup: MuscleGroupDisplayName;
  bodyArea: BodyAreaDisplayName;
  percentage: number;
};

export type UserWorkout = CreateWorkoutRequest & {
  id: number;
  userId: number;
  muscleGroupStats: WorkoutMuscleGroupStat[];
};

export type UserWorkoutSummary = Omit<UserWorkout, 'exercisesCompleted' | 'muscleGroupStats'> & {
  exerciseCount: number;
};

export type DashboardResponse = {
  routines: RoutineSummary[];
  recentWorkouts: UserWorkoutSummary[];
};

export type RoutineSessionPoint = {
  date: string;
  durationSeconds: number;
  totalWeightKg: number;
  totalReps: number;
};

export type RoutineTrendData = {
  routineId: number;
  routineLabel: string;
  secondMetric: 'weight' | 'reps' | null;
  sessions: RoutineSessionPoint[];
};

export type SessionTrendsResponse = RoutineTrendData[];
