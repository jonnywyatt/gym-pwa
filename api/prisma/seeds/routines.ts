import type { Routine } from '../../src/prisma-client';

type RoutineSeed = Pick<Routine, 'label'> & {
  exerciseLabels: string[];
};

export const routines: RoutineSeed[] = [
  {
    label: 'Upper body',
    exerciseLabels: [
      'Pull up (assisted)',
      'Chest press machine',
      'Butterfly machine',
      'Lat pulldown',
      'Seated row',
      'Shoulder press (dumbell)',
      'Concentration curl',
      'Dead hang',
      "Farmer's carry",
    ],
  },
  {
    label: 'Lower body',
    exerciseLabels: [
      'Reverse lunge',
      'Box jump',
      'Box jump (single leg)',
      'Bulgarian split squat',
      'Calf raise (single leg)',
      'Sit-to-stand (single leg)',
    ],
  },
  {
    label: 'Core',
    exerciseLabels: ['Plank', 'Side plank', 'Reverse crunch', 'Bird dog'],
  },
];
