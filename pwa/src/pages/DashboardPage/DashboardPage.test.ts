import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import DashboardPage from './DashboardPage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    getUserId: () => 1,
    getAccessToken: () => 'test-token',
  },
}));

const mockRouterPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

const mockApiUrl = 'http://localhost:3000';

function setupHandlers(
  routines: unknown[] = [],
  latestWorkout: unknown | null = null,
  options: { routinesDelay?: boolean; workoutDelay?: boolean } = {}
) {
  server.use(
    http.get(`${mockApiUrl}/routines`, async () => {
      if (options.routinesDelay) {
        await delay('infinite');
        return HttpResponse.json([]);
      }
      return HttpResponse.json(routines);
    }),
    http.get(`${mockApiUrl}/users/1/workouts/latest`, async () => {
      if (options.workoutDelay) {
        await delay('infinite');
        return HttpResponse.json({});
      }
      if (latestWorkout === null) {
        return HttpResponse.json({ error: 'No workouts found' }, { status: 404 });
      }
      return HttpResponse.json(latestWorkout);
    })
  );
}

describe('DashboardPage', () => {
  beforeEach(async () => {
    localStorage.setItem('access_token', 'test-token');
    mockRouterPush.mockClear();
    await db.workouts.clear();
  });

  afterEach(async () => {
    await db.workouts.clear();
  });

  function renderPage() {
    return render(DashboardPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });
  }

  it('should display section headings', async () => {
    setupHandlers();
    renderPage();

    expect(screen.getByRole('heading', { level: 2, name: 'Routines' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Workouts' })).toBeInTheDocument();
  });

  it('should display loading state for routines', async () => {
    setupHandlers([], null, { routinesDelay: true });
    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display loading state for workouts', async () => {
    setupHandlers([], null, { workoutDelay: true });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Loading workouts...')).toBeInTheDocument();
    });
  });

  it('should display empty state when no routines', async () => {
    setupHandlers([], null);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No routines available.')).toBeInTheDocument();
    });
  });

  it('should display empty state when no workouts', async () => {
    setupHandlers([], null);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No workouts yet.')).toBeInTheDocument();
    });
  });

  it('should display up to 3 routines with Details and New workout links', async () => {
    const routines = [
      { id: 1, label: 'Upper Body', exerciseCount: 5 },
      { id: 2, label: 'Lower Body', exerciseCount: 4 },
      { id: 3, label: 'Core', exerciseCount: 3 },
      { id: 4, label: 'Cardio', exerciseCount: 2 },
    ];
    setupHandlers(routines, null);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });

    expect(screen.getByText('Upper Body')).toBeInTheDocument();
    expect(screen.getByText('Lower Body')).toBeInTheDocument();
    expect(screen.getByText('Core')).toBeInTheDocument();
    expect(screen.queryByText('Cardio')).not.toBeInTheDocument();

    const detailsLinks = screen.getAllByRole('link', { name: 'Details' });
    expect(detailsLinks).toHaveLength(3);
    expect(detailsLinks[0]).toHaveAttribute('href', '/routines/1');
    expect(detailsLinks[1]).toHaveAttribute('href', '/routines/2');
    expect(detailsLinks[2]).toHaveAttribute('href', '/routines/3');

    const newWorkoutButtons = screen.getAllByRole('button', { name: 'New workout' });
    expect(newWorkoutButtons).toHaveLength(3);
  });

  it('should display last workout with stats and Summary link', async () => {
    const workout = {
      id: 42,
      userId: 1,
      routineId: 1,
      routineLabel: 'Strength',
      startedAt: '2024-01-15T10:00:00Z',
      finishedAt: '2024-01-15T11:05:30Z',
      durationSeconds: 3930,
      exercisesCompleted: [],
      bodyWeightKg: 80,
      totalWeightKg: 2500,
    };
    setupHandlers([], workout);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    expect(screen.getByText('Last workout')).toBeInTheDocument();
    expect(screen.getByText('2,500kg total')).toBeInTheDocument();
    expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();

    const summaryLink = screen.getByRole('link', { name: 'Summary' });
    expect(summaryLink).toHaveAttribute('href', '/workouts/42');
  });

  it('should display All workouts link when latest workout exists', async () => {
    const workout = {
      id: 1,
      userId: 1,
      routineId: 1,
      routineLabel: 'Test',
      startedAt: '2024-01-15T10:00:00Z',
      finishedAt: '2024-01-15T11:00:00Z',
      durationSeconds: 3600,
      exercisesCompleted: [],
      bodyWeightKg: 80,
      totalWeightKg: 0,
    };
    setupHandlers([], workout);
    renderPage();

    await waitFor(() => {
      const allWorkoutsLink = screen.getByRole('link', { name: 'All workouts' });
      expect(allWorkoutsLink).toHaveAttribute('href', '/workouts');
    });
  });

  it('should start a new workout when New workout button is clicked', async () => {
    const user = userEvent.setup();
    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    const mockRoutineDetail = {
      id: 1,
      label: 'Upper Body',
      exercises: [
        {
          id: 10,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    setupHandlers(routines, null);
    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutineDetail);
      }),
      http.get(`${mockApiUrl}/users/1`, () => {
        return HttpResponse.json({
          id: 1,
          name: 'Test User',
          latestBodyWeight: { weightKg: 80 },
        });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New workout' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'New workout' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalled();
      const call = mockRouterPush.mock.calls[0][0] as string;
      expect(call).toMatch(/^\/workouts\//);
    });

    const workouts = await db.workouts.toArray();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].routineId).toBe(1);
    expect(workouts[0].routineLabel).toBe('Upper Body');
    expect(workouts[0].bodyWeightKg).toBe(80);
  });

  it('should show Continue workout button for routine with active workout, New workout for others', async () => {
    await db.workouts.add({
      id: 'active-workout-id',
      userId: 1,
      routineId: 1,
      routineLabel: 'Upper Body',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 80,
      exercisesCompleted: [],
    });

    const routines = [
      { id: 1, label: 'Upper Body', exerciseCount: 5 },
      { id: 2, label: 'Lower Body', exerciseCount: 4 },
    ];
    setupHandlers(routines, null);
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue workout' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'New workout' })).toBeInTheDocument();
    });
  });

  it('should navigate to active workout when Continue workout is clicked', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'active-workout-id',
      userId: 1,
      routineId: 1,
      routineLabel: 'Upper Body',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 80,
      exercisesCompleted: [],
    });

    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    const mockRoutineDetail = {
      id: 1,
      label: 'Upper Body',
      exercises: [],
    };

    setupHandlers(routines, null);
    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutineDetail);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue workout' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Continue workout' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/workouts/active-workout-id');
    });
  });

  it('should redirect to existing workout if one is active when New workout is clicked', async () => {
    const user = userEvent.setup();

    await db.workouts.add({
      id: 'existing-workout-id',
      userId: 1,
      routineId: 2,
      routineLabel: 'Other Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 80,
      exercisesCompleted: [],
    });

    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    const mockRoutineDetail = {
      id: 1,
      label: 'Upper Body',
      exercises: [
        {
          id: 10,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    setupHandlers(routines, null);
    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutineDetail);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New workout' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'New workout' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/workouts/existing-workout-id');
    });
  });

  it('should display error when routines fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      }),
      http.get(`${mockApiUrl}/users/1/workouts/latest`, () => {
        return HttpResponse.json({ error: 'No workouts found' }, { status: 404 });
      })
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should display error when workout fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () => {
        return HttpResponse.json([]);
      }),
      http.get(`${mockApiUrl}/users/1/workouts/latest`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
