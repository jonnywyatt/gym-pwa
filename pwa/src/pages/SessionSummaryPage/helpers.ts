import type { WorkoutMuscleGroupStat } from 'gym-pwa-api/types';
import type { MuscleGroupBreakdown } from '../WorkoutPage/helpers';

export function toMuscleGroupBreakdown(stats: WorkoutMuscleGroupStat[]): MuscleGroupBreakdown {
  const bodyAreaTotals = new Map<string, number>();
  for (const stat of stats) {
    bodyAreaTotals.set(stat.bodyArea, (bodyAreaTotals.get(stat.bodyArea) ?? 0) + stat.percentage);
  }

  return {
    muscleGroups: [...stats].sort((a, b) => b.percentage - a.percentage),
    bodyAreas: Array.from(bodyAreaTotals.entries())
      .map(([bodyArea, percentage]) => ({ bodyArea, percentage: Math.round(percentage * 10) / 10 }))
      .sort((a, b) => b.percentage - a.percentage),
  };
}
