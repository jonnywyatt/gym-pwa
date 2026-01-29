import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OAuthService } from './oauth';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

describe('OAuthService', () => {
  let service: OAuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    service = new OAuthService();
  });

  describe('isAuthenticated', () => {
    it('returns false when no token is stored', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('returns true when access token is stored', () => {
      localStorage.setItem('access_token', 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('getAccessToken', () => {
    it('returns null when no token is stored', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('returns the stored access token', () => {
      localStorage.setItem('access_token', 'test-token');
      expect(service.getAccessToken()).toBe('test-token');
    });
  });

  describe('logout', () => {
    it('clears stored tokens', () => {
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('refresh_token', 'test-refresh');

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });
});
