-- Add isIsometric and isUnilateral flags to exercises
ALTER TABLE "exercises" ADD COLUMN "is_isometric" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "exercises" ADD COLUMN "is_unilateral" BOOLEAN NOT NULL DEFAULT false;

-- Add tertiary muscle group junction table
CREATE TABLE "exercise_tertiary_muscle_groups" (
  "exercise_id" INTEGER NOT NULL,
  "muscle_group_id" INTEGER NOT NULL,
  CONSTRAINT "exercise_tertiary_muscle_groups_pkey" PRIMARY KEY ("exercise_id", "muscle_group_id"),
  CONSTRAINT "exercise_tertiary_muscle_groups_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "exercise_tertiary_muscle_groups_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
