import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import WorkoutsListPage from './WorkoutsListPage.vue';

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

describe('WorkoutsListPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    render(WorkoutsListPage);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display message when no workouts exist', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
      })
    );

    render(WorkoutsListPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('No workouts yet. Start a routine to log your first workout!')
    ).toBeInTheDocument();
  });

  it('should display workouts with formatted duration when durationSeconds is available', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:05:30Z',
            durationSeconds: 3930,
            exercisesCompleted: [
              { id: 1, label: 'Bench Press' },
              { id: 2, label: 'Squats' },
            ],
            bodyWeightKg: 80,
            totalWeightKg: 2500,
          },
        ]);
      })
    );

    render(WorkoutsListPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('2,500kg total')).toBeInTheDocument();
  });

  it('should fall back to calculated duration when durationSeconds is not available', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Cardio',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T10:45:00Z',
            exercisesCompleted: [{ id: 1, label: 'Running' }],
            bodyWeightKg: 75,
          },
        ]);
      })
    );

    render(WorkoutsListPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
  });

  it('should display multiple workouts', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 2,
            userId: 1,
            routineId: 1,
            routineLabel: 'Upper Body',
            startedAt: '2024-01-16T10:00:00Z',
            finishedAt: '2024-01-16T10:30:00Z',
            durationSeconds: 1800,
            exercisesCompleted: [{ id: 1, label: 'Push-ups' }],
            bodyWeightKg: 80,
            totalWeightKg: 800,
          },
          {
            id: 1,
            userId: 1,
            routineId: 2,
            routineLabel: 'Lower Body',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [{ id: 2, label: 'Squats' }],
            bodyWeightKg: 79,
            totalWeightKg: 1200,
          },
        ]);
      })
    );

    render(WorkoutsListPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Upper Body')).toBeInTheDocument();
    expect(screen.getByText('30m')).toBeInTheDocument();
    expect(screen.getByText('800kg total')).toBeInTheDocument();
    expect(screen.getByText('Lower Body')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('1,200kg total')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
      })
    );

    render(WorkoutsListPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });
});
