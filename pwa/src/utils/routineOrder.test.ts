import { describe, expect, it } from 'vitest';
import { compareByFixedRoutineOrder } from './routineOrder';

describe('compareByFixedRoutineOrder', () => {
  it('sorts fixed-order labels as Upper body, Lower body, Core', () => {
    const labels = ['Core', 'Lower body', 'Upper body'];
    const sorted = [...labels].sort(compareByFixedRoutineOrder);
    expect(sorted).toEqual(['Upper body', 'Lower body', 'Core']);
  });

  it('places fixed-order labels before unmapped labels', () => {
    expect(compareByFixedRoutineOrder('Cardio', 'Core')).toBeGreaterThan(0);
    expect(compareByFixedRoutineOrder('Core', 'Cardio')).toBeLessThan(0);
  });

  it('returns 0 for two unmapped labels, preserving their original order', () => {
    expect(compareByFixedRoutineOrder('Cardio', 'Yoga')).toBe(0);
  });
});
