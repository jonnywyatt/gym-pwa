// src/lib/db/index.ts - Dexie.js IndexedDB schema
import Dexie, { Table } from 'dexie';

interface Workout {
  id: string;
  routineSnapshot: any;
  sets: ExerciseSet[];
  status: 'in-progress' | 'completed' | 'pending-sync';
  startedAt: number;
  completedAt?: number;
  totalWeight?: number;
  duration?: number;
  muscleGroupBreakdown?: any;
}

interface PersonalRecord {
  exerciseId: string;
  recordType: string;
  value: number;
  achievedAt: number;
}

interface Routine {
  id: string;
  isUserCreated: boolean;
  name: string;
  exercises: any[];
}

interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  recordingType: string;
}

interface ExerciseSet {
  exerciseId: string;
  reps: number;
  weightKg: number;
  durationSeconds?: number;
  recordType: string;
  value: number;
}

class GymDB extends Dexie {
  workouts!: Table<Workout>;
  personalRecords!: Table<PersonalRecord>;
  routines!: Table<Routine>;
  exercises!: Table<Exercise>;

  constructor() {
    super('GymDB');
    this.version(1).stores({
      // Active workout (only 1 at a time)
      workouts: 'id, status, startedAt',

      // Synced at workout start, used for comparisons
      personalRecords: 'exerciseId, recordType',

      // Pre-seeded + user routines
      routines: 'id, isUserCreated',

      // Pre-seeded exercises
      exercises: 'id, name'
    });
  }
}

export const db = new GymDB();
export type { Workout, PersonalRecord, Routine, Exercise, ExerciseSet };
