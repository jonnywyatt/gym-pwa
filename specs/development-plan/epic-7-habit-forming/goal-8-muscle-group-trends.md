# Goal 8: muscle group trends

The exercises within routines and sessions could be analysed to get a picture of which muscles and muscle groups are being exercised.

Each exercise has primary and secondary muscle groups that are being worked. Can you recommend a calculation that would produce a % for each muscle group, as a proportion of the total session? To calculate its contribution per exercise, it might factor in weight moved / duration of sets / number of reps, as well as whether it was a primary or secondary muscle group for that exercise.

When the proportions for each muscle group in the session are calculated, they can also be grouped by body area.

I'll then design some UI to present both views.

## Calculation formula

### Step 1: Set volume

Per set, compute a volume score based on the exercise's `recordSetsType`:

| `recordSetsType` | Volume formula |
|---|---|
| `WEIGHT`, `BODYWEIGHT_PLUS_WEIGHT` | `weightKg × reps` |
| `REPS`, `BODYWEIGHT_MINUS_OFFSET` | `reps` |
| `TIME` | `timeSeconds` |
| `WEIGHT_AND_TIME` | `weightKg × timeSeconds` |

Exclude `WARMUP` sets from the calculation.

### Step 2: Exercise volume and muscle group attribution

Sum set volumes across all standard sets for the exercise to get `exerciseVolume`.

Split the volume across the exercise's muscle groups:
- Primary muscle groups each receive: `exerciseVolume × 1.0 ÷ primaryCount`
- Secondary muscle groups each receive: `exerciseVolume × 0.5 ÷ secondaryCount`

The `0.5` weighting reflects that secondary muscles assist rather than drive the movement.

### Step 3: Session totals and percentages

Sum contributions across all exercises for each muscle group:

```
muscleGroupScore[mg] = sum of all primary and secondary shares for that muscle group
muscleGroupPercent[mg] = muscleGroupScore[mg] / sum(all scores) × 100
```

### Step 4: Body area rollup

```
bodyAreaPercent[area] = sum of muscleGroupPercent for all muscle groups in that area
```

### Edge cases

| Scenario | Handling |
|---|---|
| Exercise has no muscle groups | Skip from calculation |
| Exercise has only warmup sets, or no sets | Skip from calculation |
| Exercise has only secondary muscle groups | Treat secondary groups as primary |
