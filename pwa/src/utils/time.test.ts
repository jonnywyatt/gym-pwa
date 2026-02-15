import { describe, expect, it } from 'vitest';
import { formatDurationSeconds, formatTimeMinSec, parseTimeMinSec } from './time';

describe('time utils', () => {
  describe('formatDurationSeconds', () => {
    it('formats zero seconds', () => {
      expect(formatDurationSeconds(0)).toBe('00:00:00');
    });

    it('formats seconds only', () => {
      expect(formatDurationSeconds(45)).toBe('00:00:45');
      expect(formatDurationSeconds(59)).toBe('00:00:59');
    });

    it('formats minutes and seconds', () => {
      expect(formatDurationSeconds(60)).toBe('00:01:00');
      expect(formatDurationSeconds(125)).toBe('00:02:05');
      expect(formatDurationSeconds(3599)).toBe('00:59:59');
    });

    it('formats hours, minutes, and seconds', () => {
      expect(formatDurationSeconds(3600)).toBe('01:00:00');
      expect(formatDurationSeconds(3661)).toBe('01:01:01');
      expect(formatDurationSeconds(36000)).toBe('10:00:00');
    });

    it('handles large durations', () => {
      expect(formatDurationSeconds(86399)).toBe('23:59:59');
      expect(formatDurationSeconds(90061)).toBe('25:01:01');
    });
  });

  describe('formatTimeMinSec', () => {
    it('formats zero seconds', () => {
      expect(formatTimeMinSec(0)).toBe('0:00');
    });

    it('formats seconds under a minute', () => {
      expect(formatTimeMinSec(5)).toBe('0:05');
      expect(formatTimeMinSec(45)).toBe('0:45');
    });

    it('formats minutes and seconds', () => {
      expect(formatTimeMinSec(60)).toBe('1:00');
      expect(formatTimeMinSec(125)).toBe('2:05');
      expect(formatTimeMinSec(90)).toBe('1:30');
    });

    it('formats large values', () => {
      expect(formatTimeMinSec(600)).toBe('10:00');
      expect(formatTimeMinSec(3661)).toBe('61:01');
    });
  });

  describe('parseTimeMinSec', () => {
    it('parses valid min:sec strings', () => {
      expect(parseTimeMinSec('2:05')).toBe(125);
      expect(parseTimeMinSec('1:30')).toBe(90);
      expect(parseTimeMinSec('0:45')).toBe(45);
    });

    it('parses zero values', () => {
      expect(parseTimeMinSec('0:00')).toBe(0);
    });

    it('parses large minute values', () => {
      expect(parseTimeMinSec('61:01')).toBe(3661);
    });

    it('returns null for invalid formats', () => {
      expect(parseTimeMinSec('')).toBeNull();
      expect(parseTimeMinSec('abc')).toBeNull();
      expect(parseTimeMinSec('2')).toBeNull();
      expect(parseTimeMinSec(':30')).toBeNull();
    });

    it('returns null when seconds >= 60', () => {
      expect(parseTimeMinSec('1:60')).toBeNull();
      expect(parseTimeMinSec('1:99')).toBeNull();
    });

    it('trims whitespace', () => {
      expect(parseTimeMinSec(' 2:05 ')).toBe(125);
    });
  });
});
