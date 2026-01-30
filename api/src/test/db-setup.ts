import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../prisma-client';

let prisma: PrismaClient;
let pool: pg.Pool;

export async function setupTestDatabase() {
  process.env.DATABASE_URL = 'postgresql://postgres:localdev@localhost:5432/gym_test';

  pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({ adapter });
  await prisma.$connect();

  return prisma;
}

export async function teardownTestDatabase() {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (pool) {
    await pool.end();
  }
}

export function getTestPrismaClient() {
  if (!prisma) {
    throw new Error('Test database not initialized. Call setupTestDatabase first.');
  }
  return prisma;
}
