/**
 * Recomputes UserWorkout.totalWeightKg for every past workout using the current
 * exercise bwFactor values. totalWeightKg is computed client-side at save time and
 * stored as-is, so correcting an exercise's bwFactor (e.g. Calf raise) doesn't
 * retroactively update past sessions unless this is run.
 *
 * Mirrors calculateSetWeightKg / calculateWorkoutTotalWeightKg from
 * pwa/src/pages/WorkoutPage/helpers.ts.
 *
 * Run with: tsx scripts/recompute-total-weight.ts
 */
import type { RecordSetsType } from '../src/prisma-client';
import { prisma } from '../src/utils/prisma';

function calculateSetWeightKg(
  recordSetsType: RecordSetsType,
  bodyWeightKg: number,
  weightKg: number | null,
  reps: number | null,
  bwFactor: number | null
): number {
  const weight = weightKg ?? 0;
  const repCount = reps ?? 0;
  const bwContribution = bwFactor !== null ? bodyWeightKg * bwFactor : 0;

  switch (recordSetsType) {
    case 'WEIGHT':
      return (weight + bwContribution) * repCount;
    case 'BODYWEIGHT_PLUS_WEIGHT':
      return (bodyWeightKg + weight) * repCount;
    case 'BODYWEIGHT_MINUS_OFFSET':
      return (bodyWeightKg - weight) * repCount;
    case 'WEIGHT_AND_TIME':
      return weight;
    case 'TIME':
      return 0;
    case 'REPS':
      return bwContribution * repCount;
    case 'REPS_AND_HEIGHT':
      return bwContribution * repCount;
  }
}

async function main() {
  const workouts = await prisma.userWorkout.findMany({
    include: {
      exercises: {
        include: {
          exercise: { select: { recordSetsType: true, bwFactor: true } },
          sets: true,
        },
      },
    },
  });

  let updatedCount = 0;
  let unchangedCount = 0;

  for (const workout of workouts) {
    const bodyWeightKg = Number(workout.bodyWeightKg);

    const newTotalWeightKg = workout.exercises.reduce((total, we) => {
      const bwFactor = we.exercise.bwFactor !== null ? Number(we.exercise.bwFactor) : null;
      return (
        total +
        we.sets.reduce(
          (setTotal, set) =>
            setTotal +
            calculateSetWeightKg(
              we.exercise.recordSetsType,
              bodyWeightKg,
              set.weightKg !== null ? Number(set.weightKg) : null,
              set.reps,
              bwFactor
            ),
          0
        )
      );
    }, 0);

    const roundedTotal = Math.round(newTotalWeightKg);
    if (roundedTotal === workout.totalWeightKg) {
      unchangedCount++;
      continue;
    }

    await prisma.userWorkout.update({
      where: { id: workout.id },
      data: { totalWeightKg: roundedTotal },
    });
    updatedCount++;
  }

  console.log(`✅ Updated totalWeightKg for ${updatedCount} workouts`);
  console.log(`   (${unchangedCount} unchanged)`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
