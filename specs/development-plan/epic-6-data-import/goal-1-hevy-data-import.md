# Goal 1 - import of workout data from Hevy

An export of all my previous workout data is in ./2026-03-07-hevy-export.csv

I want a javascript process that will import this data into the `user_workouts` table in my database. Use the following rules to import the data:

## Column mappings

First, do a scan of all values of the `exercise_title` column in the CSV and output a list of those that don't have an obvious match to an exercise in the database.

All exercises for a single workout can be identified in the CSV by a group of rows with the same `start_time` and the same title.
Use those rows to create a single entry in the `user_workouts` table.

The `title` values in the CSV can be matched to routines as follows:
- Abs -> Abs
- Strength -> Strength
- Puregym -> Strength
- Functional -> Strength
Ignore any others from the CSV that are not in the above list.
- Use the matched routine's ID for the `routine_id` field.

The `start_time` and `end_time` for one of the exercises in a workout (which are in GMT timezone) should be subtracted then used to calculate duration_seconds.
Assume a body weight of 83kg for all imported workouts.

To construct the `exercises_completed` JSON structure for a workout, use the following rules:
- add exercises to the `sets` in the order of their `set_index` value, lowest first
- `setType` should always be set to Standard
- to get the `primaryMuscleGroups` and `secondaryMuscleGroups` for an exercise, match the `exercise_title` to the closes `exercise_title` in the `exercises` table then used the `id` field to cross-reference to the `exercise_primary_muscle_groups` and `exercise_secondary_muscle_groups` tables. Also copy the `record_sets_type` from the exercises table to the `recordSetsType` exercise data in the `sets` array entry.
- `duration_seconds` in the CSV maps to `timeSeconds` in the `sets` array entry.
- `weight_kg` in the CSV maps to `weightKg` in the `sets` array entry.
- `duration_seconds` in the CSV maps to `timeSeconds` in the `sets` array entry.

Duplicate the app's existing logic to use the `recordSetsType` for each exercise to calculate the `total_weight_kg` of the workout.

Ignore the CSV fields - description, superset_id, exercise_notes, rpe.
