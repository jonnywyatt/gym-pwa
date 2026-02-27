import type { Exercise } from '../../src/prisma-client';
import { MuscleGroupLabel, RecordSetsType } from '../../src/prisma-client';

type ExerciseSeed = Pick<Exercise, 'label' | 'recordSetsType'> & {
  primaryMuscleGroupLabels: MuscleGroupLabel[];
  secondaryMuscleGroupLabels: MuscleGroupLabel[];
};

export const exercises: ExerciseSeed[] = [
  {
    label: 'Pull up (assisted)',
    recordSetsType: RecordSetsType.BODYWEIGHT_MINUS_OFFSET,
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
    label: 'Chest press machine',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.PECTORALIS_MAJOR,
      MuscleGroupLabel.FRONT_DELTOIDS,
      MuscleGroupLabel.TRICEPS,
    ],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.PECTORALIS_MINOR, MuscleGroupLabel.ABDOMINALS],
  },
  {
    label: 'Dead hang',
    recordSetsType: RecordSetsType.TIME,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.LATISSIMUS_DORSI,
      MuscleGroupLabel.RHOMBOIDS,
      MuscleGroupLabel.TRAPEZIUS,
      MuscleGroupLabel.FOREARMS,
    ],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.REAR_DELTOIDS,
      MuscleGroupLabel.BICEPS,
      MuscleGroupLabel.LOWER_BACK,
    ],
  },
  {
    label: "Farmer's carry",
    recordSetsType: RecordSetsType.WEIGHT_AND_TIME,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.RHOMBOIDS,
      MuscleGroupLabel.TRAPEZIUS,
      MuscleGroupLabel.FOREARMS,
      MuscleGroupLabel.REAR_DELTOIDS,
      MuscleGroupLabel.ABDOMINALS,
    ],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.QUADRICEPS,
      MuscleGroupLabel.GLUTES,
      MuscleGroupLabel.HAMSTRINGS,
      MuscleGroupLabel.CALVES,
    ],
  },
  {
    label: 'Butterfly machine',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.PECTORALIS_MAJOR,
      MuscleGroupLabel.PECTORALIS_MINOR,
    ],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.FRONT_DELTOIDS],
  },
  {
    label: 'Lat pulldown',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.LATISSIMUS_DORSI],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.RHOMBOIDS,
      MuscleGroupLabel.TRAPEZIUS,
      MuscleGroupLabel.REAR_DELTOIDS,
    ],
  },
  {
    label: 'Leg press horizontal machine',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.QUADRICEPS, MuscleGroupLabel.GLUTES],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.HAMSTRINGS, MuscleGroupLabel.ADDUCTORS],
  },
  {
    label: 'Seated row',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.RHOMBOIDS, MuscleGroupLabel.TRAPEZIUS],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.REAR_DELTOIDS,
      MuscleGroupLabel.LATISSIMUS_DORSI,
      MuscleGroupLabel.BICEPS,
    ],
  },
  {
    label: 'Shoulder press (dumbell)',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.FRONT_DELTOIDS, MuscleGroupLabel.TRICEPS],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.TRAPEZIUS, MuscleGroupLabel.PECTORALIS_MAJOR],
  },
  {
    label: 'Single leg sit-to-stand',
    recordSetsType: RecordSetsType.BODYWEIGHT_PLUS_WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.QUADRICEPS, MuscleGroupLabel.GLUTES],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.HAMSTRINGS, MuscleGroupLabel.CALVES],
  },
  {
    label: 'Bulgarian split squat',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [MuscleGroupLabel.QUADRICEPS, MuscleGroupLabel.GLUTES],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.HAMSTRINGS,
      MuscleGroupLabel.CALVES,
      MuscleGroupLabel.ADDUCTORS,
      MuscleGroupLabel.ABDOMINALS,
      MuscleGroupLabel.LOWER_BACK,
    ],
  },
  {
    label: 'Reverse lunge',
    recordSetsType: RecordSetsType.WEIGHT,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.QUADRICEPS,
      MuscleGroupLabel.GLUTES,
      MuscleGroupLabel.HAMSTRINGS,
    ],
    secondaryMuscleGroupLabels: [
      MuscleGroupLabel.CALVES,
      MuscleGroupLabel.ADDUCTORS,
      MuscleGroupLabel.ABDOMINALS,
      MuscleGroupLabel.LOWER_BACK,
    ],
  },
  {
    label: 'Plank',
    recordSetsType: RecordSetsType.TIME,
    primaryMuscleGroupLabels: [MuscleGroupLabel.ABDOMINALS, MuscleGroupLabel.OBLIQUES],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.LOWER_BACK, MuscleGroupLabel.GLUTES],
  },
  {
    label: 'Side plank',
    recordSetsType: RecordSetsType.TIME,
    primaryMuscleGroupLabels: [MuscleGroupLabel.OBLIQUES],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.LOWER_BACK, MuscleGroupLabel.ADDUCTORS],
  },
  {
    label: 'Reverse crunch',
    recordSetsType: RecordSetsType.REPS,
    primaryMuscleGroupLabels: [MuscleGroupLabel.OBLIQUES],
    secondaryMuscleGroupLabels: [MuscleGroupLabel.LOWER_BACK, MuscleGroupLabel.ADDUCTORS],
  },
  {
    label: 'Superman',
    recordSetsType: RecordSetsType.REPS,
    primaryMuscleGroupLabels: [
      MuscleGroupLabel.LOWER_BACK,
      MuscleGroupLabel.GLUTES,
      MuscleGroupLabel.HAMSTRINGS,
      MuscleGroupLabel.RHOMBOIDS,
    ],
    secondaryMuscleGroupLabels: [],
  },
];
