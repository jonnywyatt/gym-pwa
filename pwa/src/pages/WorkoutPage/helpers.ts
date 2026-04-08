import type {
  BodyAreaDisplayName,
  CompletedSet,
  CompletedWorkoutExercise,
  CreateWorkoutRequest,
  MuscleGroupDisplayName,
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

export function isSetFilledIn(set: WorkoutSet, recordSetsType: RecordSetsType): boolean {
  const { showWeight, showReps, showTime } = getSetInputFields(recordSetsType);
  if (showWeight && set.weightKg === undefined) return false;
  if (showReps && set.reps === undefined) return false;
  if (showTime && set.timeSeconds === undefined) return false;
  return true;
}

export function calculateExerciseTotalWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  sets: WorkoutSet[]
): number {
  return sets.reduce(
    (total, set) => total + calculateSetWeightKg(recordSetsType, bodyWeightKg, set),
    0
  );
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
  return exercises.reduce(
    (total, exercise) =>
      total +
      calculateExerciseTotalWeightKg(exercise.recordSetsType, bodyWeightKg, exercise.sets ?? []),
    0
  );
}

const REPS_RECORD_TYPES: RecordSetsType[] = [
  'WEIGHT',
  'BODYWEIGHT_PLUS_WEIGHT',
  'BODYWEIGHT_MINUS_OFFSET',
  'REPS',
];

export function calculateWorkoutTotalReps(exercises: LocalWorkoutExercise[]): number {
  return exercises
    .filter((exercise) => exercise.completed && REPS_RECORD_TYPES.includes(exercise.recordSetsType))
    .reduce(
      (total, exercise) =>
        total + (exercise.sets ?? []).reduce((setTotal, set) => setTotal + (set.reps ?? 0), 0),
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
        .filter((set) => isSetFilledIn(set, exercise.recordSetsType))
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
    totalReps: calculateWorkoutTotalReps(workout.exercisesCompleted),
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

export type MuscleGroupScore = {
  muscleGroup: MuscleGroupDisplayName;
  bodyArea: BodyAreaDisplayName;
  percentage: number;
};

export type BodyAreaScore = {
  bodyArea: BodyAreaDisplayName;
  percentage: number;
};

export type MuscleGroupBreakdown = {
  muscleGroups: MuscleGroupScore[];
  bodyAreas: BodyAreaScore[];
};

const muscleGroupToBodyArea: Record<MuscleGroupDisplayName, BodyAreaDisplayName> = {
  'Pectoralis Major': 'Chest',
  'Pectoralis Minor': 'Chest',
  'Latissimus Dorsi': 'Back',
  Trapezius: 'Back',
  Rhomboids: 'Back',
  'Lower Back': 'Back',
  'Rear Deltoids': 'Shoulders',
  'Front Deltoids': 'Shoulders',
  Biceps: 'Arms',
  Triceps: 'Arms',
  Forearms: 'Arms',
  Abdominals: 'Core',
  Obliques: 'Core',
  Glutes: 'Legs',
  Hamstrings: 'Legs',
  Quadriceps: 'Legs',
  Adductors: 'Legs',
  Calves: 'Legs',
};

function calculateSetVolume(recordSetsType: RecordSetsType, set: WorkoutSet): number {
  switch (recordSetsType) {
    case 'WEIGHT':
    case 'BODYWEIGHT_PLUS_WEIGHT':
    case 'BODYWEIGHT_MINUS_OFFSET':
      return (set.weightKg ?? 0) * (set.reps ?? 0);
    case 'REPS':
      return set.reps ?? 0;
    case 'TIME':
      return set.timeSeconds ?? 0;
    case 'WEIGHT_AND_TIME':
      return (set.weightKg ?? 0) * (set.timeSeconds ?? 0);
  }
}

function calculateExerciseVolume(exercise: LocalWorkoutExercise): number {
  return (exercise.sets ?? []).reduce(
    (total, set) => total + calculateSetVolume(exercise.recordSetsType, set),
    0
  );
}

export function calculateMuscleGroupBreakdown(
  exercises: LocalWorkoutExercise[]
): MuscleGroupBreakdown {
  const scores = new Map<MuscleGroupDisplayName, number>();

  for (const exercise of exercises) {
    const volume = calculateExerciseVolume(exercise);
    if (volume === 0) continue;

    const primaryGroups = exercise.primaryMuscleGroups;
    const secondaryGroups = exercise.secondaryMuscleGroups;

    const effectivePrimary = primaryGroups.length > 0 ? primaryGroups : secondaryGroups;
    const effectiveSecondary = primaryGroups.length > 0 ? secondaryGroups : [];

    if (effectivePrimary.length > 0) {
      const sharePerPrimary = volume / effectivePrimary.length;
      for (const mg of effectivePrimary) {
        scores.set(mg, (scores.get(mg) ?? 0) + sharePerPrimary);
      }
    }

    if (effectiveSecondary.length > 0) {
      const sharePerSecondary = (volume * 0.5) / effectiveSecondary.length;
      for (const mg of effectiveSecondary) {
        scores.set(mg, (scores.get(mg) ?? 0) + sharePerSecondary);
      }
    }
  }

  const totalScore = Array.from(scores.values()).reduce((sum, v) => sum + v, 0);

  if (totalScore === 0) {
    return { muscleGroups: [], bodyAreas: [] };
  }

  const muscleGroups: MuscleGroupScore[] = Array.from(scores.entries())
    .map(([muscleGroup, score]) => ({
      muscleGroup,
      bodyArea: muscleGroupToBodyArea[muscleGroup],
      percentage: Math.round((score / totalScore) * 1000) / 10,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const bodyAreaTotals = new Map<BodyAreaDisplayName, number>();
  for (const { bodyArea, percentage } of muscleGroups) {
    bodyAreaTotals.set(bodyArea, (bodyAreaTotals.get(bodyArea) ?? 0) + percentage);
  }

  const bodyAreas: BodyAreaScore[] = Array.from(bodyAreaTotals.entries())
    .map(([bodyArea, percentage]) => ({
      bodyArea,
      percentage: Math.round(percentage * 10) / 10,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return { muscleGroups, bodyAreas };
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
