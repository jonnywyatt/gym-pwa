import { config } from '../../config';
import { authService } from '../auth/oauth';

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = authService.getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    authService.logout();
    window.location.href = '/';
  }

  return response;
}

export async function authFetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await authFetch(path, options);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}
