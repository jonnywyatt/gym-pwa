const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./src/prisma-client');
const pg = require('pg');

async function verify() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:localdev@localhost:5432/gym_test'
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();
  console.log('✓ Connected to database');

  const exercises = await prisma.exercise.findMany({
    include: {
      primaryMuscleGroups: {
        include: {
          muscleGroup: true,
        },
      },
    },
  });

  console.log(`✓ Found ${exercises.length} exercises`);

  const pullUp = exercises.find((e) => e.label === 'Pull up (assisted)');
  if (pullUp) {
    console.log(`✓ Found "Pull up (assisted)"`);
    console.log(`  Primary muscle groups: ${pullUp.primaryMuscleGroups.length}`);
    pullUp.primaryMuscleGroups.forEach((pmg) => {
      console.log(`    - ${pmg.muscleGroup.label}`);
    });
  } else {
    console.log('✗ "Pull up (assisted)" not found!');
  }

  await prisma.$disconnect();
  await pool.end();
}

verify().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
