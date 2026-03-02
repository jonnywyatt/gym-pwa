import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import WeightKg from './WeightKg.vue';

describe('WeightKg', () => {
  it('renders the kg value as text', () => {
    render(WeightKg, { props: { kg: 120 } });
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  it('renders the kg unit in a span', () => {
    const { container } = render(WeightKg, { props: { kg: 60 } });
    const unitSpan = container.querySelector('span');
    expect(unitSpan).toHaveTextContent('kg');
  });
});
