import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma-client';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.exercise.deleteMany({});
  console.log('🗑️  Cleared existing exercises');

  // Seed new exercise
  await prisma.exercise.create({
    data: {
      name: 'Assisted pull up',
    },
  });

  console.log('🗑️  Exercises loaded');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
