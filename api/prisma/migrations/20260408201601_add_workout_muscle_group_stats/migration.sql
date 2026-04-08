-- CreateTable
CREATE TABLE "workout_muscle_group_stats" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "muscle_group" "MuscleGroupLabel" NOT NULL,
    "body_area" "BodyAreaLabel" NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "workout_muscle_group_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workout_muscle_group_stats_muscle_group_idx" ON "workout_muscle_group_stats"("muscle_group");

-- AddForeignKey
ALTER TABLE "workout_muscle_group_stats" ADD CONSTRAINT "workout_muscle_group_stats_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "user_workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
