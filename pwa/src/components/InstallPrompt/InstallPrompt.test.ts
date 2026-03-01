import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import * as helpers from './InstallPrompt.helpers';
import InstallPrompt from './InstallPrompt.vue';

vi.mock('./InstallPrompt.helpers', () => ({
  initInstallPromptListener: vi.fn(),
  canInstall: vi.fn(),
  promptInstall: vi.fn().mockResolvedValue('accepted'),
  isIos: vi.fn(),
}));

describe('InstallPrompt', () => {
  it('does not show the install button when the app is not installable', () => {
    vi.mocked(helpers.canInstall).mockReturnValue(false);

    render(InstallPrompt);

    expect(
      screen.queryByRole('button', { name: 'Add Duro to your home screen' })
    ).not.toBeInTheDocument();
  });

  it('shows the install button when the app is installable', async () => {
    vi.mocked(helpers.canInstall).mockReturnValue(true);

    render(InstallPrompt);
    await nextTick();

    expect(
      screen.getByRole('button', { name: 'Add Duro to your home screen' })
    ).toBeInTheDocument();
  });

  it('shows the install button when beforeinstallprompt fires after mount', async () => {
    vi.mocked(helpers.canInstall).mockReturnValue(false);

    render(InstallPrompt);
    expect(
      screen.queryByRole('button', { name: 'Add Duro to your home screen' })
    ).not.toBeInTheDocument();

    window.dispatchEvent(new Event('beforeinstallprompt'));

    await screen.findByRole('button', { name: 'Add Duro to your home screen' });
    expect(
      screen.getByRole('button', { name: 'Add Duro to your home screen' })
    ).toBeInTheDocument();
  });

  it('hides the install button after it is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.canInstall).mockReturnValue(true);
    vi.mocked(helpers.promptInstall).mockResolvedValue('accepted');

    render(InstallPrompt);
    await nextTick();

    await user.click(screen.getByRole('button', { name: 'Add Duro to your home screen' }));

    expect(
      screen.queryByRole('button', { name: 'Add Duro to your home screen' })
    ).not.toBeInTheDocument();
  });

  it('hides the install button even when the user dismisses the prompt', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.canInstall).mockReturnValue(true);
    vi.mocked(helpers.promptInstall).mockResolvedValue('dismissed');

    render(InstallPrompt);
    await nextTick();

    await user.click(screen.getByRole('button', { name: 'Add Duro to your home screen' }));

    expect(
      screen.queryByRole('button', { name: 'Add Duro to your home screen' })
    ).not.toBeInTheDocument();
  });
});

describe('iOS install prompt', () => {
  it('shows the iOS install button on iOS devices', async () => {
    vi.mocked(helpers.canInstall).mockReturnValue(false);
    vi.mocked(helpers.isIos).mockReturnValue(true);

    render(InstallPrompt);
    await nextTick();

    expect(
      screen.getByRole('button', { name: 'Add Duro to your iPhone home screen' })
    ).toBeInTheDocument();
  });

  it('does not show the iOS install button on non-iOS devices', async () => {
    vi.mocked(helpers.canInstall).mockReturnValue(false);
    vi.mocked(helpers.isIos).mockReturnValue(false);

    render(InstallPrompt);
    await nextTick();

    expect(
      screen.queryByRole('button', { name: 'Add Duro to your iPhone home screen' })
    ).not.toBeInTheDocument();
  });

  it('shows iOS instructions overlay when the button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.canInstall).mockReturnValue(false);
    vi.mocked(helpers.isIos).mockReturnValue(true);

    render(InstallPrompt);
    await nextTick();

    await user.click(screen.getByRole('button', { name: 'Add Duro to your iPhone home screen' }));

    expect(
      screen.getByRole('heading', { name: 'Add Duro to your iPhone Home Screen' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
  });

  it('closes iOS instructions overlay when Got it is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.canInstall).mockReturnValue(false);
    vi.mocked(helpers.isIos).mockReturnValue(true);

    render(InstallPrompt);
    await nextTick();

    await user.click(screen.getByRole('button', { name: 'Add Duro to your iPhone home screen' }));
    await user.click(screen.getByRole('button', { name: 'Got it' }));

    expect(
      screen.queryByRole('heading', { name: 'Add Duro to your iPhone home screen' })
    ).not.toBeInTheDocument();
  });
});
