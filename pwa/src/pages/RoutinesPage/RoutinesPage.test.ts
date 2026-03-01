import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw';
import RoutinesPage from './RoutinesPage.vue';

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

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

const mockApiUrl = 'http://localhost:3000';

const mockRoutines = [
  { id: 1, label: 'Strength', userId: null, exerciseCount: 12 },
  { id: 2, label: 'Abs', userId: null, exerciseCount: 4 },
  { id: 3, label: 'My Routine', userId: 1, exerciseCount: 3 },
];

const mockPreferences = { showRecommendedRoutines: true };

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

const mockRouter = {
  push: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}));

function setupDefaultHandlers() {
  server.use(
    http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(mockRoutines)),
    http.get(`${mockApiUrl}/users/1/preferences`, () => HttpResponse.json(mockPreferences)),
    http.patch(`${mockApiUrl}/users/1/preferences`, () => HttpResponse.json(mockPreferences))
  );
}

function renderPage() {
  return render(RoutinesPage, { global: { stubs: { RouterLink: routerLinkStub } } });
}

describe('RoutinesPage', () => {
  it('shows loading state initially', () => {
    setupDefaultHandlers();
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays all routines when show recommended is checked', async () => {
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Strength' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Abs' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Routine' })).toBeInTheDocument();
  });

  it('shows "Show recommended routines" checkbox', async () => {
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: /show recommended routines/i })
      ).toBeInTheDocument();
    });
  });

  it('filters to user routines only when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(mockRoutines)),
      http.get(`${mockApiUrl}/users/1/preferences`, () =>
        HttpResponse.json({ showRecommendedRoutines: true })
      ),
      http.patch(`${mockApiUrl}/users/1/preferences`, () =>
        HttpResponse.json({ showRecommendedRoutines: false })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Strength' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('checkbox', { name: /show recommended routines/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Strength' })).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: 'Abs' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Routine' })).toBeInTheDocument();
  });

  it('loads preferences on mount and reflects saved preference', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(mockRoutines)),
      http.get(`${mockApiUrl}/users/1/preferences`, () =>
        HttpResponse.json({ showRecommendedRoutines: false })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('heading', { name: 'Strength' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Routine' })).toBeInTheDocument();
  });

  it('shows Create routine button', async () => {
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create routine' })).toBeInTheDocument();
    });
  });

  it('navigates to edit page when Create routine is clicked', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(mockRoutines)),
      http.get(`${mockApiUrl}/users/1/preferences`, () => HttpResponse.json(mockPreferences)),
      http.post(`${mockApiUrl}/routines`, () => HttpResponse.json({ id: 99 }, { status: 201 }))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create routine' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Create routine' }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/routines/99/edit');
    });
  });

  it('shows Edit and Delete buttons only for user-owned routines', async () => {
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My Routine' })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete My Routine/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Strength/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Abs/i })).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when Delete is clicked', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete My Routine/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Delete My Routine/i }));

    expect(screen.getByRole('heading', { name: 'Delete routine?' })).toBeInTheDocument();
  });

  it('removes routine from list when delete is confirmed', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${mockApiUrl}/routines`, () => HttpResponse.json(mockRoutines)),
      http.get(`${mockApiUrl}/users/1/preferences`, () => HttpResponse.json(mockPreferences)),
      http.delete(`${mockApiUrl}/routines/3`, () => new HttpResponse(null, { status: 204 }))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete My Routine/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Delete My Routine/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'My Routine' })).not.toBeInTheDocument();
    });
  });

  it('keeps routine in list when delete is cancelled', async () => {
    const user = userEvent.setup();
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete My Routine/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Delete My Routine/i }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('heading', { name: 'My Routine' })).toBeInTheDocument();
  });

  it('shows Recommended label for default routines and not for user-owned routines', async () => {
    setupDefaultHandlers();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Strength' })).toBeInTheDocument();
    });

    const recommendedLabels = screen.getAllByText('Recommended');
    expect(recommendedLabels).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'My Routine' }).closest('a')).not.toHaveTextContent(
      'Recommended'
    );
  });

  it('displays error message when fetch fails', async () => {
    server.use(
      http.get(`${mockApiUrl}/routines`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      ),
      http.get(`${mockApiUrl}/users/1/preferences`, () => HttpResponse.json(mockPreferences))
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
