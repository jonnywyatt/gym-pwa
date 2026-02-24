import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import AppLayout from './AppLayout.vue';

vi.mock('../InstallPrompt/InstallPrompt.vue', () => ({
  default: { template: '<div data-testid="install-prompt" />' },
}));

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
  it('should not display Routines and Workouts nav links on the dashboard', async () => {
    await renderWithRoute('dashboard', '/');

    expect(screen.queryByRole('link', { name: 'Routines' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Workouts' })).not.toBeInTheDocument();
  });

  it('should display Routines and Workouts nav links on non-dashboard routes', async () => {
    await renderWithRoute('routine-detail', '/routines/1');

    const routinesLink = screen.getByRole('link', { name: 'Routines' });
    expect(routinesLink).toHaveAttribute('href', '/routines');

    const workoutsLink = screen.getByRole('link', { name: 'Workouts' });
    expect(workoutsLink).toHaveAttribute('href', '/workouts');
  });

  it('should highlight the Routines link when on the routines list page', async () => {
    await renderWithRoute('routines', '/routines');

    expect(screen.getByRole('link', { name: 'Routines' }).className).toContain('navLinkActive');
    expect(screen.getByRole('link', { name: 'Workouts' }).className).not.toContain('navLinkActive');
  });

  it('should highlight the Routines link when on a routine detail page', async () => {
    await renderWithRoute('routine-detail', '/routines/1');

    expect(screen.getByRole('link', { name: 'Routines' }).className).toContain('navLinkActive');
    expect(screen.getByRole('link', { name: 'Workouts' }).className).not.toContain('navLinkActive');
  });

  it('should highlight the Workouts link when on the workouts list page', async () => {
    await renderWithRoute('workouts-list', '/workouts');

    expect(screen.getByRole('link', { name: 'Workouts' }).className).toContain('navLinkActive');
    expect(screen.getByRole('link', { name: 'Routines' }).className).not.toContain('navLinkActive');
  });

  it('should highlight the Workouts link when on a workout detail page', async () => {
    await renderWithRoute('workout-detail', '/workouts/42');

    expect(screen.getByRole('link', { name: 'Workouts' }).className).toContain('navLinkActive');
    expect(screen.getByRole('link', { name: 'Routines' }).className).not.toContain('navLinkActive');
  });

  it('should not show nav links on the dashboard', async () => {
    await renderWithRoute('dashboard', '/');

    expect(screen.queryByRole('link', { name: 'Routines' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Workouts' })).not.toBeInTheDocument();
  });

  it('should display the brand name as a link to the dashboard', async () => {
    await renderWithRoute('dashboard', '/');

    const brandLink = screen.getByRole('link', { name: 'Duro' });
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('should display the profile icon as a link to the user profile', async () => {
    await renderWithRoute('dashboard', '/');

    const profileLink = screen.getByRole('link', { name: 'Test User' });
    expect(profileLink).toHaveAttribute('href', '/users/1');
  });

  it('should not show the nav on the login route', async () => {
    await renderWithRoute('login', '/login');

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should render the install prompt', async () => {
    await renderWithRoute('dashboard', '/');

    expect(screen.getByTestId('install-prompt')).toBeInTheDocument();
  });
});
