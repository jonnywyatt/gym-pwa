import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { getTestPrismaClient } from '../db-setup';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('Workout Routes - DELETE', () => {
  let testUserId: number;
  let workoutId: number;

  function getToken(userId: number) {
    return jwt.sign({ userId, email: 'testuser@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  beforeEach(async () => {
    const prisma = getTestPrismaClient();
    const user = await prisma.user.upsert({
      where: { googleId: 'test-google-id-workouts' },
      update: { email: 'workoutuser@example.com', name: 'Workout User' },
      create: {
        googleId: 'test-google-id-workouts',
        email: 'workoutuser@example.com',
        name: 'Workout User',
      },
    });
    testUserId = user.id;

    const workout = await prisma.userWorkout.create({
      data: {
        userId: testUserId,
        routineId: 1,
        routineLabel: 'Test Routine',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        finishedAt: new Date('2025-01-15T11:00:00Z'),
        durationSeconds: 3600,
        totalWeightKg: 0,
        bodyWeightKg: 75,
      },
    });
    workoutId = workout.id;
  });

  afterEach(async () => {
    const prisma = getTestPrismaClient();
    await prisma.userWorkout.deleteMany({ where: { userId: testUserId } });
  });

  it('returns 204 on successful delete', async () => {
    const token = getToken(testUserId);

    const response = await request(app)
      .delete(`/users/${testUserId}/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const prisma = getTestPrismaClient();
    const deleted = await prisma.userWorkout.findFirst({ where: { id: workoutId } });
    expect(deleted).toBeNull();
  });

  it('returns 401 without auth', async () => {
    const response = await request(app).delete(`/users/${testUserId}/workouts/${workoutId}`);

    expect(response.status).toBe(401);
  });

  it('returns 403 for another user workout', async () => {
    const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const response = await request(app)
      .delete(`/users/${testUserId}/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(403);
  });

  it('returns 404 for non-existent workout', async () => {
    const token = getToken(testUserId);

    const response = await request(app)
      .delete(`/users/${testUserId}/workouts/999999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('returns 400 for invalid user ID', async () => {
    const token = getToken(1);

    const response = await request(app)
      .delete(`/users/abc/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('returns 400 for invalid workout ID', async () => {
    const token = getToken(testUserId);

    const response = await request(app)
      .delete(`/users/${testUserId}/workouts/abc`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
