import Dexie, { type EntityTable } from 'dexie';
import type { CompletedSet, WorkoutExercise } from 'gym-pwa-api/types';

export type { SetType } from 'gym-pwa-api/types';

export interface WorkoutSet extends CompletedSet {
  id: string;
  completed: boolean;
}

export interface LocalWorkoutExercise extends WorkoutExercise {
  completed: boolean;
  startedAt?: string;
  sets?: WorkoutSet[];
}

export interface LocalWorkout {
  id: string;
  userId: number;
  routineId: number;
  routineLabel: string;
  startedAt: string;
  exercisesCompleted: LocalWorkoutExercise[];
  bodyWeightKg: number;
  finishedAt?: string;
  pausedAt?: string;
  totalPausedSeconds?: number;
  elapsedSeconds?: number;
}

export class GymDatabase extends Dexie {
  workouts!: EntityTable<LocalWorkout, 'id'>;

  constructor() {
    super('GymDatabase');
    this.version(2).stores({
      workouts: 'id, userId, routineId, startedAt',
    });
  }
}

export const db = new GymDatabase();

export async function getActiveWorkout(userId: number): Promise<LocalWorkout | undefined> {
  return await db.workouts
    .where('userId')
    .equals(userId)
    .and((workout) => !workout.finishedAt)
    .first();
}

export async function getActiveWorkoutForRoutine(
  userId: number,
  routineId: number
): Promise<LocalWorkout | undefined> {
  return await db.workouts
    .where('userId')
    .equals(userId)
    .and((workout) => workout.routineId === routineId && !workout.finishedAt)
    .first();
}

export async function createWorkout(workout: LocalWorkout): Promise<string> {
  await db.workouts.add(workout);
  return workout.id;
}

export async function updateWorkoutExercises(
  workoutId: string,
  exercises: LocalWorkoutExercise[]
): Promise<void> {
  await db.workouts.update(workoutId, {
    exercisesCompleted: exercises,
  });
}

export async function finishWorkout(workoutId: string, finishedAt: string): Promise<void> {
  await db.workouts.update(workoutId, { finishedAt });
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  await db.workouts.delete(workoutId);
}

export async function updateWorkoutTimer(
  workoutId: string,
  updates: {
    elapsedSeconds?: number;
    pausedAt?: string;
    totalPausedSeconds?: number;
  }
): Promise<void> {
  await db.workouts.update(workoutId, updates);
}
