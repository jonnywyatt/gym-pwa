import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma-client';
import 'dotenv/config';
import { bodyAreas } from './seeds/bodyAreas';
import { exercises } from './seeds/exercises';
import { muscleGroups } from './seeds/muscleGroups';
import { routines } from './seeds/routines';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Seed body areas
  const createdBodyAreas = await Promise.all(
    bodyAreas.map((bodyArea) =>
      prisma.bodyArea.upsert({
        where: { label: bodyArea.label },
        update: {},
        create: bodyArea,
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
      return prisma.muscleGroup.upsert({
        where: { label: muscleGroup.label },
        update: { bodyAreaId },
        create: {
          label: muscleGroup.label,
          bodyAreaId,
        },
      });
    })
  );
  console.log(`✅ Seeded ${createdMuscleGroups.length} muscle groups`);

  // Seed exercises
  const muscleGroupMap = new Map(createdMuscleGroups.map((mg) => [mg.label, mg.id]));
  const exerciseMap = new Map<string, number>();
  for (const exercise of exercises) {
    const upsertedExercise = await prisma.exercise.upsert({
      where: { label: exercise.label },
      update: { recordSetsType: exercise.recordSetsType },
      create: {
        label: exercise.label,
        recordSetsType: exercise.recordSetsType,
      },
    });
    exerciseMap.set(upsertedExercise.label, upsertedExercise.id);

    // Replace primary muscle group relationships
    await prisma.exercisePrimaryMuscleGroup.deleteMany({
      where: { exerciseId: upsertedExercise.id },
    });
    await Promise.all(
      exercise.primaryMuscleGroupLabels.map((label) => {
        const muscleGroupId = muscleGroupMap.get(label);
        if (!muscleGroupId) {
          throw new Error(`Muscle group not found: ${label}`);
        }
        return prisma.exercisePrimaryMuscleGroup.create({
          data: {
            exerciseId: upsertedExercise.id,
            muscleGroupId,
          },
        });
      })
    );

    // Replace secondary muscle group relationships
    await prisma.exerciseSecondaryMuscleGroup.deleteMany({
      where: { exerciseId: upsertedExercise.id },
    });
    await Promise.all(
      exercise.secondaryMuscleGroupLabels.map((label) => {
        const muscleGroupId = muscleGroupMap.get(label);
        if (!muscleGroupId) {
          throw new Error(`Muscle group not found: ${label}`);
        }
        return prisma.exerciseSecondaryMuscleGroup.create({
          data: {
            exerciseId: upsertedExercise.id,
            muscleGroupId,
          },
        });
      })
    );
  }
  console.log(`✅ Seeded ${exercises.length} exercises`);

  // Seed routines
  for (const routine of routines) {
    const upsertedRoutine = await prisma.routine.upsert({
      where: { label: routine.label },
      update: {},
      create: { label: routine.label },
    });

    // Replace routine exercise relationships
    await prisma.routineExercise.deleteMany({
      where: { routineId: upsertedRoutine.id },
    });
    await Promise.all(
      routine.exerciseLabels.map((label, index) => {
        const exerciseId = exerciseMap.get(label);
        if (!exerciseId) {
          throw new Error(`Exercise not found: ${label}`);
        }
        return prisma.routineExercise.create({
          data: {
            routineId: upsertedRoutine.id,
            exerciseId,
            position: index,
          },
        });
      })
    );
  }
  console.log(`✅ Seeded ${routines.length} routines`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
