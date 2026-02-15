-- CreateEnum
CREATE TYPE "RecordSetsType" AS ENUM ('WEIGHT', 'BODYWEIGHT_MINUS_OFFSET', 'TIME', 'WEIGHT_AND_TIME', 'BODYWEIGHT_PLUS_WEIGHT');

-- CreateEnum
CREATE TYPE "BodyAreaLabel" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'CORE', 'LEGS');

-- CreateEnum
CREATE TYPE "MuscleGroupLabel" AS ENUM ('PECTORALIS_MAJOR', 'PECTORALIS_MINOR', 'LATISSIMUS_DORSI', 'TRAPEZIUS', 'RHOMBOIDS', 'LOWER_BACK', 'REAR_DELTOIDS', 'FRONT_DELTOIDS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'ABDOMINALS', 'OBLIQUES', 'GLUTES', 'HAMSTRINGS', 'QUADRICEPS', 'ADDUCTORS', 'CALVES');

-- CreateTable
CREATE TABLE "body_areas" (
    "id" SERIAL NOT NULL,
    "label" "BodyAreaLabel" NOT NULL,

    CONSTRAINT "body_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" SERIAL NOT NULL,
    "label" "MuscleGroupLabel" NOT NULL,
    "body_area_id" INTEGER NOT NULL,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "record_sets_type" "RecordSetsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_exercises" (
    "routine_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "routine_exercises_pkey" PRIMARY KEY ("routine_id","exercise_id")
);

-- CreateTable
CREATE TABLE "exercise_primary_muscle_groups" (
    "exercise_id" INTEGER NOT NULL,
    "muscle_group_id" INTEGER NOT NULL,

    CONSTRAINT "exercise_primary_muscle_groups_pkey" PRIMARY KEY ("exercise_id","muscle_group_id")
);

-- CreateTable
CREATE TABLE "exercise_secondary_muscle_groups" (
    "exercise_id" INTEGER NOT NULL,
    "muscle_group_id" INTEGER NOT NULL,

    CONSTRAINT "exercise_secondary_muscle_groups_pkey" PRIMARY KEY ("exercise_id","muscle_group_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "google_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_body_weights" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_body_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "routine_id" INTEGER NOT NULL,
    "routine_label" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "duration_seconds" INTEGER,
    "exercises_completed" JSONB NOT NULL,
    "total_weight_kg" INTEGER,
    "body_weight_kg" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "user_workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "body_areas_label_key" ON "body_areas"("label");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_label_key" ON "muscle_groups"("label");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_label_key" ON "exercises"("label");

-- CreateIndex
CREATE UNIQUE INDEX "routines_label_key" ON "routines"("label");

-- CreateIndex
CREATE UNIQUE INDEX "routine_exercises_routine_id_position_key" ON "routine_exercises"("routine_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- AddForeignKey
ALTER TABLE "muscle_groups" ADD CONSTRAINT "muscle_groups_body_area_id_fkey" FOREIGN KEY ("body_area_id") REFERENCES "body_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_primary_muscle_groups" ADD CONSTRAINT "exercise_primary_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_primary_muscle_groups" ADD CONSTRAINT "exercise_primary_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_secondary_muscle_groups" ADD CONSTRAINT "exercise_secondary_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_secondary_muscle_groups" ADD CONSTRAINT "exercise_secondary_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_body_weights" ADD CONSTRAINT "user_body_weights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
