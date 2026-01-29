import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../app';

const JWT_SECRET = 'test-jwt-secret';
process.env.JWT_SECRET = JWT_SECRET;

describe('Auth Middleware', () => {
  describe('GET /exercises (protected route)', () => {
    it('returns 401 when no authorization header is provided', async () => {
      const response = await request(app).get('/exercises');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Missing or invalid authorization header');
    });

    it('returns 401 when authorization header does not start with Bearer', async () => {
      const response = await request(app).get('/exercises').set('Authorization', 'Basic sometoken');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Missing or invalid authorization header');
    });

    it('returns 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/exercises')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('returns 401 when token is expired', async () => {
      const expiredToken = jwt.sign({ userId: 1, email: 'test@example.com' }, JWT_SECRET, {
        expiresIn: '-1h',
      });

      const response = await request(app)
        .get('/exercises')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('returns 200 when valid token is provided', async () => {
      const validToken = jwt.sign({ userId: 1, email: 'test@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const response = await request(app)
        .get('/exercises')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
