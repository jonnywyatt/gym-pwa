import { beforeEach, describe, expect, it } from 'vitest';
import { getTestPrismaClient } from '../db-setup';

describe('Auth Routes', () => {
  describe('POST /auth/google', () => {
    let testUserId: number;

    beforeEach(async () => {
      const prisma = getTestPrismaClient();
      const user = await prisma.user.upsert({
        where: { googleId: 'test-google-id-auth' },
        update: { email: 'authtest@example.com', name: 'Auth Test User' },
        create: {
          googleId: 'test-google-id-auth',
          email: 'authtest@example.com',
          name: 'Auth Test User',
        },
      });
      testUserId = user.id;
    });

    describe('hasBodyWeight flag', () => {
      it('returns hasBodyWeight: false when user has no body weight records', async () => {
        const prisma = getTestPrismaClient();

        const latestBodyWeight = await prisma.userBodyWeight.findFirst({
          where: { userId: testUserId },
          orderBy: { recordedAt: 'desc' },
        });

        expect(latestBodyWeight).toBeNull();
        expect(!!latestBodyWeight).toBe(false);
      });

      it('returns hasBodyWeight: true when user has body weight records', async () => {
        const prisma = getTestPrismaClient();

        await prisma.userBodyWeight.create({
          data: {
            userId: testUserId,
            weight: 75.5,
            unit: 'KG',
          },
        });

        const latestBodyWeight = await prisma.userBodyWeight.findFirst({
          where: { userId: testUserId },
          orderBy: { recordedAt: 'desc' },
        });

        expect(latestBodyWeight).not.toBeNull();
        expect(!!latestBodyWeight).toBe(true);
      });

      it('returns the most recent body weight when multiple records exist', async () => {
        const prisma = getTestPrismaClient();

        await prisma.userBodyWeight.createMany({
          data: [
            {
              userId: testUserId,
              weight: 70.0,
              unit: 'KG',
              recordedAt: new Date('2025-01-01'),
            },
            {
              userId: testUserId,
              weight: 75.5,
              unit: 'KG',
              recordedAt: new Date('2025-01-02'),
            },
          ],
        });

        const latestBodyWeight = await prisma.userBodyWeight.findFirst({
          where: { userId: testUserId },
          orderBy: { recordedAt: 'desc' },
        });

        expect(latestBodyWeight?.weight.toString()).toBe('75.5');
      });
    });
  });
});
