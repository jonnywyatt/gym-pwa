import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage.vue';

const routerLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};

describe('DashboardPage', () => {
  it('should display the dashboard heading', () => {
    render(DashboardPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    expect(screen.getByText('Axis gym companion')).toBeInTheDocument();
  });

  it('should display a link to the Routines page', () => {
    render(DashboardPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    const link = screen.getByText('Routines').closest('a');
    expect(link).toHaveAttribute('href', '/routines');
    expect(screen.getByText('Browse and start a workout')).toBeInTheDocument();
  });

  it('should display a link to the Workouts page', () => {
    render(DashboardPage, {
      global: { stubs: { RouterLink: routerLinkStub } },
    });

    const link = screen.getByText('Workouts').closest('a');
    expect(link).toHaveAttribute('href', '/workouts');
    expect(screen.getByText('View your workout history')).toBeInTheDocument();
  });
});
