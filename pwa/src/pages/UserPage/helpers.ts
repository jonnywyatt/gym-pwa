import type { UserProfile } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';

export async function fetchUserProfile(userId: string | string[]): Promise<UserProfile> {
  return authFetchJson<UserProfile>(`/users/${userId}`);
}

export async function saveBodyWeight(userId: string | string[], weight: number): Promise<void> {
  const response = await authFetch(`/users/${userId}/body-weights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
}
