-- CreateTable
CREATE TABLE "user_workouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "routine_id" INTEGER NOT NULL,
    "routine_label" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "exercises_completed" JSONB NOT NULL,

    CONSTRAINT "user_workouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_workouts" ADD CONSTRAINT "user_workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
