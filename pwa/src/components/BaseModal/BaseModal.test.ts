import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import BaseModal from './BaseModal.vue';

describe('BaseModal', () => {
  it('renders slot content when open', () => {
    render(BaseModal, {
      props: { open: true },
      slots: { default: '<p>Modal content</p>' },
    });

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('emits close when cancel event fires on dialog', () => {
    const { emitted } = render(BaseModal, {
      props: { open: true },
      slots: { default: '<button>Inside</button>' },
    });

    const dialog = document.querySelector('dialog');
    dialog?.dispatchEvent(new Event('cancel'));

    expect(emitted().close).toHaveLength(1);
  });
});
