import type {
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

export function createDefaultSets(): WorkoutSet[] {
  return [
    {
      id: crypto.randomUUID(),
      setType: 'Warmup',
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      setType: 'Normal',
      completed: false,
    },
  ];
}

export function createNewSet(): WorkoutSet {
  return {
    id: crypto.randomUUID(),
    setType: 'Normal',
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
      return { showWeight: true, showReps: true, showTime: false, weightLabel: 'Offset' };
    case 'WEIGHT_AND_TIME':
      return { showWeight: true, showReps: false, showTime: true, weightLabel: 'Kg' };
    case 'TIME':
      return { showWeight: false, showReps: false, showTime: true, weightLabel: '' };
  }
}

export function calculateSetWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  set: WorkoutSet
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

export function calculateWorkoutTotalWeightKg(exercises: LocalWorkoutExercise[]): number {
  return exercises
    .filter((exercise) => exercise.completed && exercise.totalWeightKg !== undefined)
    .reduce((total, exercise) => total + (exercise.totalWeightKg ?? 0), 0);
}

export function startExercise(exercise: LocalWorkoutExercise): LocalWorkoutExercise {
  return {
    ...exercise,
    startedAt: new Date().toISOString(),
    sets: createDefaultSets(),
  };
}

export function finishExercise(
  exercise: LocalWorkoutExercise,
  bodyWeightKg: number
): LocalWorkoutExercise {
  const completedSets = (exercise.sets ?? []).filter((set) => set.completed);
  const totalWeightKg = calculateExerciseTotalWeightKg(
    exercise.recordSetsType,
    bodyWeightKg,
    exercise.sets ?? []
  );

  return {
    ...exercise,
    completed: true,
    sets: completedSets,
    totalWeightKg,
  };
}

export function discardExercise(exercise: LocalWorkoutExercise): LocalWorkoutExercise {
  return {
    ...exercise,
    completed: false,
    startedAt: undefined,
    sets: undefined,
    totalWeightKg: undefined,
  };
}

export function getCompletedExercises(
  exercises: LocalWorkoutExercise[]
): CompletedWorkoutExercise[] {
  return exercises
    .filter((ex) => ex.completed)
    .map(({ completed, startedAt, ...exercise }) => ({
      ...exercise,
      sets: (exercise.sets ?? []).map(({ id, completed: setCompleted, ...set }) => set),
      totalWeightKg: exercise.totalWeightKg ?? 0,
    }));
}

export function createWorkoutPayload(
  workout: LocalWorkout,
  finishedAt: string,
  durationSeconds: number
): CreateWorkoutRequest {
  const completedExercises = getCompletedExercises(workout.exercisesCompleted);
  const totalWeightKg = completedExercises.reduce((sum, ex) => sum + ex.totalWeightKg, 0);

  return {
    routineId: workout.routineId,
    routineLabel: workout.routineLabel,
    startedAt: workout.startedAt,
    finishedAt,
    durationSeconds,
    exercisesCompleted: completedExercises,
    bodyWeightKg: workout.bodyWeightKg,
    totalWeightKg,
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
