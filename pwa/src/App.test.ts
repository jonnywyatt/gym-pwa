import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthCallbackPage from './pages/AuthCallbackPage/AuthCallbackPage.vue';
import ExercisesPage from './pages/ExercisesPage/ExercisesPage.vue';
import RoutinePage from './pages/RoutinePage/RoutinePage.vue';
import RoutinesPage from './pages/RoutinesPage/RoutinesPage.vue';
import { server } from './test/msw';

// Mock the config module
vi.mock('./config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

// Mock vue-router
const mockRouterReplace = vi.fn();
const mockRouterPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
    push: mockRouterPush,
  }),
  useRoute: () => ({
    params: { routineId: '1' },
  }),
}));

describe('ExercisesPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    // Set up a valid token for authenticated tests
    localStorage.setItem('access_token', 'test-token');
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    render(ExercisesPage);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display exercises when API call succeeds', async () => {
    const mockExercises = [
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
      {
        id: 3,
        label: 'Deadlift',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Lower Back', 'Hamstrings'],
        secondaryMuscleGroups: ['Glutes'],
      },
    ];

    server.use(
      http.get(`${mockApiUrl}/exercises`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockExercises);
      })
    );

    render(ExercisesPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  it('should display empty state when no exercises exist', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json([]);
      })
    );

    render(ExercisesPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No exercises found.')).toBeInTheDocument();
  });

  it('should display error message when API call fails with HTTP error', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(ExercisesPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error: HTTP error: 500/)).toBeInTheDocument();
  });

  it('should display error message when network request fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, () => {
        return HttpResponse.error();
      })
    );

    render(ExercisesPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  it('should render exercises in a list', async () => {
    const mockExercises = [
      {
        id: 1,
        label: 'Push-ups',
        recordSetsType: 'WEIGHT',
        primaryMuscleGroups: ['Pectoralis Major', 'Triceps'],
        secondaryMuscleGroups: ['Front Deltoids'],
      },
      {
        id: 2,
        label: 'Pull-ups',
        recordSetsType: 'WEIGHT_OFFSET_FROM_BODY',
        primaryMuscleGroups: ['Latissimus Dorsi', 'Biceps'],
        secondaryMuscleGroups: ['Rhomboids'],
      },
    ];

    server.use(
      http.get(`${mockApiUrl}/exercises`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockExercises);
      })
    );

    render(ExercisesPage);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent('Push-ups');
      expect(listItems[1]).toHaveTextContent('Pull-ups');
    });
  });
});

describe('RoutinesPage', () => {
  const mockApiUrl = 'http://localhost:3000';
  const routerLinkStub = {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  };

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    render(RoutinesPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display routines with exercise counts when API call succeeds', async () => {
    const mockRoutines = [
      { id: 1, label: 'Strength', exerciseCount: 12 },
      { id: 2, label: 'Cardio', exerciseCount: 5 },
    ];

    server.use(
      http.get(`${mockApiUrl}/routines`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockRoutines);
      })
    );

    render(RoutinesPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Routines')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('12 exercises')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('5 exercises')).toBeInTheDocument();
  });

  it('should display empty state when no routines exist', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json([]);
      })
    );

    render(RoutinesPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No routines found.')).toBeInTheDocument();
  });

  it('should display error message when API call fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(RoutinesPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error: HTTP error: 500/)).toBeInTheDocument();
  });
});

describe('RoutinePage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/1`, async () => {
        await delay('infinite');
        return HttpResponse.json({});
      })
    );

    render(RoutinePage);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display routine with exercises when API call succeeds', async () => {
    const mockRoutine = {
      id: 1,
      label: 'Strength',
      exercises: [
        {
          id: 1,
          label: 'Pull up (assisted)',
          recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
          primaryMuscleGroups: ['Latissimus Dorsi', 'Biceps'],
          secondaryMuscleGroups: ['Rhomboids', 'Trapezius'],
        },
        {
          id: 2,
          label: 'Chest press machine',
          recordSetsType: 'WEIGHT',
          primaryMuscleGroups: ['Pectoralis Major', 'Triceps'],
          secondaryMuscleGroups: ['Front Deltoids'],
        },
      ],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockRoutine);
      })
    );

    render(RoutinePage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Strength routine')).toBeInTheDocument();
    expect(screen.getByText('Pull up (assisted)')).toBeInTheDocument();
    expect(screen.getByText('Chest press machine')).toBeInTheDocument();
  });

  it('should display error message when API call fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/1`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(RoutinePage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error: HTTP error: 500/)).toBeInTheDocument();
  });

  it('should display empty state when routine has no exercises', async () => {
    const mockRoutine = {
      id: 1,
      label: 'Empty Routine',
      exercises: [],
    };

    server.use(
      http.get(`${mockApiUrl}/routines/1`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockRoutine);
      })
    );

    render(RoutinePage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No exercises in this routine.')).toBeInTheDocument();
  });

  it('should redirect to user page when starting workout without body weight', async () => {
    const user = userEvent.setup();
    localStorage.setItem('user_id', '123');

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

    render(RoutinePage);

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/users/123');
    });
  });

  it('should create workout when starting with valid body weight', async () => {
    const user = userEvent.setup();
    localStorage.setItem('user_id', '123');

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

    render(RoutinePage);

    await waitFor(() => {
      expect(screen.getByText('Start workout')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start workout'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalled();
      const call = mockRouterPush.mock.calls[0][0];
      expect(call).toMatch(/^\/workouts\//);
    });
  });
});

describe('AuthCallbackPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    mockRouterReplace.mockClear();
    sessionStorage.setItem('pkce_code_verifier', 'test-verifier');
  });

  it('should redirect to user page when hasBodyWeight is false', async () => {
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

    // Mock the URL search params
    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/users/123');
    });
  });

  it('should redirect to dashboard when hasBodyWeight is true', async () => {
    server.use(
      http.post(`${mockApiUrl}/auth/google`, () => {
        return HttpResponse.json({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 123, name: 'Test User' },
          hasBodyWeight: true,
        });
      })
    );

    Object.defineProperty(window, 'location', {
      value: {
        search: '?code=test-code',
        origin: 'http://localhost:5173',
      },
      writable: true,
    });

    render(AuthCallbackPage);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/');
    });
  });

  it('should display error when no code is provided', async () => {
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
  });
});
