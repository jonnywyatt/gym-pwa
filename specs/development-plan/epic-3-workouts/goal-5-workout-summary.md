# Goal 5 - workout summary

From the Workouts page, the user should be able to click on any workout and go to a workout summary page `/workouts/{workoutId}`.

The workout summary page should have the standard navbar with a link in it back to the workouts page.

It should show the workout name and below that the date and time, workout duration and total weight.

Below those all the completed exercises should be listed, with the exercise name and total weight for that exercise. Then under that, the sets completed with full details - the set type (Warmup / Normal / Failure), weight / time / reps.

## Implementation notes
Add new API endpoint `GET /users/:userId/workouts/:workoutId` for the workout summary page to fetch the workout.

## Delete workout
Add the ability to delete a workout from the /workouts page, or the completed workout page
