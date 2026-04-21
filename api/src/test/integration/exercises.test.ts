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

    expect(exercises).toHaveLength(39);

    const pullUp = exercises.find((e) => e.label === 'Pull up (assisted)');
    expect(pullUp).toBeDefined();
    expect(
      pullUp?.primaryMuscleGroups
        .map((pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label])
        .sort()
    ).toEqual(['Latissimus Dorsi']);
    expect(
      pullUp?.secondaryMuscleGroups
        .map((smg) => muscleGroupDisplayNames[smg.muscleGroup.label])
        .sort()
    ).toEqual(['Biceps', 'Rhomboids']);

    const chestPress = exercises.find((e) => e.label === 'Chest press machine');
    expect(chestPress).toBeDefined();
    expect(
      chestPress?.primaryMuscleGroups
        .map((pmg) => muscleGroupDisplayNames[pmg.muscleGroup.label])
        .sort()
    ).toEqual(['Pectoralis Major']);
    expect(
      chestPress?.secondaryMuscleGroups
        .map((smg) => muscleGroupDisplayNames[smg.muscleGroup.label])
        .sort()
    ).toEqual(['Triceps']);
  });
});
