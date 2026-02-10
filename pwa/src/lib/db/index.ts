import Dexie, { type EntityTable } from 'dexie';
import type { WorkoutExercise } from 'gym-pwa-api/types';

export interface LocalWorkoutExercise extends WorkoutExercise {
  completed: boolean;
}

export interface LocalWorkout {
  id: string;
  userId: number;
  routineId: number;
  routineLabel: string;
  startedAt: string;
  exercisesCompleted: LocalWorkoutExercise[];
  finishedAt?: string;
}

export class GymDatabase extends Dexie {
  workouts!: EntityTable<LocalWorkout, 'id'>;

  constructor() {
    super('GymDatabase');
    this.version(1).stores({
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

export async function createWorkout(workout: LocalWorkout): Promise<string> {
  await db.workouts.add(workout);
  return workout.id;
}

export async function updateWorkoutExercise(
  workoutId: string,
  exerciseId: number,
  completed: boolean
): Promise<void> {
  const workout = await db.workouts.get(workoutId);
  if (!workout) {
    throw new Error('Workout not found');
  }

  const updatedExercises = workout.exercisesCompleted.map((exercise) =>
    exercise.id === exerciseId ? { ...exercise, completed } : exercise
  );

  await db.workouts.update(workoutId, {
    exercisesCompleted: updatedExercises,
  });
}

export async function finishWorkout(workoutId: string, finishedAt: string): Promise<void> {
  await db.workouts.update(workoutId, { finishedAt });
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  await db.workouts.delete(workoutId);
}
