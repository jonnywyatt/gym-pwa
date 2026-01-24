// src/lib/services/sync.ts - Handle failed sync scenarios
import { db } from '../db';
import { api } from '../api/client';
import type { Workout } from '../db';

/**
 * Check for unsaved workouts on app load
 * Returns pending workouts that failed to sync
 */
export async function checkForPendingWorkouts(): Promise<Workout[]> {
  const pending = await db.workouts
    .where('status')
    .equals('pending-sync')
    .toArray();

  if (pending.length > 0) {
    // Show banner: "You have 1 unsaved workout. Retry sync?"
    return pending;
  }

  return [];
}

/**
 * Retry syncing a workout that failed previously
 */
export async function retrySyncWorkout(workoutId: string): Promise<void> {
  const workout = await db.workouts.get(workoutId);

  if (!workout) {
    throw new Error('Workout not found');
  }

  try {
    await api.saveWorkout(workout);
    await db.workouts.delete(workoutId);
    // Show success message
  } catch (error) {
    // Show error, keep in DB
    throw error;
  }
}

/**
 * Optimistic UI pattern for completing sets
 * Updates UI immediately before saving to IndexedDB
 */
export async function completeSetOptimistic(
  workoutId: string,
  set: any,
  updateUIWithNewSet: (set: any) => void
): Promise<void> {
  // 1. Update UI immediately (optimistic)
  updateUIWithNewSet(set);

  // 2. Save to IndexedDB in background
  const workout = await db.workouts.get(workoutId);
  if (!workout) throw new Error('Workout not found');

  const updatedSets = [...workout.sets, set];
  await db.workouts.update(workoutId, { sets: updatedSets });

  // No network call during workout = always instant
}
