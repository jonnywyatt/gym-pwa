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
  it.each([
    { route: 'routines', path: '/routines', label: 'Dashboard', href: '/' },
    {
      route: 'workouts-list',
      path: '/workouts',
      label: 'Dashboard',
      href: '/',
    },
    {
      route: 'routine-detail',
      path: '/routines/1',
      label: 'Routines',
      href: '/routines',
    },
    {
      route: 'workout-detail',
      path: '/workouts/1',
      label: 'Workouts',
      href: '/workouts',
    },
    {
      route: 'user-profile',
      path: '/users/1',
      label: 'Dashboard',
      href: '/',
    },
  ])('should show a back link to $label when on the $route route', async ({
    route,
    path,
    label,
    href,
  }) => {
    await renderWithRoute(route, path);

    const backLink = screen.getByText(`← ${label}`).closest('a');
    expect(backLink).toHaveAttribute('href', href);
  });

  it('should not show a back link on the dashboard route', async () => {
    await renderWithRoute('dashboard', '/');

    expect(screen.queryByText(/←/)).not.toBeInTheDocument();
  });

  it('should not show the nav on the login route', async () => {
    await renderWithRoute('login', '/login');

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
