import { describe, expect, it } from 'vitest';
import { calculateRelativeBarWidth } from './helpers';

describe('calculateRelativeBarWidth', () => {
  it('scales the highest percentage to 90%', () => {
    expect(calculateRelativeBarWidth(25, 25)).toBe(90);
  });

  it('scales lower percentages proportionally to the max', () => {
    expect(calculateRelativeBarWidth(12.5, 25)).toBe(45);
  });

  it('returns 0 when the max percentage is 0', () => {
    expect(calculateRelativeBarWidth(0, 0)).toBe(0);
  });

  it('returns 0 for a 0 percentage relative to a non-zero max', () => {
    expect(calculateRelativeBarWidth(0, 25)).toBe(0);
  });
});
