import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  addExercise,
  fetchRoutineDetail,
  removeExercise,
  saveRoutineLabel,
  searchExercises,
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

describe('fetchRoutineDetail', () => {
  it('fetches routine detail by id', async () => {
    const routine = { id: 5, label: 'My Routine', exercises: [] };
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(routine)));

    const result = await fetchRoutineDetail('5');
    expect(result).toEqual(routine);
  });
});

describe('searchExercises', () => {
  it('returns matching exercises', async () => {
    const exercises = [
      {
        id: 1,
        label: 'Plank',
        recordSetsType: 'TIME',
        primaryMuscleGroups: ['Abdominals'],
        secondaryMuscleGroups: [],
      },
    ];
    server.use(http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(exercises)));

    const result = await searchExercises('plank');
    expect(result).toEqual(exercises);
  });

  it('returns empty array for empty search', async () => {
    const result = await searchExercises('');
    expect(result).toEqual([]);
  });

  it('returns empty array for whitespace-only search', async () => {
    const result = await searchExercises('   ');
    expect(result).toEqual([]);
  });
});

describe('saveRoutineLabel', () => {
  it('sends PATCH request and resolves on success', async () => {
    server.use(
      http.patch(`${mockApiUrl}/routines/5/label`, () => new HttpResponse(null, { status: 204 }))
    );

    await expect(saveRoutineLabel('5', 'My Routine')).resolves.toBeUndefined();
  });

  it('throws on failure', async () => {
    server.use(
      http.patch(`${mockApiUrl}/routines/5/label`, () =>
        HttpResponse.json({ error: 'Forbidden' }, { status: 403 })
      )
    );

    await expect(saveRoutineLabel('5', 'Hacked')).rejects.toThrow(
      'Failed to save routine name: 403'
    );
  });
});

describe('addExercise', () => {
  it('sends POST request and resolves on success', async () => {
    server.use(
      http.post(`${mockApiUrl}/routines/5/exercises`, () => new HttpResponse(null, { status: 204 }))
    );

    await expect(addExercise('5', 10)).resolves.toBeUndefined();
  });

  it('throws on failure', async () => {
    server.use(
      http.post(`${mockApiUrl}/routines/5/exercises`, () =>
        HttpResponse.json({ error: 'Error' }, { status: 500 })
      )
    );

    await expect(addExercise('5', 10)).rejects.toThrow('Failed to add exercise: 500');
  });
});

describe('removeExercise', () => {
  it('sends DELETE request and resolves on success', async () => {
    server.use(
      http.delete(
        `${mockApiUrl}/routines/5/exercises/10`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    await expect(removeExercise('5', 10)).resolves.toBeUndefined();
  });

  it('throws on failure', async () => {
    server.use(
      http.delete(`${mockApiUrl}/routines/5/exercises/10`, () =>
        HttpResponse.json({ error: 'Error' }, { status: 500 })
      )
    );

    await expect(removeExercise('5', 10)).rejects.toThrow('Failed to remove exercise: 500');
  });
});
