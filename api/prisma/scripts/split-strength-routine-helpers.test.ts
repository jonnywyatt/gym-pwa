import { describe, expect, it } from 'vitest';
import {
  calculateExercisesTotalReps,
  calculateExercisesTotalWeightKg,
  calculateSetWeightKg,
  calculateSplitDurationSeconds,
} from './split-strength-routine-helpers';

describe('calculateSetWeightKg', () => {
  it('adds weight and bodyweight contribution for WEIGHT sets', () => {
    const result = calculateSetWeightKg('WEIGHT', 80, { weightKg: 20, reps: 10 }, null);
    expect(result).toBe(200);
  });

  it('includes bodyweight for BODYWEIGHT_PLUS_WEIGHT sets', () => {
    const result = calculateSetWeightKg(
      'BODYWEIGHT_PLUS_WEIGHT',
      80,
      { weightKg: 10, reps: 5 },
      null
    );
    expect(result).toBe(450);
  });

  it('subtracts assistance offset for BODYWEIGHT_MINUS_OFFSET sets', () => {
    const result = calculateSetWeightKg(
      'BODYWEIGHT_MINUS_OFFSET',
      80,
      { weightKg: 20, reps: 5 },
      null
    );
    expect(result).toBe(300);
  });

  it('returns only weight for WEIGHT_AND_TIME sets', () => {
    const result = calculateSetWeightKg('WEIGHT_AND_TIME', 80, { weightKg: 15, reps: 0 }, null);
    expect(result).toBe(15);
  });

  it('returns 0 for TIME sets', () => {
    const result = calculateSetWeightKg('TIME', 80, {}, 1.0);
    expect(result).toBe(0);
  });

  it('uses bwFactor contribution for REPS sets', () => {
    const result = calculateSetWeightKg('REPS', 80, { reps: 10 }, 0.2);
    expect(result).toBe(160);
  });
});

describe('calculateExercisesTotalWeightKg', () => {
  it('sums weight across all exercises and sets', () => {
    const total = calculateExercisesTotalWeightKg(
      [
        {
          recordSetsType: 'WEIGHT',
          bwFactor: null,
          sets: [{ weightKg: 20, reps: 10 }],
        },
        {
          recordSetsType: 'REPS',
          bwFactor: 0.2,
          sets: [{ reps: 10 }],
        },
      ],
      80
    );
    expect(total).toBe(200 + 160);
  });

  it('rounds the total to a whole number', () => {
    const total = calculateExercisesTotalWeightKg(
      [
        {
          recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
          bwFactor: null,
          sets: [{ weightKg: 15.3, reps: 3 }],
        },
      ],
      70.4
    );
    expect(Number.isInteger(total)).toBe(true);
  });
});

describe('calculateExercisesTotalReps', () => {
  it('sums reps for rep-based exercises only', () => {
    const total = calculateExercisesTotalReps([
      { recordSetsType: 'WEIGHT', bwFactor: null, sets: [{ reps: 10 }, { reps: 8 }] },
      { recordSetsType: 'TIME', bwFactor: null, sets: [{ reps: 100 }] },
    ]);
    expect(total).toBe(18);
  });

  it('excludes TIME and WEIGHT_AND_TIME exercises', () => {
    const total = calculateExercisesTotalReps([
      { recordSetsType: 'TIME', bwFactor: null, sets: [{ reps: 10 }] },
      { recordSetsType: 'WEIGHT_AND_TIME', bwFactor: null, sets: [{ reps: 10 }] },
    ]);
    expect(total).toBe(0);
  });
});

describe('calculateSplitDurationSeconds', () => {
  it('splits duration proportionally to set count', () => {
    const result = calculateSplitDurationSeconds(1800, 6, 10);
    expect(result).toBe(1080);
  });

  it('returns undefined when the original duration is null', () => {
    const result = calculateSplitDurationSeconds(null, 6, 10);
    expect(result).toBeUndefined();
  });

  it('returns undefined when there are no sets at all', () => {
    const result = calculateSplitDurationSeconds(1800, 0, 0);
    expect(result).toBeUndefined();
  });
});
