import type { RecordSetsType } from '../../src/prisma-client';

export const UPPER_BODY_EXERCISE_LABELS = [
  'Pull up (assisted)',
  'Chest press machine',
  'Dead hang',
  "Farmer's carry",
  'Butterfly machine',
  'Lat pulldown',
  'Seated row',
  'Shoulder press (dumbell)',
];

export const LOWER_BODY_EXERCISE_LABELS = [
  'Single leg sit-to-stand',
  'Bulgarian split squat',
  'Reverse lunge',
  'Box jump',
  'Single leg box jump',
];

export type SplitSet = {
  weightKg?: number;
  reps?: number;
};

export type SplitExercise = {
  recordSetsType: RecordSetsType;
  bwFactor: number | null;
  sets: SplitSet[];
};

const REPS_RECORD_TYPES: RecordSetsType[] = [
  'WEIGHT',
  'BODYWEIGHT_PLUS_WEIGHT',
  'BODYWEIGHT_MINUS_OFFSET',
  'REPS',
];

export function calculateSetWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  set: SplitSet,
  bwFactor: number | null
): number {
  const weightKg = set.weightKg ?? 0;
  const reps = set.reps ?? 0;
  const bwContribution = bwFactor !== null ? bodyWeightKg * bwFactor : 0;

  switch (recordSetsType) {
    case 'WEIGHT':
      return (weightKg + bwContribution) * reps;
    case 'BODYWEIGHT_PLUS_WEIGHT':
      return (bodyWeightKg + weightKg) * reps;
    case 'BODYWEIGHT_MINUS_OFFSET':
      return (bodyWeightKg - weightKg) * reps;
    case 'WEIGHT_AND_TIME':
      return weightKg;
    case 'TIME':
      return 0;
    case 'REPS':
      return bwContribution * reps;
  }
}

export function calculateExercisesTotalWeightKg(
  exercises: SplitExercise[],
  bodyWeightKg: number
): number {
  const total = exercises.reduce(
    (sum, exercise) =>
      sum +
      exercise.sets.reduce(
        (setSum, set) =>
          setSum +
          calculateSetWeightKg(exercise.recordSetsType, bodyWeightKg, set, exercise.bwFactor),
        0
      ),
    0
  );
  return Math.round(total);
}

export function calculateExercisesTotalReps(exercises: SplitExercise[]): number {
  return exercises
    .filter((exercise) => REPS_RECORD_TYPES.includes(exercise.recordSetsType))
    .reduce(
      (total, exercise) =>
        total + exercise.sets.reduce((setTotal, set) => setTotal + (set.reps ?? 0), 0),
      0
    );
}

export function calculateSplitDurationSeconds(
  originalDurationSeconds: number | null,
  sideSetCount: number,
  totalSetCount: number
): number | undefined {
  if (originalDurationSeconds === null || totalSetCount === 0) return undefined;
  return Math.round(originalDurationSeconds * (sideSetCount / totalSetCount));
}
