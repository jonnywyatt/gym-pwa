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
  workouts: unknown[] = [],
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
    http.get(`${mockApiUrl}/users/1/workouts`, async () => {
      if (options.workoutDelay) {
        await delay('infinite');
        return HttpResponse.json([]);
      }
      return HttpResponse.json(workouts);
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

    expect(screen.getByRole('heading', { level: 2, name: 'Start a session' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Recent sessions' })).toBeInTheDocument();
  });

  it('should display loading state for routines', async () => {
    setupHandlers([], [], { routinesDelay: true });
    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display loading state for workouts', async () => {
    setupHandlers([], [], { workoutDelay: true });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Loading sessions...')).toBeInTheDocument();
    });
  });

  it('should display the two most recently used routines', async () => {
    const routines = [
      { id: 1, label: 'Upper Body', exerciseCount: 5 },
      { id: 2, label: 'Lower Body', exerciseCount: 4 },
      { id: 3, label: 'Core', exerciseCount: 3 },
      { id: 4, label: 'Cardio', exerciseCount: 2 },
    ];
    const workouts = [
      {
        id: 1,
        userId: 1,
        routineId: 4,
        routineLabel: 'Cardio',
        startedAt: '2024-01-15T10:00:00Z',
        finishedAt: '2024-01-15T11:00:00Z',
        durationSeconds: 3600,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 0,
      },
      {
        id: 2,
        userId: 1,
        routineId: 3,
        routineLabel: 'Core',
        startedAt: '2024-01-14T10:00:00Z',
        finishedAt: '2024-01-14T11:00:00Z',
        durationSeconds: 3600,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 0,
      },
    ];
    setupHandlers(routines, workouts);
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cardio' })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Cardio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Core' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Upper Body' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lower Body' })).not.toBeInTheDocument();
  });

  it('should display a create routine link when there are no routines', async () => {
    setupHandlers([], []);
    renderPage();

    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'Start by creating a routine' });
      expect(link).toHaveAttribute('href', '/routines');
    });

    expect(
      screen.queryByRole('heading', { level: 2, name: 'Start a session' })
    ).not.toBeInTheDocument();
  });

  it('should hide the Recent sessions section when there are no workouts', async () => {
    setupHandlers([], []);
    renderPage();

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Recent sessions' })
      ).not.toBeInTheDocument();
    });
  });

  it('should display up to 2 routines as clickable cards', async () => {
    const routines = [
      { id: 1, label: 'Upper Body', exerciseCount: 5 },
      { id: 2, label: 'Lower Body', exerciseCount: 4 },
      { id: 3, label: 'Core', exerciseCount: 3 },
      { id: 4, label: 'Cardio', exerciseCount: 2 },
    ];
    setupHandlers(routines, []);
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lower Body' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Core' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cardio' })).not.toBeInTheDocument();
  });

  it('should display up to 2 recent workouts', async () => {
    const workouts = [
      {
        id: 1,
        userId: 1,
        routineId: 1,
        routineLabel: 'Strength',
        startedAt: '2024-01-15T10:00:00Z',
        finishedAt: '2024-01-15T11:05:30Z',
        durationSeconds: 3930,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 2500,
      },
      {
        id: 2,
        userId: 1,
        routineId: 2,
        routineLabel: 'Cardio',
        startedAt: '2024-01-14T10:00:00Z',
        finishedAt: '2024-01-14T10:30:00Z',
        durationSeconds: 1800,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 0,
      },
      {
        id: 3,
        userId: 1,
        routineId: 1,
        routineLabel: 'Strength',
        startedAt: '2024-01-13T10:00:00Z',
        finishedAt: '2024-01-13T11:00:00Z',
        durationSeconds: 3600,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 2000,
      },
    ];
    setupHandlers([], workouts);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('workout-1')).toBeInTheDocument();
    });

    expect(screen.getByTestId('workout-1')).toHaveAttribute('href', '/sessions/1');
    expect(screen.getByTestId('workout-2')).toHaveAttribute('href', '/sessions/2');
    expect(screen.queryByTestId('workout-3')).not.toBeInTheDocument();
  });

  it('should display workout stats', async () => {
    const workouts = [
      {
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
      },
    ];
    setupHandlers([], workouts);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    expect(screen.getByText('2,500kg total')).toBeInTheDocument();
    expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();

    const cardLink = screen.getByTestId('workout-42');
    expect(cardLink).toHaveAttribute('href', '/sessions/42');
  });

  it('should display Create new routine button alongside All routines link when routines exist', async () => {
    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    setupHandlers(routines, []);
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'All routines' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create new routine' })).toBeInTheDocument();
    });
  });

  it('should create a routine and navigate to the edit page when Create new routine is clicked', async () => {
    const user = userEvent.setup();
    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    setupHandlers(routines, []);
    server.use(
      http.post(`${mockApiUrl}/routines`, () => {
        return HttpResponse.json({ id: 99 });
      })
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create new routine' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Create new routine' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/routines/99/edit');
    });
  });

  it('should display See all link when routines exist', async () => {
    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    setupHandlers(routines, []);
    renderPage();

    await waitFor(() => {
      const allRoutinesLink = screen.getByRole('link', { name: 'All routines' });
      expect(allRoutinesLink).toHaveAttribute('href', '/routines');
    });
  });

  it('should display See all link when workouts exist', async () => {
    const workouts = [
      {
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
      },
    ];
    setupHandlers([], workouts);
    renderPage();

    await waitFor(() => {
      const allWorkoutsLink = screen.getByRole('link', { name: 'All sessions' });
      expect(allWorkoutsLink).toHaveAttribute('href', '/sessions');
    });
  });

  it('should start a new workout when Start workout button is clicked', async () => {
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

    setupHandlers(routines, []);
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
      expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Upper Body' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalled();
      const call = mockRouterPush.mock.calls[0][0] as string;
      expect(call).toMatch(/^\/sessions\//);
    });

    const workouts = await db.workouts.toArray();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].routineId).toBe(1);
    expect(workouts[0].routineLabel).toBe('Upper Body');
    expect(workouts[0].bodyWeightKg).toBe(80);
  });

  it('should hide the routines section when an active workout exists', async () => {
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
    const workouts = [
      {
        id: 1,
        userId: 1,
        routineId: 1,
        routineLabel: 'Upper Body',
        startedAt: '2025-01-15T14:00:00Z',
        finishedAt: '2025-01-15T15:00:00Z',
        durationSeconds: 3600,
        exercisesCompleted: [],
        bodyWeightKg: 80,
        totalWeightKg: 0,
      },
    ];
    setupHandlers(routines, workouts);
    renderPage();

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Start a session' })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Recent sessions' })
      ).toBeInTheDocument();
    });
  });

  it('should show the routines section when there is no active workout', async () => {
    const routines = [{ id: 1, label: 'Upper Body', exerciseCount: 5 }];
    setupHandlers(routines, []);
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 2, name: 'Start a session' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    });
  });

  it('should hide the Start workout button when a different routine has an active workout', async () => {
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
    setupHandlers(routines, []);

    renderPage();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Start session' })).not.toBeInTheDocument();
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('should display error when routines fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      }),
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
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
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
