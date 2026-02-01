import type { Exercise } from '../../src/prisma-client';
import { MuscleGroupLabel, RecordSetsType } from '../../src/prisma-client';

type ExerciseSeed = Pick<Exercise, 'label' | 'recordSetsType'> & {
  primaryMuscleGroupLabels: MuscleGroupLabel[];
  secondaryMuscleGroupLabels: MuscleGroupLabel[];
};

export const exercises: ExerciseSeed[] = [
  {
    label: 'Pull up (assisted)',
    recordSetsType: RecordSetsType.WEIGHT_OFFSET_FROM_BODY,
    primaryMuscleGroupLabels: [MuscleGroupLabel.LATISSIMUS_DORSI, MuscleGroupLabel.BICEPS],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.RHOMBOIDS,
      MuscleGroupLabel.TRAPEZIUS,
      MuscleGroupLabel.REAR_DELTOIDS,
      MuscleGroupLabel.FOREARMS,
      MuscleGroupLabel.ABDOMINALS,
    ],
  },
  {
    label: 'Chest press (machine)',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.PECTORALIS_MAJOR,
      MuscleGroupLabel.FRONT_DELTOIDS,
      MuscleGroupLabel.TRICEPS,
    ],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.PECTORALIS_MINOR, MuscleGroupLabel.ABDOMINALS],
  },
];
