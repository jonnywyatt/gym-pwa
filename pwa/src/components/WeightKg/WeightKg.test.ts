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

  it('rounds the kg value to 1 decimal place', () => {
    render(WeightKg, { props: { kg: 120.456 } });
    expect(screen.getByText(/120\.5/)).toBeInTheDocument();
  });

  it('does not show trailing zero for whole numbers', () => {
    const { container } = render(WeightKg, { props: { kg: 120 } });
    expect(container.textContent).toBe('120kg');
  });
});
