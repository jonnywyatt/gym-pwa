import type { RoutineTrendData } from 'gym-pwa-api/types';
import { describe, expect, it } from 'vitest';
import {
  buildChartData,
  buildChartOptions,
  buildSessionPopup,
  buildTrendlineData,
  formatDate,
  formatMinutes,
  formatWeightKg,
  formatWeightKThousands,
  getMetricLabel,
  getPeriodSince,
  linearRegression,
} from './helpers';

describe('getPeriodSince', () => {
  it('returns null for all', () => {
    expect(getPeriodSince('all')).toBeNull();
  });

  it('returns a date approximately 3 months ago for 3m', () => {
    const result = getPeriodSince('3m');
    const expected = new Date();
    expected.setMonth(expected.getMonth() - 3);
    expect(result).not.toBeNull();
    expect(Math.abs((result as Date).getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it('returns a date approximately 6 months ago for 6m', () => {
    const result = getPeriodSince('6m');
    const expected = new Date();
    expected.setMonth(expected.getMonth() - 6);
    expect(result).not.toBeNull();
    expect(Math.abs((result as Date).getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it('returns a date approximately 1 year ago for 1y', () => {
    const result = getPeriodSince('1y');
    const expected = new Date();
    expected.setFullYear(expected.getFullYear() - 1);
    expect(result).not.toBeNull();
    expect(Math.abs((result as Date).getTime() - expected.getTime())).toBeLessThan(1000);
  });
});

describe('formatMinutes', () => {
  it('formats seconds as rounded minutes', () => {
    expect(formatMinutes(3600)).toBe('60m');
  });

  it('rounds to nearest minute', () => {
    expect(formatMinutes(3660)).toBe('61m');
  });

  it('formats zero as 0m', () => {
    expect(formatMinutes(0)).toBe('0m');
  });

  it('rounds partial minutes', () => {
    expect(formatMinutes(90)).toBe('2m');
  });
});

describe('formatWeightKThousands', () => {
  it('formats kg as thousands with one decimal when non-round', () => {
    expect(formatWeightKThousands(10900)).toBe('10.9k');
  });

  it('omits .0 for exact thousands', () => {
    expect(formatWeightKThousands(5000)).toBe('5k');
  });

  it('omits .0 for zero', () => {
    expect(formatWeightKThousands(0)).toBe('0k');
  });
});

describe('formatDate', () => {
  it('formats an ISO date as dd mmm yyyy', () => {
    expect(formatDate('2026-01-04T10:00:00Z')).toBe('04 Jan 2026');
  });
});

describe('formatWeightKg', () => {
  it('formats kg with comma thousands separator', () => {
    expect(formatWeightKg(10954)).toBe('10,954kg');
  });

  it('rounds to nearest integer', () => {
    expect(formatWeightKg(10954.7)).toBe('10,955kg');
  });

  it('formats small values', () => {
    expect(formatWeightKg(500)).toBe('500kg');
  });
});

describe('buildSessionPopup', () => {
  const session = {
    date: '2026-01-04T10:00:00Z',
    durationSeconds: 3600,
    totalWeightKg: 10954,
    totalReps: 0,
  };

  it('builds popup for weight metric', () => {
    const result = buildSessionPopup(session, 'weight', 100, 50);
    expect(result.date).toBe('04 Jan 2026');
    expect(result.metric).toBe('Total weight: 10,954kg');
    expect(result.x).toBe(100);
    expect(result.y).toBe(50);
  });

  it('builds popup for reps metric', () => {
    const result = buildSessionPopup(session, 'reps', 0, 0);
    expect(result.metric).toBe('Session duration: 60m');
  });

  it('builds popup for null metric', () => {
    const result = buildSessionPopup(session, null, 0, 0);
    expect(result.metric).toBe('Session duration: 60m');
  });
});

describe('getMetricLabel', () => {
  it('returns total weight label for weight metric', () => {
    expect(getMetricLabel('weight')).toBe('Total weight (kg)');
  });

  it('returns session duration label for reps metric', () => {
    expect(getMetricLabel('reps')).toBe('Session duration');
  });

  it('returns session duration label when no second metric', () => {
    expect(getMetricLabel(null)).toBe('Session duration');
  });
});

const baseSession = {
  date: '2026-01-01T10:00:00Z',
  durationSeconds: 3600,
  totalWeightKg: 1000,
  totalReps: 50,
};

describe('linearRegression', () => {
  it('returns null for fewer than 2 values', () => {
    expect(linearRegression([], [])).toBeNull();
    expect(linearRegression([0], [5])).toBeNull();
  });

  it('calculates slope and intercept for a perfectly linear series', () => {
    const result = linearRegression([0, 1, 2, 3], [0, 2, 4, 6]);
    expect(result).not.toBeNull();
    if (result === null) return;
    const [slope, intercept] = result;
    expect(slope).toBeCloseTo(2);
    expect(intercept).toBeCloseTo(0);
  });

  it('calculates slope and intercept for a flat series', () => {
    const result = linearRegression([0, 1, 2], [5, 5, 5]);
    expect(result).not.toBeNull();
    if (result === null) return;
    const [slope, intercept] = result;
    expect(slope).toBeCloseTo(0);
    expect(intercept).toBeCloseTo(5);
  });
});

const DAY_MS = 86400000;

describe('buildTrendlineData', () => {
  it('returns empty array for fewer than 2 values', () => {
    expect(buildTrendlineData(['2026-01-01T00:00:00Z'], [42])).toEqual([]);
  });

  it('returns a point per session with predicted y values', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1, 2, 3].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [0, 2, 4, 6]);
    expect(result).toHaveLength(4);
    expect(result[0].x).toBe(origin);
    expect(result[0].y).toBeCloseTo(0);
    expect(result[3].x).toBe(origin + 3 * DAY_MS);
    expect(result[3].y).toBeCloseTo(6);
  });

  it('returns a point per session for a two-point series', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [10, 20]);
    expect(result).toHaveLength(2);
    expect(result[0].y).toBeCloseTo(10);
    expect(result[1].y).toBeCloseTo(20);
  });

  it('accounts for unequal time gaps between sessions', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1, 10].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [10, 10, 10]);
    expect(result).toHaveLength(3);
    expect(result[0].y).toBeCloseTo(10);
    expect(result[2].y).toBeCloseTo(10);
  });
});

describe('buildChartData', () => {
  it('shows duration series and trendline when secondMetric is null', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: null,
      sessions: [baseSession, baseSession],
    };
    const data = buildChartData(routine);
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0].label).toBe('Duration');
    expect(data.datasets[0].yAxisID).toBe('y');
    expect(data.datasets[1].label).toBe('Trend');
  });

  it('shows duration series and trendline when secondMetric is reps', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Cardio',
      secondMetric: 'reps',
      sessions: [baseSession, baseSession],
    };
    const data = buildChartData(routine);
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0].label).toBe('Duration');
    expect(data.datasets[1].label).toBe('Trend');
  });

  it('shows weight series and trendline when secondMetric is weight', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: 'weight',
      sessions: [baseSession, baseSession],
    };
    const data = buildChartData(routine);
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0].label).toBe('Weight (kg)');
    expect(data.datasets[0].yAxisID).toBe('y');
    expect(data.datasets[1].label).toBe('Trend');
  });

  it('trendline dataset uses dashed border', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: null,
      sessions: [baseSession, baseSession],
    };
    const data = buildChartData(routine);
    expect(data.datasets[1].borderDash).toEqual([4, 4]);
  });

  it('data series uses 3px dot radius and no line', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: null,
      sessions: [baseSession],
    };
    const data = buildChartData(routine);
    expect(data.datasets[0].pointRadius).toBe(1.5);
    expect((data.datasets[0] as { showLine: boolean }).showLine).toBe(false);
  });

  it('maps session dates as timestamps in data points', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: null,
      sessions: [
        { ...baseSession, date: '2026-01-01T10:00:00Z' },
        { ...baseSession, date: '2026-01-08T10:00:00Z' },
      ],
    };
    const data = buildChartData(routine);
    const points = data.datasets[0].data as { x: number; y: number }[];
    expect(points[0].x).toBe(new Date('2026-01-01T10:00:00Z').getTime());
    expect(points[1].x).toBe(new Date('2026-01-08T10:00:00Z').getTime());
  });
});

describe('buildChartOptions', () => {
  it('never includes y1 scale', () => {
    expect(buildChartOptions(null, '6m').scales).not.toHaveProperty('y1');
    expect(buildChartOptions('reps', '6m').scales).not.toHaveProperty('y1');
    expect(buildChartOptions('weight', '6m').scales).not.toHaveProperty('y1');
  });

  it('uses time scale type', () => {
    const options = buildChartOptions(null, '6m');
    expect((options.scales?.x as { type: string }).type).toBe('time');
  });

  it('uses month unit for all periods', () => {
    for (const period of ['3m', '6m', '1y', 'all'] as const) {
      expect(
        (buildChartOptions(null, period).scales?.x as { time: { unit: string } }).time.unit
      ).toBe('month');
    }
  });

  it('hides x grid line colour for all periods', () => {
    for (const period of ['3m', '6m', '1y', 'all'] as const) {
      expect(
        (buildChartOptions(null, period).scales?.x as { grid: { color: string } }).grid.color
      ).toBe('transparent');
    }
  });

  it('enables major ticks for all period', () => {
    const options = buildChartOptions(null, 'all');
    expect(
      (options.scales?.x as { ticks: { major: { enabled: boolean } } }).ticks.major.enabled
    ).toBe(true);
  });

  it('hides y grid lines', () => {
    const options = buildChartOptions(null, '6m');
    expect((options.scales?.y as { grid: { display: boolean } }).grid.display).toBe(false);
  });
});
