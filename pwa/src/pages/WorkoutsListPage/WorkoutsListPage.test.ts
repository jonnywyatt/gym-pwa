import { render, screen, waitFor, within } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
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

const sessionCalendarStub = {
  template: '<div data-testid="session-calendar" />',
  props: ['startDate', 'endDate', 'sessions'],
};

describe('WorkoutsListPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  function renderPage() {
    return render(WorkoutsListPage, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
          SessionCalendar: sessionCalendarStub,
        },
      },
    });
  }

  it('should display a Start session link', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
      })
    );

    renderPage();

    const link = screen.getByRole('link', { name: 'Start session' });
    expect(link).toHaveAttribute('href', '/sessions/start');
  });

  it('should display navigation links with By month highlighted', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
      })
    );

    renderPage();

    const byMonthLink = screen.getByRole('link', { name: 'By month' });
    expect(byMonthLink).toHaveAttribute('href', '/sessions');
    expect(byMonthLink.className).toContain('buttonLink--active');

    const trendsLink = screen.getByRole('link', { name: 'Trends' });
    expect(trendsLink).toHaveAttribute('href', '/session-trends');
    expect(trendsLink.className).not.toContain('buttonLink--active');
  });

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

  it('should display month headings when data loads', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T12:00:00'));

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'April 2026' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'March 2026' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'May 2025' })).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should show routine summary counts for months with sessions', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T12:00:00'));

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2026-04-01T10:00:00Z',
            finishedAt: '2026-04-01T11:00:00Z',
            durationSeconds: 3600,
            exerciseCount: 3,
            bodyWeightKg: 80,
            totalWeightKg: 1500,
            totalReps: 50,
          },
          {
            id: 2,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2026-04-03T10:00:00Z',
            finishedAt: '2026-04-03T11:00:00Z',
            durationSeconds: 3600,
            exerciseCount: 3,
            bodyWeightKg: 80,
            totalWeightKg: 1600,
            totalReps: 55,
          },
          {
            id: 3,
            userId: 1,
            routineId: 2,
            routineLabel: 'Cardio',
            startedAt: '2026-04-02T10:00:00Z',
            finishedAt: '2026-04-02T10:30:00Z',
            durationSeconds: 1800,
            exerciseCount: 1,
            bodyWeightKg: 80,
            totalWeightKg: 0,
            totalReps: 0,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const aprilHeading = screen.getByRole('heading', { name: 'April 2026' });
    const aprilSection = aprilHeading.closest('section');
    expect(aprilSection).not.toBeNull();
    if (aprilSection) {
      const sectionQueries = within(aprilSection);
      expect(sectionQueries.getByText('Strength')).toBeInTheDocument();
      expect(sectionQueries.getByText('2')).toBeInTheDocument();
      expect(sectionQueries.getByText('Cardio')).toBeInTheDocument();
      expect(sectionQueries.getByText('1')).toBeInTheDocument();
    }

    vi.useRealTimers();
  });

  it('should render a session calendar for months with sessions', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T12:00:00'));

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2026-04-01T10:00:00Z',
            finishedAt: '2026-04-01T11:00:00Z',
            durationSeconds: 3600,
            exerciseCount: 3,
            bodyWeightKg: 80,
            totalWeightKg: 1500,
            totalReps: 50,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const aprilHeading = screen.getByRole('heading', { name: 'April 2026' });
    const aprilSection = aprilHeading.closest('section');
    expect(aprilSection).not.toBeNull();
    if (aprilSection) {
      expect(within(aprilSection).getByTestId('session-calendar')).toBeInTheDocument();
    }

    vi.useRealTimers();
  });

  it('should not render a session calendar for empty months', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T12:00:00'));

    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, () => {
        return HttpResponse.json([
          {
            id: 1,
            userId: 1,
            routineId: 1,
            routineLabel: 'Strength',
            startedAt: '2026-04-01T10:00:00Z',
            finishedAt: '2026-04-01T11:00:00Z',
            durationSeconds: 3600,
            exerciseCount: 3,
            bodyWeightKg: 80,
            totalWeightKg: 1500,
            totalReps: 50,
          },
        ]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const marchHeading = screen.getByRole('heading', { name: 'March 2026' });
    const marchSection = marchHeading.closest('section');
    expect(marchSection).not.toBeNull();
    if (marchSection) {
      expect(within(marchSection).queryByTestId('session-calendar')).not.toBeInTheDocument();
    }

    vi.useRealTimers();
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

  it('should fetch workouts with since param for 12 months', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T12:00:00'));

    let capturedUrl = '';
    server.use(
      http.get(`${mockApiUrl}/users/1/workouts`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(capturedUrl).toContain('since=');
    const sinceParam = new URL(capturedUrl).searchParams.get('since');
    expect(sinceParam).not.toBeNull();
    const sinceDate = new Date(sinceParam as string);
    expect(sinceDate.getFullYear()).toBe(2025);
    expect(sinceDate.getMonth()).toBe(4);
    expect(sinceDate.getDate()).toBe(1);

    vi.useRealTimers();
  });
});
