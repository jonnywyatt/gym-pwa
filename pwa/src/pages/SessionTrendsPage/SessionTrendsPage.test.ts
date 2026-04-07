import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import { clearTrendsCache } from './helpers';
import SessionTrendsPage from './SessionTrendsPage.vue';

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

const LineChartStub = {
  name: 'LazyLineChart',
  template: '<canvas data-testid="line-chart" />',
  props: ['data', 'options'],
};

const mockApiUrl = 'http://localhost:3000';

const weightRoutine = {
  routineId: 1,
  routineLabel: 'Push Day',
  secondMetric: 'weight',
  sessions: [
    { date: '2026-01-01T10:00:00Z', durationSeconds: 3600, totalWeightKg: 1000, totalReps: 0 },
    { date: '2026-01-08T10:00:00Z', durationSeconds: 4200, totalWeightKg: 1100, totalReps: 0 },
  ],
};

const repsRoutine = {
  routineId: 2,
  routineLabel: 'Cardio',
  secondMetric: 'reps',
  sessions: [
    { date: '2026-01-02T10:00:00Z', durationSeconds: 1800, totalWeightKg: 0, totalReps: 120 },
  ],
};

const noMetricRoutine = {
  routineId: 3,
  routineLabel: 'Stretching',
  secondMetric: null,
  sessions: [
    { date: '2026-01-03T10:00:00Z', durationSeconds: 900, totalWeightKg: 0, totalReps: 0 },
  ],
};

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

function renderPage() {
  return render(SessionTrendsPage, {
    global: { stubs: { RouterLink: routerLinkStub, LazyLineChart: LineChartStub } },
  });
}

describe('SessionTrendsPage', () => {
  beforeEach(() => {
    clearTrendsCache();
  });

  it('should display navigation links with Trends highlighted', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => {
        return HttpResponse.json([]);
      })
    );

    renderPage();

    const byMonthLink = screen.getByRole('link', { name: 'By month' });
    expect(byMonthLink).toHaveAttribute('href', '/sessions');
    expect(byMonthLink.className).not.toContain('buttonLink--active');

    const trendsLink = screen.getByRole('link', { name: 'Trends' });
    expect(trendsLink).toHaveAttribute('href', '/session-trends');
    expect(trendsLink.className).toContain('buttonLink--active');
  });

  it('shows loading state initially', () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no data returned', async () => {
    server.use(http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([])));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No session data in this period.')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('renders routine name as a heading', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([weightRoutine]))
    );

    renderPage();

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'Push Day', level: 2 })).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  }, 15000);

  it('shows total weight label for weight metric', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([weightRoutine]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Total weight \(kg\)/)).toBeInTheDocument();
    });
  });

  it('shows session duration label for reps metric', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([repsRoutine]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Session duration/)).toBeInTheDocument();
    });
  });

  it('shows session duration label when no second metric', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([noMetricRoutine]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Session duration/)).toBeInTheDocument();
    });
  });

  it('renders two charts per routine with sessions', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () =>
        HttpResponse.json([weightRoutine, repsRoutine])
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByTestId('line-chart')).toHaveLength(4);
    });
  });

  it('shows page heading', async () => {
    server.use(http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([])));

    renderPage();

    expect(screen.getByRole('heading', { name: 'Sessions', level: 1 })).toBeInTheDocument();
  });

  it('renders all period filter buttons', async () => {
    server.use(http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([])));

    renderPage();

    expect(screen.getByRole('button', { name: '3 mths' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6 mths' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 year' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  it('re-fetches with since param when a period filter is selected', async () => {
    let capturedUrl = '';
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: '3 mths' }));

    await waitFor(() => {
      expect(capturedUrl).toContain('since=');
    });
  });

  it('does not show a session popup initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, () => HttpResponse.json([weightRoutine]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Push Day', level: 2 })).toBeInTheDocument();
    });

    expect(screen.queryByText('01 Jan 2026')).not.toBeInTheDocument();
  });

  it('re-fetches without since param when All is selected', async () => {
    let capturedUrl = '';
    server.use(
      http.get(`${mockApiUrl}/users/1/session-trends`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'All' }));

    await waitFor(() => {
      expect(capturedUrl).toBe(`${mockApiUrl}/users/1/session-trends`);
    });
  });
});
