import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHashHistory } from 'vue-router';
import SessionCalendar from './SessionCalendar.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
});

const makeWorkout = (
  id: number,
  routineId: number,
  routineLabel: string,
  startedAt: string
): UserWorkoutSummary => ({
  id,
  userId: 1,
  routineId,
  routineLabel,
  startedAt,
  finishedAt: startedAt,
  durationSeconds: 3600,
  exerciseCount: 0,
  bodyWeightKg: 80,
  totalWeightKg: 0,
});

// 2024-01-01 is a Monday — no padding needed for this range
const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2024-01-28T00:00:00'); // 28 days, ends on Sunday

function renderCalendar(sessions: UserWorkoutSummary[] = []) {
  return render(SessionCalendar, {
    props: { startDate, endDate, sessions },
    global: { plugins: [router] },
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
      global: { plugins: [router] },
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

  describe('session day popup', () => {
    it('opens popup on click of a session dot', async () => {
      const sessions = [makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z')];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('shows session name and weight when totalWeightKg > 0', async () => {
      const sessions = [
        { ...makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z'), totalWeightKg: 250 },
      ];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);

      expect(screen.getByRole('link', { name: 'Strength' })).toBeInTheDocument();
      expect(screen.getByText('250 kg')).toBeInTheDocument();
    });

    it('shows duration instead of weight when totalWeightKg is 0', async () => {
      const sessions = [
        {
          ...makeWorkout(99, 10, 'Yoga', '2024-01-15T10:00:00Z'),
          totalWeightKg: 0,
          durationSeconds: 3600,
        },
      ];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);

      expect(screen.getByText('1h')).toBeInTheDocument();
    });

    it('popup session name links to the session page', async () => {
      const sessions = [makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z')];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);

      expect(screen.getByRole('link', { name: 'Strength' })).toHaveAttribute(
        'href',
        expect.stringContaining('/sessions/99')
      );
    });

    it('shows all sessions when multiple sessions on the same day', async () => {
      const sessions = [
        makeWorkout(10, 10, 'Strength', '2024-01-15T09:00:00Z'),
        makeWorkout(11, 20, 'Cardio', '2024-01-15T17:00:00Z'),
      ];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);

      expect(screen.getByRole('link', { name: 'Strength' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Cardio' })).toBeInTheDocument();
    });

    it('closes popup when clicking the close button', async () => {
      const sessions = [makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z')];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes popup when clicking outside', async () => {
      const sessions = [makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z')];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(document.body);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows popup for a different dot when clicked while popup is open', async () => {
      const sessions = [
        makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z'),
        makeWorkout(100, 20, 'Cardio', '2024-01-16T10:00:00Z'),
      ];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);
      expect(screen.getByRole('link', { name: 'Strength' })).toBeInTheDocument();

      await userEvent.click(screen.getByText('16').parentElement as HTMLElement);
      expect(screen.queryByRole('link', { name: 'Strength' })).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Cardio' })).toBeInTheDocument();
    });

    it('closes popup on Escape key', async () => {
      const sessions = [makeWorkout(99, 10, 'Strength', '2024-01-15T10:00:00Z')];
      renderCalendar(sessions);

      await userEvent.click(screen.getByText('15').parentElement as HTMLElement);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not open popup when clicking a day with no sessions', async () => {
      renderCalendar();

      await userEvent.click(screen.getByText('1').parentElement as HTMLElement);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
