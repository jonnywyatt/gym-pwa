import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import DeleteIconButton from './DeleteIconButton.vue';

function renderComponent(
  overrides: Partial<{ label: string; confirmTitle: string; confirmMessage: string }> = {}
) {
  return render(DeleteIconButton, {
    props: {
      label: 'Delete item',
      confirmTitle: 'Delete?',
      confirmMessage: 'This cannot be undone.',
      ...overrides,
    },
  });
}

describe('DeleteIconButton', () => {
  it('renders a button with the given aria-label', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument();
  });

  it('does not show the dialog initially', () => {
    renderComponent();
    expect(screen.queryByRole('heading', { name: 'Delete?' })).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));

    expect(screen.getByRole('heading', { name: 'Delete?' })).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('emits confirm event when dialog is confirmed', async () => {
    const user = userEvent.setup();
    const { emitted } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(emitted('confirm')).toBeTruthy();
  });

  it('does not emit confirm when dialog is cancelled', async () => {
    const user = userEvent.setup();
    const { emitted } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(emitted('confirm')).toBeFalsy();
  });

  it('closes dialog after confirmation', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByRole('heading', { name: 'Delete?' })).not.toBeInTheDocument();
  });

  it('closes dialog after cancellation', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('heading', { name: 'Delete?' })).not.toBeInTheDocument();
  });
});
