-- AlterEnum
ALTER TYPE "RecordSetsType" ADD VALUE 'REPS_AND_HEIGHT';

-- AlterTable
ALTER TABLE "workout_sets" ADD COLUMN     "height_in" DECIMAL(5,2);
