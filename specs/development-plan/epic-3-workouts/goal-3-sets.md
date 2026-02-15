# Goal 3 - Workout sets

## Record user body weight with workout
1. When the user creates a new workout, copy their latest body weight reading from the `user_body_weights` table to the new workout record in indexedDB. It will be used to calculate weight for exercises that offset body weight.
2. When they finish the workout, save the body weight with the workout record in the remote DB

## Workout timer
At the moment, the workout start time is shown on the workout page. Instead, show a timer at the top of the workout page that updates every second and can be paused / played. Start the timer automatically when the workout is created. When the workout finishes, stop the timer automatically. Store the duration of the workout in the remote DB as a new field.

## Sets
1. Show the total weight moved for the current workout, at the top of the workout page in the navbar, next to the workout timer.
2. For each exercise in the workout, remove the checkbox and show a 'Start' button
3. When the Start button is clicked, store a start date / time for the exercise in indexedDB, and create 2 empty default sets for that exercise - one should be a 'Warmup' set and the other a 'Normal' set.
4. Normal or Failure sets done after the Warmup set will be numbered starting at 1
5. Each set row in the UI will have the following: one or more input boxes which will reflect the recordSetsType of the exercise (the input box(es) will be Weight (always in Kg), or Time (in minutes and seconds), or both). For exercises of type WEIGHT, BODYWEIGHT_PLUS_WEIGHT or BODYWEIGHT_MINUS_OFFSET, there will also be an input to enter the number of reps completed. There will also be a dropdown to change the set type between Warmup / Normal / Failure. Also a checkbox which the user can tick when the set is complete.
6. There will be a 'Add set' button below the last set. Any number of sets can be added. A newly added set defaults to type Normal
7. As each set is marked complete using the checkbox, the calculated weight and/or time is stored in indexedDB. See 'Weight calculations' section below. A total weight for the exercise is shown alongside the exercise name.
8. When the user has completed all the sets they want to do, they can click a Finish button. At that point the exercise will be marked as completed in the workout record in indexedDB. The total weight moved for all completed sets in that exercise, will be calculated and added to the total weight for the workout, updating it in the navbar. Incompleted sets will be removed from the DB at this point.
9. There will also be a discard button next to the Finish button; if pressed, all sets for the exercise will be removed from the DB.
10. Before the user ends an exercise, they'll be able to edit the input values for weight / time and uncheck sets if they want; if they uncheck a set it will remain in the DB but be marked incomplete (but the row will remain visible in the UI in case they want to check it again)

### Weight calculations
When an exercise is completed, calculate the total weight moved for sets as follows, based on the exercise type:
    - WEIGHT: entered weight x number of reps
    - BODYWEIGHT_PLUS_WEIGHT: (bodyWeight + entered weight) x number of reps (e.g. weighted dips)
    - BODYWEIGHT_MINUS_OFFSET: (bodyWeight - entered offset) x number of reps (e.g. assisted pull-ups)
    - WEIGHT_AND_TIME: entered weight contributes to total (e.g. farmer's carry)
    - TIME: no weight contribution (e.g. dead hang)

### Not in scope at this point, but will be added later
- the ability to edit a set after an exercise has been finished
