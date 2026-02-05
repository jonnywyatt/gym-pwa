-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG');

-- CreateTable
CREATE TABLE "user_body_weights" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "unit" "WeightUnit" NOT NULL DEFAULT 'KG',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_body_weights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_body_weights" ADD CONSTRAINT "user_body_weights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
