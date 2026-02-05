# Goal 3 - Workout sets

1. For each exercise in the workout, remove the checkbox and show a 'Start' button
2. When the Start button is clicked, store a start date / time for the exercise in indexedDB, and create 2 empty default sets for that exercise - one should be a 'Warmup' set and the other a 'Normal' set. The set type can be changed to any of Warmup / Normal / Failure
3. Each set will show the set number (warmup will always be number 1), and also one or two input boxes which will reflect the recordSetsType of the exercise (the input box(es) will be Weight, or Time, or both)
4. There will be a 'Add set' button below the last set. Any number of sets can be added. As data is inputted or changed for each set, the weight and/or time is stored in indexedDB. The weight stored with the set should be the weight the user has inputted
5. As the user completes sets, the total weight for the workout should be recalculated and displayed at the top of the screen in the workout nav bar. When calculating total weight, for exercises that have recordSetsType of WEIGHT_OFFSET_FROM_BODY, add the user's body weight

# Set
A set can be one of 3 types - warmup, normal or failure
