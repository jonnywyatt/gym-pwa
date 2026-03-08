-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('WARMUP', 'STANDARD', 'FAILURE');

-- AlterTable
ALTER TABLE "user_workouts" DROP COLUMN "exercises_completed";

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sets" (
    "id" SERIAL NOT NULL,
    "workout_exercise_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "set_type" "SetType" NOT NULL,
    "weight_kg" DECIMAL(5,2),
    "reps" INTEGER,
    "time_seconds" INTEGER,

    CONSTRAINT "workout_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "user_workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
