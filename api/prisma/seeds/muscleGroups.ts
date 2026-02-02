import type { MuscleGroup } from '../../src/prisma-client';
import { BodyAreaLabel, MuscleGroupLabel } from '../../src/prisma-client';

type MuscleGroupSeed = Pick<MuscleGroup, 'label'> & {
  bodyAreaLabel: BodyAreaLabel;
};

export const muscleGroups: MuscleGroupSeed[] = [
  // Chest
  { label: MuscleGroupLabel.PECTORALIS_MAJOR, bodyAreaLabel: BodyAreaLabel.CHEST },
  { label: MuscleGroupLabel.PECTORALIS_MINOR, bodyAreaLabel: BodyAreaLabel.CHEST },
  // Back
  { label: MuscleGroupLabel.LATISSIMUS_DORSI, bodyAreaLabel: BodyAreaLabel.BACK },
  { label: MuscleGroupLabel.TRAPEZIUS, bodyAreaLabel: BodyAreaLabel.BACK },
  { label: MuscleGroupLabel.RHOMBOIDS, bodyAreaLabel: BodyAreaLabel.BACK },
  { label: MuscleGroupLabel.LOWER_BACK, bodyAreaLabel: BodyAreaLabel.BACK },
  // Shoulders
  { label: MuscleGroupLabel.REAR_DELTOIDS, bodyAreaLabel: BodyAreaLabel.SHOULDERS },
  { label: MuscleGroupLabel.FRONT_DELTOIDS, bodyAreaLabel: BodyAreaLabel.SHOULDERS },
  // Arms
  { label: MuscleGroupLabel.BICEPS, bodyAreaLabel: BodyAreaLabel.ARMS },
  { label: MuscleGroupLabel.TRICEPS, bodyAreaLabel: BodyAreaLabel.ARMS },
  { label: MuscleGroupLabel.FOREARMS, bodyAreaLabel: BodyAreaLabel.ARMS },
  // Core
  { label: MuscleGroupLabel.ABDOMINALS, bodyAreaLabel: BodyAreaLabel.CORE },
  { label: MuscleGroupLabel.OBLIQUES, bodyAreaLabel: BodyAreaLabel.CORE },
  // Legs
  { label: MuscleGroupLabel.GLUTES, bodyAreaLabel: BodyAreaLabel.LEGS },
  { label: MuscleGroupLabel.HAMSTRINGS, bodyAreaLabel: BodyAreaLabel.LEGS },
  { label: MuscleGroupLabel.QUADRICEPS, bodyAreaLabel: BodyAreaLabel.LEGS },
  { label: MuscleGroupLabel.ADDUCTORS, bodyAreaLabel: BodyAreaLabel.LEGS },
  { label: MuscleGroupLabel.CALVES, bodyAreaLabel: BodyAreaLabel.LEGS },
];
