import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../../../src/test/msw';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

describe('authFetch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('access_token', 'test-token');

    const { authFetch } = await import('./client');
    const response = await authFetch('/exercises');

    expect(response.ok).toBe(true);
  });

  it('returns 401 when no token is provided', async () => {
    const { authFetch } = await import('./client');

    // Mock window.location to prevent redirect
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    const response = await authFetch('/exercises');

    expect(response.status).toBe(401);

    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('authFetchJson returns parsed JSON', async () => {
    localStorage.setItem('access_token', 'test-token');

    const { authFetchJson } = await import('./client');
    const data = await authFetchJson<unknown[]>('/exercises');

    expect(Array.isArray(data)).toBe(true);
  });
});
