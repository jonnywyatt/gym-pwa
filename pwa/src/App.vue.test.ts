import { render } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import App from './App.vue';

vi.mock('./config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

vi.mock('./components/AppLayout/AppLayout.vue', () => ({
  default: { template: '<div />' },
}));

const mockPrefetchDashboardData = vi.hoisted(() => vi.fn());
const mockPrefetchSessionTrends = vi.hoisted(() => vi.fn());
const mockIsAuthenticated = vi.hoisted(() => vi.fn());
const mockGetUserId = vi.hoisted(() => vi.fn());

vi.mock('./pages/DashboardPage/helpers', () => ({
  prefetchDashboardData: mockPrefetchDashboardData,
  consumeDashboardPrefetch: vi.fn().mockReturnValue(null),
}));

vi.mock('./pages/SessionTrendsPage/helpers', () => ({
  prefetchSessionTrends: mockPrefetchSessionTrends,
}));

vi.mock('./lib/auth/oauth', () => ({
  authService: {
    isAuthenticated: mockIsAuthenticated,
    getUserId: mockGetUserId,
    getAccessToken: vi.fn().mockReturnValue(null),
  },
}));

describe('App', () => {
  it('calls prefetchDashboardData on mount when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetUserId.mockReturnValue(1);

    render(App);

    expect(mockPrefetchDashboardData).toHaveBeenCalledWith(1);
  });

  it('does not call prefetchDashboardData when not authenticated', () => {
    mockIsAuthenticated.mockReturnValue(false);
    mockGetUserId.mockReturnValue(null);

    render(App);

    expect(mockPrefetchDashboardData).not.toHaveBeenCalled();
  });
});
