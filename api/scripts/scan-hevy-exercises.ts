/**
 * Scans the Hevy CSV export and reports which exercise_title values don't have
 * an obvious match to exercises already in the database.
 *
 * Run with: tsx scripts/scan-hevy-exercises.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/utils/prisma';

const RELEVANT_TITLES = new Set(['Abs', 'Strength', 'Puregym', 'Functional']);

const CSV_PATH = path.resolve(
  __dirname,
  '../../specs/development-plan/epic-6-data-import/2026-03-07-hevy-export.csv'
);

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

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // remove parenthetical qualifiers e.g. "(Machine)", "(Barbell)"
    .replace(/'/g, '') // remove apostrophes
    .replace(/s\b/g, '') // remove trailing 's' (plurals)
    .replace(/\s+/g, ' ')
    .trim();
}

type MatchResult =
  | { type: 'exact'; dbLabel: string }
  | { type: 'approximate'; dbLabel: string }
  | { type: 'none' };

function findMatch(csvTitle: string, dbLabels: string[]): MatchResult {
  // Case-insensitive exact match
  for (const label of dbLabels) {
    if (label.toLowerCase() === csvTitle.toLowerCase()) {
      return { type: 'exact', dbLabel: label };
    }
  }

  // Normalized contains match
  const normCsv = normalize(csvTitle);
  for (const label of dbLabels) {
    const normDb = normalize(label);
    if (normCsv === normDb || normCsv.includes(normDb) || normDb.includes(normCsv)) {
      return { type: 'approximate', dbLabel: label };
    }
  }

  return { type: 'none' };
}

async function main() {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n').filter(Boolean);

  const headers = parseCsvLine(lines[0]);
  const titleIdx = headers.indexOf('title');
  const exerciseTitleIdx = headers.indexOf('exercise_title');

  const csvExerciseTitles = new Set<string>();
  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line);
    const title = fields[titleIdx];
    const exerciseTitle = fields[exerciseTitleIdx]?.trim();
    if (RELEVANT_TITLES.has(title) && exerciseTitle) {
      csvExerciseTitles.add(exerciseTitle);
    }
  }

  const dbExercises = await prisma.exercise.findMany({ select: { label: true } });
  const dbLabels = dbExercises.map((e) => e.label);

  console.log(
    `\nFound ${csvExerciseTitles.size} unique exercise titles in CSV (from relevant workouts)`
  );
  console.log(`Found ${dbLabels.length} exercises in database\n`);

  const exact: string[] = [];
  const approximate: { csv: string; dbLabel: string }[] = [];
  const noMatch: string[] = [];

  for (const csvTitle of [...csvExerciseTitles].sort()) {
    const result = findMatch(csvTitle, dbLabels);
    if (result.type === 'exact') {
      exact.push(csvTitle);
    } else if (result.type === 'approximate') {
      approximate.push({ csv: csvTitle, dbLabel: result.dbLabel });
    } else {
      noMatch.push(csvTitle);
    }
  }

  console.log(`✅ Clear matches (${exact.length}):`);
  for (const t of exact) {
    console.log(`   ${t}`);
  }

  console.log(`\n⚠️  Approximate matches — review needed (${approximate.length}):`);
  for (const { csv, dbLabel } of approximate) {
    console.log(`   "${csv}"  →  "${dbLabel}"`);
  }

  console.log(`\n❌ No match found — add to DB or provide a mapping (${noMatch.length}):`);
  for (const t of noMatch) {
    console.log(`   ${t}`);
  }
}

main().catch(console.error);
