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

    expect(routines).toHaveLength(3);

    const upperBodyRoutine = routines.find((r) => r.label === 'Upper body');
    expect(upperBodyRoutine).toBeDefined();
    expect(upperBodyRoutine?._count.routineExercises).toBe(8);

    const lowerBodyRoutine = routines.find((r) => r.label === 'Lower body');
    expect(lowerBodyRoutine).toBeDefined();
    expect(lowerBodyRoutine?._count.routineExercises).toBe(5);

    const coreRoutine = routines.find((r) => r.label === 'Core');
    expect(coreRoutine).toBeDefined();
    expect(coreRoutine?._count.routineExercises).toBe(4);
  });

  it('should retrieve a routine with ordered exercises', async () => {
    const prisma = getTestPrismaClient();

    const routine = await prisma.routine.findFirst({
      where: { label: 'Upper body' },
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
    expect(routine?.routineExercises).toHaveLength(8);

    // Verify exercises are in the correct order (matching seed data order)
    const exerciseLabels = routine?.routineExercises.map((re) => re.exercise.label);
    expect(exerciseLabels).toEqual([
      'Pull up (assisted)',
      'Chest press machine',
      'Dead hang',
      "Farmer's carry",
      'Butterfly machine',
      'Lat pulldown',
      'Seated row',
      'Shoulder press (dumbell)',
    ]);
  });

  it('should cascade delete routine exercises when exercise is deleted', async () => {
    const prisma = getTestPrismaClient();

    // Create a temporary exercise and add it to the routine
    const tempExercise = await prisma.exercise.create({
      data: {
        label: 'Temp exercise for cascade test',
        recordSetsType: 'WEIGHT',
      },
    });

    const routine = await prisma.routine.findFirstOrThrow({
      where: { label: 'Upper body' },
    });

    await prisma.routineExercise.create({
      data: {
        routineId: routine.id,
        exerciseId: tempExercise.id,
        position: 99,
      },
    });

    const initialCount = await prisma.routineExercise.count();
    expect(initialCount).toBe(18);

    // Delete the temporary exercise
    await prisma.exercise.delete({
      where: { id: tempExercise.id },
    });

    // Verify routine exercise was also deleted
    const afterDeleteCount = await prisma.routineExercise.count();
    expect(afterDeleteCount).toBe(17);
  });
});
