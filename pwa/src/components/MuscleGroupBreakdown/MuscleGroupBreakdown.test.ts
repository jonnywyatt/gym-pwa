import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import type { MuscleGroupBreakdown as MuscleGroupBreakdownType } from '../../pages/WorkoutPage/helpers';
import MuscleGroupBreakdown from './MuscleGroupBreakdown.vue';

const breakdown: MuscleGroupBreakdownType = {
  bodyAreas: [
    { bodyArea: 'Legs', percentage: 50 },
    { bodyArea: 'Back', percentage: 30 },
    { bodyArea: 'Core', percentage: 20 },
  ],
  muscleGroups: [
    { muscleGroup: 'Quads', bodyArea: 'Legs', percentage: 25 },
    { muscleGroup: 'Lats', bodyArea: 'Back', percentage: 12.5 },
    { muscleGroup: 'Abs', bodyArea: 'Core', percentage: 5 },
  ],
};

async function renderExpanded() {
  const user = userEvent.setup();
  render(MuscleGroupBreakdown, { props: { breakdown } });
  await user.click(screen.getByRole('button', { name: /muscle detail/i }));
  return user;
}

describe('MuscleGroupBreakdown', () => {
  it('scales the highest muscle group bar to 90% width', async () => {
    await renderExpanded();

    const bar = screen.getByText('Quads').parentElement?.querySelector('[style*="width"]');
    expect(bar).toHaveStyle({ width: '90%' });
  });

  it('scales lower muscle group bars proportionally to the highest', async () => {
    await renderExpanded();

    const latsBar = screen.getByText('Lats').parentElement?.querySelector('[style*="width"]');
    const absBar = screen.getByText('Abs').parentElement?.querySelector('[style*="width"]');

    expect(latsBar).toHaveStyle({ width: '45%' });
    expect(absBar).toHaveStyle({ width: '18%' });
  });
});
