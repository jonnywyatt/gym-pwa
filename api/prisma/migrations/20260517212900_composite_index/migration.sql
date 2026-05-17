-- CreateIndex
CREATE INDEX "user_workouts_user_id_started_at_idx" ON "user_workouts"("user_id", "started_at");
