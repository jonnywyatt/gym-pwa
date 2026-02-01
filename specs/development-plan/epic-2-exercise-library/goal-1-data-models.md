# Goal 1 - Exercise library

Use the information below to:
1. Define Prisma schema models called MuscleGroup, BodyArea and Exercise (update the existing class). Set up the joins between the different models using the section 'Muscle Group → Body Area mappings' below. Create explicit join tables for primaryMuscleGroups and secondaryMuscleGroups mappings from Exercises. Create a database migration.
2. Update Exercise model field from name to label 
3. Create 3 separate seed data files under a new folder api/prisma/seeds/, in the order BodyAreas, MuscleGroups and Exercises. All seeding should continue to be controlled from api/prisma/seed.ts, but load the seed data from eg .ts or .json files rather than it being inline in seed.ts 
4. run the migrations and seeding. 
5. Update the GET /exercises route so that it returns the array of exercises with primaryMuscleGroups and secondaryMuscleGroups being arrays of labels not id's. Update the [exercises.test.ts](../../../api/src/test/integration/exercises.test.ts) integration test to reflect this 
6. Update the PWA so that the exercises page lists out all exercises and for each, shows the label, primary muscle groups and secondary muscle groups. No styling is needed at this stage.

[Additional context - spec.md](../../spec.md)

## Muscle groups
Fields:
- bodyArea - join by ID to BodyAreas table. MuscleGroup -> BodyArea is a many-to-one relationship
- label
Seed data - create records with these labels - Pectoralis Major / Pectoralis Minor / Latissimus Dorsi / Trapezius / Rhomboids / Rear Deltoids / Front Deltoids / Biceps / Triceps / Forearms / Abdominals / Obliques / Lower Back / Glutes / Hamstrings / Quadriceps / Calves
Muscle Group → Body Area mappings:
- Chest: Pectoralis Major, Pectoralis Minor
- Back: Latissimus Dorsi, Trapezius, Rhomboids, Lower Back
- Shoulders: Rear Deltoids, Front Deltoids
- Arms: Biceps, Triceps, Forearms
- Core: Abdominals, Obliques
- Legs: Glutes, Hamstrings, Quadriceps, Calves

## Body areas
Fields:
- id
- label
Seed data - labels are - Chest / Back / Shoulders / Arms / Core / Legs

## Exercises
Fields:
- id
- label
- recordSetsType - how the exercise records its sets. Create Prisma enum RecordSetsType with these values:
  - 'WEIGHT' - weight moved by the user (eg bench press or lat pulldown). Reps are required.
  - 'WEIGHT_OFFSET_FROM_BODY' - weight offset from body weight (eg assisted pull up - if the pull up machine assistance weight is set to 10kg, and the user's recorded body weight is 80kg, then for each pull up the user has moved weight of 70kg (80kg minus 10kg). Reps are required
  - 'TIME' - with time eg dead hang, plank. Reps not required
  - 'WEIGHT_AND_TIME' - with weight and time eg farmers carry - you carry an amount of weight for a period of time - both should be recorded in that set. Reps not required.
- primaryMuscleGroups - array of ids of muscle groups that are focussed / worked most by this exercise
- secondaryMuscleGroups - array of ids of muscle groups that are also worked by this exercise, but not as intensively as the primaryMuscleGroups

Note - Use 2 join tables to achieve the mappings of primaryMuscleGroups and secondaryMuscleGroups

Seed data -
### Pull up (assisted)
- recordSetsType - WEIGHT_OFFSET_FROM_BODY
- primaryMuscleGroups - Latissimus Dorsi, Biceps
- secondaryMuscleGroups - Rhomboids, Trapezius, Rear Deltoids, Forearms, Abdominals

### Chest press (machine)
- recordSetsType - WEIGHT
- primaryMuscleGroups - Pectoralis Major, Front Deltoids, Triceps
- secondaryMuscleGroups - Pectoralis Minor, Abdominals
