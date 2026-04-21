import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { getTestPrismaClient } from '../db-setup';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('Routines API Routes', () => {
  let testUserId: number;
  let userRoutineId: number;

  function getToken(userId: number) {
    return jwt.sign({ userId, email: 'testuser@example.com' }, JWT_SECRET, { expiresIn: '1h' });
  }

  beforeEach(async () => {
    const prisma = getTestPrismaClient();
    const user = await prisma.user.upsert({
      where: { googleId: 'test-google-id-routines-api' },
      update: { email: 'routinesapi@example.com', name: 'Routines API User' },
      create: {
        googleId: 'test-google-id-routines-api',
        email: 'routinesapi@example.com',
        name: 'Routines API User',
      },
    });
    testUserId = user.id;

    const routine = await prisma.routine.create({
      data: { userId: testUserId, label: 'My Test Routine' },
    });
    userRoutineId = routine.id;
  });

  afterEach(async () => {
    const prisma = getTestPrismaClient();
    await prisma.routine.deleteMany({ where: { userId: testUserId } });
  });

  describe('GET /routines', () => {
    it('returns public routines and user routines', async () => {
      const token = getToken(testUserId);
      const response = await request(app).get('/routines').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const labels = response.body.map((r: { label: string }) => r.label);
      expect(labels).toContain('Strength');
      expect(labels).toContain('Core');
      expect(labels).toContain('My Test Routine');
    });

    it('includes userId on each routine', async () => {
      const token = getToken(testUserId);
      const response = await request(app).get('/routines').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const userRoutine = response.body.find(
        (r: { label: string }) => r.label === 'My Test Routine'
      );
      expect(userRoutine.userId).toBe(testUserId);

      const publicRoutine = response.body.find((r: { label: string }) => r.label === 'Strength');
      expect(publicRoutine.userId).toBeNull();
    });

    it("does not return another user's private routines", async () => {
      const prisma = getTestPrismaClient();
      const otherUser = await prisma.user.upsert({
        where: { googleId: 'test-google-id-other-routines' },
        update: {},
        create: {
          googleId: 'test-google-id-other-routines',
          email: 'other@example.com',
          name: 'Other User',
        },
      });
      await prisma.routine.create({
        data: { userId: otherUser.id, label: 'Other user routine' },
      });

      const token = getToken(testUserId);
      const response = await request(app).get('/routines').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const labels = response.body.map((r: { label: string }) => r.label);
      expect(labels).not.toContain('Other user routine');

      await prisma.routine.deleteMany({ where: { userId: otherUser.id } });
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).get('/routines');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /routines', () => {
    it('creates a new empty routine and returns its id', async () => {
      const token = getToken(testUserId);
      const response = await request(app).post('/routines').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(typeof response.body.id).toBe('number');

      const prisma = getTestPrismaClient();
      const created = await prisma.routine.findUnique({ where: { id: response.body.id } });
      expect(created).not.toBeNull();
      expect(created?.userId).toBe(testUserId);
      expect(created?.label).toBeNull();

      await prisma.routine.delete({ where: { id: response.body.id } });
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).post('/routines');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /routines/:routineId/label', () => {
    it('updates the routine label and returns 204', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .patch(`/routines/${userRoutineId}/label`)
        .set('Authorization', `Bearer ${token}`)
        .send({ label: 'Updated Routine Name' });

      expect(response.status).toBe(204);

      const prisma = getTestPrismaClient();
      const updated = await prisma.routine.findUnique({ where: { id: userRoutineId } });
      expect(updated?.label).toBe('Updated Routine Name');
    });

    it('returns 403 for a public routine', async () => {
      const prisma = getTestPrismaClient();
      const publicRoutine = await prisma.routine.findFirstOrThrow({ where: { userId: null } });
      const token = getToken(testUserId);

      const response = await request(app)
        .patch(`/routines/${publicRoutine.id}/label`)
        .set('Authorization', `Bearer ${token}`)
        .send({ label: 'Hacked' });

      expect(response.status).toBe(403);
    });

    it('returns 404 for non-existent routine', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .patch('/routines/999999/label')
        .set('Authorization', `Bearer ${token}`)
        .send({ label: 'Test' });

      expect(response.status).toBe(404);
    });

    it('returns 400 when label is not a string', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .patch(`/routines/${userRoutineId}/label`)
        .set('Authorization', `Bearer ${token}`)
        .send({ label: 123 });

      expect(response.status).toBe(400);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app)
        .patch(`/routines/${userRoutineId}/label`)
        .send({ label: 'Test' });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /routines/:routineId/exercises', () => {
    it('adds an exercise to the routine and returns 204', async () => {
      const prisma = getTestPrismaClient();
      const exercise = await prisma.exercise.findFirstOrThrow();
      const token = getToken(testUserId);

      const response = await request(app)
        .post(`/routines/${userRoutineId}/exercises`)
        .set('Authorization', `Bearer ${token}`)
        .send({ exerciseId: exercise.id });

      expect(response.status).toBe(204);

      const routineExercise = await prisma.routineExercise.findUnique({
        where: { routineId_exerciseId: { routineId: userRoutineId, exerciseId: exercise.id } },
      });
      expect(routineExercise).not.toBeNull();
    });

    it("returns 403 for another user's routine", async () => {
      const prisma = getTestPrismaClient();
      const exercise = await prisma.exercise.findFirstOrThrow();
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const response = await request(app)
        .post(`/routines/${userRoutineId}/exercises`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ exerciseId: exercise.id });

      expect(response.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app)
        .post(`/routines/${userRoutineId}/exercises`)
        .send({ exerciseId: 1 });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /routines/:routineId/exercises/:exerciseId', () => {
    it('removes an exercise from the routine and returns 204', async () => {
      const prisma = getTestPrismaClient();
      const exercise = await prisma.exercise.findFirstOrThrow();

      await prisma.routineExercise.create({
        data: { routineId: userRoutineId, exerciseId: exercise.id, position: 0 },
      });

      const token = getToken(testUserId);
      const response = await request(app)
        .delete(`/routines/${userRoutineId}/exercises/${exercise.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const routineExercise = await prisma.routineExercise.findUnique({
        where: { routineId_exerciseId: { routineId: userRoutineId, exerciseId: exercise.id } },
      });
      expect(routineExercise).toBeNull();
    });

    it("returns 403 for another user's routine", async () => {
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const response = await request(app)
        .delete(`/routines/${userRoutineId}/exercises/1`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).delete(`/routines/${userRoutineId}/exercises/1`);
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /routines/:routineId', () => {
    it('deletes the routine and returns 204', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .delete(`/routines/${userRoutineId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const prisma = getTestPrismaClient();
      const deleted = await prisma.routine.findUnique({ where: { id: userRoutineId } });
      expect(deleted).toBeNull();
    });

    it('returns 403 for a public routine', async () => {
      const prisma = getTestPrismaClient();
      const publicRoutine = await prisma.routine.findFirstOrThrow({ where: { userId: null } });
      const token = getToken(testUserId);

      const response = await request(app)
        .delete(`/routines/${publicRoutine.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('returns 404 for non-existent routine', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .delete('/routines/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).delete(`/routines/${userRoutineId}`);
      expect(response.status).toBe(401);
    });
  });
});
