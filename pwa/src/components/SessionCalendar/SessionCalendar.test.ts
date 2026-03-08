import { render, screen } from '@testing-library/vue';
import type { UserWorkout } from 'gym-pwa-api/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SessionCalendar from './SessionCalendar.vue';

const makeWorkout = (
  id: number,
  routineId: number,
  routineLabel: string,
  startedAt: string
): UserWorkout => ({
  id,
  userId: 1,
  routineId,
  routineLabel,
  startedAt,
  finishedAt: startedAt,
  durationSeconds: 3600,
  exercisesCompleted: [],
  bodyWeightKg: 80,
  totalWeightKg: 0,
});

// 2024-01-01 is a Monday — no padding needed for this range
const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2024-01-28T00:00:00'); // 28 days, ends on Sunday

function renderCalendar(sessions: UserWorkout[] = []) {
  return render(SessionCalendar, {
    props: { startDate, endDate, sessions },
  });
}

describe('SessionCalendar', () => {
  it('renders all 28 date numbers', () => {
    renderCalendar();

    for (let day = 1; day <= 28; day++) {
      expect(screen.getByText(String(day))).toBeInTheDocument();
    }
  });

  it('does not render numbers for padding cells', () => {
    // startDate is a Wednesday so Mon and Tue are padding
    const wednesdayStart = new Date('2024-01-03T00:00:00');
    const sundayEnd = new Date('2024-01-07T00:00:00');

    render(SessionCalendar, {
      props: { startDate: wednesdayStart, endDate: sundayEnd, sessions: [] },
    });

    // Days 1 and 2 (padding) should not appear
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    // Day 3 (startDate) should appear
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders session dots with the correct background colour', () => {
    const sessions = [makeWorkout(1, 10, 'Strength', '2024-01-15T10:00:00Z')];

    renderCalendar(sessions);

    const jan15 = screen.getByText('15').parentElement;
    expect(jan15?.style.background).toBe('var(--em-accent-mint)');
  });

  it('renders split dot for a day with two different routines', () => {
    const sessions = [
      makeWorkout(1, 10, 'Strength', '2024-01-15T09:00:00Z'),
      makeWorkout(2, 20, 'Cardio', '2024-01-15T17:00:00Z'),
    ];

    renderCalendar(sessions);

    const jan15 = screen.getByText('15').parentElement;
    expect(jan15?.style.background).toContain('conic-gradient');
    expect(jan15?.style.background).toContain('var(--em-accent-mint)');
    expect(jan15?.style.background).toContain('var(--em-accent-aqua)');
  });

  it('renders neutral dot for a day with no session', () => {
    renderCalendar();

    const jan1 = screen.getByText('1').parentElement;
    expect(jan1?.style.background).toContain('var(--em-neutral)');
  });

  it('renders inverse text colour for session days', () => {
    const sessions = [makeWorkout(1, 10, 'Strength', '2024-01-05T10:00:00Z')];

    renderCalendar(sessions);

    const jan5Number = screen.getByText('5');
    expect(jan5Number.style.color).toBe('var(--em-text-inverse)');
  });

  it('renders muted text for no-session days', () => {
    renderCalendar();

    const jan1Number = screen.getByText('1');
    expect(jan1Number.style.color).toContain('var(--em-text-primary)');
  });

  describe('today outline', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('applies dotToday class to today dot', () => {
      renderCalendar();

      const jan15 = screen.getByText('15').parentElement;
      expect(jan15?.className).toContain('dotToday');
    });

    it('does not apply dotToday class to other dots', () => {
      renderCalendar();

      const jan1 = screen.getByText('1').parentElement;
      expect(jan1?.className).not.toContain('dotToday');
    });
  });

  it('renders the most recent week first', () => {
    // Jan 1-28: 4 complete weeks. Reversed: week 4 (Jan 22-28) is first row.
    renderCalendar();

    const allDateNumbers = screen
      .getAllByText(/^\d{1,2}$/)
      .map((el) => Number(el.textContent?.trim()));

    expect(allDateNumbers[0]).toBe(22); // Monday of most recent week
    expect(allDateNumbers[6]).toBe(28); // Sunday of most recent week
    expect(allDateNumbers[21]).toBe(1); // Monday of oldest week
    expect(allDateNumbers[27]).toBe(7); // Sunday of oldest week
  });

  it('does not split the dot when the same routine is used twice in one day', () => {
    const sessions = [
      makeWorkout(1, 10, 'Strength', '2024-01-05T09:00:00Z'),
      makeWorkout(2, 10, 'Strength', '2024-01-05T17:00:00Z'),
    ];

    renderCalendar(sessions);

    const jan5 = screen.getByText('5').parentElement;
    expect(jan5?.style.background).toBe('var(--em-accent-mint)');
  });
});
