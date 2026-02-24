import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canInstall,
  initInstallPromptListener,
  promptInstall,
  resetDeferredPrompt,
} from './InstallPrompt.helpers';

describe('InstallPrompt helpers', () => {
  beforeEach(() => {
    resetDeferredPrompt(null);
  });

  describe('canInstall', () => {
    it('returns false when no deferred prompt is available', () => {
      expect(canInstall()).toBe(false);
    });

    it('returns true after beforeinstallprompt fires', () => {
      const fakeEvent = {
        preventDefault: vi.fn(),
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: 'accepted' as const }),
      } as unknown as Event;

      initInstallPromptListener();
      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), fakeEvent));

      expect(canInstall()).toBe(true);
    });
  });

  describe('promptInstall', () => {
    it('returns dismissed when no deferred prompt is available', async () => {
      const result = await promptInstall();
      expect(result).toBe('dismissed');
    });

    it('returns accepted when user accepts the prompt', async () => {
      const fakePrompt = vi.fn().mockResolvedValue(undefined);
      const fakeUserChoice = Promise.resolve({ outcome: 'accepted' as const });

      resetDeferredPrompt({
        prompt: fakePrompt,
        userChoice: fakeUserChoice,
      } as unknown as Parameters<typeof resetDeferredPrompt>[0]);

      const result = await promptInstall();

      expect(fakePrompt).toHaveBeenCalledOnce();
      expect(result).toBe('accepted');
    });

    it('returns dismissed when user dismisses the prompt', async () => {
      const fakePrompt = vi.fn().mockResolvedValue(undefined);
      const fakeUserChoice = Promise.resolve({ outcome: 'dismissed' as const });

      resetDeferredPrompt({
        prompt: fakePrompt,
        userChoice: fakeUserChoice,
      } as unknown as Parameters<typeof resetDeferredPrompt>[0]);

      const result = await promptInstall();

      expect(result).toBe('dismissed');
    });

    it('clears the deferred prompt after calling it', async () => {
      const fakePrompt = vi.fn().mockResolvedValue(undefined);
      const fakeUserChoice = Promise.resolve({ outcome: 'accepted' as const });

      resetDeferredPrompt({
        prompt: fakePrompt,
        userChoice: fakeUserChoice,
      } as unknown as Parameters<typeof resetDeferredPrompt>[0]);

      await promptInstall();

      expect(canInstall()).toBe(false);
    });
  });
});
