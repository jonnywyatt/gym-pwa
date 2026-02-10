-- AlterTable
ALTER TABLE "user_workouts" ADD COLUMN     "body_weight" DECIMAL(5,2),
ADD COLUMN     "body_weight_unit" "WeightUnit" DEFAULT 'KG';
