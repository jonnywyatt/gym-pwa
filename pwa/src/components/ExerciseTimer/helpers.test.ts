import { describe, expect, it } from 'vitest';
import { formatElapsed } from './helpers';

describe('formatElapsed', () => {
  it('formats zero as 00:00', () => {
    expect(formatElapsed(0)).toBe('00:00');
  });

  it('formats seconds only', () => {
    expect(formatElapsed(9)).toBe('00:09');
    expect(formatElapsed(45)).toBe('00:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatElapsed(60)).toBe('01:00');
    expect(formatElapsed(90)).toBe('01:30');
    expect(formatElapsed(125)).toBe('02:05');
  });

  it('pads single-digit minutes and seconds', () => {
    expect(formatElapsed(61)).toBe('01:01');
  });

  it('formats large values', () => {
    expect(formatElapsed(3600)).toBe('60:00');
  });
});
