import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed exercises
  const benchPress = await prisma.exercise.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Bench Press',
      recordingType: 'weight',
      muscleGroups: {
        primary: ['chest', 'triceps'],
        secondary: ['shoulders']
      },
      bodyAreas: {
        primary: ['upper_body'],
        secondary: []
      },
      benefits: 'Builds upper body strength, particularly chest and triceps',
      formTips: 'Keep shoulder blades retracted, lower bar to mid-chest, maintain arch in lower back',
      isSeedData: true
    }
  });

  const pullUp = await prisma.exercise.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Pull Up',
      recordingType: 'weight', // Can be bodyweight or weighted
      muscleGroups: {
        primary: ['lats', 'biceps'],
        secondary: ['traps', 'forearms']
      },
      bodyAreas: {
        primary: ['back'],
        secondary: ['arms']
      },
      benefits: 'Best exercise for back width and arm strength',
      formTips: 'Full extension at bottom, pull chest to bar, control descent',
      isSeedData: true
    }
  });

  // Seed routine
  const upperBody = await prisma.routine.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Upper Body Strength',
      isSeedData: true,
      routineExercises: {
        create: [
          { exerciseId: benchPress.id, orderIndex: 0 },
          { exerciseId: pullUp.id, orderIndex: 1 }
        ]
      }
    }
  });

  console.log('✅ Seeding completed');
  console.log({ benchPress, pullUp, upperBody });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
