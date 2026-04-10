import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import SessionSummaryPage from './SessionSummaryPage.vue';

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

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
    params: { workoutId: '42' },
  }),
}));

describe('SessionSummaryPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('user_id', '123');
    mockRouterPush.mockClear();
  });

  it('should display loading state initially', () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return new Promise(() => {});
      })
    );

    render(SessionSummaryPage);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display workout summary', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Strength Training',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:05:30.000Z',
          durationSeconds: 3930,
          exercisesCompleted: [
            {
              id: 1,
              label: 'Bench Press',
              recordSetsType: 'WEIGHT',
              primaryMuscleGroups: ['Pectoralis Major'],
              secondaryMuscleGroups: ['Triceps'],
              sets: [
                { setType: 'Warmup', weightKg: 40, reps: 10 },
                { setType: 'Standard', weightKg: 60, reps: 10 },
              ],
            },
          ],
          totalWeightKg: 1000,
          bodyWeightKg: 75.5,
          muscleGroupStats: [],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText('Strength Training session')).toBeInTheDocument();
    });

    expect(screen.getByText('1h 5m 30s')).toBeInTheDocument();
    expect(screen.getByText('1,000kg')).toBeInTheDocument();

    const exerciseButton = screen.getByRole('button', { name: /Bench Press/ });
    expect(exerciseButton).toBeInTheDocument();

    await userEvent.click(exerciseButton);

    expect(screen.getByText('Warmup · 40kg · 10 reps')).toBeInTheDocument();
    expect(screen.getByText('Standard · 60kg · 10 reps')).toBeInTheDocument();
  });

  it('should display exercises with different record set types', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Mixed Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [
            {
              id: 1,
              label: 'Plank',
              recordSetsType: 'TIME',
              primaryMuscleGroups: ['Core'],
              secondaryMuscleGroups: [],
              sets: [{ setType: 'Standard', timeSeconds: 60 }],
            },
            {
              id: 2,
              label: 'Assisted Pull-up',
              recordSetsType: 'BODYWEIGHT_MINUS_OFFSET',
              primaryMuscleGroups: ['Back'],
              secondaryMuscleGroups: [],
              sets: [{ setType: 'Standard', weightKg: 20, reps: 8 }],
            },
          ],
          totalWeightKg: 480,
          bodyWeightKg: 80,
          muscleGroupStats: [],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText('Mixed Workout session')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Plank/ }));
    expect(screen.getByText('Standard · 1m')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Assisted Pull-up/ }));
    expect(screen.getByText('Standard · 20kg offset · 8 reps')).toBeInTheDocument();
  });

  it('should display error when API fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should not show active workout UI elements', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText('Test Workout session')).toBeInTheDocument();
    });

    expect(screen.queryByText('Finish')).not.toBeInTheDocument();
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
  });

  it('should display delete button', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText('Test Workout session')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Delete session' })).toBeInTheDocument();
  });

  it('should navigate to /sessions after confirming delete', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [],
        });
      }),
      http.delete(`${mockApiUrl}/users/123/workouts/42`, () => {
        return new HttpResponse(null, { status: 204 });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Delete session' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete session' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Delete session?' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/sessions');
    });
  });

  it('should display error when delete fails', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [],
        });
      }),
      http.delete(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Delete session' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete session' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should not show the muscle group breakdown section when there are no stats', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByText('Test Workout session')).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('region', { name: 'Muscle group breakdown' })
    ).not.toBeInTheDocument();
  });

  it('should show body area bar when muscle group stats are present', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/123/workouts/42`, () => {
        return HttpResponse.json({
          id: 42,
          userId: 123,
          routineId: 1,
          routineLabel: 'Test Workout',
          startedAt: '2025-01-15T14:00:00.000Z',
          finishedAt: '2025-01-15T15:00:00.000Z',
          durationSeconds: 3600,
          exercisesCompleted: [],
          totalWeightKg: 0,
          bodyWeightKg: 75,
          muscleGroupStats: [
            { muscleGroup: 'Pectoralis Major', bodyArea: 'Chest', percentage: 70 },
            { muscleGroup: 'Triceps', bodyArea: 'Arms', percentage: 30 },
          ],
        });
      })
    );

    render(SessionSummaryPage);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Body area breakdown bar' })).toBeInTheDocument();
    });

    expect(screen.getByRole('list', { name: 'Body areas' })).toBeInTheDocument();
  });
});
