I want to build a Progressive Web App that will be for people to use in the gym during their workouts, and as they do exercises, they should be able to log the exercise sets in the app, including the number of reps performed, and the time / weight / offset weight for each set (see glossary).

## Glossary
- Muscle group - eg quadriceps, latissimus dorsi, rhomboids, hamstrings. Each muscle group belongs to a specific body area
- Body area - eg chest, back, legs, abs, arms
- Exercise - a single gym activity eg pull ups, or deadlifts. An exercise will work on one or more muscle groups. The groups that are focussed most by the exercise are the 'primary muscle groups' for that exercise. Others that are focussed less but still worked on, are 'secondary muscle groups'
- Set - when an exercise is performed in a workout, it comprises one or more sets. Each set has a number of repetitions (or 'reps') of the exercise eg 8 pull ups. A set can be either a 'warm-up' set which might have a lower weight, or a 'standard' set, or it could be marked as a 'failure' set where it wasn't possible to do more than the recorded number of reps due to a heavy weight being used
- Routine - a collection of exercises. 
- Workout - a session in the gym, during which you will complete a routine.

## Key functionality

### Exercise library
The app will be pre-seeded with a library of common exercises (in the remote DB).
Each exercise should have the following data:
- how does the exercise record its sets? eg -
  - weight moved by the user (eg bench press or lat pulldown). Reps are required.
  - weight offset from body weight (eg assisted pull up - if the pull up machine assistance weight is set to 10kg, and the user's recorded body weight is 80kg, then for each pull up the user has moved weight of 70kg (80kg minus 10kg). Reps are required
  - with time eg dead hang, plank. Reps not required
  - with weight and time eg farmers carry - you carry an amount of weight for a period of time - both should be recorded in that set. Reps not required.
- muscle groups worked, and for each group, whether it's primary or secondary (see the glossary for details)
- body areas focussed on, and for each area, whether it's of primary or secondary focus
- benefits / why this is better than alternatives
- form tips

### Routines
Each routine is an ordered collection of exercises. The composition of exercises that it contains can change over time as exercises are added or removed from the routine.
The routine also has a title.
The app will be pre-seeded with a handful of routines (in the remote DB).

### Workouts
A workout is the single execution of a selected routine. The user starts a workout by selecting one of the available routines. That workout's timer is then started. The workout timer can be paused and restarted at any point during the workout.

At the point the workout is started, a snapshot of the selected routine is copied to the workout. Any subsequent changes to the original routine are not reflected in the workout's snapshot. Also a snapshot of the user's current body weight is copied to the workout.
The user can choose to do some or all of the exercises in the routine, during the current workout. They can complete the exercises in any order. Any exercises that they don't complete, will be removed automatically by the app when the workout is saved). 
The user performs one or more sets for each exercise. The first set might be marked as a warmup set, which typically has a lower weight than the sets that follow it. 

#### Rest timer
As the user finishes each set and marks it as complete in the app, a 'rest timer' will automatically start. The user will stop the rest timer just before they start their next set. The rest periods between sets will be recorded in the workout along with the sets.

#### Personal records
When an exercise set is completed, its recorded metrics (time / weight / time & weight / offset weight) will be compared with the user's previous best for that exercise.
How 'best' is defined depends on the exercise:
- Weight exercises:
    - Max weight (single rep)
    - Max volume (weight × reps in one set)
- Time exercises: Longest duration
- Combined (eg farmers carry): 
  - Weight
  - Time

If it's a new best record, the user will receive feedback and the new record will be stored in the user's profile. 

#### Finishing the workout
When the user has completed all the exercises that they want to do from the selected routine, and they finish the workout, then the exercises and sets that were performed should be copied, to the saved workout. So that, if the routine is later changed, the copy of it stored with that workout, won't be updated - it should be a snapshot of the routine at the time the workout was done. 
Other data that will be stored with the workout:
- The workout timer total
- the sum total of the weight moved during the workout (see Exercise library section for more detail)
- any records broken
- The date and time that the workout was completed
- A calculation of which body areas and muscle groups were exercised, and the percentage for each

The user will be able to delete a recorded workout if they don't want to keep it.

The user will be able to see a list of all workouts done, in the app, ordered by most recent first.

#### Offline-first strategy during workouts
During a workout the network connection might not be good; also the user wants instant responses eg if they beat a personal record for a given exercise.
IndexedDB will be used to store in-workout data. At the start of a workout, all the user's personal records will be synced from the remote API to the local DB. The local DB should be the source of truth during a workout, and store a snapshot of the selected routine. When the workout is saved, its data should be synced to the remote API (See [offline.md](technical/client-app/offline.md) for implementation details and fallbacks)

### User login / profile
The user will be required to login using oauth2. Initially the only provider allowed will be Google.
Once logged in, the user will be able to create a new routine, give it a name, and add exercises to it. The user's routines will be stored separately from the pre-seeded routines. The user will be able to delete any routines they have created, but not any of the pre-seeded routines.
The user will be able to enter their body weight in Kg which will be stored with their profile and used to calculate the weight for some exercises eg assisted pullup (see glossary). The user can update their recorded body weight as often as they like and the history will be preserved so they can track it over time.

## Functionality for post MVP
- a calendar showing workout history
- other summary charts / dashboard with aggregate data across all workouts
- for each exercise, the muscle groups involved to be shown on an image of a body (front or back view, depending on where the muscle group is located).
- allow user to add / remove exercises from the workout routine, during the workout (ie the snapshot copy of the routine)

## Technical approach and specs
See [specs/technical](./technical/index.md)
