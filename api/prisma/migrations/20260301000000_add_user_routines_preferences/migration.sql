-- AlterTable: make label nullable and drop old unique constraint
ALTER TABLE "routines" DROP CONSTRAINT IF EXISTS "routines_label_key";
ALTER TABLE "routines" ALTER COLUMN "label" DROP NOT NULL;

-- AlterTable: add user_id to routines
ALTER TABLE "routines" ADD COLUMN "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex: unique on (label, user_id)
CREATE UNIQUE INDEX "routines_label_user_id_key" ON "routines"("label", "user_id");

-- AlterTable: add preferences to users
ALTER TABLE "users" ADD COLUMN "preferences" JSONB;
