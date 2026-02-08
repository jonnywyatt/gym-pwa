-- One-time reset: clear seed data and restart sequences so IDs begin at 1.
-- The seed script runs after migrations and will recreate all rows.

DELETE FROM "routine_exercises";
DELETE FROM "exercise_primary_muscle_groups";
DELETE FROM "exercise_secondary_muscle_groups";
DELETE FROM "routines";
DELETE FROM "exercises";
DELETE FROM "muscle_groups";
DELETE FROM "body_areas";

ALTER SEQUENCE "body_areas_id_seq" RESTART WITH 1;
ALTER SEQUENCE "muscle_groups_id_seq" RESTART WITH 1;
ALTER SEQUENCE "exercises_id_seq" RESTART WITH 1;
ALTER SEQUENCE "routines_id_seq" RESTART WITH 1;
