import { describe, expect, it } from 'vitest';
import { getTestPrismaClient } from '../db-setup';

describe('Routine Integration Tests', () => {
  it('should retrieve all routines with exercise counts', async () => {
    const prisma = getTestPrismaClient();

    const routines = await prisma.routine.findMany({
      include: {
        _count: {
          select: { routineExercises: true },
        },
      },
    });

    expect(routines).toHaveLength(1);

    const strengthRoutine = routines.find((r) => r.label === 'Strength');
    expect(strengthRoutine).toBeDefined();
    expect(strengthRoutine?._count.routineExercises).toBe(12);
  });

  it('should retrieve a routine with ordered exercises', async () => {
    const prisma = getTestPrismaClient();

    const routine = await prisma.routine.findFirst({
      where: { label: 'Strength' },
      include: {
        routineExercises: {
          orderBy: { position: 'asc' },
          include: {
            exercise: true,
          },
        },
      },
    });

    expect(routine).toBeDefined();
    expect(routine?.routineExercises).toHaveLength(12);

    // Verify exercises are in the correct order (matching seed data order)
    const exerciseLabels = routine?.routineExercises.map((re) => re.exercise.label);
    expect(exerciseLabels).toEqual([
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
    ]);
  });

  it('should cascade delete routine exercises when exercise is deleted', async () => {
    const prisma = getTestPrismaClient();

    // Get initial count
    const initialCount = await prisma.routineExercise.count();
    expect(initialCount).toBe(12);

    // Delete one exercise
    const pullUp = await prisma.exercise.findFirst({
      where: { label: 'Pull up (assisted)' },
    });
    expect(pullUp).toBeDefined();

    await prisma.exercise.delete({
      where: { id: pullUp?.id },
    });

    // Verify routine exercise was also deleted
    const afterDeleteCount = await prisma.routineExercise.count();
    expect(afterDeleteCount).toBe(11);

    // Re-seed for other tests
    await prisma.exercise.create({
      data: {
        label: 'Pull up (assisted)',
        recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
      },
    });
  });
});
