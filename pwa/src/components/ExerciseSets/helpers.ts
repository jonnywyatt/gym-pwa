import type { WorkoutSet } from '../../lib/db';

export function getCompletedTotalTimeSeconds(sets: WorkoutSet[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + (set.timeSeconds ?? 0), 0);
}

export function getCompletedTotalReps(sets: WorkoutSet[]): number {
  return sets.filter((set) => set.completed).reduce((total, set) => total + (set.reps ?? 0), 0);
}

export function formatTotalTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

export function getRepresentativeWeightKg(sets: WorkoutSet[]): number | undefined {
  const completedSets = sets.filter((set) => set.completed);
  const standardSet = completedSets.find((set) => set.setType !== 'Warmup');
  const set = standardSet ?? completedSets[0];
  return set?.weightKg;
}

export function getMinutes(timeSeconds: number | undefined): string {
  if (timeSeconds === undefined) return '';
  return String(Math.floor(timeSeconds / 60));
}

export function getSeconds(timeSeconds: number | undefined): string {
  if (timeSeconds === undefined) return '';
  return String(timeSeconds % 60);
}

export function combineTimeSeconds(
  currentTimeSeconds: number | undefined,
  field: 'minutes' | 'seconds',
  value: string
): number | undefined {
  const numValue = Number(value) || 0;
  const currentMinutes = currentTimeSeconds !== undefined ? Math.floor(currentTimeSeconds / 60) : 0;
  const currentSeconds = currentTimeSeconds !== undefined ? currentTimeSeconds % 60 : 0;

  const newMinutes = field === 'minutes' ? numValue : currentMinutes;
  const newSeconds = field === 'seconds' ? Math.min(numValue, 59) : currentSeconds;
  const totalSeconds = newMinutes * 60 + newSeconds;

  return totalSeconds || undefined;
}
