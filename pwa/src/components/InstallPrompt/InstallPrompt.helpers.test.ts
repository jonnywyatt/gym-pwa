import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canInstall,
  initInstallPromptListener,
  isIos,
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

  describe('isIos', () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: false,
        configurable: true,
      });
      Object.defineProperty(navigator, 'standalone', {
        value: undefined,
        configurable: true,
      });
    });

    function setUserAgent(userAgent: string): void {
      Object.defineProperty(navigator, 'userAgent', {
        value: userAgent,
        writable: false,
        configurable: true,
      });
    }

    function setStandalone(value: boolean): void {
      Object.defineProperty(navigator, 'standalone', {
        value,
        writable: false,
        configurable: true,
      });
    }

    it('returns true for iPhone user agent', () => {
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)');
      expect(isIos()).toBe(true);
    });

    it('returns true for iPad user agent', () => {
      setUserAgent('Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)');
      expect(isIos()).toBe(true);
    });

    it('returns true for iPod user agent', () => {
      setUserAgent('Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)');
      expect(isIos()).toBe(true);
    });

    it('returns false when already installed as standalone', () => {
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)');
      setStandalone(true);
      expect(isIos()).toBe(false);
    });

    it('returns false for non-iOS user agents', () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(isIos()).toBe(false);
    });
  });
});
