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

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

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

const mockAllExercises = [
  {
    id: 1,
    label: 'Plank',
    recordSetsType: 'TIME',
    primaryMuscleGroups: ['Abdominals'],
    secondaryMuscleGroups: [],
  },
  {
    id: 2,
    label: 'Side plank',
    recordSetsType: 'TIME',
    primaryMuscleGroups: ['Obliques'],
    secondaryMuscleGroups: ['Abdominals'],
  },
];

function setupDefaultHandlers() {
  server.use(
    http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
    http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockAllExercises))
  );
}

function renderPage() {
  return render(EditRoutinePage);
}

describe('EditRoutinePage', () => {
  it('shows loading state initially', () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, async () => {
        await new Promise(() => {});
        return HttpResponse.json(mockRoutine);
      }),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays the routine name in the input', async () => {
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('New routine name');
    expect(nameInput).toHaveValue('My Routine');
  });

  it('focuses the routine name input after loading', async () => {
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('New routine name')).toHaveFocus();
    });
  });

  it('displays existing exercises in the routine', async () => {
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Plank')).toBeInTheDocument();
    });

    expect(screen.getByText('Primary groups: Abdominals')).toBeInTheDocument();
  });

  it('shows Finish button when routine has a name and at least one exercise', async () => {
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
    });
  });

  it('does not show Finish button when there are no exercises', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'My Routine', exercises: [] })
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
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
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeInTheDocument();
  });

  it('navigates to the routine page when Finish is clicked', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(mockRouter.push).toHaveBeenCalledWith('/routines/5');
  });

  it('saves routine name on blur', async () => {
    const user = userEvent.setup();
    let patchedLabel: string | undefined;

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([])),
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
    setupDefaultHandlers();

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

  it('shows "No exercises found" when search matches nothing', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();

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
    setupDefaultHandlers();

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
    setupDefaultHandlers();

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
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockAllExercises)),
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

  it('shows adding overlay while the add request is in flight', async () => {
    const user = userEvent.setup();
    let resolveAdd: (() => void) | undefined;

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'My Routine', exercises: [] })
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json(mockAllExercises)),
      http.post(`${mockApiUrl}/routines/5/exercises`, async () => {
        await new Promise<void>((resolve) => {
          resolveAdd = resolve;
        });
        return new HttpResponse(null, { status: 204 });
      })
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
      expect(screen.getByText('Adding Side plank')).toBeInTheDocument();
    });

    if (!resolveAdd) throw new Error('resolveAdd not assigned');
    resolveAdd();

    await waitFor(() => {
      expect(screen.queryByText('Adding Side plank')).not.toBeInTheDocument();
    });
  });

  it('removes an exercise when Remove is clicked and confirmed', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([])),
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
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.queryByText('Plank')).not.toBeInTheDocument();
    });
  });

  it('does not show already-added exercises in search results', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();

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

  it('does not show results until 2 characters have been typed', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search exercises to add...');
    await user.type(searchInput, 's');

    expect(screen.queryByText('No exercises found')).not.toBeInTheDocument();
    expect(screen.queryByText('Side plank')).not.toBeInTheDocument();

    await user.type(searchInput, 'i');

    await waitFor(() => {
      expect(screen.getByText('Side plank')).toBeInTheDocument();
    });
  });

  it('fetches all exercises once on load and filters client-side without additional API calls', async () => {
    const user = userEvent.setup();
    let exercisesCallCount = 0;

    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () => {
        exercisesCallCount += 1;
        return HttpResponse.json(mockAllExercises);
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search exercises to add...')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search exercises to add...'), 'side plank');

    await waitFor(() => {
      expect(screen.getByText('Side plank')).toBeInTheDocument();
    });

    expect(exercisesCallCount).toBe(1);
  });

  it('displays error message when routine fails to load', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Exercises didn't load - please refresh the page")
      ).toBeInTheDocument();
    });
  });

  it('displays error message when exercises fail to load', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () => HttpResponse.json(mockRoutine)),
      http.get(`${mockApiUrl}/exercises`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Exercises didn't load - please refresh the page")
      ).toBeInTheDocument();
    });
  });

  it('shows empty state when routine has no exercises', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines/5`, () =>
        HttpResponse.json({ id: 5, label: 'Empty Routine', exercises: [] })
      ),
      http.get(`${mockApiUrl}/exercises`, () => HttpResponse.json([]))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/No exercises yet/)).toBeInTheDocument();
    });
  });
});
