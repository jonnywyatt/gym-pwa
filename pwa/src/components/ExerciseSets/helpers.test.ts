import { describe, expect, it } from 'vitest';
import { combineTimeSeconds, getMinutes, getSeconds } from './helpers';

describe('getMinutes', () => {
  it('returns empty string when timeSeconds is undefined', () => {
    expect(getMinutes(undefined)).toBe('');
  });

  it('returns minutes from total seconds', () => {
    expect(getMinutes(90)).toBe('1');
  });

  it('returns 0 for less than 60 seconds', () => {
    expect(getMinutes(45)).toBe('0');
  });

  it('floors partial minutes', () => {
    expect(getMinutes(125)).toBe('2');
  });
});

describe('getSeconds', () => {
  it('returns empty string when timeSeconds is undefined', () => {
    expect(getSeconds(undefined)).toBe('');
  });

  it('returns remaining seconds', () => {
    expect(getSeconds(90)).toBe('30');
  });

  it('returns full value when under 60', () => {
    expect(getSeconds(45)).toBe('45');
  });

  it('returns 0 for exact minutes', () => {
    expect(getSeconds(120)).toBe('0');
  });
});

describe('combineTimeSeconds', () => {
  it('updates minutes while preserving existing seconds', () => {
    expect(combineTimeSeconds(90, 'minutes', '2')).toBe(150);
  });

  it('updates seconds while preserving existing minutes', () => {
    expect(combineTimeSeconds(90, 'seconds', '45')).toBe(105);
  });

  it('caps seconds at 59', () => {
    expect(combineTimeSeconds(60, 'seconds', '75')).toBe(119);
  });

  it('returns undefined when result is 0', () => {
    expect(combineTimeSeconds(undefined, 'minutes', '0')).toBeUndefined();
  });

  it('handles undefined currentTimeSeconds for minutes', () => {
    expect(combineTimeSeconds(undefined, 'minutes', '2')).toBe(120);
  });

  it('handles undefined currentTimeSeconds for seconds', () => {
    expect(combineTimeSeconds(undefined, 'seconds', '30')).toBe(30);
  });

  it('handles non-numeric value as 0', () => {
    expect(combineTimeSeconds(90, 'minutes', '')).toBe(30);
  });
});
