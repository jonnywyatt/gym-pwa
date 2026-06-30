import { describe, expect, it } from 'vitest';
import {
  getBodyAreasForExercise,
  getMuscleMapSvgIds,
  getVisibleViews,
  muscleGroupToBodyArea,
  muscleGroupToSvgIds,
} from './muscleGroups';

describe('muscleGroupToBodyArea', () => {
  it('maps all muscle groups to a body area', () => {
    const bodyAreas = new Set(Object.values(muscleGroupToBodyArea));
    expect(bodyAreas.size).toBe(6);
    expect(bodyAreas).toContain('Chest');
    expect(bodyAreas).toContain('Back');
    expect(bodyAreas).toContain('Shoulders');
    expect(bodyAreas).toContain('Arms');
    expect(bodyAreas).toContain('Core');
    expect(bodyAreas).toContain('Legs');
  });
});

describe('muscleGroupToSvgIds', () => {
  it('maps all 20 muscle groups', () => {
    expect(Object.keys(muscleGroupToSvgIds)).toHaveLength(20);
  });

  it('maps chest muscles to chest svg id', () => {
    expect(muscleGroupToSvgIds['Pectoralis Major']).toContain('chest');
    expect(muscleGroupToSvgIds['Pectoralis Minor']).toContain('chest');
  });

  it('maps back muscles to correct svg ids', () => {
    expect(muscleGroupToSvgIds['Latissimus Dorsi']).toContain('lats');
    expect(muscleGroupToSvgIds['Erector Spinae']).toContain('lowerback');
    expect(muscleGroupToSvgIds.Rhomboids).toContain('traps-middle');
    expect(muscleGroupToSvgIds.Trapezius).toContain('traps');
    expect(muscleGroupToSvgIds.Trapezius).toContain('traps-middle');
  });

  it('maps shoulder muscles to correct svg ids', () => {
    expect(muscleGroupToSvgIds['Front Deltoids']).toContain('front-shoulders');
    expect(muscleGroupToSvgIds['Rear Deltoids']).toContain('rear-shoulders');
    expect(muscleGroupToSvgIds['Medial Deltoids']).toContain('front-shoulders');
    expect(muscleGroupToSvgIds['Medial Deltoids']).toContain('rear-shoulders');
  });
});

describe('getMuscleMapSvgIds', () => {
  it('returns svg ids for given muscle groups', () => {
    const result = getMuscleMapSvgIds(['Pectoralis Major', 'Biceps']);
    expect(result).toContain('chest');
    expect(result).toContain('biceps');
  });

  it('deduplicates svg ids', () => {
    const result = getMuscleMapSvgIds(['Pectoralis Major', 'Pectoralis Minor']);
    expect(result.filter((id) => id === 'chest')).toHaveLength(1);
  });

  it('includes all ids when a muscle maps to multiple', () => {
    const result = getMuscleMapSvgIds(['Trapezius']);
    expect(result).toContain('traps');
    expect(result).toContain('traps-middle');
  });

  it('returns empty array for empty input', () => {
    expect(getMuscleMapSvgIds([])).toEqual([]);
  });
});

describe('getVisibleViews', () => {
  it('shows front for front-only muscles', () => {
    const result = getVisibleViews(['chest', 'abdominals']);
    expect(result.front).toBe(true);
    expect(result.back).toBe(false);
  });

  it('shows back for back-only muscles', () => {
    const result = getVisibleViews(['lats', 'glutes']);
    expect(result.front).toBe(false);
    expect(result.back).toBe(true);
  });

  it('shows both views for muscles that appear on both sides', () => {
    const result = getVisibleViews(['chest', 'lats']);
    expect(result.front).toBe(true);
    expect(result.back).toBe(true);
  });

  it('shows neither view for empty ids', () => {
    const result = getVisibleViews([]);
    expect(result.front).toBe(false);
    expect(result.back).toBe(false);
  });
});

describe('getBodyAreasForExercise', () => {
  it('returns body areas from primary muscle groups', () => {
    const result = getBodyAreasForExercise(['Pectoralis Major', 'Triceps'], [], []);
    expect(result).toEqual(['Chest', 'Arms']);
  });

  it('returns body areas in priority order: primary, secondary, tertiary', () => {
    const result = getBodyAreasForExercise(['Pectoralis Major'], ['Biceps'], ['Quadriceps']);
    expect(result).toEqual(['Chest', 'Arms', 'Legs']);
  });

  it('deduplicates body areas across tiers', () => {
    const result = getBodyAreasForExercise(
      ['Pectoralis Major'],
      ['Pectoralis Minor', 'Triceps'],
      ['Forearms']
    );
    expect(result).toEqual(['Chest', 'Arms']);
  });

  it('returns empty array when no muscle groups provided', () => {
    const result = getBodyAreasForExercise([], [], []);
    expect(result).toEqual([]);
  });

  it('preserves insertion order within a tier', () => {
    const result = getBodyAreasForExercise(['Quadriceps', 'Glutes', 'Latissimus Dorsi'], [], []);
    expect(result).toEqual(['Legs', 'Back']);
  });

  it('does not repeat a body area already seen in primary when it appears in secondary', () => {
    const result = getBodyAreasForExercise(['Latissimus Dorsi'], ['Trapezius', 'Biceps'], []);
    expect(result).toEqual(['Back', 'Arms']);
  });
});
