/*
  Warnings:

  - You are about to drop the column `name` on the `exercises` table. All the data in the column will be lost.
  - Added the required column `label` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_sets_type` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecordSetsType" AS ENUM ('WEIGHT', 'WEIGHT_OFFSET_FROM_BODY', 'TIME', 'WEIGHT_AND_TIME');

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "record_sets_type" "RecordSetsType" NOT NULL;

-- CreateTable
CREATE TABLE "body_areas" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "body_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "body_area_id" INTEGER NOT NULL,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "muscle_groups" ADD CONSTRAINT "muscle_groups_body_area_id_fkey" FOREIGN KEY ("body_area_id") REFERENCES "body_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_primary_muscle_groups" ADD CONSTRAINT "exercise_primary_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_primary_muscle_groups" ADD CONSTRAINT "exercise_primary_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_secondary_muscle_groups" ADD CONSTRAINT "exercise_secondary_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_secondary_muscle_groups" ADD CONSTRAINT "exercise_secondary_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
