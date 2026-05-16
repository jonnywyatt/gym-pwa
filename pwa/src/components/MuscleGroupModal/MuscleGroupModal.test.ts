import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import MuscleGroupModal from './MuscleGroupModal.vue';

describe('MuscleGroupModal', () => {
  function renderModal(props = {}) {
    return render(MuscleGroupModal, {
      props: {
        open: true,
        exerciseLabel: 'Bench Press',
        primaryMuscleGroups: ['Pectoralis Major', 'Front Deltoids'],
        secondaryMuscleGroups: ['Triceps'],
        tertiaryMuscleGroups: ['Abdominals'],
        ...props,
      },
    });
  }

  it('displays the exercise label as a heading', () => {
    renderModal();

    expect(screen.getByRole('heading', { name: 'Bench Press', hidden: true })).toBeInTheDocument();
  });

  it('displays primary muscle groups', () => {
    renderModal();

    expect(screen.getByText(/Pectoralis Major/, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Front Deltoids/, { exact: false })).toBeInTheDocument();
  });

  it('displays secondary muscle groups', () => {
    renderModal();

    expect(screen.getByText(/Triceps/, { exact: false })).toBeInTheDocument();
  });

  it('displays tertiary muscle groups', () => {
    renderModal();

    expect(screen.getByText(/Abdominals/, { exact: false })).toBeInTheDocument();
  });

  it('displays section headings for each tier', () => {
    renderModal();

    expect(
      screen.getByRole('heading', { name: 'Main muscles worked', hidden: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Secondary muscles', hidden: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Stabilizing muscles', hidden: true })
    ).toBeInTheDocument();
  });

  it('hides section when muscle group array is empty', () => {
    renderModal({
      secondaryMuscleGroups: [],
      tertiaryMuscleGroups: [],
    });

    expect(
      screen.getByRole('heading', { name: 'Main muscles worked', hidden: true })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Secondary muscles', hidden: true })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Stabilizing muscles', hidden: true })
    ).not.toBeInTheDocument();
  });

  it('emits close when close button is clicked', async () => {
    const user = userEvent.setup();
    const { emitted } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Close', hidden: true }));

    expect(emitted().close).toHaveLength(1);
  });
});
