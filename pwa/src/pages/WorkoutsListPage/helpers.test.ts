import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  calculateDuration,
  deleteWorkoutApi,
  formatDate,
  formatDuration,
  formatTime,
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

describe('formatDate', () => {
  it('formats date in MMM D, YYYY format', () => {
    const dateString = '2024-01-15T10:30:00Z';

    const result = formatDate(dateString);

    expect(result).toMatch(/Jan 1[45], 2024/);
  });
});

describe('formatTime', () => {
  it('formats time in 12-hour format', () => {
    const dateString = '2024-01-15T14:30:00Z';

    const result = formatTime(dateString);

    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
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
