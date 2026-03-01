import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import RoutinePage from './RoutinePage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

const mockRouterPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    params: { routineId: '1' },
  }),
}));

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

function renderPage() {
  return render(RoutinePage, { global: { stubs: { RouterLink: routerLinkStub } } });
}

describe('RoutinePage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(async () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('user_id', '123');
    mockRouterPush.mockClear();
    await db.workouts.clear();
  });

  afterEach(async () => {
    await db.workouts.clear();
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/1`, async () => {
        await new Promise(() => {}); // Never resolve
      })
    );

    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display routine with exercises', async () => {
    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major', 'Triceps'],
          secondaryMuscleGroups: ['Front Deltoids'],
        },
        {
          id: 2,
          label: 'Squats',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Quadriceps', 'Glutes'],
          secondaryMuscleGroups: ['Hamstrings'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Test Routine routine')).toBeInTheDocument();
    });

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start workout' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument();
  });

  it('should link Edit button to the edit routine page', async () => {
    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
        'href',
        '/routines/1/edit'
      );
    });
  });

  it('should display error when routine fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should display empty state when routine has no exercises', async () => {
    const mockRoutine = {
      id: 1,
      label: 'Empty Routine',
      exercises: [],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No exercises in this routine.')).toBeInTheDocument();
    });
  });

  it('should redirect to user page when starting workout without body weight', async () => {
    const user = userEvent.setup();

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      }),
      http.get(`${mockApiUrl}/users/123`, () => {
        return HttpResponse.json({
          id: 123,
          name: 'Test User',
          latestBodyWeight: null,
        });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(screen.getByText(/Please set your body weight first/)).toBeInTheDocument();
      expect(mockRouterPush).toHaveBeenCalledWith('/users/123');
    });
  });

  it('should create workout and navigate when starting with valid body weight', async () => {
    const user = userEvent.setup();

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      }),
      http.get(`${mockApiUrl}/users/123`, () => {
        return HttpResponse.json({
          id: 123,
          name: 'Test User',
          latestBodyWeight: { weightKg: 75.5 },
        });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalled();
      const call = mockRouterPush.mock.calls[0][0];
      expect(call).toMatch(/^\/workouts\//);
    });

    // Verify workout was created in IndexedDB with body weight
    const workouts = await db.workouts.toArray();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].bodyWeightKg).toBe(75.5);
    expect(workouts[0].routineId).toBe(1);
    expect(workouts[0].routineLabel).toBe('Test Routine');
    expect(workouts[0].exercisesCompleted).toHaveLength(1);
  });

  it('should show "Continue workout" button when there is an active workout for this routine', async () => {
    await db.workouts.add({
      id: 'active-workout-id',
      userId: 123,
      routineId: 1,
      routineLabel: 'Test Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 75.0,
      exercisesCompleted: [],
    });

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue workout' })).toBeInTheDocument();
    });
  });

  it('should show "Start workout" button when the active workout belongs to a different routine', async () => {
    await db.workouts.add({
      id: 'other-workout-id',
      userId: 123,
      routineId: 99,
      routineLabel: 'Other Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 75.0,
      exercisesCompleted: [],
    });

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start workout' })).toBeInTheDocument();
    });
  });

  it('should redirect to existing workout if one is already active', async () => {
    const user = userEvent.setup();

    // Add existing active workout to IndexedDB
    await db.workouts.add({
      id: 'existing-workout-id',
      userId: 123,
      routineId: 2,
      routineLabel: 'Another Routine',
      startedAt: '2025-01-15T14:00:00.000Z',
      bodyWeightKg: 80.0,
      exercisesCompleted: [],
    });

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/workouts/existing-workout-id');
    });

    // Should not create a new workout
    const workouts = await db.workouts.toArray();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].id).toBe('existing-workout-id');
  });

  it('should show error when not authenticated', async () => {
    const user = userEvent.setup();
    localStorage.removeItem('user_id'); // Remove user ID

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(screen.getByText(/User not authenticated/)).toBeInTheDocument();
    });
  });

  it('should handle error when fetching body weight fails', async () => {
    const user = userEvent.setup();

    const mockRoutine = {
      id: 1,
      label: 'Test Routine',
      exercises: [
        {
          id: 1,
          label: 'Bench Press',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major'],
          secondaryMuscleGroups: ['Triceps'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return HttpResponse.json(mockRoutine);
      }),
      http.get(`${mockApiUrl}/users/123`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
