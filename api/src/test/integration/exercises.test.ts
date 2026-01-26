import { describe, expect, it } from 'vitest';
import { getTestPrismaClient } from '../db-setup';

describe('Exercise Integration Tests', () => {
  it('should create and retrieve an exercise', async () => {
    const prisma = getTestPrismaClient();

    // Create an exercise
    const created = await prisma.exercise.create({
      data: {
        name: 'Test Exercise',
      },
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Test Exercise');

    // Retrieve the exercise
    const found = await prisma.exercise.findUnique({
      where: { id: created.id },
    });

    expect(found).toBeDefined();
    expect(found?.name).toBe('Test Exercise');
  });

  it('should list all exercises', async () => {
    const prisma = getTestPrismaClient();

    // Create multiple exercises
    await prisma.exercise.createMany({
      data: [{ name: 'Exercise 1' }, { name: 'Exercise 2' }, { name: 'Exercise 3' }],
    });

    // Retrieve all exercises
    const exercises = await prisma.exercise.findMany();

    expect(exercises).toHaveLength(3);
    expect(exercises.map((e) => e.name)).toEqual(['Exercise 1', 'Exercise 2', 'Exercise 3']);
  });

  it('should start with a clean database', async () => {
    const prisma = getTestPrismaClient();

    // This should be empty due to beforeEach cleanup
    const exercises = await prisma.exercise.findMany();

    expect(exercises).toHaveLength(0);
  });
});
