import type { SetType as DbSetType } from '../../src/prisma-client';
import { createUserWorkout } from '../../src/routes/workouts/queries';
import type { SetType as ApiSetType, CreateWorkoutRequest } from '../../src/types';
import { prisma } from '../../src/utils/prisma';
import {
  calculateExercisesTotalReps,
  calculateExercisesTotalWeightKg,
  calculateSplitDurationSeconds,
  LOWER_BODY_EXERCISE_LABELS,
  UPPER_BODY_EXERCISE_LABELS,
} from './split-strength-routine-helpers';

const setTypeToApi: Record<DbSetType, ApiSetType> = {
  WARMUP: 'Warmup',
  STANDARD: 'Standard',
  FAILURE: 'Failure',
};

async function splitRoutineExercises() {
  const strength = await prisma.routine.findFirst({
    where: { label: 'Strength', userId: null },
    include: { routineExercises: { orderBy: { position: 'asc' }, include: { exercise: true } } },
  });

  if (!strength) {
    console.log('No default Strength routine found - nothing to migrate');
    return null;
  }

  const upperExercises = strength.routineExercises.filter((re) =>
    UPPER_BODY_EXERCISE_LABELS.includes(re.exercise.label)
  );
  const lowerExercises = strength.routineExercises.filter((re) =>
    LOWER_BODY_EXERCISE_LABELS.includes(re.exercise.label)
  );

  const { upperRoutine, lowerRoutine } = await prisma.$transaction(async (tx) => {
    const upperRoutine = await tx.routine.create({ data: { label: 'Upper body' } });
    const lowerRoutine = await tx.routine.create({ data: { label: 'Lower body' } });

    await tx.routineExercise.createMany({
      data: upperExercises.map((re, position) => ({
        routineId: upperRoutine.id,
        exerciseId: re.exerciseId,
        position,
      })),
    });
    await tx.routineExercise.createMany({
      data: lowerExercises.map((re, position) => ({
        routineId: lowerRoutine.id,
        exerciseId: re.exerciseId,
        position,
      })),
    });

    await tx.routineExercise.deleteMany({ where: { routineId: strength.id } });
    await tx.routine.delete({ where: { id: strength.id } });

    return { upperRoutine, lowerRoutine };
  });

  console.log(
    `✅ Created Upper body (${upperExercises.length} exercises) and Lower body (${lowerExercises.length} exercises)`
  );

  return { upperRoutine, lowerRoutine };
}

async function splitHistoricalWorkouts(upperRoutine: { id: number }, lowerRoutine: { id: number }) {
  const workouts = await prisma.userWorkout.findMany({
    where: { routineLabel: 'Strength' },
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { exercise: true, sets: { orderBy: { position: 'asc' } } },
      },
    },
  });

  let migratedCount = 0;

  for (const workout of workouts) {
    const bodyWeightKg = Number(workout.bodyWeightKg);
    const totalSetCount = workout.exercises.reduce((sum, we) => sum + we.sets.length, 0);

    const sides = [
      {
        routineId: upperRoutine.id,
        routineLabel: 'Upper body',
        exercises: workout.exercises.filter((we) =>
          UPPER_BODY_EXERCISE_LABELS.includes(we.exercise.label)
        ),
      },
      {
        routineId: lowerRoutine.id,
        routineLabel: 'Lower body',
        exercises: workout.exercises.filter((we) =>
          LOWER_BODY_EXERCISE_LABELS.includes(we.exercise.label)
        ),
      },
    ];

    for (const side of sides) {
      if (side.exercises.length === 0) continue;

      const sideSetCount = side.exercises.reduce((sum, we) => sum + we.sets.length, 0);

      const exercisesCompleted: CreateWorkoutRequest['exercisesCompleted'] = side.exercises.map(
        (we) => ({
          id: we.exercise.id,
          label: we.exercise.label,
          recordSetsType: we.exercise.recordSetsType,
          isIsometric: we.exercise.isIsometric,
          isUnilateral: we.exercise.isUnilateral,
          bwFactor: we.exercise.bwFactor !== null ? Number(we.exercise.bwFactor) : null,
          primaryMuscleGroups: [],
          secondaryMuscleGroups: [],
          tertiaryMuscleGroups: [],
          sets: we.sets.map((set) => ({
            setType: setTypeToApi[set.setType],
            weightKg: set.weightKg !== null ? Number(set.weightKg) : undefined,
            reps: set.reps ?? undefined,
            timeSeconds: set.timeSeconds ?? undefined,
          })),
        })
      );

      await createUserWorkout(workout.userId, {
        routineId: side.routineId,
        routineLabel: side.routineLabel,
        startedAt: workout.startedAt.toISOString(),
        finishedAt: workout.finishedAt.toISOString(),
        durationSeconds: calculateSplitDurationSeconds(
          workout.durationSeconds,
          sideSetCount,
          totalSetCount
        ),
        bodyWeightKg,
        totalWeightKg: calculateExercisesTotalWeightKg(exercisesCompleted, bodyWeightKg),
        totalReps: calculateExercisesTotalReps(exercisesCompleted),
        exercisesCompleted,
      });
    }

    await prisma.userWorkout.delete({ where: { id: workout.id } });
    migratedCount++;
  }

  console.log(`✅ Migrated ${migratedCount} historical Strength session(s)`);
}

async function main() {
  const routines = await splitRoutineExercises();
  if (!routines) return;

  await splitHistoricalWorkouts(routines.upperRoutine, routines.lowerRoutine);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
