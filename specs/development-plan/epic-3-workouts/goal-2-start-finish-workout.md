# Goal 2 - User can create and finish a new workout

## Starting a new workout
1. The routine page should have a new button at the top - Start workout
2. When the button is clicked, a new workout based on the routine should be created, and the user redirected to the workout page at `/workouts/{workoutId}`
    - technical note - take snapshot of the routine from the remote DB and store in a user workouts table in indexedDB. From that point, any changes to the original routine will not be synced to the workout
    - the local user workouts table should also have a start date / time field, with the time the workout was created
3. The workout page should show:
   - a page heading of the workout label (which will be a copy of the routine label)
   - a nav bar with:
     - start date / time
     - a 'Finish' button
   - then below the nav bar, the list of exercises, each with a checkbox to the right of its panel, which will default to unchecked
4. As the user checks / unchecks the box for each exercise, it will be marked as done for that workout in indexedDB
5. When the 'Finish' button is clicked, store a end date & time with the workout, and remove any exercises that weren't completed, then copy the workout from indexedDB to the remote DB (to a new user workouts table) and remove the workout from indexedDB
6. The user should now be returned to a new page `/workouts` which will list all workouts completed by that user, in date order (most recent first). Each workout will show its label, start date / time, duration, and number of exercises completed
