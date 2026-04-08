import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../lib/db';
import { server } from '../../test/msw';
import StartSessionPage from './StartSessionPage.vue';

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

const mockApiUrl = 'http://localhost:3000';

describe('StartSessionPage', () => {
  beforeEach(async () => {
    localStorage.setItem('access_token', 'test-token');
    mockRouterPush.mockClear();
    await db.workouts.clear();
  });

  afterEach(async () => {
    await db.workouts.clear();
  });

  function renderPage() {
    return render(StartSessionPage);
  }

  it('should display the page heading', () => {
    server.use(http.get(`${mockApiUrl}/routines`, () => HttpResponse.json([])));
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Start a session' })).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display all routines as buttons', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json([
          { id: 1, label: 'Upper Body', exerciseCount: 5, userId: null },
          { id: 2, label: 'Lower Body', exerciseCount: 4, userId: null },
          { id: 3, label: 'Core', exerciseCount: 3, userId: null },
        ])
      )
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Lower Body' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Core' })).toBeInTheDocument();
  });

  it('should display error when routines fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should start a new workout when a routine button is clicked', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json([{ id: 1, label: 'Upper Body', exerciseCount: 5, userId: null }])
      ),
      http.get(`${mockApiUrl}/routines/1`, () =>
        HttpResponse.json({
          id: 1,
          label: 'Upper Body',
          exercises: [
            {
              id: 10,
              label: 'Bench Press',
              recordSetsType: 'WEIGHT',
              isIsometric: false,
              isUnilateral: false,
              primaryMuscleGroups: ['Pectoralis Major'],
              secondaryMuscleGroups: ['Triceps'],
              tertiaryMuscleGroups: [],
            },
          ],
        })
      ),
      http.get(`${mockApiUrl}/users/1`, () =>
        HttpResponse.json({ id: 1, name: 'Test User', latestBodyWeight: { weightKg: 80 } })
      )
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
  });

  it('should disable buttons while a workout is being started', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json([{ id: 1, label: 'Upper Body', exerciseCount: 5, userId: null }])
      ),
      http.get(`${mockApiUrl}/routines/1`, async () => {
        await delay('infinite');
        return HttpResponse.json({});
      }),
      http.get(`${mockApiUrl}/users/1`, () =>
        HttpResponse.json({ id: 1, name: 'Test User', latestBodyWeight: { weightKg: 80 } })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Upper Body' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Upper Body' }));

    expect(screen.getByRole('button', { name: 'Upper Body' })).toBeDisabled();
  });
});
