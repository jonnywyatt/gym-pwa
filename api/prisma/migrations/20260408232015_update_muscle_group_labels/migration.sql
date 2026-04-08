-- Rename LOWER_BACK -> ERECTOR_SPINAE, add MEDIAL_DELTOIDS and HIP_FLEXORS to MuscleGroupLabel enum

-- Step 1: Add new enum values
ALTER TYPE "MuscleGroupLabel" ADD VALUE 'ERECTOR_SPINAE';
ALTER TYPE "MuscleGroupLabel" ADD VALUE 'MEDIAL_DELTOIDS';
ALTER TYPE "MuscleGroupLabel" ADD VALUE 'HIP_FLEXORS';

-- Step 2: Migrate all existing LOWER_BACK references to ERECTOR_SPINAE
UPDATE "muscle_groups" SET "label" = 'ERECTOR_SPINAE' WHERE "label" = 'LOWER_BACK';
UPDATE "exercise_primary_muscle_groups"
  SET "muscle_group_id" = (SELECT id FROM "muscle_groups" WHERE "label" = 'ERECTOR_SPINAE')
  WHERE "muscle_group_id" = (SELECT id FROM "muscle_groups" WHERE "label" = 'LOWER_BACK');
UPDATE "exercise_secondary_muscle_groups"
  SET "muscle_group_id" = (SELECT id FROM "muscle_groups" WHERE "label" = 'ERECTOR_SPINAE')
  WHERE "muscle_group_id" = (SELECT id FROM "muscle_groups" WHERE "label" = 'LOWER_BACK');
UPDATE "workout_muscle_group_stats" SET "muscle_group" = 'ERECTOR_SPINAE' WHERE "muscle_group" = 'LOWER_BACK';

-- Step 3: Recreate the enum without LOWER_BACK
ALTER TYPE "MuscleGroupLabel" RENAME TO "MuscleGroupLabel_old";
CREATE TYPE "MuscleGroupLabel" AS ENUM (
  'PECTORALIS_MAJOR',
  'PECTORALIS_MINOR',
  'LATISSIMUS_DORSI',
  'TRAPEZIUS',
  'RHOMBOIDS',
  'ERECTOR_SPINAE',
  'REAR_DELTOIDS',
  'FRONT_DELTOIDS',
  'MEDIAL_DELTOIDS',
  'BICEPS',
  'TRICEPS',
  'FOREARMS',
  'ABDOMINALS',
  'OBLIQUES',
  'HIP_FLEXORS',
  'GLUTES',
  'HAMSTRINGS',
  'QUADRICEPS',
  'ADDUCTORS',
  'CALVES'
);

-- Step 4: Swap columns to new enum type
ALTER TABLE "muscle_groups"
  ALTER COLUMN "label" TYPE "MuscleGroupLabel" USING "label"::text::"MuscleGroupLabel";
ALTER TABLE "workout_muscle_group_stats"
  ALTER COLUMN "muscle_group" TYPE "MuscleGroupLabel" USING "muscle_group"::text::"MuscleGroupLabel";

-- Step 5: Drop old enum
DROP TYPE "MuscleGroupLabel_old";
