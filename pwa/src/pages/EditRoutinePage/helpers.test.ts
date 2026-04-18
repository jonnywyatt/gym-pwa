import type { Exercise } from 'gym-pwa-api/types';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import {
  addExercise,
  fetchAllExercises,
  fetchRoutineDetail,
  filterExercises,
  removeExercise,
  saveRoutineLabel,
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

const mockExercises: Exercise[] = [
  {
    id: 1,
    label: 'Plank',
    recordSetsType: 'TIME' as const,
    isIsometric: true,
    isUnilateral: false,
    bwFactor: null,
    primaryMuscleGroups: ['Abdominals'],
    secondaryMuscleGroups: [],
    tertiaryMuscleGroups: [],
  },
  {
    id: 2,
    label: 'Side Plank',
    recordSetsType: 'TIME' as const,
    isIsometric: true,
    isUnilateral: true,
    bwFactor: null,
    primaryMuscleGroups: ['Obliques'],
    secondaryMuscleGroups: ['Abdominals'],
    tertiaryMuscleGroups: [],
  },
  {
    id: 3,
    label: 'Squat',
    recordSetsType: 'REPS' as const,
    isIsometric: false,
    isUnilateral: false,
    bwFactor: null,
    primaryMuscleGroups: ['Quads'],
    secondaryMuscleGroups: [],
    tertiaryMuscleGroups: [],
  },
];

describe('fetchAllExercises', () => {
  it('returns all exercises', async () => {
    server.use(http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockExercises)));

    const result = await fetchAllExercises();
    expect(result).toEqual(mockExercises);
  });
});

describe('filterExercises', () => {
  it('returns exercises matching the query case-insensitively', () => {
    expect(filterExercises(mockExercises, 'plank')).toEqual([mockExercises[0], mockExercises[1]]);
  });

  it('returns empty array for empty query', () => {
    expect(filterExercises(mockExercises, '')).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    expect(filterExercises(mockExercises, '   ')).toEqual([]);
  });

  it('returns empty array when no exercises match', () => {
    expect(filterExercises(mockExercises, 'deadlift')).toEqual([]);
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
