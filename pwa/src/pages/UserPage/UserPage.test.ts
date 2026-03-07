import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import UserPage from './UserPage.vue';

vi.mock('../../config', () => ({
  config: {
    apiUrl: 'http://localhost:3000',
    googleClientId: 'test-client-id',
  },
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  useRoute: () => ({
    params: { userId: '1' },
  }),
}));

describe('UserPage', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1`, async () => {
        await delay('infinite');
        return HttpResponse.json({});
      })
    );

    render(UserPage);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display user name and empty weight input when no body weight exists', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json({
          id: 1,
          name: 'Test User',
          latestBodyWeight: null,
        });
      })
    );

    render(UserPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    const input = screen.getByLabelText('Body weight') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('should pre-populate weight input with latest body weight', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json({
          id: 1,
          name: 'Test User',
          latestBodyWeight: { weightKg: 75.5 },
        });
      })
    );

    render(UserPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText('Update bodyweight')).toBeInTheDocument();
    const input = screen.getByLabelText('Update bodyweight') as HTMLInputElement;
    expect(input.value).toBe('75.5');
  });

  it('should display kg suffix after the input', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1`, () => {
        return HttpResponse.json({ id: 1, name: 'Test User', latestBodyWeight: null });
      })
    );

    render(UserPage);

    await waitFor(() => {
      expect(screen.getByText('kg')).toBeInTheDocument();
    });
  });

  it('should save weight and show success message', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/users/1`, () => {
        return HttpResponse.json({
          id: 1,
          name: 'Test User',
          latestBodyWeight: null,
        });
      }),
      http.post(`${mockApiUrl}/users/1/body-weights`, async ({ request }) => {
        const body = (await request.json()) as { weightKg: number };
        return HttpResponse.json({ weightKg: String(body.weightKg) }, { status: 201 });
      })
    );

    render(UserPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const input = screen.getByLabelText('Body weight');
    await user.type(input, '80.25');
    await user.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Weight saved')).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/users/1`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(UserPage);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error: HTTP error: 500/)).toBeInTheDocument();
  });
});
