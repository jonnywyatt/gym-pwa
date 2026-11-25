/**
 * Recomputes WorkoutMuscleGroupStat rows for every past workout using the current
 * exercise definitions (bwFactor, muscle group mappings). Needed after
 * correcting exercise metadata so historical session summaries reflect the fix.
 *
 * Run with: tsx scripts/recompute-muscle-group-stats.ts
 */
import { calculateMuscleGroupStats, exerciseMuscleGroupSelect } from '../src/routes/workouts/queries';
import { SetType } from '../src/prisma-client';
import type { SetType as ApiSetType, CreateWorkoutRequest } from '../src/types';
import { prisma } from '../src/utils/prisma';

const setTypeToApi: Record<SetType, ApiSetType> = {
  [SetType.WARMUP]: 'Warmup',
  [SetType.STANDARD]: 'Standard',
  [SetType.FAILURE]: 'Failure',
};

async function main() {
  const workouts = await prisma.userWorkout.findMany({
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { sets: { orderBy: { position: 'asc' } } },
      },
    },
  });

  const exerciseIds = [...new Set(workouts.flatMap((w) => w.exercises.map((e) => e.exerciseId)))];
  const exerciseData = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
    select: exerciseMuscleGroupSelect,
  });

  let updatedCount = 0;

  for (const workout of workouts) {
    // calculateMuscleGroupStats only reads `id` and `sets[].setType`/`timeSeconds`;
    // the other CompletedWorkoutExercise fields aren't needed here.
    const exercisesCompleted = workout.exercises.map(
      (we) => ({
        id: we.exerciseId,
        sets: we.sets.map((set) => ({
          setType: setTypeToApi[set.setType],
          weightKg: set.weightKg !== null ? Number(set.weightKg) : undefined,
          reps: set.reps ?? undefined,
          timeSeconds: set.timeSeconds ?? undefined,
          heightIn: set.heightIn !== null ? Number(set.heightIn) : undefined,
        })),
      })
    );

    const newStats = calculateMuscleGroupStats(
      exercisesCompleted as CreateWorkoutRequest['exercisesCompleted'],
      exerciseData
    );

    await prisma.$transaction([
      prisma.workoutMuscleGroupStat.deleteMany({ where: { workoutId: workout.id } }),
      ...(newStats.length > 0
        ? [
            prisma.workoutMuscleGroupStat.createMany({
              data: newStats.map(({ muscleGroup, bodyArea, percentage }) => ({
                workoutId: workout.id,
                muscleGroup,
                bodyArea,
                percentage,
              })),
            }),
          ]
        : []),
    ]);

    updatedCount++;
  }

  console.log(`✅ Recomputed muscle group stats for ${updatedCount} workouts`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
