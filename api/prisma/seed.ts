import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing exercises
  await prisma.exercise.deleteMany({});
  console.log('🗑️  Cleared existing exercises');

  // Seed new exercise
  const exercise = await prisma.exercise.create({
    data: {
      name: 'Assisted pull up',
    },
  });

  console.log('✅ Seeded exercise:', exercise);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
