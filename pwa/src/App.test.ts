import { render, screen, waitFor } from '@testing-library/vue';
import { delay, HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.vue';
import { server } from './test/msw';

describe('Exercises Page', () => {
  const mockApiUrl = 'http://localhost:3000';

  beforeEach(() => {
    import.meta.env.VITE_API_URL = mockApiUrl;
  });

  it('should display loading state initially', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    render(App);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display exercises when API call succeeds', async () => {
    const mockExercises = [
      { id: 1, name: 'Bench Press', createdAt: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Squats', createdAt: '2024-01-02T00:00:00Z' },
      { id: 3, name: 'Deadlift', createdAt: '2024-01-03T00:00:00Z' },
    ];

    server.use(
      http.get(`${mockApiUrl}/exercises`, () => {
        return HttpResponse.json(mockExercises);
      })
    );

    render(App);

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
      http.get(`${mockApiUrl}/exercises`, () => {
        return HttpResponse.json([]);
      })
    );

    render(App);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No exercises found.')).toBeInTheDocument();
  });

  it('should display error message when API call fails with HTTP error', async () => {
    server.use(
      http.get(`${mockApiUrl}/exercises`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(App);

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

    render(App);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  it('should render exercises in a list', async () => {
    const mockExercises = [
      { id: 1, name: 'Push-ups', createdAt: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Pull-ups', createdAt: '2024-01-02T00:00:00Z' },
    ];

    server.use(
      http.get(`${mockApiUrl}/exercises`, () => {
        return HttpResponse.json(mockExercises);
      })
    );

    render(App);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent('Push-ups');
      expect(listItems[1]).toHaveTextContent('Pull-ups');
    });
  });
});
