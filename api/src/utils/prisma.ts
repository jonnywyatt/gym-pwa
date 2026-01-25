import { PrismaClient } from '@prisma/client';

// Singleton pattern - reuse connection across requests
declare global {
  var cachedPrisma: PrismaClient | undefined;
}

export const prisma =
  global.cachedPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.cachedPrisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
