import type { UserWorkout } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';
import { formatDateTime as formatDateTimeUtil } from '../../utils/time';

export async function fetchWorkouts(userId: number): Promise<UserWorkout[]> {
  return await authFetchJson<UserWorkout[]>(`/users/${userId}/workouts`);
}

export async function deleteWorkoutApi(userId: number, workoutId: number): Promise<void> {
  const response = await authFetch(`/users/${userId}/workouts/${workoutId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete workout: ${response.status}`);
  }
}

export function calculateDuration(startedAt: string, finishedAt: string): number {
  const start = new Date(startedAt).getTime();
  const finish = new Date(finishedAt).getTime();
  return Math.round((finish - start) / 1000 / 60);
}

export function formatDateTime(dateString: string): string {
  return formatDateTimeUtil(dateString);
}

export function formatTotalWeight(weightKg: number): string {
  return `${weightKg.toLocaleString()}kg`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(' ');
}
