import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ExercisesPage from './pages/ExercisesPage/ExercisesPage.vue';
import { server } from './test/msw';

// Mock the config module
vi.mock('./config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
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

  it('should display logout button', async () => {
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

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
