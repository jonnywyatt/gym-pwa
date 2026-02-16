import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import AppLayout from './AppLayout.vue';

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    getUserName: () => 'Test User',
    getUserId: () => 1,
    isAuthenticated: () => true,
    logout: vi.fn(),
  },
}));

function createTestRouter(routeName: string, routePath: string) {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: routePath, name: routeName, component: { template: '<div />' } }],
  });
}

async function renderWithRoute(routeName: string, routePath: string = '/') {
  const router = createTestRouter(routeName, routePath);
  router.push(routePath);
  await router.isReady();

  return render(AppLayout, {
    global: {
      plugins: [router],
    },
  });
}

describe('AppLayout', () => {
  it('should display Routines and Workouts nav links', async () => {
    await renderWithRoute('dashboard', '/');

    const routinesLink = screen.getByRole('link', { name: 'Routines' });
    expect(routinesLink).toHaveAttribute('href', '/routines');

    const workoutsLink = screen.getByRole('link', { name: 'Workouts' });
    expect(workoutsLink).toHaveAttribute('href', '/workouts');
  });

  it('should display nav links on all authenticated routes', async () => {
    await renderWithRoute('routine-detail', '/routines/1');

    expect(screen.getByRole('link', { name: 'Routines' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Workouts' })).toBeInTheDocument();
  });

  it('should display the brand name as a link to the dashboard', async () => {
    await renderWithRoute('dashboard', '/');

    const brandLink = screen.getByRole('link', { name: 'Duro' });
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('should not show the nav on the login route', async () => {
    await renderWithRoute('login', '/login');

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
