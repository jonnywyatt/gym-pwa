import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma-client';
import 'dotenv/config';
import { bodyAreas } from './seeds/bodyAreas';
import { exercises } from './seeds/exercises';
import { muscleGroups } from './seeds/muscleGroups';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Clear existing data
  await prisma.exerciseSecondaryMuscleGroup.deleteMany({});
  await prisma.exercisePrimaryMuscleGroup.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.muscleGroup.deleteMany({});
  await prisma.bodyArea.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Seed body areas
  const createdBodyAreas = await Promise.all(
    bodyAreas.map((bodyArea) =>
      prisma.bodyArea.create({
        data: bodyArea,
      })
    )
  );
  console.log(`✅ Seeded ${createdBodyAreas.length} body areas`);

  // Seed muscle groups
  const bodyAreaMap = new Map(createdBodyAreas.map((ba) => [ba.label, ba.id]));
  const createdMuscleGroups = await Promise.all(
    muscleGroups.map((muscleGroup) => {
      const bodyAreaId = bodyAreaMap.get(muscleGroup.bodyAreaLabel);
      if (!bodyAreaId) {
        throw new Error(`Body area not found: ${muscleGroup.bodyAreaLabel}`);
      }
      return prisma.muscleGroup.create({
        data: {
          label: muscleGroup.label,
          bodyAreaId,
        },
      });
    })
  );
  console.log(`✅ Seeded ${createdMuscleGroups.length} muscle groups`);

  // Seed exercises
  const muscleGroupMap = new Map(createdMuscleGroups.map((mg) => [mg.label, mg.id]));
  for (const exercise of exercises) {
    const createdExercise = await prisma.exercise.create({
      data: {
        label: exercise.label,
        recordSetsType: exercise.recordSetsType,
      },
    });

    // Create primary muscle group relationships
    await Promise.all(
      exercise.primaryMuscleGroupLabels.map((label) => {
        const muscleGroupId = muscleGroupMap.get(label);
        if (!muscleGroupId) {
          throw new Error(`Muscle group not found: ${label}`);
        }
        return prisma.exercisePrimaryMuscleGroup.create({
          data: {
            exerciseId: createdExercise.id,
            muscleGroupId,
          },
        });
      })
    );

    // Create secondary muscle group relationships
    await Promise.all(
      exercise.secondaryMuscleGroupLabels.map((label) => {
        const muscleGroupId = muscleGroupMap.get(label);
        if (!muscleGroupId) {
          throw new Error(`Muscle group not found: ${label}`);
        }
        return prisma.exerciseSecondaryMuscleGroup.create({
          data: {
            exerciseId: createdExercise.id,
            muscleGroupId,
          },
        });
      })
    );
  }
  console.log(`✅ Seeded ${exercises.length} exercises`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
