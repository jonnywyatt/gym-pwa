import type { RoutineSummary, UserPreferences } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';

export async function fetchRoutines(): Promise<RoutineSummary[]> {
  return await authFetchJson<RoutineSummary[]>('/routines');
}

export async function fetchPreferences(userId: number): Promise<UserPreferences> {
  return await authFetchJson<UserPreferences>(`/users/${userId}/preferences`);
}

export async function savePreferences(
  userId: number,
  update: Partial<UserPreferences>
): Promise<UserPreferences> {
  return await authFetchJson<UserPreferences>(`/users/${userId}/preferences`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
}

export async function createRoutine(): Promise<number> {
  const response = await authFetchJson<{ id: number }>('/routines', { method: 'POST' });
  return response.id;
}

export async function deleteRoutineApi(routineId: number): Promise<void> {
  const response = await authFetch(`/routines/${routineId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete routine: ${response.status}`);
  }
}

export function filterRoutines(
  routines: RoutineSummary[],
  showRecommended: boolean,
  userId: number
): RoutineSummary[] {
  if (showRecommended) {
    return routines;
  }
  return routines.filter((r) => r.userId === userId);
}
