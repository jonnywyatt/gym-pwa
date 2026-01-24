// src/lib/services/workout.ts
import { db } from '../db';
import { api } from '../api/client';
import type { Workout, ExerciseSet } from '../db';

class WorkoutService {
  async startWorkout(routineId: string): Promise<Workout> {
    // 1. Fetch latest records from API
    const records = await api.getPersonalRecords();
    await db.personalRecords.clear();
    await db.personalRecords.bulkAdd(records);

    // 2. Create local workout
    const routine = await db.routines.get(routineId);
    const workout: Workout = {
      id: crypto.randomUUID(),
      routineSnapshot: routine,
      sets: [],
      status: 'in-progress',
      startedAt: Date.now()
    };
    await db.workouts.add(workout);

    return workout;
  }

  async completeSet(workoutId: string, set: ExerciseSet): Promise<boolean> {
    // 1. Save set locally
    const workout = await db.workouts.get(workoutId);
    if (!workout) throw new Error('Workout not found');

    workout.sets.push(set);
    await db.workouts.put(workout);

    // 2. Check if it's a new record (instant, local comparison)
    const isNewRecord = await this.checkForNewRecord(set);

    // 3. If new record, update local records immediately
    if (isNewRecord) {
      await db.personalRecords.put({
        exerciseId: set.exerciseId,
        recordType: set.recordType,
        value: set.value,
        achievedAt: Date.now()
      });
    }

    return isNewRecord;
  }

  async finishWorkout(workoutId: string): Promise<void> {
    const workout = await db.workouts.get(workoutId);
    if (!workout) throw new Error('Workout not found');

    workout.status = 'completed';
    workout.completedAt = Date.now();

    // Calculate totals
    workout.totalWeight = this.calculateTotalWeight(workout.sets);
    workout.duration = workout.completedAt - workout.startedAt;
    workout.muscleGroupBreakdown = this.calculateMuscleGroups(workout);

    try {
      // Sync to server
      await api.saveWorkout(workout);

      // Success: remove local copy
      await db.workouts.delete(workoutId);
      await db.personalRecords.clear(); // Clean up

    } catch (error) {
      // Keep workout in IndexedDB with 'pending-sync' status
      workout.status = 'pending-sync';
      await db.workouts.put(workout);
      throw error; // Let UI handle error display
    }
  }

  private async checkForNewRecord(set: ExerciseSet): Promise<boolean> {
    const currentRecord = await db.personalRecords.get({
      exerciseId: set.exerciseId,
      recordType: set.recordType
    });

    return !currentRecord || set.value > currentRecord.value;
  }

  private calculateTotalWeight(sets: ExerciseSet[]): number {
    return sets.reduce((total, set) => total + (set.weightKg * set.reps), 0);
  }

  private calculateMuscleGroups(workout: Workout): any {
    // Implementation depends on your muscle group tracking logic
    return {};
  }
}

export const workoutService = new WorkoutService();
