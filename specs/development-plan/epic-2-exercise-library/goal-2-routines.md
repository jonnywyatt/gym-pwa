# Routines

A routine is an ordered collection of exercises.
There will be initially one routine in seed data. Later, users will be able to create their own, but not as part of this goal.

## Fields
- id
- label - string

Routines should have a many-to-many relationship with Exercises (a single routine can have multiple exercises, and there can be multiple routines).

Should be a join table: RoutineExercise with:                                                 
- routineId (FK to Routine)                  
- exerciseId (FK to Exercise)           
- position or order (integer for ordering)     
- Composite primary key [routineId, exerciseId] 
- unique constraint within a routine: @@unique([routineId, position])

If an exercise is deleted from the Exercises table then the deletion should cascade to any routines that use that exercise. There should not be a cascading delete in the other direction (ie if a routine is deleted, it will not affect the Exercises). Deletions will not be possible by the user, yet.

## Endpoint
`GET /routines/{routineId}` - return a routine, with id and exercises list
`GET /routines` - return all
Add integration tests for both endpoints.

## Seed data
One routine initially
- label - 'Strength'
- exercises - include all the exercises that have been created from the [Exercises seed data](./exercises-seed-data.md), in the order they appear in the seed file

## PWA
- new route `GET /routines` and page that lists all routines with label and the number of exercises in it (but not the details of the exercises themselves). Clicking on a routine links to the routine page, see below
- new route `/routines/{routineId}` - routine page
  - page heading is the routine label
  - list all the exercises
- after login, the user should be redirected to the routines page, not the exercises page
- Add new integration tests for both pages
