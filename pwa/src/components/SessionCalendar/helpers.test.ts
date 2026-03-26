import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import { describe, expect, it } from 'vitest';
import {
  buildCalendarDays,
  buildRoutineColourMap,
  formatSessionStat,
  getDotBackground,
  getRoutineSummaries,
  ROUTINE_COLOURS,
} from './helpers';

const makeWorkout = (
  id: number,
  routineId: number,
  routineLabel: string,
  startedAt: string
): UserWorkoutSummary => ({
  id,
  userId: 1,
  routineId,
  routineLabel,
  startedAt,
  finishedAt: startedAt,
  durationSeconds: 3600,
  exerciseCount: 0,
  bodyWeightKg: 80,
  totalWeightKg: 0,
});

describe('buildRoutineColourMap', () => {
  it('assigns colour 1 to the routine with the most sessions', () => {
    const sessions = [
      makeWorkout(1, 10, 'Strength', '2024-01-01T10:00:00Z'),
      makeWorkout(2, 10, 'Strength', '2024-01-02T10:00:00Z'),
      makeWorkout(3, 10, 'Strength', '2024-01-03T10:00:00Z'),
      makeWorkout(4, 20, 'Cardio', '2024-01-04T10:00:00Z'),
    ];

    const colourMap = buildRoutineColourMap(sessions);

    expect(colourMap.get(10)).toBe(ROUTINE_COLOURS[0]);
    expect(colourMap.get(20)).toBe(ROUTINE_COLOURS[1]);
  });

  it('assigns colours to multiple routines sorted by count descending', () => {
    const sessions = [
      makeWorkout(1, 1, 'A', '2024-01-01T10:00:00Z'),
      makeWorkout(2, 2, 'B', '2024-01-02T10:00:00Z'),
      makeWorkout(3, 2, 'B', '2024-01-03T10:00:00Z'),
      makeWorkout(4, 2, 'B', '2024-01-04T10:00:00Z'),
      makeWorkout(5, 3, 'C', '2024-01-05T10:00:00Z'),
      makeWorkout(6, 3, 'C', '2024-01-06T10:00:00Z'),
    ];

    const colourMap = buildRoutineColourMap(sessions);

    expect(colourMap.get(2)).toBe(ROUTINE_COLOURS[0]);
    expect(colourMap.get(3)).toBe(ROUTINE_COLOURS[1]);
    expect(colourMap.get(1)).toBe(ROUTINE_COLOURS[2]);
  });

  it('wraps back to first colour when there are more than 4 routines', () => {
    const sessions = [1, 2, 3, 4, 5].map((id) =>
      makeWorkout(id, id, `Routine ${id}`, `2024-01-0${id}T10:00:00Z`)
    );

    const colourMap = buildRoutineColourMap(sessions);

    expect(colourMap.get(5)).toBe(ROUTINE_COLOURS[0]);
  });

  it('returns an empty map for empty sessions', () => {
    const colourMap = buildRoutineColourMap([]);

    expect(colourMap.size).toBe(0);
  });
});

describe('getRoutineSummaries', () => {
  it('returns summaries sorted by count descending', () => {
    const sessions = [
      makeWorkout(1, 1, 'Strength', '2024-01-01T10:00:00Z'),
      makeWorkout(2, 1, 'Strength', '2024-01-02T10:00:00Z'),
      makeWorkout(3, 1, 'Strength', '2024-01-03T10:00:00Z'),
      makeWorkout(4, 2, 'Cardio', '2024-01-04T10:00:00Z'),
      makeWorkout(5, 2, 'Cardio', '2024-01-05T10:00:00Z'),
    ];
    const colourMap = buildRoutineColourMap(sessions);

    const summaries = getRoutineSummaries(sessions, colourMap);

    expect(summaries[0]).toEqual({
      routineId: 1,
      label: 'Strength',
      count: 3,
      colour: ROUTINE_COLOURS[0],
    });
    expect(summaries[1]).toEqual({
      routineId: 2,
      label: 'Cardio',
      count: 2,
      colour: ROUTINE_COLOURS[1],
    });
  });

  it('returns at most 3 summaries', () => {
    const sessions = [1, 2, 3, 4].map((id) =>
      makeWorkout(id, id, `Routine ${id}`, `2024-01-0${id}T10:00:00Z`)
    );
    const colourMap = buildRoutineColourMap(sessions);

    const summaries = getRoutineSummaries(sessions, colourMap);

    expect(summaries).toHaveLength(3);
  });

  it('returns empty array for empty sessions', () => {
    const summaries = getRoutineSummaries([], new Map());

    expect(summaries).toHaveLength(0);
  });
});

describe('buildCalendarDays', () => {
  it('returns 7 days when startDate is a Monday and endDate is a Sunday', () => {
    const startDate = new Date('2024-01-01T00:00:00'); // Monday
    const endDate = new Date('2024-01-07T00:00:00'); // Sunday

    const days = buildCalendarDays(startDate, endDate, []);

    expect(days).toHaveLength(7);
    expect(days.every((d) => d.dateNumber !== null)).toBe(true);
  });

  it('includes padding cells for days before startDate in the same week', () => {
    const startDate = new Date('2024-01-03T00:00:00'); // Wednesday
    const endDate = new Date('2024-01-07T00:00:00'); // Sunday

    const days = buildCalendarDays(startDate, endDate, []);

    expect(days).toHaveLength(7);
    expect(days[0].dateNumber).toBeNull(); // Monday padding
    expect(days[1].dateNumber).toBeNull(); // Tuesday padding
    expect(days[2].dateNumber).toBe(3); // Wednesday = startDate
  });

  it('includes padding cells for days after endDate in the same week', () => {
    const startDate = new Date('2024-01-01T00:00:00'); // Monday
    const endDate = new Date('2024-01-05T00:00:00'); // Friday

    const days = buildCalendarDays(startDate, endDate, []);

    expect(days).toHaveLength(7);
    expect(days[4].dateNumber).toBe(5); // Friday = endDate
    expect(days[5].dateNumber).toBeNull(); // Saturday padding
    expect(days[6].dateNumber).toBeNull(); // Sunday padding
  });

  it('correctly groups session routineIds by date', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-07T00:00:00');
    const sessions = [
      makeWorkout(1, 10, 'Strength', '2024-01-01T10:00:00Z'),
      makeWorkout(2, 20, 'Cardio', '2024-01-01T14:00:00Z'),
      makeWorkout(3, 30, 'Abs', '2024-01-03T10:00:00Z'),
    ];

    const days = buildCalendarDays(startDate, endDate, sessions);

    const jan1 = days.find((d) => d.dateNumber === 1);
    const jan3 = days.find((d) => d.dateNumber === 3);
    const jan2 = days.find((d) => d.dateNumber === 2);

    expect(jan1?.routineIds).toHaveLength(2);
    expect(jan1?.routineIds).toContain(10);
    expect(jan1?.routineIds).toContain(20);
    expect(jan3?.routineIds).toEqual([30]);
    expect(jan2?.routineIds).toHaveLength(0);
    expect(jan2?.hasSession).toBe(false);
  });

  it('populates daySessions for days with sessions', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-07T00:00:00');
    const w42 = makeWorkout(42, 10, 'Strength', '2024-01-01T10:00:00Z');
    const w43 = makeWorkout(43, 20, 'Cardio', '2024-01-01T14:00:00Z');
    const w44 = makeWorkout(44, 30, 'Abs', '2024-01-03T10:00:00Z');
    const sessions = [w42, w43, w44];

    const days = buildCalendarDays(startDate, endDate, sessions);

    const jan1 = days.find((d) => d.dateNumber === 1);
    const jan3 = days.find((d) => d.dateNumber === 3);
    const jan2 = days.find((d) => d.dateNumber === 2);

    expect(jan1?.daySessions).toContainEqual(w42);
    expect(jan1?.daySessions).toContainEqual(w43);
    expect(jan3?.daySessions).toEqual([w44]);
    expect(jan2?.daySessions).toHaveLength(0);
  });

  it('deduplicates routineIds per day when same routine used multiple times', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-07T00:00:00');
    const sessions = [
      makeWorkout(1, 10, 'Strength', '2024-01-01T09:00:00Z'),
      makeWorkout(2, 10, 'Strength', '2024-01-01T17:00:00Z'),
    ];

    const days = buildCalendarDays(startDate, endDate, sessions);

    const jan1 = days.find((d) => d.dateNumber === 1);
    expect(jan1?.routineIds).toHaveLength(1);
    expect(jan1?.routineIds).toContain(10);
  });

  it('marks hasSession correctly', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-07T00:00:00');
    const sessions = [makeWorkout(1, 10, 'Strength', '2024-01-03T10:00:00Z')];

    const days = buildCalendarDays(startDate, endDate, sessions);

    expect(days.find((d) => d.dateNumber === 3)?.hasSession).toBe(true);
    expect(days.find((d) => d.dateNumber === 1)?.hasSession).toBe(false);
  });

  it('marks isToday correctly using the injected today param', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-07T00:00:00');
    const today = new Date('2024-01-04T14:30:00'); // Friday, mid-day

    const days = buildCalendarDays(startDate, endDate, [], today);

    expect(days.find((d) => d.dateNumber === 4)?.isToday).toBe(true);
    expect(days.find((d) => d.dateNumber === 3)?.isToday).toBe(false);
    expect(days.find((d) => d.dateNumber === 5)?.isToday).toBe(false);
  });

  it('marks isToday false for padding cells', () => {
    const startDate = new Date('2024-01-03T00:00:00'); // Wednesday
    const endDate = new Date('2024-01-07T00:00:00');
    const today = new Date('2024-01-01T00:00:00'); // Monday — a padding cell

    const days = buildCalendarDays(startDate, endDate, [], today);

    expect(days[0].isToday).toBe(false); // padding cell is never isToday
  });

  it('generates unique keys for all days', () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-28T00:00:00');

    const days = buildCalendarDays(startDate, endDate, []);

    const keys = days.map((d) => d.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(days.length);
  });
});

describe('getDotBackground', () => {
  it('returns neutral background for no sessions', () => {
    const result = getDotBackground([], new Map());

    expect(result).toBe('color-mix(in srgb, var(--em-neutral) 30%, transparent)');
  });

  it('returns single colour for one routine', () => {
    const colourMap = new Map([[10, 'var(--em-accent-mint)']]);

    const result = getDotBackground([10], colourMap);

    expect(result).toBe('var(--em-accent-mint)');
  });

  it('returns conic-gradient for two routines', () => {
    const colourMap = new Map([
      [10, 'var(--em-accent-mint)'],
      [20, 'var(--em-accent-aqua)'],
    ]);

    const result = getDotBackground([10, 20], colourMap);

    expect(result).toContain('conic-gradient');
    expect(result).toContain('var(--em-accent-mint)');
    expect(result).toContain('var(--em-accent-aqua)');
  });

  it('orders segments by colour map priority (most sessions first)', () => {
    const colourMap = new Map([
      [10, 'var(--em-accent-mint)'],
      [20, 'var(--em-accent-aqua)'],
    ]);

    const result = getDotBackground([20, 10], colourMap);

    const mintIndex = result.indexOf('var(--em-accent-mint)');
    const aquaIndex = result.indexOf('var(--em-accent-aqua)');
    expect(mintIndex).toBeLessThan(aquaIndex);
  });

  it('returns conic-gradient for three routines', () => {
    const colourMap = new Map([
      [1, 'var(--em-accent-mint)'],
      [2, 'var(--em-accent-aqua)'],
      [3, 'var(--em-accent-flat-purple)'],
    ]);

    const result = getDotBackground([1, 2, 3], colourMap);

    expect(result).toMatch(/conic-gradient/);
    expect(result).toContain('33.33%');
    expect(result).toContain('66.67%');
  });

  it('falls back to first colour for unknown routine id', () => {
    const colourMap = new Map([[10, 'var(--em-accent-mint)']]);

    const result = getDotBackground([99], colourMap);

    expect(result).toBe(ROUTINE_COLOURS[0]);
  });
});

describe('formatSessionStat', () => {
  it('returns weight when totalWeightKg is greater than 0', () => {
    expect(formatSessionStat(150, 3600)).toBe('150 kg');
  });

  it('returns duration when totalWeightKg is 0', () => {
    expect(formatSessionStat(0, 3600)).toBe('1h');
  });

  it('returns duration with minutes when totalWeightKg is 0', () => {
    expect(formatSessionStat(0, 5400)).toBe('1h 30m');
  });

  it('returns empty string when totalWeightKg is 0 and durationSeconds is undefined', () => {
    expect(formatSessionStat(0, undefined)).toBe('');
  });
});
