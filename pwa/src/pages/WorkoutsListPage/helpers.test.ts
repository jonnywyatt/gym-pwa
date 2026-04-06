import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  buildMonthGroups,
  calculateDuration,
  deleteWorkoutApi,
  fetchWorkouts,
  formatDateTime,
  formatDuration,
  formatTotalWeight,
} from './helpers';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    getUserId: () => 1,
    getAccessToken: () => 'test-token',
  },
}));

describe('calculateDuration', () => {
  it('calculates duration in minutes between two timestamps', () => {
    const startedAt = '2024-01-15T10:00:00Z';
    const finishedAt = '2024-01-15T10:45:00Z';

    const result = calculateDuration(startedAt, finishedAt);

    expect(result).toBe(45);
  });

  it('rounds to nearest minute', () => {
    const startedAt = '2024-01-15T10:00:00Z';
    const finishedAt = '2024-01-15T10:45:35Z';

    const result = calculateDuration(startedAt, finishedAt);

    expect(result).toBe(46);
  });
});

describe('formatDateTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-16T15:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats date and time without year for current year', () => {
    const result = formatDateTime('2026-02-16T15:45:00');
    expect(result).toBe('16 Feb @ 3:45pm');
  });

  it('formats date and time with year for previous year', () => {
    const result = formatDateTime('2025-12-25T09:30:00');
    expect(result).toBe('25 Dec 2025 @ 9:30am');
  });
});

describe('formatTotalWeight', () => {
  it('formats weight with kg suffix', () => {
    expect(formatTotalWeight(150)).toBe('150kg');
  });

  it('formats large numbers with locale separator', () => {
    expect(formatTotalWeight(1500)).toBe('1,500kg');
  });

  it('formats zero weight', () => {
    expect(formatTotalWeight(0)).toBe('0kg');
  });
});

describe('formatDuration', () => {
  it('formats duration with hours, minutes, and seconds', () => {
    const seconds = 3665; // 1h 1m 5s

    const result = formatDuration(seconds);

    expect(result).toBe('1h 1m 5s');
  });

  it('formats duration with only minutes and seconds', () => {
    const seconds = 125; // 2m 5s

    const result = formatDuration(seconds);

    expect(result).toBe('2m 5s');
  });

  it('formats duration with only seconds', () => {
    const seconds = 45;

    const result = formatDuration(seconds);

    expect(result).toBe('45s');
  });

  it('formats zero seconds', () => {
    const seconds = 0;

    const result = formatDuration(seconds);

    expect(result).toBe('0s');
  });

  it('formats duration with hours only', () => {
    const seconds = 3600; // 1h exactly

    const result = formatDuration(seconds);

    expect(result).toBe('1h');
  });

  it('formats duration with hours and minutes only', () => {
    const seconds = 3660; // 1h 1m

    const result = formatDuration(seconds);

    expect(result).toBe('1h 1m');
  });

  it('formats duration with multiple hours', () => {
    const seconds = 7384; // 2h 3m 4s

    const result = formatDuration(seconds);

    expect(result).toBe('2h 3m 4s');
  });
});

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
  totalReps: 0,
});

describe('buildMonthGroups', () => {
  const today = new Date('2026-04-06T12:00:00');

  it('returns the requested number of months in reverse chronological order', () => {
    const groups = buildMonthGroups([], 3, today);

    expect(groups).toHaveLength(3);
    expect(groups[0].key).toBe('2026-04');
    expect(groups[1].key).toBe('2026-03');
    expect(groups[2].key).toBe('2026-02');
  });

  it('uses month and year as label', () => {
    const groups = buildMonthGroups([], 2, today);

    expect(groups[0].label).toBe('April 2026');
    expect(groups[1].label).toBe('March 2026');
  });

  it('sets startDate to first of the month', () => {
    const groups = buildMonthGroups([], 2, today);

    expect(groups[0].startDate).toEqual(new Date(2026, 3, 1));
    expect(groups[1].startDate).toEqual(new Date(2026, 2, 1));
  });

  it('sets endDate to today for the current month', () => {
    const groups = buildMonthGroups([], 1, today);

    expect(groups[0].endDate).toEqual(today);
  });

  it('sets endDate to last day of month for past months', () => {
    const groups = buildMonthGroups([], 2, today);

    expect(groups[1].endDate).toEqual(new Date(2026, 2, 31));
  });

  it('groups sessions into correct months', () => {
    const sessions = [
      makeWorkout(1, 1, 'Strength', '2026-04-01T10:00:00Z'),
      makeWorkout(2, 1, 'Strength', '2026-04-03T10:00:00Z'),
      makeWorkout(3, 2, 'Cardio', '2026-03-15T10:00:00Z'),
    ];

    const groups = buildMonthGroups(sessions, 3, today);

    expect(groups[0].sessions).toHaveLength(2);
    expect(groups[1].sessions).toHaveLength(1);
    expect(groups[2].sessions).toHaveLength(0);
  });

  it('ignores sessions outside the month range', () => {
    const sessions = [makeWorkout(1, 1, 'Strength', '2025-01-01T10:00:00Z')];

    const groups = buildMonthGroups(sessions, 3, today);

    expect(groups.every((g) => g.sessions.length === 0)).toBe(true);
  });

  it('spans year boundaries correctly', () => {
    const janToday = new Date('2026-01-15T12:00:00');
    const groups = buildMonthGroups([], 3, janToday);

    expect(groups[0].key).toBe('2026-01');
    expect(groups[1].key).toBe('2025-12');
    expect(groups[2].key).toBe('2025-11');
  });
});

describe('fetchWorkouts', () => {
  const mockApiUrl = 'http://localhost:3000';

  it('fetches workouts without since param when not provided', async () => {
    let capturedUrl = '';
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    await fetchWorkouts(1);

    expect(capturedUrl).toBe(`${mockApiUrl}/users/1/workouts`);
  });

  it('fetches workouts with since query param when provided', async () => {
    let capturedUrl = '';
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    const since = new Date('2026-02-05T12:00:00.000Z');
    await fetchWorkouts(1, since);

    expect(capturedUrl).toContain(`${mockApiUrl}/users/1/workouts?since=`);
    expect(capturedUrl).toContain('2026-02-05T12');
  });
});

describe('deleteWorkoutApi', () => {
  const mockApiUrl = 'http://localhost:3000';

  it('successfully deletes a workout', async () => {
    server.use(
      http.delete(`${mockApiUrl}/users/1/workouts/42`, () => {
        return new HttpResponse(null, { status: 204 });
      })
    );

    await expect(deleteWorkoutApi(1, 42)).resolves.toBeUndefined();
  });

  it('throws an error when the API returns an error', async () => {
    server.use(
      http.delete(`${mockApiUrl}/users/1/workouts/42`, () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
      })
    );

    await expect(deleteWorkoutApi(1, 42)).rejects.toThrow('Failed to delete workout: 404');
  });
});
