import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import EditRoutinePage from './EditRoutinePage.vue';

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

const mockRouter = { push: vi.fn() };
const mockRouteParams = { routineId: '5' };

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => ({ params: mockRouteParams }),
}));

const mockApiUrl = 'http://localhost:3000';

const mockRoutine = {
  id: 5,
  label: 'My Routine',
  exercises: [
    {
      id: 1,
      label: 'Plank',
      recordSetsType: 'TIME',
      primaryMuscleGroups: ['Abdominals'],
      secondaryMuscleGroups: [],
    },
  ],
};

const mockSearchResults = [
  {
    id: 2,
    label: 'Side plank',
    recordSetsType: 'TIME',
    primaryMuscleGroups: ['Obliques'],
    secondaryMuscleGroups: ['Abdominals'],
  },
];

function renderPage() {
  return render(EditRoutinePage);
}

describe('EditRoutinePage', () => {
  it('shows loading state initially', () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, async () => {
        await new Promise(() => {});
        return HttpResponse.json(mockRoutine);
      })
    );

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays the routine name in the input', async () => {
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)));

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('New routine name');
    expect(nameInput).toHaveValue('My Routine');
  });

  it('focuses the routine name input after loading', async () => {
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)));

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('New routine name')).toHaveFocus();
    });
  });

  it('displays existing exercises in the routine', async () => {
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Plank')).toBeInTheDocument();
    });

    expect(screen.getByText('Primary groups: Abdominals')).toBeInTheDocument();
  });

  it('shows Finish button when routine has a name and at least one exercise', async () => {
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)));

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
    });
  });

  it('does not show Finish button when there are no exercises', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'My Routine', exercises: [] })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeInTheDocument();
  });

  it('does not show Finish button when routine has no name', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: '', exercises: mockRoutine.exercises })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeInTheDocument();
  });

  it('navigates to /routines when Finish is clicked', async () => {
    const user = userEvent.setup();
    server.use(http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)));

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(mockRouter.push).toHaveBeenCalledWith('/routines');
  });

  it('saves routine name on blur', async () => {
    const user = userEvent.setup();
    let patchedLabel: string | undefined;

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.patch(`${mockApiUrl}/routines/5/label`, async ({ request }) => {
        const body = (await request.json()) as { label: string };
        patchedLabel = body.label;
        return new HttpResponse(null, { status: 204 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('New routine name')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('New routine name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Routine');
    await user.tab();

    await waitFor(() => {
      expect(patchedLabel).toBe('Updated Routine');
    });
  });

  it('shows search results as exercise cards when typing', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockSearchResults))
    );

    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'side');

    await waitFor(() => {
      expect(screen.getByText('Side plank')).toBeInTheDocument();
    });

    expect(screen.getByText('Obliques')).toBeInTheDocument();
    expect(screen.getByText('Secondary muscle groups: Abdominals')).toBeInTheDocument();
  });

  it('shows "No exercises found" when search returns no matches', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'xyz');

    await waitFor(() => {
      expect(screen.getByText('No exercises found')).toBeInTheDocument();
    });

    expect(screen.getByTestId('search-backdrop')).toBeInTheDocument();
  });

  it('hides the results panel when the search input is cleared', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search exercises to add...');
    await user.type(searchInput, 'xyz');

    await waitFor(() => {
      expect(screen.getByTestId('search-backdrop')).toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.queryByTestId('search-backdrop')).not.toBeInTheDocument();
    });
  });

  it('closes search results when clicking the overlay backdrop', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockSearchResults))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'side');

    await waitFor(() => {
      expect(screen.getByTestId('search-backdrop')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('search-backdrop'));

    await waitFor(() => {
      expect(screen.queryByTestId('search-backdrop')).not.toBeInTheDocument();
    });
  });

  it('adds an exercise when a search result is clicked', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'My Routine', exercises: [] })
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockSearchResults)),
      http.post(`${mockApiUrl}/routines/5/exercises`, () => new HttpResponse(null, { status: 204 }))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'side');

    await waitFor(() => {
      expect(screen.getByText('Side plank')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Side plank'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Remove Side plank' })).toBeInTheDocument();
    });
  });

  it('removes an exercise when Remove is clicked', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.delete(
        `${mockApiUrl}/routines/5/exercises/1`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Remove Plank' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Remove Plank' }));

    await waitFor(() => {
      expect(screen.queryByText('Plank')).not.toBeInTheDocument();
    });
  });

  it('does not show already-added exercises in search results', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () =>
        HttpResponse.json([
          {
            id: 1,
            label: 'Plank',
            recordSetsType: 'TIME',
            primaryMuscleGroups: ['Abdominals'],
            secondaryMuscleGroups: [],
          },
          ...mockSearchResults,
        ])
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'plank');

    await waitFor(() => {
      expect(screen.getByText('Side plank')).toBeInTheDocument();
    });

    const allPlankItems = screen.getAllByText(/plank/i);
    const inRoutineCount = allPlankItems.filter((el) =>
      el.closest('li')?.querySelector('[aria-label*="Remove"]')
    ).length;
    expect(inRoutineCount).toBe(1);
  });

  it('displays error message when routine fails to load', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('shows empty state when routine has no exercises', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'Empty Routine', exercises: [] })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/No exercises yet/)).toBeInTheDocument();
    });
  });
});
