import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import ConfirmDialog from './ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  function renderDialog(props = {}) {
    return render(ConfirmDialog, {
      props: {
        open: true,
        title: 'Delete workout?',
        message: 'This action cannot be undone.',
        ...props,
      },
    });
  }

  it('displays title and message when open', () => {
    renderDialog();

    expect(
      screen.getByRole('heading', { name: 'Delete workout?', hidden: true })
    ).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('emits confirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Delete', hidden: true }));

    expect(emitted().confirm).toHaveLength(1);
  });

  it('emits cancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Cancel', hidden: true }));

    expect(emitted().cancel).toHaveLength(1);
  });

  it('uses custom button labels', () => {
    renderDialog({ confirmLabel: 'Remove', cancelLabel: 'Keep' });

    expect(screen.getByRole('button', { name: 'Remove', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep', hidden: true })).toBeInTheDocument();
  });
});
