import { describe, expect, it } from 'vitest';
import { toMuscleGroupBreakdown } from './helpers';

describe('toMuscleGroupBreakdown', () => {
  it('returns empty arrays when stats is empty', () => {
    const result = toMuscleGroupBreakdown([]);
    expect(result).toEqual({ muscleGroups: [], bodyAreas: [] });
  });

  it('passes muscle groups through sorted by percentage descending', () => {
    const result = toMuscleGroupBreakdown([
      { muscleGroup: 'Quadriceps', bodyArea: 'Legs', percentage: 30 },
      { muscleGroup: 'Pectoralis Major', bodyArea: 'Chest', percentage: 70 },
    ]);
    expect(result.muscleGroups[0].muscleGroup).toBe('Pectoralis Major');
    expect(result.muscleGroups[1].muscleGroup).toBe('Quadriceps');
  });

  it('rolls up muscle groups into body areas', () => {
    const result = toMuscleGroupBreakdown([
      { muscleGroup: 'Pectoralis Major', bodyArea: 'Chest', percentage: 60 },
      { muscleGroup: 'Triceps', bodyArea: 'Arms', percentage: 20 },
      { muscleGroup: 'Biceps', bodyArea: 'Arms', percentage: 20 },
    ]);
    const arms = result.bodyAreas.find((a) => a.bodyArea === 'Arms');
    const chest = result.bodyAreas.find((a) => a.bodyArea === 'Chest');
    expect(arms?.percentage).toBe(40);
    expect(chest?.percentage).toBe(60);
  });

  it('sorts body areas by percentage descending', () => {
    const result = toMuscleGroupBreakdown([
      { muscleGroup: 'Quadriceps', bodyArea: 'Legs', percentage: 30 },
      { muscleGroup: 'Pectoralis Major', bodyArea: 'Chest', percentage: 70 },
    ]);
    expect(result.bodyAreas[0].bodyArea).toBe('Chest');
    expect(result.bodyAreas[1].bodyArea).toBe('Legs');
  });
});
