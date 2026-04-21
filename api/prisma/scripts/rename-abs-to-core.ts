import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/prisma-client';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const updatedRoutine = await prisma.routine.updateMany({
    where: { label: 'Abs' },
    data: { label: 'Core' },
  });
  console.log(`✅ Updated ${updatedRoutine.count} routine(s)`);

  const updatedWorkouts = await prisma.userWorkout.updateMany({
    where: { routineLabel: 'Abs' },
    data: { routineLabel: 'Core' },
  });
  console.log(`✅ Updated ${updatedWorkouts.count} historical session(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
