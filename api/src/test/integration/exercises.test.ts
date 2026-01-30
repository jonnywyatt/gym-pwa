import { describe, expect, it } from 'vitest';
import { getTestPrismaClient } from '../db-setup';

describe('Exercise Integration Tests', () => {
  it('should retrieve default exercises', async () => {
    const prisma = getTestPrismaClient();

    // Retrieve all exercises
    const exercises = await prisma.exercise.findMany();

    expect(exercises).toHaveLength(1);
    expect(exercises.map((e) => e.name)).toEqual(['Assisted pull up']);
  });
});
