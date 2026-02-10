import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { getTestPrismaClient } from '../db-setup';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('User Routes', () => {
  let testUserId: number;

  function getToken(userId: number) {
    return jwt.sign({ userId, email: 'testuser@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  beforeEach(async () => {
    const prisma = getTestPrismaClient();
    const user = await prisma.user.upsert({
      where: { googleId: 'test-google-id-users' },
      update: { email: 'testuser@example.com', name: 'Test User' },
      create: {
        googleId: 'test-google-id-users',
        email: 'testuser@example.com',
        name: 'Test User',
      },
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    const prisma = getTestPrismaClient();
    await prisma.userBodyWeight.deleteMany({ where: { userId: testUserId } });
  });

  describe('GET /users/:userId', () => {
    it('returns user profile with no body weight when none exists', async () => {
      const token = getToken(testUserId);

      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: testUserId,
        name: 'Test User',
        latestBodyWeight: null,
      });
    });

    it('returns user profile with latest body weight', async () => {
      const token = getToken(testUserId);
      const prisma = getTestPrismaClient();

      await prisma.userBodyWeight.createMany({
        data: [
          { userId: testUserId, weight: 70.5, unit: 'KG', recordedAt: new Date('2025-01-01') },
          { userId: testUserId, weight: 71.25, unit: 'KG', recordedAt: new Date('2025-01-02') },
        ],
      });

      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.latestBodyWeight).toEqual({
        weight: 71.25,
        unit: 'KG',
      });
    });

    it('returns 403 when requesting another user profile', async () => {
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const response = await request(app).get(`/users/${testUserId}`);

      expect(response.status).toBe(401);
    });

    it('returns 400 for invalid user ID', async () => {
      const token = getToken(1);

      const response = await request(app).get('/users/abc').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /users/:userId/body-weights', () => {
    it('creates a new body weight record', async () => {
      const token = getToken(testUserId);

      const response = await request(app)
        .post(`/users/${testUserId}/body-weights`)
        .set('Authorization', `Bearer ${token}`)
        .send({ weight: 75.5 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        weight: '75.5',
        unit: 'KG',
      });

      const prisma = getTestPrismaClient();
      const records = await prisma.userBodyWeight.findMany({
        where: { userId: testUserId },
      });
      expect(records).toHaveLength(1);
    });

    it('appends a new record without overwriting existing ones', async () => {
      const token = getToken(testUserId);
      const prisma = getTestPrismaClient();

      await prisma.userBodyWeight.create({
        data: { userId: testUserId, weight: 70.0, unit: 'KG' },
      });

      const response = await request(app)
        .post(`/users/${testUserId}/body-weights`)
        .set('Authorization', `Bearer ${token}`)
        .send({ weight: 71.5 });

      expect(response.status).toBe(201);

      const records = await prisma.userBodyWeight.findMany({
        where: { userId: testUserId },
        orderBy: { recordedAt: 'asc' },
      });
      expect(records).toHaveLength(2);
      expect(Number(records[0].weight)).toBe(70);
      expect(Number(records[1].weight)).toBe(71.5);
    });

    it('returns 400 for invalid weight', async () => {
      const token = getToken(testUserId);

      const response = await request(app)
        .post(`/users/${testUserId}/body-weights`)
        .set('Authorization', `Bearer ${token}`)
        .send({ weight: -5 });

      expect(response.status).toBe(400);
    });

    it('returns 400 for missing weight', async () => {
      const token = getToken(testUserId);

      const response = await request(app)
        .post(`/users/${testUserId}/body-weights`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('returns 403 when posting to another user', async () => {
      const otherToken = jwt.sign({ userId: 9999, email: 'other@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const response = await request(app)
        .post(`/users/${testUserId}/body-weights`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ weight: 75 });

      expect(response.status).toBe(403);
    });
  });
});
