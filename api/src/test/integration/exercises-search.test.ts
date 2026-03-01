import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { getTestPrismaClient } from '../db-setup';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('Exercises Routes', () => {
  let testUserId: number;

  function getToken(userId: number) {
    return jwt.sign({ userId, email: 'testuser@example.com' }, JWT_SECRET, { expiresIn: '1h' });
  }

  beforeEach(async () => {
    const prisma = getTestPrismaClient();
    const user = await prisma.user.upsert({
      where: { googleId: 'test-google-id-exercises' },
      update: {},
      create: {
        googleId: 'test-google-id-exercises',
        email: 'exercises@example.com',
        name: 'Exercises User',
      },
    });
    testUserId = user.id;
  });

  describe('GET /exercises', () => {
    it('returns all exercises when no search param', async () => {
      const token = getToken(testUserId);
      const response = await request(app).get('/exercises').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('returns matching exercises for a search term', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .get('/exercises?search=plank')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const labels: string[] = response.body.map((e: { label: string }) => e.label.toLowerCase());
      expect(labels.every((l) => l.includes('plank'))).toBe(true);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('returns empty array when no exercises match search', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .get('/exercises?search=xyznonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns exercises with muscle groups included', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .get('/exercises?search=plank')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const exercise = response.body[0];
      expect(Array.isArray(exercise.primaryMuscleGroups)).toBe(true);
      expect(Array.isArray(exercise.secondaryMuscleGroups)).toBe(true);
    });

    it('search is case-insensitive', async () => {
      const token = getToken(testUserId);
      const [lower, upper] = await Promise.all([
        request(app).get('/exercises?search=plank').set('Authorization', `Bearer ${token}`),
        request(app).get('/exercises?search=PLANK').set('Authorization', `Bearer ${token}`),
      ]);

      expect(lower.status).toBe(200);
      expect(upper.status).toBe(200);
      expect(lower.body).toEqual(upper.body);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).get('/exercises?search=plank');
      expect(response.status).toBe(401);
    });
  });
});
