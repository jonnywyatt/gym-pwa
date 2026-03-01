interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function initInstallPromptListener(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
  });
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

export async function promptInstall(): Promise<'accepted' | 'dismissed'> {
  if (deferredPrompt === null) {
    return 'dismissed';
  }

  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome;
}

export function resetDeferredPrompt(value: BeforeInstallPromptEvent | null = null): void {
  deferredPrompt = value;
}

export function isIos(): boolean {
  const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return isIosDevice && !isStandalone;
}
