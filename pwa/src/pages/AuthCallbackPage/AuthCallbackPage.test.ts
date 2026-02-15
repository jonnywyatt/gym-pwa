import { render, screen, waitFor } from '@testing-library/vue';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import AuthCallbackPage from './AuthCallbackPage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

const mockRouterReplace = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
  useRoute: () => ({
    params: {},
  }),
}));

describe('AuthCallbackPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    mockRouterReplace.mockClear();
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem('pkce_code_verifier', 'test-verifier');

    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:5173',
        search: '',
      },
      writable: true,
      configurable: true,
    });
  });

  it('should display signing in message initially', () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, async () => {
        await new Promise(() => {}); // Never resolve
      })
    );

    render(AuthCallbackPage);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('should redirect to user page when hasBodyWeight is false', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 123, name: 'Test User' },
          hasBodyWeight: false,
        });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/users/123');
    });

    // Verify tokens and user info were stored
    expect(localStorage.getItem('access_token')).toBe('test-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
    expect(localStorage.getItem('user_id')).toBe('123');
    expect(localStorage.getItem('user_name')).toBe('Test User');
  });

  it('should redirect to dashboard when hasBodyWeight is true', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 456, name: 'Existing User' },
          hasBodyWeight: true,
        });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/');
    });

    // Verify tokens and user info were stored
    expect(localStorage.getItem('access_token')).toBe('test-access-token');
    expect(localStorage.getItem('user_id')).toBe('456');
  });

  it('should display error when no authorization code is provided', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(screen.getByText('No authorization code received')).toBeInTheDocument();
    });

    expect(mockRouterReplace).not.toHaveBeenCalled();
  });

  it('should display error when PKCE verifier is missing', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    sessionStorage.removeItem('pkce_code_verifier');

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(screen.getByText(/No PKCE verifier found/)).toBeInTheDocument();
    });

    expect(mockRouterReplace).not.toHaveBeenCalled();
  });

  it('should display error when authentication fails', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=invalid-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(screen.getByText(/Authentication failed/)).toBeInTheDocument();
    });

    expect(mockRouterReplace).not.toHaveBeenCalled();
  });

  it('should store user info correctly for first-time users', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'new-user-token',
          refreshToken: 'new-user-refresh',
          user: { id: 789, name: 'New User' },
          hasBodyWeight: false,
        });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/users/789');
    });

    expect(localStorage.getItem('access_token')).toBe('new-user-token');
    expect(localStorage.getItem('refresh_token')).toBe('new-user-refresh');
    expect(localStorage.getItem('user_id')).toBe('789');
    expect(localStorage.getItem('user_name')).toBe('New User');
  });

  it('should clean up PKCE verifier after successful authentication', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    sessionStorage.setItem('pkce_code_verifier', 'test-verifier');

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'test-token',
          refreshToken: 'test-refresh',
          user: { id: 123, name: 'Test User' },
          hasBodyWeight: true,
        });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalled();
    });

    expect(sessionStorage.getItem('pkce_code_verifier')).toBeNull();
  });

  it('should handle user without name', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'test-token',
          refreshToken: 'test-refresh',
          user: { id: 999, name: null },
          hasBodyWeight: true,
        });
      })
    );

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/');
    });

    expect(localStorage.getItem('user_name')).toBe('');
  });
});
