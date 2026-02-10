import type { CreateWorkoutRequest, UserWorkout } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';

export async function saveWorkout(
  userId: number,
  workout: CreateWorkoutRequest
): Promise<UserWorkout> {
  return await authFetchJson<UserWorkout>(`/users/${userId}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workout),
  });
}
