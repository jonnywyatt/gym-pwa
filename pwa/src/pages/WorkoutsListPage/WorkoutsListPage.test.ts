import userEvent from '@testing-library/user-event';
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

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

describe('WorkoutsListPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  function renderPage() {
    return render(WorkoutsListPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });
  }

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display message when no workouts exist', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
      })
    );

    renderPage();

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

    renderPage();

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

    renderPage();

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

    renderPage();

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

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  it('should render workout items as links to workout detail', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 42,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    const link = screen.getByText('Strength').closest('a');
    expect(link).toHaveAttribute('href', '/workouts/42');
  });

  it('should display a delete button for each workout', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Upper Body',
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
            routineId: 2,
            routineLabel: 'Lower Body',
            startedAt: '2024-01-16T10:00:00Z',
            finishedAt: '2024-01-16T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Delete Upper Body' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Lower Body' })).toBeInTheDocument();
  });

  it('should open confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Strength' }));

    expect(screen.getByRole('heading', { name: 'Delete workout?' })).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should remove workout from list when delete is confirmed', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      }),
      http.delete(`${mockApiUrl}/users/1/workouts/1`, () => {
        return new HttpResponse(null, { status: 204 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Strength' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.queryByText('Strength')).not.toBeInTheDocument();
    });
  });

  it('should keep workout in list when delete is cancelled', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Strength' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Strength')).toBeInTheDocument();
  });

  it('should display error when delete fails', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2024-01-15T10:00:00Z',
            finishedAt: '2024-01-15T11:00:00Z',
            durationSeconds: 3600,
            exercisesCompleted: [],
            bodyWeightKg: 80,
            totalWeightKg: 0,
          },
        ]);
      }),
      http.delete(`${mockApiUrl}/users/1/workouts/1`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Strength')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Strength' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
