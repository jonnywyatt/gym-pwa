import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import * as installPromptHelpers from '../../components/InstallPrompt/InstallPrompt.helpers';
import LoginPage from './LoginPage.vue';

const initiateLogin = vi.fn();

vi.mock('../../lib/auth/oauth', () => ({
  authService: {
    initiateLogin: () => initiateLogin(),
  },
}));

vi.mock('../../components/InstallPrompt/InstallPrompt.helpers', () => ({
  initInstallPromptListener: vi.fn(),
  canInstall: vi.fn(),
  promptInstall: vi.fn().mockResolvedValue('accepted'),
  isIos: vi.fn(),
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

    expect(
      screen.getByRole('heading', { name: 'A mobile app for building a gym habit' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Balance your training' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Track weight moved per session' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Take Duro with you' })).toBeInTheDocument();

    expect(
      screen.getByAltText('Dashboard showing recent sessions and progress')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Muscle group breakdown chart')).toBeInTheDocument();
    expect(
      screen.getByAltText('Session trends chart showing lift progress over time')
    ).toBeInTheDocument();
  });

  it('should include a slide with a button to install Duro to the home screen', async () => {
    vi.mocked(installPromptHelpers.canInstall).mockReturnValue(true);

    render(LoginPage);

    expect(screen.getByRole('heading', { name: 'Take Duro with you' })).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Add Duro to your home screen' })
    ).toBeInTheDocument();
  });
});
