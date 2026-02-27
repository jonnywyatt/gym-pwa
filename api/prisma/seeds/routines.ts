import type { Routine } from '../../src/prisma-client';

type RoutineSeed = Pick<Routine, 'label'> & {
  exerciseLabels: string[];
};

export const routines: RoutineSeed[] = [
  {
    label: 'Strength',
    exerciseLabels: [
      'Pull up (assisted)',
      'Chest press machine',
      'Dead hang',
      "Farmer's carry",
      'Butterfly machine',
      'Lat pulldown',
      'Leg press horizontal machine',
      'Seated row',
      'Shoulder press (dumbell)',
      'Single leg sit-to-stand',
      'Bulgarian split squat',
      'Reverse lunge',
    ],
  },
  {
    label: 'Abs',
    exerciseLabels: ['Plank', 'Side plank', 'Reverse crunch', 'Superman'],
  },
];
