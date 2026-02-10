import type { UserWorkout } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';

export async function fetchWorkouts(userId: number): Promise<UserWorkout[]> {
  return await authFetchJson<UserWorkout[]>(`/users/${userId}/workouts`);
}

export function calculateDuration(startedAt: string, finishedAt: string): number {
  const start = new Date(startedAt).getTime();
  const finish = new Date(finishedAt).getTime();
  return Math.round((finish - start) / 1000 / 60);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
