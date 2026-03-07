import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  calculateDuration,
  deleteWorkoutApi,
  fetchWorkouts,
  formatDateTime,
  formatDuration,
  formatTotalWeight,
  getFilterStartDate,
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

describe('getFilterStartDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-07T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for "all"', () => {
    expect(getFilterStartDate('all')).toBeNull();
  });

  it('returns 30 days ago for "30d"', () => {
    const result = getFilterStartDate('30d');
    expect(result?.toISOString()).toBe('2026-02-05T12:00:00.000Z');
  });

  it('returns 1 year ago for "1y"', () => {
    const result = getFilterStartDate('1y');
    expect(result?.toISOString()).toBe('2025-03-07T12:00:00.000Z');
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
