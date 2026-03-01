import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  createRoutine,
  deleteRoutineApi,
  fetchPreferences,
  fetchRoutines,
  filterRoutines,
  savePreferences,
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

const mockApiUrl = 'http://localhost:3000';

describe('fetchRoutines', () => {
  it('fetches and returns routines', async () => {
    const routines = [
      { id: 1, label: 'Strength', userId: null, exerciseCount: 12 },
      { id: 2, label: 'My Routine', userId: 1, exerciseCount: 3 },
    ];
    server.use(http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(routines)));

    const result = await fetchRoutines();
    expect(result).toEqual(routines);
  });

  it('throws on API error', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    await expect(fetchRoutines()).rejects.toThrow();
  });
});

describe('fetchPreferences', () => {
  it('fetches user preferences', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/preferences`, () =>
        HttpResponse.json({ showRecommendedRoutines: false })
      )
    );

    const result = await fetchPreferences(1);
    expect(result).toEqual({ showRecommendedRoutines: false });
  });
});

describe('savePreferences', () => {
  it('sends PATCH request and returns updated preferences', async () => {
    server.use(
      http.patch(`${mockApiUrl}/users/1/preferences`, () =>
        HttpResponse.json({ showRecommendedRoutines: false })
      )
    );

    const result = await savePreferences(1, { showRecommendedRoutines: false });
    expect(result).toEqual({ showRecommendedRoutines: false });
  });
});

describe('createRoutine', () => {
  it('posts to /routines and returns the new id', async () => {
    server.use(
      http.post(`${mockApiUrl}/routines`, () => HttpResponse.json({ id: 42 }, { status: 201 }))
    );

    const id = await createRoutine();
    expect(id).toBe(42);
  });
});

describe('deleteRoutineApi', () => {
  it('successfully deletes a routine', async () => {
    server.use(
      http.delete(`${mockApiUrl}/routines/5`, () => new HttpResponse(null, { status: 204 }))
    );

    await expect(deleteRoutineApi(5)).resolves.toBeUndefined();
  });

  it('throws when delete fails', async () => {
    server.use(
      http.delete(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ error: 'Forbidden' }, { status: 403 })
      )
    );

    await expect(deleteRoutineApi(5)).rejects.toThrow('Failed to delete routine: 403');
  });
});

describe('filterRoutines', () => {
  const routines = [
    { id: 1, label: 'Strength', userId: null, exerciseCount: 12 },
    { id: 2, label: 'Abs', userId: null, exerciseCount: 4 },
    { id: 3, label: 'My Routine', userId: 1, exerciseCount: 2 },
    { id: 4, label: 'Other User', userId: 2, exerciseCount: 1 },
  ];

  it('returns all routines when showRecommended is true', () => {
    const result = filterRoutines(routines, true, 1);
    expect(result).toHaveLength(4);
  });

  it('returns only user routines when showRecommended is false', () => {
    const result = filterRoutines(routines, false, 1);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('My Routine');
  });

  it('returns empty array when user has no routines and showRecommended is false', () => {
    const result = filterRoutines(routines, false, 99);
    expect(result).toHaveLength(0);
  });
});
