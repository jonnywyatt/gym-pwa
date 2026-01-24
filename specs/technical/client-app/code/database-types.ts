import type { Prisma } from '@prisma/client';

// Use Prisma-generated types in frontend
export type User = Prisma.UserGetPayload<{}>;
export type Exercise = Prisma.ExerciseGetPayload<{}>;
export type Routine = Prisma.RoutineGetPayload<{
  include: {
    routineExercises: {
      include: { exercise: true }
    }
  }
}>;
export type Workout = Prisma.WorkoutGetPayload<{
  include: {
    workoutSets: {
      include: { exercise: true }
    }
  }
}>;
export type PersonalRecord = Prisma.PersonalRecordGetPayload<{
  include: { exercise: true }
}>;

// Frontend-specific types
export interface WorkoutInProgress {
  id: string;
  routineSnapshot: Routine;
  sets: WorkoutSet[];
  status: 'in-progress' | 'completed' | 'pending-sync';
  startedAt: number;
}
