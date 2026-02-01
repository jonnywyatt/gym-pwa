-- CreateEnum
CREATE TYPE "BodyAreaLabel" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'CORE', 'LEGS');

-- CreateEnum
CREATE TYPE "MuscleGroupLabel" AS ENUM ('PECTORALIS_MAJOR', 'PECTORALIS_MINOR', 'LATISSIMUS_DORSI', 'TRAPEZIUS', 'RHOMBOIDS', 'LOWER_BACK', 'REAR_DELTOIDS', 'FRONT_DELTOIDS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'ABDOMINALS', 'OBLIQUES', 'GLUTES', 'HAMSTRINGS', 'QUADRICEPS', 'CALVES');

-- AlterTable
ALTER TABLE "body_areas" ALTER COLUMN "label" TYPE "BodyAreaLabel" USING ("label"::text::"BodyAreaLabel");

-- AlterTable
ALTER TABLE "muscle_groups" ALTER COLUMN "label" TYPE "MuscleGroupLabel" USING ("label"::text::"MuscleGroupLabel");

-- CreateIndex
CREATE UNIQUE INDEX "body_areas_label_key" ON "body_areas"("label");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_label_key" ON "muscle_groups"("label");
