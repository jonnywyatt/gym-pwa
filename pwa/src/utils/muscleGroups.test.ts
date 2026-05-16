import { describe, expect, it } from 'vitest';
import { getBodyAreasForExercise, muscleGroupToBodyArea } from './muscleGroups';

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
