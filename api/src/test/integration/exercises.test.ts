import { describe, expect, it } from 'vitest';
import { muscleGroupDisplayNames } from '../../utils/display-names';
import { getTestPrismaClient } from '../db-setup';

describe('Exercise Integration Tests', () => {
  it('should retrieve default exercises with muscle groups', async () => {
    const prisma = getTestPrismaClient();

    // Retrieve all exercises with muscle groups
    const exercises = await prisma.exercise.findMany({
      include: {
        primaryMuscleGroups: {
          include: {
            muscleGroup: true,
          },
        },
        secondaryMuscleGroups: {
          include: {
            muscleGroup: true,
          },
        },
      },
    });

    expect(exercises).toHaveLength(12);

    const pullUp = exercises.find((e) => e.label === 'Pull up (assisted)');
    console.log('DEBUG: pullUp found:', !!pullUp);
    if (pullUp) {
      console.log('DEBUG: pullUp.primaryMuscleGroups.length:', pullUp.primaryMuscleGroups.length);
      console.log(
        'DEBUG: pullUp.primaryMuscleGroups:',
        JSON.stringify(pullUp.primaryMuscleGroups, null, 2)
      );
    }
    expect(pullUp).toBeDefined();
    expect(
      pullUp?.primaryMuscleGroups
        .map((pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label])
        .sort()
    ).toEqual(['Biceps', 'Latissimus Dorsi']);
    expect(
      pullUp?.secondaryMuscleGroups
        .map((smg) => muscleGroupDisplayNames[smg.muscleGroup.label])
        .sort()
    ).toEqual(['Abdominals', 'Forearms', 'Rear Deltoids', 'Rhomboids', 'Trapezius']);

    const chestPress = exercises.find((e) => e.label === 'Chest press machine');
    expect(chestPress).toBeDefined();
    expect(
      chestPress?.primaryMuscleGroups
        .map((pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label])
        .sort()
    ).toEqual(['Front Deltoids', 'Pectoralis Major', 'Triceps']);
    expect(
      chestPress?.secondaryMuscleGroups
        .map((smg) => muscleGroupDisplayNames[smg.muscleGroup.label])
        .sort()
    ).toEqual(['Abdominals', 'Pectoralis Minor']);
  });
});
