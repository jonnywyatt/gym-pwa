# Sets Feature Implementation Plan

## Context
Currently, exercises in a workout have a simple checkbox for completion. This feature replaces that with a full set-tracking system: each exercise gets a "Start" button that creates sets with weight/time/reps inputs, per-set completion checkboxes, and exercise-level finish/discard actions. Total weight is calculated and shown in the navbar.

Spec: `specs/development-plan/epic-3-workouts/goal-3-sets.md`

---

## Step 1: Data Model & Types

### `pwa/src/lib/db/index.ts` — Add new types, extend `LocalWorkoutExercise`

```typescript
export type SetType = 'Warmup' | 'Normal' | 'Failure';

export interface WorkoutSet {
  id: string;               // crypto.randomUUID()
  setType: SetType;
  weightKg?: number;
  reps?: number;
  timeSeconds?: number;     // stored as total seconds, UI shows min:sec
  completed: boolean;
}

// Extend existing interface:
export interface LocalWorkoutExercise extends WorkoutExercise {
  completed: boolean;       // keep existing field — true when exercise is "finished"
  startedAt?: string;       // set when user clicks "Start"
  sets?: WorkoutSet[];      // undefined until started
  totalWeightKg?: number;   // calculated when exercise is finished
}
```

No Dexie version bump needed — `exercisesCompleted` is a JSON blob inside the same indexed field.

### `api/src/types.ts` — Add set types for API payload

```typescript
export type CompletedSet = {
  setType: 'Warmup' | 'Normal' | 'Failure';
  weightKg?: number;
  reps?: number;
  timeSeconds?: number;
};

// Extend WorkoutExercise for exercises that include set data
export type CompletedWorkoutExercise = WorkoutExercise & {
  sets: CompletedSet[];
  totalWeightKg: number;
};

// Update CreateWorkoutRequest:
//   exercisesCompleted: WorkoutExercise[]  →  CompletedWorkoutExercise[]
//   add: totalWeightKg: number
```

Keep `WorkoutExercise` unchanged (it's the base type used elsewhere). `UserWorkout` inherits from `CreateWorkoutRequest` so will automatically get the new shape.

### `api/src/routes/workouts/transforms.ts` — No changes needed

The `exercisesCompleted` field is stored as JSON and cast on read. No Prisma migration needed.

---

## Step 2: Time Utilities

### `pwa/src/utils/time.ts` — Add min:sec formatting/parsing

```typescript
export function formatTimeMinSec(totalSeconds: number): string   // "2:05"
export function parseTimeMinSec(input: string): number | null    // "2:05" → 125
```

### `pwa/src/utils/time.test.ts` — Unit tests for both functions

---

## Step 3: Helper Functions

All in `pwa/src/pages/WorkoutPage/helpers.ts` — pure functions, unit tested.

### Set creation
- `createDefaultSets(): WorkoutSet[]` — Returns [Warmup, Normal], both incomplete
- `createNewSet(): WorkoutSet` — Returns Normal type, incomplete

### Display
- `getSetDisplayLabel(sets: WorkoutSet[], index: number): string` — Warmup → "W", Normal/Failure numbered from 1
- `getSetInputFields(recordSetsType: RecordSetsType): { showWeight, showReps, showTime, weightLabel }` — determines which inputs to render per set row

### Weight calculations
- `calculateSetWeightKg(recordSetsType, bodyWeightKg, set): number` — per-set weight based on type:
  - WEIGHT: weightKg × reps
  - BODYWEIGHT_PLUS_WEIGHT: (bodyWeightKg + weightKg) × reps
  - BODYWEIGHT_MINUS_OFFSET: (bodyWeightKg - weightKg) × reps
  - WEIGHT_AND_TIME: weightKg
  - TIME: 0
- `calculateExerciseTotalWeightKg(recordSetsType, bodyWeightKg, sets): number` — sums completed sets
- `calculateWorkoutTotalWeightKg(exercises, bodyWeightKg): number` — sums finished exercises

### Exercise state transitions
- `startExercise(exercise): LocalWorkoutExercise` — sets startedAt + creates default sets
- `finishExercise(exercise, bodyWeightKg): LocalWorkoutExercise` — marks completed, keeps only completed sets, calculates totalWeightKg
- `discardExercise(exercise): LocalWorkoutExercise` — clears startedAt/sets/completed/totalWeightKg

### API payload (update existing)
- Update `getCompletedExercises()` — strip local-only fields (set `id`, set `completed`, exercise `startedAt`, exercise `completed`), return `CompletedWorkoutExercise[]`
- Update `createWorkoutPayload()` — add `totalWeightKg` to payload

### `helpers.test.ts` — Unit tests for all new helpers

---

## Step 4: DB Operations

### `pwa/src/lib/db/index.ts`

Replace `updateWorkoutExercise(workoutId, exerciseId, completed)` with a general-purpose:

```typescript
export async function updateWorkoutExercises(
  workoutId: string,
  exercises: LocalWorkoutExercise[]
): Promise<void>
```

Helper functions handle immutable transformations; this single DB function persists the result. Remove the old `updateWorkoutExercise`.

---

## Step 5: ExerciseSets Component

### `pwa/src/components/ExerciseSets/ExerciseSets.vue`

New component handling a single exercise's full lifecycle.

**Props:** `exercise: LocalWorkoutExercise`, `bodyWeightKg: number`

**Emits:** `start`, `updateSet`, `addSet`, `changeSetType`, `finish`, `discard`

**Three visual states:**
1. **Not started** (`!exercise.startedAt`): Exercise label + "Start" button
2. **In progress** (`exercise.startedAt && !exercise.completed`): Exercise label + running total weight, set rows, Add Set / Finish / Discard buttons
3. **Completed** (`exercise.completed`): Exercise label + total weight, read-only summary

**Each set row contains:**
- Set type dropdown (`<select>`: Warmup / Normal / Failure) — emits `changeSetType`
- Set display label (W / 1 / 2...) via `getSetDisplayLabel`, shown alongside the dropdown
- Input fields determined by `getSetInputFields(exercise.recordSetsType)`:
  - Weight input (number, Kg) — if showWeight
  - Reps input (number) — if showReps
  - Time input (text, "m:ss" placeholder) — if showTime
- Completion checkbox

Component imports display helpers from `WorkoutPage/helpers.ts`. No business logic in the component — it emits events upward.

Uses a computed property with `calculateExerciseTotalWeightKg` for live exercise total display while sets are being completed.

### `pwa/src/components/ExerciseSets/ExerciseSets.module.css`
### `pwa/src/components/ExerciseSets/ExerciseSets.test.ts` — Integration tests

---

## Step 6: WorkoutPage Updates

### `pwa/src/pages/WorkoutPage/WorkoutPage.vue`

1. **Navbar**: Add workout total weight (computed via `calculateWorkoutTotalWeightKg`) next to timer
2. **Exercise list**: Replace checkbox `<li>` elements with `<ExerciseSets>` components
3. **Event handlers** — each receives an exerciseId, maps over `workout.exercisesCompleted` to produce updated array, persists via `updateWorkoutExercises`:
   - `handleStartExercise(id)` — calls `startExercise()`
   - `handleUpdateSet(id, setId, updates)` — updates set fields in the exercise's sets array
   - `handleAddSet(id)` — appends `createNewSet()` to exercise's sets
   - `handleChangeSetType(id, setId, type)` — updates set type
   - `handleFinishExercise(id)` — calls `finishExercise()`
   - `handleDiscardExercise(id)` — calls `discardExercise()`
4. **Remove** `handleCheckboxChange` and `updateWorkoutExercise` import
5. **Import** `updateWorkoutExercises` from db instead

### `pwa/src/pages/WorkoutPage/WorkoutPage.module.css` — Update/add styles for total weight in navbar

### `pwa/src/pages/WorkoutPage/WorkoutPage.test.ts` — Update integration tests:
- Start exercise → verify sets appear with set type dropdown
- Add set → verify new row
- Complete sets → verify exercise total weight shown
- Change set type via dropdown → verify label updates
- Finish exercise → verify completed state, workout total updates
- Discard exercise → verify returns to Start state
- Finish workout → verify API payload includes sets and totalWeightKg

---

## Implementation Order

1. Step 1 (types) — foundation everything depends on
2. Step 2 (time utils + tests)
3. Step 3 (helpers + unit tests) — validate all business logic before UI
4. Step 4 (DB operations)
5. Step 5 (ExerciseSets component + tests)
6. Step 6 (WorkoutPage updates + tests)
7. Run `type-check` and `lint` in both api/ and pwa/

---

## Files to Modify/Create

**Modify:**
- `pwa/src/lib/db/index.ts` — types + DB operations
- `pwa/src/pages/WorkoutPage/helpers.ts` — business logic
- `pwa/src/pages/WorkoutPage/helpers.test.ts` — unit tests
- `pwa/src/pages/WorkoutPage/WorkoutPage.vue` — UI orchestration
- `pwa/src/pages/WorkoutPage/WorkoutPage.test.ts` — integration tests
- `pwa/src/pages/WorkoutPage/WorkoutPage.module.css` — styles
- `pwa/src/utils/time.ts` — time formatting
- `api/src/types.ts` — API types

**Create:**
- `pwa/src/utils/time.test.ts`
- `pwa/src/components/ExerciseSets/ExerciseSets.vue`
- `pwa/src/components/ExerciseSets/ExerciseSets.module.css`
- `pwa/src/components/ExerciseSets/ExerciseSets.test.ts`

---

## Verification

1. Run `cd pwa && npm test` — all unit + integration tests pass
2. Run `cd pwa && npm run type-check` — no TypeScript errors
3. Run `cd api && npm run type-check` — no TypeScript errors
4. Manual test: start dev server, create a workout, start an exercise, add/complete sets, finish exercise, verify total weight, finish workout, verify data saved to API
