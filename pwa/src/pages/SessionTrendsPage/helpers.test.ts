import type { RoutineTrendData } from 'gym-pwa-api/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BODY_AREA_COLOURS,
  buildBodyAreaTrendChartData,
  buildChartData,
  buildChartOptions,
  buildMetricSubtitle,
  buildSessionPopup,
  buildSessionsPerWeekChartData,
  buildSessionsPerWeekChartOptions,
  buildSessionsPerWeekData,
  buildTrendlineData,
  clearTrendsCache,
  fetchSessionTrends,
  formatDate,
  formatMinutes,
  formatWeightKg,
  formatWeightKThousands,
  getMetricLabel,
  getPeriodSince,
  prefetchSessionTrends,
} from './helpers';

describe('getPeriodSince', () => {
  it('returns null for all', () => {
    expect(getPeriodSince('all')).toBeNull();
  });

  it('returns a date approximately 3 months ago for 3m, truncated to midnight', () => {
    const result = getPeriodSince('3m');
    const expected = new Date();
    expected.setMonth(expected.getMonth() - 3);
    expected.setHours(0, 0, 0, 0);
    expect(result).not.toBeNull();
    expect((result as Date).getTime()).toBe(expected.getTime());
  });

  it('returns a date approximately 6 months ago for 6m, truncated to midnight', () => {
    const result = getPeriodSince('6m');
    const expected = new Date();
    expected.setMonth(expected.getMonth() - 6);
    expected.setHours(0, 0, 0, 0);
    expect(result).not.toBeNull();
    expect((result as Date).getTime()).toBe(expected.getTime());
  });

  it('returns a date approximately 1 year ago for 1y, truncated to midnight', () => {
    const result = getPeriodSince('1y');
    const expected = new Date();
    expected.setFullYear(expected.getFullYear() - 1);
    expected.setHours(0, 0, 0, 0);
    expect(result).not.toBeNull();
    expect((result as Date).getTime()).toBe(expected.getTime());
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
    bodyAreaPercentages: {},
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
  bodyAreaPercentages: {},
};

describe('buildMetricSubtitle', () => {
  it('returns the weight label for weight metric', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: 'weight',
      sessions: [baseSession],
    };
    expect(buildMetricSubtitle(routine)).toBe('Total weight (kg)');
  });

  it('returns the duration label for null metric', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Cardio',
      secondMetric: null,
      sessions: [baseSession],
    };
    expect(buildMetricSubtitle(routine)).toBe('Session duration');
  });
});

const DAY_MS = 86400000;

describe('buildTrendlineData', () => {
  it('returns empty array for fewer than 2 values', () => {
    expect(buildTrendlineData(['2026-01-01T00:00:00Z'], [42], '3m')).toEqual([]);
  });

  it('returns 100 points spanning the full date range', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1, 2, 3].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [0, 2, 4, 6], '3m');
    expect(result).toHaveLength(100);
    expect(result[0].x).toBe(origin);
    expect(result[99].x).toBe(origin + 3 * DAY_MS);
  });

  it('endpoints are close to actual first and last session values for a linear series', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1, 2, 3].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [0, 2, 4, 6], '3m');
    expect(result[0].y).toBeCloseTo(0, 0);
    expect(result[99].y).toBeCloseTo(6, 0);
  });

  it('produces a curve close to the flat value for a flat series', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1, 2, 3, 4].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [10, 10, 10, 10, 10], '3m');
    for (const point of result) {
      expect(Math.abs(point.y - 10)).toBeLessThan(2);
    }
  });

  it('excludes outliers so they do not distort the curve', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    // 8 regular sessions near 100, plus one extreme outlier
    const dates = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
      new Date(origin + i * DAY_MS).toISOString()
    );
    const values = [100, 100, 100, 100, 9999, 100, 100, 100, 100];
    const result = buildTrendlineData(dates, values, '3m');
    expect(result[0].y).toBeCloseTo(100, -1);
    expect(result[99].y).toBeCloseTo(100, -1);
  });

  it('handles two-point series', () => {
    const origin = new Date('2026-01-01T00:00:00Z').getTime();
    const dates = [0, 1].map((i) => new Date(origin + i * DAY_MS).toISOString());
    const result = buildTrendlineData(dates, [10, 20], '3m');
    expect(result).toHaveLength(100);
    expect(result[0].y).toBeCloseTo(10, 0);
    expect(result[99].y).toBeCloseTo(20, 0);
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
    const data = buildChartData(routine, '3m');
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
    const data = buildChartData(routine, '3m');
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
    const data = buildChartData(routine, '3m');
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
    const data = buildChartData(routine, '3m');
    expect(data.datasets[1].borderDash).toEqual([4, 4]);
  });

  it('data series uses 3px dot radius and no line', () => {
    const routine: RoutineTrendData = {
      routineId: 1,
      routineLabel: 'Push',
      secondMetric: null,
      sessions: [baseSession],
    };
    const data = buildChartData(routine, '3m');
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
    const data = buildChartData(routine, '3m');
    const points = data.datasets[0].data as { x: number; y: number }[];
    expect(points[0].x).toBe(new Date('2026-01-01T10:00:00Z').getTime());
    expect(points[1].x).toBe(new Date('2026-01-08T10:00:00Z').getTime());
  });
});

describe('buildSessionsPerWeekData', () => {
  it('groups sessions in the same ISO week into one entry', () => {
    const sessions = [
      {
        date: '2026-01-05T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
      {
        date: '2026-01-06T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
    ];
    const result = buildSessionsPerWeekData(sessions);
    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(2);
  });

  it('produces separate entries for sessions in different weeks', () => {
    const sessions = [
      {
        date: '2026-01-05T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
      {
        date: '2026-01-12T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
    ];
    const result = buildSessionsPerWeekData(sessions);
    expect(result).toHaveLength(2);
    expect(result[0].count).toBe(1);
    expect(result[1].count).toBe(1);
  });

  it('fills in zero-count weeks between sessions in non-adjacent weeks', () => {
    const sessions = [
      {
        date: '2026-01-05T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
      {
        date: '2026-01-26T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
    ];
    const result = buildSessionsPerWeekData(sessions);
    expect(result).toHaveLength(4);
    expect(result[0].count).toBe(1);
    expect(result[1].count).toBe(0);
    expect(result[2].count).toBe(0);
    expect(result[3].count).toBe(1);
  });

  it('returns entries sorted by date ascending', () => {
    const sessions = [
      {
        date: '2026-01-12T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
      {
        date: '2026-01-05T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
    ];
    const result = buildSessionsPerWeekData(sessions);
    expect(result[0].date < result[1].date).toBe(true);
  });

  it('returns empty array for no sessions', () => {
    expect(buildSessionsPerWeekData([])).toEqual([]);
  });
});

describe('buildSessionsPerWeekChartData', () => {
  const routine: RoutineTrendData = {
    routineId: 1,
    routineLabel: 'Push',
    secondMetric: null,
    sessions: [
      {
        date: '2026-01-05T10:00:00Z',
        durationSeconds: 3600,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
      {
        date: '2026-01-12T10:00:00Z',
        durationSeconds: 3600,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: {},
      },
    ],
  };

  it('returns two datasets: sessions per week dots and trendline', () => {
    const data = buildSessionsPerWeekChartData(routine, '3m');
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0].label).toBe('Sessions per week');
    expect(data.datasets[1].label).toBe('Trend');
  });

  it('dots dataset uses the pink colour', () => {
    const data = buildSessionsPerWeekChartData(routine, '3m');
    expect(data.datasets[0].backgroundColor).toBe('#FF00A5');
  });

  it('dot dataset has no line', () => {
    const data = buildSessionsPerWeekChartData(routine, '3m');
    expect((data.datasets[0] as { showLine: boolean }).showLine).toBe(false);
  });

  it('trendline uses dashed border', () => {
    const data = buildSessionsPerWeekChartData(routine, '3m');
    expect(data.datasets[1].borderDash).toEqual([4, 4]);
  });

  it('data points use timestamps as x values', () => {
    const data = buildSessionsPerWeekChartData(routine, '3m');
    const points = data.datasets[0].data as { x: number; y: number }[];
    expect(points[0].x).toBeGreaterThan(0);
  });
});

describe('buildSessionsPerWeekChartOptions', () => {
  it('uses time scale type', () => {
    const options = buildSessionsPerWeekChartOptions('3m');
    expect((options.scales?.x as { type: string }).type).toBe('time');
  });

  it('hides legend', () => {
    const options = buildSessionsPerWeekChartOptions('3m');
    expect(options.plugins?.legend?.display).toBe(false);
  });

  it('has a y axis', () => {
    const options = buildSessionsPerWeekChartOptions('3m');
    expect(options.scales).toHaveProperty('y');
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

  it('shows y grid lines in dark grey', () => {
    const options = buildChartOptions(null, '6m');
    const yScale = options.scales?.y as { grid: { display: boolean; color: string } };
    expect(yScale.grid.display).toBe(true);
    expect(yScale.grid.color).toBe('#2a3a42');
  });
});

vi.mock('../../lib/api/client', () => ({
  authFetchJson: vi.fn(),
}));

const { authFetchJson } = await import('../../lib/api/client');
const mockAuthFetchJson = vi.mocked(authFetchJson);

const mockTrendsResponse = [
  {
    routineId: 1,
    routineLabel: 'Push',
    secondMetric: 'weight' as const,
    sessions: [baseSession],
  },
];

describe('fetchSessionTrends', () => {
  beforeEach(() => {
    clearTrendsCache();
    mockAuthFetchJson.mockReset();
  });

  it('fetches from API on first call', async () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    const result = await fetchSessionTrends(1, '3m');

    expect(result).toEqual(mockTrendsResponse);
    expect(mockAuthFetchJson).toHaveBeenCalledOnce();
  });

  it('returns cached data on second call for same period', async () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    await fetchSessionTrends(1, '3m');
    const result = await fetchSessionTrends(1, '3m');

    expect(result).toEqual(mockTrendsResponse);
    expect(mockAuthFetchJson).toHaveBeenCalledOnce();
  });

  it('fetches from API for a different period', async () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    await fetchSessionTrends(1, '3m');
    await fetchSessionTrends(1, '6m');

    expect(mockAuthFetchJson).toHaveBeenCalledTimes(2);
  });

  it('clearTrendsCache forces a fresh fetch', async () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    await fetchSessionTrends(1, '3m');
    clearTrendsCache();
    await fetchSessionTrends(1, '3m');

    expect(mockAuthFetchJson).toHaveBeenCalledTimes(2);
  });
});

describe('prefetchSessionTrends', () => {
  beforeEach(() => {
    clearTrendsCache();
    mockAuthFetchJson.mockReset();
  });

  it('does not fetch when userId is null', () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    prefetchSessionTrends(null);

    expect(mockAuthFetchJson).not.toHaveBeenCalled();
  });

  it('prefetched data is consumed by fetchSessionTrends', async () => {
    mockAuthFetchJson.mockResolvedValue(mockTrendsResponse);

    prefetchSessionTrends(1);
    const result = await fetchSessionTrends(1, '3m');

    expect(result).toEqual(mockTrendsResponse);
    expect(mockAuthFetchJson).toHaveBeenCalledOnce();
  });
});

describe('BODY_AREA_COLOURS', () => {
  it('defines a colour for each of the 6 body areas', () => {
    expect(Object.keys(BODY_AREA_COLOURS)).toEqual([
      'Chest',
      'Back',
      'Shoulders',
      'Arms',
      'Core',
      'Legs',
    ]);
  });
});

describe('buildBodyAreaTrendChartData', () => {
  function makeRoutine(sessions: RoutineTrendData['sessions']): RoutineTrendData {
    return { routineId: 1, routineLabel: 'Push', secondMetric: 'weight', sessions };
  }

  it('returns empty datasets when fewer than 2 sessions', () => {
    const routine = makeRoutine([
      {
        date: '2026-01-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Chest: 50 },
      },
    ]);
    const result = buildBodyAreaTrendChartData(routine, '3m');
    expect(result.datasets).toHaveLength(0);
  });

  it('omits body areas that appear in fewer than 2 sessions', () => {
    const routine = makeRoutine([
      {
        date: '2026-01-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Chest: 60, Arms: 40 },
      },
      {
        date: '2026-02-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Chest: 70 },
      },
    ]);
    const result = buildBodyAreaTrendChartData(routine, '3m');
    const labels = result.datasets.map((d) => d.label);
    expect(labels).toContain('Chest');
    expect(labels).not.toContain('Arms');
  });

  it('includes a dataset for each body area with 2+ data points', () => {
    const sessions = [
      {
        date: '2026-01-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Chest: 60, Legs: 40 },
      },
      {
        date: '2026-02-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Chest: 50, Legs: 50 },
      },
    ];
    const result = buildBodyAreaTrendChartData(makeRoutine(sessions), '3m');
    const labels = result.datasets.map((d) => d.label);
    expect(labels).toContain('Chest');
    expect(labels).toContain('Legs');
    expect(labels).not.toContain('Back');
  });

  it('uses the correct colour for each body area', () => {
    const sessions = [
      {
        date: '2026-01-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Core: 100 },
      },
      {
        date: '2026-02-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Core: 100 },
      },
    ];
    const result = buildBodyAreaTrendChartData(makeRoutine(sessions), '3m');
    const coreDataset = result.datasets.find((d) => d.label === 'Core');
    expect(coreDataset?.borderColor).toBe(BODY_AREA_COLOURS.Core);
  });

  it('datasets have no visible dots', () => {
    const sessions = [
      {
        date: '2026-01-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Back: 100 },
      },
      {
        date: '2026-02-01T10:00:00Z',
        durationSeconds: 0,
        totalWeightKg: 0,
        totalReps: 0,
        bodyAreaPercentages: { Back: 100 },
      },
    ];
    const result = buildBodyAreaTrendChartData(makeRoutine(sessions), '3m');
    for (const dataset of result.datasets) {
      expect(dataset.pointRadius).toBe(0);
      expect(dataset.pointHoverRadius).toBe(0);
    }
  });
});
