import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';
import { formatDateTime as formatDateTimeUtil, toLocalDateString } from '../../utils/time';

export interface MonthGroup {
  key: string;
  label: string;
  startDate: Date;
  endDate: Date;
  sessions: UserWorkoutSummary[];
}

export function buildMonthGroups(
  sessions: UserWorkoutSummary[],
  monthCount: number,
  today = new Date()
): MonthGroup[] {
  const groups: MonthGroup[] = [];

  for (let i = 0; i < monthCount; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = i === 0 ? today : new Date(year, month + 1, 0);

    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    groups.push({ key, label, startDate, endDate, sessions: [] });
  }

  for (const session of sessions) {
    const date = new Date(session.startedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const group = groups.find((g) => g.key === key);
    if (group) {
      group.sessions.push(session);
    }
  }

  return groups;
}

export async function fetchWorkouts(userId: number, since?: Date): Promise<UserWorkoutSummary[]> {
  const url = since
    ? `/users/${userId}/workouts?since=${toLocalDateString(since)}`
    : `/users/${userId}/workouts`;
  return await authFetchJson<UserWorkoutSummary[]>(url);
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
