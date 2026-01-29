import type { Exercise } from 'gym-pwa-api/types';
import { config } from '../config';

export async function fetchExercises(): Promise<Exercise[]> {
  const response = await fetch(`${config.apiUrl}/exercises`);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}
