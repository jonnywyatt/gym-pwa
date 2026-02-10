# Goal 2 - User can create and finish a new workout

Goal 2 is a simplified foundation for creating a workout, with more advanced features to come in later goals.

## Functionality - creating a new workout
1. The routine page should have a new button at the top - Start workout
2. When the button is clicked, a new workout based on the routine should be created, and the user redirected to the workout page at `/workouts/{workoutId}`
    - technical note - take snapshot of the routine from the remote DB and store in a `user_workouts` table in indexedDB along with the current user's ID. From that point, any changes to the original routine will not be synced to the workout
    - the local user workouts table should also have a start date / time field, with the time the workout was created
3. The workout page should show:
   - a page heading of the workout label (which will be a copy of the routine label)
   - a nav bar with:
     - start date / time
     - a 'Finish' button
   - then below the nav bar, the list of exercises, each with a checkbox to the right of its panel, which will default to unchecked
4. As the user checks / unchecks the box for each exercise, it will be marked as done for that workout in indexedDB (a boolean field called 'completed' on the exercise will be set to true)
5. When the 'Finish' button is clicked, store a end date & time with the workout, and remove any exercises that weren't completed, then copy the workout from indexedDB to the remote DB (to a new `user_workouts` table) and remove the workout from the indexedDB table. If the workout had no exercises, save it anyway.
6. The user should now be returned to a new page `/workouts` which will list all workouts completed by that user, in date order (most recent first), loaded from the remote DB. Each workout will show its label, start date / time, duration, and number of exercises completed

## Implementation notes
### New remote DB table - `user_workouts`
- The completed workout including a snapshot of the routine (but only the exercises that were ticked as complete) is stored in this table when the user finishes their workout.
Fields: 
- id
- userId (to join to user table)
- routineId (to join to routines table)
- routineLabel
- startedAt
- finishedAt
- exercisesCompleted (array of copies of the Exercise data from the original routine)

### New API endpoints
- POST /users/:userId/workouts - request body should contain the completed workout data
- GET /users/:userId/workouts - list user's workout history

### PWA
- Install Dexie.js: `npm install dexie`
- Create IndexedDB schema at `pwa/src/lib/db/index.ts`
- new routes - /workouts and /workouts/:workoutId

#### IndexedDB Schema (user_workouts table)
- id
- userId
- workout: { id, label (copied from Routine), exercises: Array<{id, label, completed (boolean)}> }
- startedAt: Date Time
- finishedAt?: Date Time
