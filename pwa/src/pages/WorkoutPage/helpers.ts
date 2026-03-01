import type {
  CompletedSet,
  CompletedWorkoutExercise,
  CreateWorkoutRequest,
  RecordSetsType,
  UserWorkout,
} from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import type { LocalWorkout, LocalWorkoutExercise, WorkoutSet } from '../../lib/db';

export async function saveWorkout(
  userId: number,
  workout: CreateWorkoutRequest
): Promise<UserWorkout> {
  return await authFetchJson<UserWorkout>(`/users/${userId}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workout),
  });
}

export function formatStartTime(startedAt: string): string {
  const date = new Date(startedAt);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function createDefaultSets(recordSetsType: RecordSetsType): WorkoutSet[] {
  const standardSet = (): WorkoutSet => ({
    id: crypto.randomUUID(),
    setType: 'Standard',
    completed: false,
  });

  if (recordSetsType === 'REPS') {
    return [standardSet(), standardSet()];
  }

  if (recordSetsType === 'WEIGHT_AND_TIME' || recordSetsType === 'TIME') {
    return [standardSet()];
  }

  return [
    {
      id: crypto.randomUUID(),
      setType: 'Warmup',
      completed: false,
    },
    standardSet(),
    standardSet(),
  ];
}

export function createNewSet(): WorkoutSet {
  return {
    id: crypto.randomUUID(),
    setType: 'Standard',
    completed: false,
  };
}

export function getSetDisplayLabel(sets: WorkoutSet[], index: number): string {
  if (sets[index].setType === 'Warmup') return 'W';

  let numberIndex = 0;
  for (let i = 0; i <= index; i++) {
    if (sets[i].setType !== 'Warmup') {
      numberIndex++;
    }
  }
  return String(numberIndex);
}

export function getSetInputFields(recordSetsType: RecordSetsType): {
  showWeight: boolean;
  showReps: boolean;
  showTime: boolean;
  weightLabel: string;
} {
  switch (recordSetsType) {
    case 'WEIGHT':
      return { showWeight: true, showReps: true, showTime: false, weightLabel: 'Kg' };
    case 'BODYWEIGHT_PLUS_WEIGHT':
      return { showWeight: true, showReps: true, showTime: false, weightLabel: 'Kg' };
    case 'BODYWEIGHT_MINUS_OFFSET':
      return { showWeight: true, showReps: true, showTime: false, weightLabel: 'Kg' };
    case 'WEIGHT_AND_TIME':
      return { showWeight: true, showReps: false, showTime: true, weightLabel: 'Kg' };
    case 'TIME':
      return { showWeight: false, showReps: false, showTime: true, weightLabel: '' };
    case 'REPS':
      return { showWeight: false, showReps: true, showTime: false, weightLabel: '' };
  }
}

export function calculateSetWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  set: CompletedSet
): number {
  const weightKg = set.weightKg ?? 0;
  const reps = set.reps ?? 0;

  switch (recordSetsType) {
    case 'WEIGHT':
      return weightKg * reps;
    case 'BODYWEIGHT_PLUS_WEIGHT':
      return (bodyWeightKg + weightKg) * reps;
    case 'BODYWEIGHT_MINUS_OFFSET':
      return (bodyWeightKg - weightKg) * reps;
    case 'WEIGHT_AND_TIME':
      return weightKg;
    case 'TIME':
      return 0;
    case 'REPS':
      return 0;
  }
}

export function calculateExerciseTotalWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  sets: WorkoutSet[]
): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + calculateSetWeightKg(recordSetsType, bodyWeightKg, set), 0);
}

export function calculateCompletedSetsTotalWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  sets: CompletedSet[]
): number {
  return sets.reduce(
    (total, set) => total + calculateSetWeightKg(recordSetsType, bodyWeightKg, set),
    0
  );
}

export function calculateWorkoutTotalWeightKg(
  exercises: LocalWorkoutExercise[],
  bodyWeightKg: number
): number {
  return exercises
    .filter((exercise) => exercise.completed)
    .reduce(
      (total, exercise) =>
        total +
        calculateExerciseTotalWeightKg(exercise.recordSetsType, bodyWeightKg, exercise.sets ?? []),
      0
    );
}

export function startExercise(exercise: LocalWorkoutExercise): LocalWorkoutExercise {
  return {
    ...exercise,
    startedAt: new Date().toISOString(),
    sets: createDefaultSets(exercise.recordSetsType),
  };
}

export function getCompletedExercises(
  exercises: LocalWorkoutExercise[]
): CompletedWorkoutExercise[] {
  return exercises
    .filter((ex) => ex.completed)
    .map(({ completed, startedAt, ...exercise }) => ({
      ...exercise,
      sets: (exercise.sets ?? [])
        .filter((set) => set.completed)
        .map(({ id, completed: setCompleted, ...set }) => set),
    }));
}

export function createWorkoutPayload(
  workout: LocalWorkout,
  finishedAt: string,
  durationSeconds: number
): CreateWorkoutRequest {
  return {
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt,
    finishedAt,
    durationSeconds,
    exercisesCompleted: getCompletedExercises(workout.exercisesCompleted),
    bodyWeightKg: workout.bodyWeightKg,
    totalWeightKg: calculateWorkoutTotalWeightKg(workout.exercisesCompleted, workout.bodyWeightKg),
  };
}

export function calculateElapsedSeconds(
  startedAt: string,
  totalPausedSeconds: number = 0,
  isPaused: boolean,
  pausedAt?: string
): number {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();

  let currentPausedTime = 0;
  if (isPaused && pausedAt) {
    const pausedAtTime = new Date(pausedAt).getTime();
    currentPausedTime = Math.floor((now - pausedAtTime) / 1000);
  }

  const totalElapsed = Math.floor((now - startTime) / 1000);
  return totalElapsed - totalPausedSeconds - currentPausedTime;
}

export function calculateFinalDurationSeconds(
  startedAt: string,
  finishedAt: string,
  totalPausedSeconds: number = 0
): number {
  const startTime = new Date(startedAt).getTime();
  const endTime = new Date(finishedAt).getTime();
  const totalElapsed = Math.floor((endTime - startTime) / 1000);
  return totalElapsed - totalPausedSeconds;
}

export async function fetchWorkout(userId: number, workoutId: number): Promise<UserWorkout> {
  return await authFetchJson<UserWorkout>(`/users/${userId}/workouts/${workoutId}`);
}

function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

export function formatSetDetails(set: CompletedSet, recordSetsType: RecordSetsType): string {
  const parts: string[] = [set.setType];

  switch (recordSetsType) {
    case 'WEIGHT':
    case 'BODYWEIGHT_PLUS_WEIGHT':
      parts.push(`${set.weightKg ?? 0}kg`);
      parts.push(`${set.reps ?? 0} reps`);
      break;
    case 'BODYWEIGHT_MINUS_OFFSET':
      parts.push(`${set.weightKg ?? 0}kg offset`);
      parts.push(`${set.reps ?? 0} reps`);
      break;
    case 'WEIGHT_AND_TIME':
      parts.push(`${set.weightKg ?? 0}kg`);
      parts.push(formatTimeSeconds(set.timeSeconds ?? 0));
      break;
    case 'TIME':
      parts.push(formatTimeSeconds(set.timeSeconds ?? 0));
      break;
    case 'REPS':
      parts.push(`${set.reps ?? 0} reps`);
      break;
  }

  return parts.join(' · ');
}
