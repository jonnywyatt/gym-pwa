import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import { db } from '../../lib/db';
import ActiveWorkoutBanner from './ActiveWorkoutBanner.vue';

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    getUserId: () => 1,
  },
}));

const activeWorkoutEntry = {
  id: 'workout-123',
  userId: 1,
  routineId: 1,
  routineLabel: 'Upper Body',
  startedAt: '2025-01-15T14:00:00.000Z',
  bodyWeightKg: 80,
  exercisesCompleted: [],
};

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      { path: '/auth/callback', name: 'auth-callback', component: { template: '<div />' } },
      { path: '/routines', name: 'routines', component: { template: '<div />' } },
      { path: '/workouts/:workoutId', name: 'workout-detail', component: { template: '<div />' } },
    ],
  });
}

async function renderBannerAtRoute(path: string) {
  const router = createTestRouter();
  router.push(path);
  await router.isReady();
  const result = render(ActiveWorkoutBanner, { global: { plugins: [router] } });
  return { ...result, router };
}

describe('ActiveWorkoutBanner', () => {
  beforeEach(async () => {
    await db.workouts.clear();
  });

  afterEach(async () => {
    await db.workouts.clear();
  });

  it('should show the banner with the routine name when there is an active workout', async () => {
    await db.workouts.add(activeWorkoutEntry);
    await renderBannerAtRoute('/');

    await waitFor(() => {
      expect(screen.getByText('In-progress session: Upper Body')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });
  });

  it('should not show the banner when there is no active workout', async () => {
    await renderBannerAtRoute('/');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    });
  });

  it('should not show the banner on the login page', async () => {
    await db.workouts.add(activeWorkoutEntry);
    await renderBannerAtRoute('/login');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    });
  });

  it('should not show the banner on the auth callback page', async () => {
    await db.workouts.add(activeWorkoutEntry);
    await renderBannerAtRoute('/auth/callback');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    });
  });

  it('should not show the banner on the workout detail page', async () => {
    await db.workouts.add(activeWorkoutEntry);
    await renderBannerAtRoute('/workouts/workout-123');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    });
  });

  it('should navigate to the active workout when Continue is clicked', async () => {
    const user = userEvent.setup();
    await db.workouts.add(activeWorkoutEntry);
    const { router } = await renderBannerAtRoute('/');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/workouts/workout-123');
    });
  });

  it('should show the banner on non-excluded pages', async () => {
    await db.workouts.add(activeWorkoutEntry);
    await renderBannerAtRoute('/routines');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });
  });
});
