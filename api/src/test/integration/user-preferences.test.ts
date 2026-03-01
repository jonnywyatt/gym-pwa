import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { Prisma } from '../../prisma-client';
import { getTestPrismaClient } from '../db-setup';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('User Preferences Routes', () => {
  let testUserId: number;

  function getToken(userId: number) {
    return jwt.sign({ userId, email: 'testuser@example.com' }, JWT_SECRET, { expiresIn: '1h' });
  }

  beforeEach(async () => {
    const prisma = getTestPrismaClient();
    const user = await prisma.user.upsert({
      where: { googleId: 'test-google-id-prefs' },
      update: { email: 'prefs@example.com', name: 'Prefs User', preferences: Prisma.JsonNull },
      create: {
        googleId: 'test-google-id-prefs',
        email: 'prefs@example.com',
        name: 'Prefs User',
      },
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    const prisma = getTestPrismaClient();
    await prisma.user.update({ where: { id: testUserId }, data: { preferences: Prisma.JsonNull } });
  });

  describe('GET /users/:userId/preferences', () => {
    it('returns default preferences when none saved', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .get(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ showRecommendedRoutines: true });
    });

    it('returns saved preferences', async () => {
      const prisma = getTestPrismaClient();
      await prisma.user.update({
        where: { id: testUserId },
        data: { preferences: { showRecommendedRoutines: false } },
      });

      const token = getToken(testUserId);
      const response = await request(app)
        .get(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ showRecommendedRoutines: false });
    });

    it('returns 403 for another user', async () => {
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });
      const response = await request(app)
        .get(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).get(`/users/${testUserId}/preferences`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /users/:userId/preferences', () => {
    it('updates preferences and returns merged result', async () => {
      const token = getToken(testUserId);
      const response = await request(app)
        .patch(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${token}`)
        .send({ showRecommendedRoutines: false });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ showRecommendedRoutines: false });
    });

    it('merges into existing preferences without losing other properties', async () => {
      const prisma = getTestPrismaClient();
      await prisma.user.update({
        where: { id: testUserId },
        data: { preferences: { showRecommendedRoutines: true, someOtherProp: 'value' } },
      });

      const token = getToken(testUserId);
      const response = await request(app)
        .patch(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${token}`)
        .send({ showRecommendedRoutines: false });

      expect(response.status).toBe(200);
      expect(response.body.showRecommendedRoutines).toBe(false);
    });

    it('returns 403 for another user', async () => {
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });
      const response = await request(app)
        .patch(`/users/${testUserId}/preferences`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ showRecommendedRoutines: false });

      expect(response.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app)
        .patch(`/users/${testUserId}/preferences`)
        .send({ showRecommendedRoutines: false });
      expect(response.status).toBe(401);
    });
  });
});
