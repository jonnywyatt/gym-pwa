import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage.vue';

const initiateLogin = vi.fn();

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    initiateLogin: () => initiateLogin(),
  },
}));

describe('LoginPage', () => {
  it('should display the Duro logo', () => {
    render(LoginPage);
    expect(screen.getByAltText('Duro')).toBeInTheDocument();
  });

  it('should call initiateLogin when the sign in button is clicked', async () => {
    render(LoginPage);

    await userEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

    expect(initiateLogin).toHaveBeenCalled();
  });

  it('should advertise each app feature with a heading and screenshot', () => {
    render(LoginPage);

    expect(screen.getByRole('heading', { name: 'Build a gym habit' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Train smarter, not lopsided' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Watch your strength climb' })).toBeInTheDocument();

    expect(
      screen.getByAltText('Duro dashboard showing recent sessions and progress')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Duro muscle group breakdown chart')).toBeInTheDocument();
    expect(
      screen.getByAltText('Duro session trends chart showing lift progress over time')
    ).toBeInTheDocument();
  });
});
