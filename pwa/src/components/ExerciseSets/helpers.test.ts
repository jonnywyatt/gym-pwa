import { describe, expect, it } from 'vitest';
import {
  combineTimeSeconds,
  formatTotalTime,
  getCompletedTotalTimeSeconds,
  getMinutes,
  getRepresentativeWeightKg,
  getSeconds,
} from './helpers';

describe('getCompletedTotalTimeSeconds', () => {
  it('returns 0 when no sets are completed', () => {
    expect(
      getCompletedTotalTimeSeconds([
        { id: 's1', setType: 'Standard', completed: false, timeSeconds: 30 },
      ])
    ).toBe(0);
  });

  it('sums timeSeconds from completed sets only', () => {
    expect(
      getCompletedTotalTimeSeconds([
        { id: 's1', setType: 'Standard', completed: true, timeSeconds: 30 },
        { id: 's2', setType: 'Standard', completed: false, timeSeconds: 30 },
        { id: 's3', setType: 'Standard', completed: true, timeSeconds: 45 },
      ])
    ).toBe(75);
  });

  it('treats missing timeSeconds as 0', () => {
    expect(getCompletedTotalTimeSeconds([{ id: 's1', setType: 'Standard', completed: true }])).toBe(
      0
    );
  });
});

describe('formatTotalTime', () => {
  it('formats seconds only', () => {
    expect(formatTotalTime(45)).toBe('45s');
  });

  it('formats minutes only', () => {
    expect(formatTotalTime(120)).toBe('2m');
  });

  it('formats minutes and seconds', () => {
    expect(formatTotalTime(90)).toBe('1m 30s');
  });

  it('formats 0 seconds as 0s', () => {
    expect(formatTotalTime(0)).toBe('0s');
  });
});

describe('getRepresentativeWeightKg', () => {
  it('returns undefined when no sets are completed', () => {
    expect(
      getRepresentativeWeightKg([{ id: 's1', setType: 'Standard', completed: false, weightKg: 20 }])
    ).toBeUndefined();
  });

  it('returns weight from first completed standard set', () => {
    expect(
      getRepresentativeWeightKg([
        { id: 's1', setType: 'Warmup', completed: true, weightKg: 10 },
        { id: 's2', setType: 'Standard', completed: true, weightKg: 20 },
      ])
    ).toBe(20);
  });

  it('falls back to warmup set when no standard sets are completed', () => {
    expect(
      getRepresentativeWeightKg([{ id: 's1', setType: 'Warmup', completed: true, weightKg: 10 }])
    ).toBe(10);
  });

  it('returns undefined when completed set has no weight', () => {
    expect(
      getRepresentativeWeightKg([{ id: 's1', setType: 'Standard', completed: true }])
    ).toBeUndefined();
  });
});

describe('getMinutes', () => {
  it('returns empty string when timeSeconds is undefined', () => {
    expect(getMinutes(undefined)).toBe('');
  });

  it('returns minutes from total seconds', () => {
    expect(getMinutes(90)).toBe('1');
  });

  it('returns 0 for less than 60 seconds', () => {
    expect(getMinutes(45)).toBe('0');
  });

  it('floors partial minutes', () => {
    expect(getMinutes(125)).toBe('2');
  });
});

describe('getSeconds', () => {
  it('returns empty string when timeSeconds is undefined', () => {
    expect(getSeconds(undefined)).toBe('');
  });

  it('returns remaining seconds', () => {
    expect(getSeconds(90)).toBe('30');
  });

  it('returns full value when under 60', () => {
    expect(getSeconds(45)).toBe('45');
  });

  it('returns 0 for exact minutes', () => {
    expect(getSeconds(120)).toBe('0');
  });
});

describe('combineTimeSeconds', () => {
  it('updates minutes while preserving existing seconds', () => {
    expect(combineTimeSeconds(90, 'minutes', '2')).toBe(150);
  });

  it('updates seconds while preserving existing minutes', () => {
    expect(combineTimeSeconds(90, 'seconds', '45')).toBe(105);
  });

  it('caps seconds at 59', () => {
    expect(combineTimeSeconds(60, 'seconds', '75')).toBe(119);
  });

  it('returns undefined when result is 0', () => {
    expect(combineTimeSeconds(undefined, 'minutes', '0')).toBeUndefined();
  });

  it('handles undefined currentTimeSeconds for minutes', () => {
    expect(combineTimeSeconds(undefined, 'minutes', '2')).toBe(120);
  });

  it('handles undefined currentTimeSeconds for seconds', () => {
    expect(combineTimeSeconds(undefined, 'seconds', '30')).toBe(30);
  });

  it('handles non-numeric value as 0', () => {
    expect(combineTimeSeconds(90, 'minutes', '')).toBe(30);
  });
});
