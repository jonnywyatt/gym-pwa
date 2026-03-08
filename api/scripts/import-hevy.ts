/**
 * Imports workout data from a Hevy CSV export into the user_workouts table.
 *
 * Run with: tsx scripts/import-hevy.ts <userId>
 * Add --dry-run to preview without writing to the database.
 *
 * Prerequisites: run `npm run seed` first to ensure all exercises are in the DB.
 */
import * as fs from 'fs';
import * as path from 'path';
import { RecordSetsType, SetType } from '../src/prisma-client';
import { prisma } from '../src/utils/prisma';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CSV_PATH = path.resolve(
  __dirname,
  '../../specs/development-plan/epic-6-data-import/2026-03-07-hevy-export.csv'
);

const BODY_WEIGHT_KG = 83;

const TITLE_TO_ROUTINE_LABEL: Record<string, string> = {
  Abs: 'Abs',
  Strength: 'Strength',
  Puregym: 'Strength',
  Functional: 'Strength',
};

// Maps every CSV exercise_title to its canonical DB label.
const CSV_EXERCISE_TO_DB_LABEL: Record<string, string> = {
  'Bench Press (Dumbbell)': 'Bench press (dumbell)',
  'Bulgarian Split Squat': 'Bulgarian split squat',
  'Butterfly (Pec Deck)': 'Butterfly machine',
  'Cable Twist (Down to up)': 'Cable Twist (Down to up)',
  'Cable Twist (Up to down)': 'Cable Twist (Up to down)',
  'Chest Press (Machine)': 'Chest press machine',
  'Concentration Curl': 'Concentration curls',
  Crunch: 'Crunch',
  'Dead Bug': 'Dead Bug',
  'Dead Hang': 'Dead hang',
  'Deadlift (Barbell)': 'Deadlift',
  'Farmers Carry': "Farmer's carry",
  'Flutter Kicks': 'Flutter Kicks',
  'Lat Pulldown (Cable)': 'Lat pulldown',
  'Leg Press Horizontal (Machine)': 'Leg press horizontal',
  Lunge: 'Lunge',
  'Lunge (Dumbbell)': 'Lunge',
  Plank: 'Plank',
  'Pull Up (Assisted)': 'Pull up (assisted)',
  'Renegade Row (Dumbbell)': 'Renegade Row (dumbbell)',
  'Reverse Crunch': 'Reverse crunch',
  'Reverse Lunge (Dumbbell)': 'Reverse lunge',
  'Romanian Deadlift (Barbell)': 'Romanian deadlift',
  'Russian Twist (Bodyweight)': 'Russian Twist',
  'Seated Row (Machine)': 'Seated row',
  'Seated squat': 'Seated squat',
  'Shoulder Press (Dumbbell)': 'Shoulder press (dumbell)',
  'Side Plank': 'Side plank',
  'Single leg sit-to-stand': 'Single leg sit-to-stand',
  'Squat (Dumbbell)': 'Dumbbell squats',
  Superman: 'Superman',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CsvRow = {
  title: string;
  start_time: string;
  end_time: string;
  exercise_title: string;
  set_index: number;
  set_type: string;
  weight_kg: number | null;
  reps: number | null;
  duration_seconds: number | null;
};

type CompletedSet = {
  setType: 'Standard';
  weightKg?: number;
  reps?: number;
  timeSeconds?: number;
};

type CompletedExercise = {
  id: number;
  recordSetsType: string;
  sets: CompletedSet[];
};

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseNumber(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function parseCsvDate(dateStr: string): Date {
  // "7 Mar 2026, 10:19" (GMT) → strip comma, append seconds and timezone
  return new Date(dateStr.replace(',', '') + ':00 GMT');
}

function parseCsv(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(Boolean);
  const headers = parseCsvLine(lines[0]);

  const idx = (name: string) => headers.indexOf(name);
  const titleIdx = idx('title');
  const startIdx = idx('start_time');
  const endIdx = idx('end_time');
  const exerciseIdx = idx('exercise_title');
  const setIndexIdx = idx('set_index');
  const setTypeIdx = idx('set_type');
  const weightIdx = idx('weight_kg');
  const repsIdx = idx('reps');
  const durationIdx = idx('duration_seconds');

  return lines.slice(1).map((line) => {
    const f = parseCsvLine(line);
    return {
      title: f[titleIdx],
      start_time: f[startIdx],
      end_time: f[endIdx],
      exercise_title: f[exerciseIdx],
      set_index: parseInt(f[setIndexIdx], 10),
      set_type: f[setTypeIdx],
      weight_kg: parseNumber(f[weightIdx]),
      reps: parseNumber(f[repsIdx]),
      duration_seconds: parseNumber(f[durationIdx]),
    };
  });
}

// ---------------------------------------------------------------------------
// Weight calculation (mirrors pwa/src/pages/WorkoutPage/helpers.ts)
// ---------------------------------------------------------------------------

function calculateSetWeightKg(
  recordSetsType: string,
  bodyWeightKg: number,
  set: CompletedSet
): number {
  const weightKg = set.weightKg ?? 0;
  const reps = set.reps ?? 0;
  switch (recordSetsType) {
    case 'WEIGHT':
      return weightKg * reps;
    case 'BODYWEIGHT_PLUS_WEIGHT':
      return (bodyWeightKg + weightKg) * reps;
    case 'BODYWEIGHT_MINUS_OFFSET':
      return (bodyWeightKg - weightKg) * reps;
    case 'WEIGHT_AND_TIME':
      return weightKg;
    case 'TIME':
    case 'REPS':
    default:
      return 0;
  }
}

function calculateTotalWeightKg(exercises: CompletedExercise[], bodyWeightKg: number): number {
  return exercises.reduce(
    (total, ex) =>
      total +
      ex.sets.reduce((s, set) => s + calculateSetWeightKg(ex.recordSetsType, bodyWeightKg, set), 0),
    0
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const userIdArg = args.find((a) => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');

  if (!userIdArg) {
    console.error('Usage: tsx scripts/import-hevy.ts <userId> [--dry-run]');
    process.exit(1);
  }

  const userId = parseInt(userIdArg, 10);
  if (isNaN(userId)) {
    console.error(`Invalid userId: ${userIdArg}`);
    process.exit(1);
  }

  console.log(`Importing Hevy workouts for userId=${userId}${dryRun ? ' (DRY RUN)' : ''}\n`);

  // Load routines
  const routineRows = await prisma.routine.findMany({
    where: { label: { in: ['Abs', 'Strength'] }, userId: null },
    select: { id: true, label: true },
  });
  const routineIdByLabel = new Map(routineRows.map((r) => [r.label!, r.id]));

  const dbExercises = await prisma.exercise.findMany({
    select: { id: true, label: true, recordSetsType: true },
  });

  type DbExercise = (typeof dbExercises)[number];
  const exerciseByLabel = new Map<string, DbExercise>(dbExercises.map((e) => [e.label, e]));

  function toCompletedExerciseBase(ex: DbExercise): Omit<CompletedExercise, 'sets'> {
    return { id: ex.id, recordSetsType: ex.recordSetsType };
  }

  // Parse CSV and group into workouts keyed by title+start_time
  const rows = parseCsv(CSV_PATH);
  const workoutMap = new Map<string, CsvRow[]>();

  for (const row of rows) {
    if (!TITLE_TO_ROUTINE_LABEL[row.title]) continue;
    const key = `${row.title}|${row.start_time}`;
    if (!workoutMap.has(key)) workoutMap.set(key, []);
    workoutMap.get(key)!.push(row);
  }

  console.log(`Found ${workoutMap.size} workouts to import\n`);

  let imported = 0;
  let skipped = 0;
  const warnings: string[] = [];

  for (const [key, workoutRows] of workoutMap) {
    const { title, start_time, end_time } = workoutRows[0];
    const routineLabel = TITLE_TO_ROUTINE_LABEL[title];
    const routineId = routineIdByLabel.get(routineLabel);

    if (!routineId) {
      warnings.push(
        `No routine found for label "${routineLabel}" (CSV title "${title}") — skipping workout at ${start_time}`
      );
      skipped++;
      continue;
    }

    const startedAt = parseCsvDate(start_time);
    const finishedAt = parseCsvDate(end_time);
    const durationSeconds = Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000);

    // Check for existing record
    const existing = await prisma.userWorkout.findFirst({
      where: { userId, routineId, startedAt },
    });
    if (existing) {
      console.log(`  ↷ Already exists: ${title} at ${start_time} — skipping`);
      skipped++;
      continue;
    }

    // Group rows by exercise, preserving set_index order
    const exerciseMap = new Map<string, CsvRow[]>();
    for (const row of workoutRows) {
      if (!exerciseMap.has(row.exercise_title)) exerciseMap.set(row.exercise_title, []);
      exerciseMap.get(row.exercise_title)!.push(row);
    }

    const exercisesCompleted: CompletedExercise[] = [];

    for (const [csvTitle, setRows] of exerciseMap) {
      const dbLabel = CSV_EXERCISE_TO_DB_LABEL[csvTitle];
      if (!dbLabel) {
        warnings.push(
          `No DB mapping for CSV exercise "${csvTitle}" in workout "${key}" — exercise skipped`
        );
        continue;
      }

      const dbExercise = exerciseByLabel.get(dbLabel);
      if (!dbExercise) {
        warnings.push(
          `Exercise "${dbLabel}" not found in DB (mapped from "${csvTitle}") — exercise skipped`
        );
        continue;
      }

      const sets: CompletedSet[] = setRows
        .sort((a, b) => a.set_index - b.set_index)
        .map((row) => {
          const set: CompletedSet = { setType: 'Standard' };
          if (row.weight_kg !== null) set.weightKg = row.weight_kg;
          if (row.reps !== null) set.reps = row.reps;
          if (row.duration_seconds !== null) set.timeSeconds = row.duration_seconds;
          return set;
        });

      exercisesCompleted.push({ ...toCompletedExerciseBase(dbExercise), sets });
    }

    const totalWeightKg = Math.round(calculateTotalWeightKg(exercisesCompleted, BODY_WEIGHT_KG));

    console.log(
      `  ${dryRun ? '[DRY RUN] ' : ''}Importing: ${title} → ${routineLabel} | ${start_time} | ` +
        `${exercisesCompleted.length} exercises | ${durationSeconds}s | ${totalWeightKg}kg total`
    );

    if (!dryRun) {
      await prisma.userWorkout.create({
        data: {
          userId,
          routineId,
          routineLabel,
          startedAt,
          finishedAt,
          durationSeconds,
          totalWeightKg,
          bodyWeightKg: BODY_WEIGHT_KG,
          exercises: {
            create: exercisesCompleted.map((exercise, position) => ({
              exerciseId: exercise.id,
              position,
              sets: {
                create: exercise.sets.map((set, setPosition) => ({
                  position: setPosition,
                  setType: SetType.STANDARD,
                  weightKg: set.weightKg,
                  reps: set.reps,
                  timeSeconds: set.timeSeconds,
                })),
              },
            })),
          },
        },
      });
    }

    imported++;
  }

  console.log(`\nDone. ${imported} imported, ${skipped} skipped.`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.warn(`   ${w}`));
  }
}

main().catch(console.error);
