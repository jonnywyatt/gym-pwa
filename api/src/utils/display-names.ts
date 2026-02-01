import { BodyAreaLabel, MuscleGroupLabel } from '../prisma-client';

export const bodyAreaDisplayNames: Record<BodyAreaLabel, string> = {
  [BodyAreaLabel.CHEST]: 'Chest',
  [BodyAreaLabel.BACK]: 'Back',
  [BodyAreaLabel.SHOULDERS]: 'Shoulders',
  [BodyAreaLabel.ARMS]: 'Arms',
  [BodyAreaLabel.CORE]: 'Core',
  [BodyAreaLabel.LEGS]: 'Legs',
} as const;

export const muscleGroupDisplayNames: Record<MuscleGroupLabel, string> = {
  [MuscleGroupLabel.PECTORALIS_MAJOR]: 'Pectoralis Major',
  [MuscleGroupLabel.PECTORALIS_MINOR]: 'Pectoralis Minor',
  [MuscleGroupLabel.LATISSIMUS_DORSI]: 'Latissimus Dorsi',
  [MuscleGroupLabel.TRAPEZIUS]: 'Trapezius',
  [MuscleGroupLabel.RHOMBOIDS]: 'Rhomboids',
  [MuscleGroupLabel.LOWER_BACK]: 'Lower Back',
  [MuscleGroupLabel.REAR_DELTOIDS]: 'Rear Deltoids',
  [MuscleGroupLabel.FRONT_DELTOIDS]: 'Front Deltoids',
  [MuscleGroupLabel.BICEPS]: 'Biceps',
  [MuscleGroupLabel.TRICEPS]: 'Triceps',
  [MuscleGroupLabel.FOREARMS]: 'Forearms',
  [MuscleGroupLabel.ABDOMINALS]: 'Abdominals',
  [MuscleGroupLabel.OBLIQUES]: 'Obliques',
  [MuscleGroupLabel.GLUTES]: 'Glutes',
  [MuscleGroupLabel.HAMSTRINGS]: 'Hamstrings',
  [MuscleGroupLabel.QUADRICEPS]: 'Quadriceps',
  [MuscleGroupLabel.CALVES]: 'Calves',
} as const;

/**
 * Union type of all valid body area display names
 * e.g., "Chest" | "Back" | "Shoulders" | ...
 */
export type BodyAreaDisplayName = (typeof bodyAreaDisplayNames)[BodyAreaLabel];

/**
 * Union type of all valid muscle group display names
 * e.g., "Pectoralis Major" | "Biceps" | "Latissimus Dorsi" | ...
 */
export type MuscleGroupDisplayName = (typeof muscleGroupDisplayNames)[MuscleGroupLabel];
