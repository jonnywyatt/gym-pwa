# Gym Tracker App: Analysis & Data Logic

## 1. Effort-Based Calculation Model
To ensure that large muscle groups (like legs) don't numerically overwhelm smaller groups (like biceps) on a bar chart, the app uses a **Weighted Effective Sets** model instead of raw volume load.

### The Set-Point Formula
For every set completed in a session, a score ($S$) is calculated for each involved muscle ($m$):
$$S_{m,e} = (1.0 \times Q) \times i_m$$

**Variables:**
* **$Q$ (Quality Multiplier):** Working Set = $1.0$ | Warmup Set = $0.5$.
* **$i_m$ (Intensity Tier):** Primary = $1.0$ | Secondary = $0.5$ | Tertiary = $0.2$.

### Proportion Calculation
To generate the bar chart percentages, the individual muscle scores are normalized against the session total:
$$\text{Muscle Area \%} = \left( \frac{\sum S_{m}}{\sum S_{total}} \right) \times 100$$

---

## 2. Special Factors Logic
* **Isometrics (Time-based):** 45 seconds of a hold is treated as $1$ "Effective Set."
* **Body Weight (BW) Factor:** For "Effort" charts, the BW factor is ignored to maintain parity between bodyweight and weighted exercises. For "Total Tonnage" stats, weight is calculated as $(\text{User BW} \times \text{Mechanical Factor}) + \text{External Weight}$.
* **Unilateral:** Exercises marked "Yes" should double the calculated volume if the user inputs reps performed *per side*.

---

## 3. Exercise Data Mapping

| id | Label | Primary | Secondary | Tertiary | BW Factor | Isometric | Unilateral |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Pull up (assisted) | Lats | Biceps, Rhomboids | Forearms, Core | Yes (Net) | No | No |
| 2 | Chest press machine | Chest | Triceps | Front Delts | No | No | No |
| 3 | Dead hang | Forearms | Lats | Core, Traps | 100% | Yes | No |
| 4 | Farmer's carry | Forearms | Traps, Core | Glutes, Calves | No | Yes | No |
| 5 | Butterfly machine | Chest | Front Delts | None | No | No | No |
| 6 | Lat pulldown | Lats | Biceps, Rhomboids | Rear Delts | No | No | No |
| 7 | Leg press horizontal | Quads | Glutes | Hamstrings | No | No | No |
| 8 | Seated row | Back (Mid) | Biceps, Lats | Rear Delts | No | No | No |
| 9 | Shoulder press (DB) | Delts (Front/Mid) | Triceps | Upper Chest | No | No | No |
| 10 | Single leg sit-to-stand| Quads | Glutes | Core, Calves | 100% | No | Yes |
| 11 | Bulgarian split squat | Quads | Glutes | Adductors, Core | 100% | No | Yes |
| 12 | Reverse lunge | Quads | Glutes | Hamstrings, Core | 100% | No | Yes |
| 337| Plank | Core (Abs) | Obliques | Shoulders, Quads | 50% | Yes | No |
| 338| Side plank | Obliques | Core (Abs) | Shoulders, Glutes | 50% | Yes | Yes |
| 339| Reverse crunch | Core (Lower) | Obliques | Hip Flexors | 20% | No | No |
| 340| Superman | Lower Back | Glutes | Hamstrings | 20% | No | No |
| 453| Bench press (barbell) | Chest | Triceps | Front Delts | No | No | No |
| 454| Pull up | Lats | Biceps, Rhomboids | Forearms, Core | 100% | No | No |
| 455| Leg extension | Quads | None | None | No | No | No |
| 456| Tricep dips | Triceps | Chest | Front Delts | 100% | No | No |
| 457| Back extension | Lower Back | Glutes | Hamstrings | 50% | No | No |
| 626| Hip thrusts | Glutes | Hamstrings | Core | 50% | No | No |
| 627| Step ups | Quads | Glutes | Calves, Core | 100% | No | Yes |
| 628| Cable kickbacks | Glutes | Hamstrings | None | No | No | Yes |
| 629| Romanian deadlift | Hamstrings | Glutes | Lower Back, Grip | No | No | No |
| 630| Concentration curls | Biceps | Forearms | None | No | No | Yes |
| 839| Bench press (DB) | Chest | Triceps | Front Delts | No | No | No |
| 840| Crunch | Core (Abs) | None | None | 20% | No | No |
| 841| Deadlift | Glutes, Hams | Grip, Traps | Lower Back, Core | No | No | No |
| 842| Dumbbell squats | Quads | Glutes | Lower Back, Core | No | No | No |
| 843| Lunge | Quads | Glutes | Hamstrings | 100% | No | Yes |
| 844| Cable Twist (D to U) | Obliques | Core (Abs) | Shoulders | No | No | Yes |
| 845| Cable Twist (U to D) | Obliques | Core (Abs) | Shoulders | No | No | Yes |
| 846| Dead Bug | Core (Abs) | Obliques | Hip Flexors | 10% | No | No |
| 847| Flutter Kicks | Core (Lower) | Hip Flexors | Quads | 10% | No | No |
| 848| Renegade Row (DB) | Back (Mid) | Core, Biceps | Front Delts | No | No | Yes |
| 849| Russian Twist | Obliques | Core (Abs) | Hip Flexors | 30% | No | No |
| 850| Seated squat | Quads | Glutes | Hamstrings | No | No | No |

