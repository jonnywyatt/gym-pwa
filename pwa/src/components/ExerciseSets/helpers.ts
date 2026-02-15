export function getMinutes(timeSeconds: number | undefined): string {
  if (timeSeconds === undefined) return '';
  return String(Math.floor(timeSeconds / 60));
}

export function getSeconds(timeSeconds: number | undefined): string {
  if (timeSeconds === undefined) return '';
  return String(timeSeconds % 60);
}

export function combineTimeSeconds(
  currentTimeSeconds: number | undefined,
  field: 'minutes' | 'seconds',
  value: string
): number | undefined {
  const numValue = Number(value) || 0;
  const currentMinutes = currentTimeSeconds !== undefined ? Math.floor(currentTimeSeconds / 60) : 0;
  const currentSeconds = currentTimeSeconds !== undefined ? currentTimeSeconds % 60 : 0;

  const newMinutes = field === 'minutes' ? numValue : currentMinutes;
  const newSeconds = field === 'seconds' ? Math.min(numValue, 59) : currentSeconds;
  const totalSeconds = newMinutes * 60 + newSeconds;

  return totalSeconds || undefined;
}
