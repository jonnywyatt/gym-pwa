import { describe, expect, it } from 'vitest';
import { getFixedRoutineColour } from './routineColours';

describe('getFixedRoutineColour', () => {
  it('returns the mapped colour for Upper body', () => {
    expect(getFixedRoutineColour('Upper body')).toBe('var(--em-accent-teal)');
  });

  it('returns the mapped colour for Lower body', () => {
    expect(getFixedRoutineColour('Lower body')).toBe('var(--em-accent-emerald)');
  });

  it('returns the mapped colour for Core', () => {
    expect(getFixedRoutineColour('Core')).toBe('var(--em-accent-aqua)');
  });

  it('returns undefined for routines without a fixed colour', () => {
    expect(getFixedRoutineColour('Cardio')).toBeUndefined();
  });
});
