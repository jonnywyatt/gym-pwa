import type { Exercise, RoutineDetail } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';

export async function fetchRoutineDetail(routineId: string | string[]): Promise<RoutineDetail> {
  return await authFetchJson<RoutineDetail>(`/routines/${routineId}`);
}

export async function searchExercises(search: string): Promise<Exercise[]> {
  if (!search.trim()) return [];
  return await authFetchJson<Exercise[]>(`/exercises?search=${encodeURIComponent(search)}`);
}

export async function saveRoutineLabel(routineId: string | string[], label: string): Promise<void> {
  const response = await authFetch(`/routines/${routineId}/label`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save routine name: ${response.status}`);
  }
}

export async function addExercise(routineId: string | string[], exerciseId: number): Promise<void> {
  const response = await authFetch(`/routines/${routineId}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exerciseId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to add exercise: ${response.status}`);
  }
}

export async function removeExercise(
  routineId: string | string[],
  exerciseId: number
): Promise<void> {
  const response = await authFetch(`/routines/${routineId}/exercises/${exerciseId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to remove exercise: ${response.status}`);
  }
}
