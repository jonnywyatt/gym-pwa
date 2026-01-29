import { execSync } from 'node:child_process';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../prisma-client';

let prisma: PrismaClient;
let pool: pg.Pool;

export async function setupTestDatabase() {
  // Set test database URL
  process.env.DATABASE_URL = 'postgresql://postgres:localdev@localhost:5432/gym_test';

  // Push schema to test database (idempotent)
  const dbUrl = process.env.DATABASE_URL;
  execSync(`npx prisma db push --accept-data-loss --url="${dbUrl}"`, {
    env: { ...process.env },
    stdio: 'inherit',
  });

  // Create connection pool and adapter
  pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  // Create Prisma client
  prisma = new PrismaClient({ adapter });
  await prisma.$connect();

  return prisma;
}

export async function cleanupTestDatabase() {
  // Clean up all tables
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE`);
    }
  }
}

export async function teardownTestDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    await pool.end();
  }
}

export function getTestPrismaClient() {
  if (!prisma) {
    throw new Error('Test database not initialized. Call setupTestDatabase first.');
  }
  return prisma;
}
