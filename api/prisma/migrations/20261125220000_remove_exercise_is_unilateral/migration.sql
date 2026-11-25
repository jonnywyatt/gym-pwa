-- Remove is_unilateral: its only effect was doubling effective set count in the
-- muscle-group breakdown, which double-counted exercises logged as separate
-- per-side sets. All exercises now use the non-doubled calculation.
ALTER TABLE "exercises" DROP COLUMN "is_unilateral";
