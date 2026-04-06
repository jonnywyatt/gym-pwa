import type { ChartData, ChartOptions, TooltipPositionerFunction } from 'chart.js';
import { Tooltip } from 'chart.js';
import type { RoutineTrendData, SessionTrendsResponse } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    offsetFromPoint: TooltipPositionerFunction<'line'>;
  }
}

Tooltip.positioners.offsetFromPoint = (_items, eventPos) => {
  if (eventPos.x === null || eventPos.y === null) return false;
  return { x: eventPos.x + 10, y: eventPos.y };
};

const COLOR_CHART_BG = '#0b1215';
const COLOR_TEXT = '#94a3b8';
const COLOR_TEXT_MUTED = '#64748b';

export type TrendPeriod = '3m' | '6m' | '1y' | 'all';

export const TREND_PERIOD_OPTIONS: Array<{ period: TrendPeriod; label: string }> = [
  { period: '3m', label: '3 mths' },
  { period: '6m', label: '6 mths' },
  { period: '1y', label: '1 year' },
  { period: 'all', label: 'All' },
];

export function getPeriodSince(period: TrendPeriod): Date | null {
  if (period === 'all') return null;
  const d = new Date();
  if (period === '3m') d.setMonth(d.getMonth() - 3);
  if (period === '6m') d.setMonth(d.getMonth() - 6);
  if (period === '1y') d.setFullYear(d.getFullYear() - 1);
  return d;
}

export async function fetchSessionTrends(
  userId: number,
  period: TrendPeriod
): Promise<SessionTrendsResponse> {
  const since = getPeriodSince(period);
  const query = since ? `?since=${since.toISOString()}` : '';
  return await authFetchJson<SessionTrendsResponse>(`/users/${userId}/session-trends${query}`);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatWeightKg(kg: number): string {
  return `${Math.round(kg).toLocaleString('en-GB')}kg`;
}

export function formatMinutes(seconds: number): string {
  return `${Math.round(seconds / 60)}m`;
}

export interface SessionPopup {
  date: string;
  metric: string;
  x: number;
  y: number;
}

export function buildSessionPopup(
  session: RoutineTrendData['sessions'][number],
  secondMetric: RoutineTrendData['secondMetric'],
  x: number,
  y: number
): SessionPopup {
  const date = formatDate(session.date);
  const metric =
    secondMetric === 'weight'
      ? `Total weight: ${formatWeightKg(session.totalWeightKg)}`
      : `Session duration: ${formatMinutes(session.durationSeconds)}`;
  return { date, metric, x, y };
}

export function formatWeightKThousands(kg: number): string {
  const formatted = (kg / 1000).toFixed(1);
  return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
}

export function getMetricLabel(secondMetric: RoutineTrendData['secondMetric']): string {
  if (secondMetric === 'weight') return 'Total weight (kg)';
  return 'Session duration';
}

export function buildMetricSubtitle(routine: RoutineTrendData): string {
  return getMetricLabel(routine.secondMetric);
}

function iqrFilter(values: number[]): boolean[] {
  if (values.length < 4) return values.map(() => true);
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return values.map((v) => v >= lower && v <= upper);
}

function tricube(u: number): number {
  const absU = Math.abs(u);
  if (absU >= 1) return 0;
  const t = 1 - absU ** 3;
  return t * t * t;
}

function weightedLinearFit(xs: number[], ys: number[], weights: number[]): [number, number] {
  let sumW = 0,
    sumWX = 0,
    sumWY = 0,
    sumWXX = 0,
    sumWXY = 0;
  for (let i = 0; i < xs.length; i++) {
    sumW += weights[i];
    sumWX += weights[i] * xs[i];
    sumWY += weights[i] * ys[i];
    sumWXX += weights[i] * xs[i] * xs[i];
    sumWXY += weights[i] * xs[i] * ys[i];
  }
  const denom = sumW * sumWXX - sumWX * sumWX;
  if (denom === 0) return [0, sumWY / sumW];
  const slope = (sumW * sumWXY - sumWX * sumWY) / denom;
  const intercept = (sumWY - slope * sumWX) / sumW;
  return [slope, intercept];
}

function loessEval(trainX: number[], trainY: number[], queryX: number, bandwidth: number): number {
  const k = Math.max(2, Math.floor(bandwidth * trainX.length));
  const distances = trainX.map((x) => Math.abs(x - queryX));
  const sortedIndices = distances
    .map((d, i) => ({ d, i }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((item) => item.i);
  const maxDist = distances[sortedIndices[sortedIndices.length - 1]];
  const xs = sortedIndices.map((i) => trainX[i]);
  const ys = sortedIndices.map((i) => trainY[i]);
  const ws = sortedIndices.map((i) => tricube(distances[i] / (maxDist === 0 ? 1 : maxDist)));
  const [slope, intercept] = weightedLinearFit(xs, ys, ws);
  return slope * queryX + intercept;
}

const LOESS_NEIGHBOURS_BY_PERIOD: Record<TrendPeriod, number> = {
  '3m': 12,
  '6m': 16,
  '1y': 30,
  all: 40,
};
const LOESS_GRID_SIZE = 100;

export function buildTrendlineData(
  dates: string[],
  values: number[],
  period: TrendPeriod
): { x: number; y: number }[] {
  const n = dates.length;
  if (n < 2) return [];

  const timestamps = dates.map((d) => new Date(d).getTime());
  const origin = timestamps[0];
  const span = timestamps[n - 1] - origin;
  if (span === 0) return [];

  const xNorm = timestamps.map((t) => (t - origin) / span);

  const keep = iqrFilter(values);
  let trainX = xNorm.filter((_, i) => keep[i]);
  let trainY = values.filter((_, i) => keep[i]);
  if (trainX.length < 2) {
    trainX = xNorm;
    trainY = values;
  }

  const gridXNorm = Array.from({ length: LOESS_GRID_SIZE }, (_, i) => i / (LOESS_GRID_SIZE - 1));
  const gridTimestamps = gridXNorm.map((x) => origin + x * span);
  const effectiveBandwidth = LOESS_NEIGHBOURS_BY_PERIOD[period] / trainX.length;
  const gridY = gridXNorm.map((qx) => loessEval(trainX, trainY, qx, effectiveBandwidth));

  return gridTimestamps.map((x, i) => ({ x, y: gridY[i] }));
}

const COLOR_DOT = '#FF00A5';

const dotStyle = {
  showLine: false,
  pointRadius: 1.5,
  pointHoverRadius: 3,
  pointHoverBackgroundColor: '#ffffff',
  borderWidth: 0,
};

const trendlinePointStyle = {
  pointRadius: 0,
  pointHoverRadius: 8,
};

const COLOR_TRENDLINE = '#ffffff';

function makeTrendlineDataset(data: { x: number; y: number }[], yAxisID: string) {
  return {
    label: 'Trend',
    data,
    borderColor: COLOR_TRENDLINE,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderDash: [4, 4],
    yAxisID,
    tension: 0.4,
    order: 0,
    ...trendlinePointStyle,
  };
}

export function buildChartData(routine: RoutineTrendData, period: TrendPeriod): ChartData<'line'> {
  const dates = routine.sessions.map((s) => s.date);
  const timestamps = dates.map((d) => new Date(d).getTime());

  if (routine.secondMetric === 'weight') {
    const values = routine.sessions.map((s) => s.totalWeightKg);
    return {
      datasets: [
        {
          label: 'Weight (kg)',
          data: timestamps.map((x, i) => ({ x, y: values[i] })),
          backgroundColor: COLOR_DOT,
          yAxisID: 'y',
          order: 1,
          ...dotStyle,
        },
        makeTrendlineDataset(buildTrendlineData(dates, values, period), 'y'),
      ],
    };
  }

  const values = routine.sessions.map((s) => s.durationSeconds);
  return {
    datasets: [
      {
        label: 'Duration',
        data: timestamps.map((x, i) => ({ x, y: values[i] })),
        backgroundColor: COLOR_DOT,
        yAxisID: 'y',
        order: 1,
        ...dotStyle,
      },
      makeTrendlineDataset(buildTrendlineData(dates, values, period), 'y'),
    ],
  };
}

function buildYAxis(
  position: 'left' | 'right',
  tickCallback: (value: number | string) => string
): object {
  return {
    position,
    grid: { display: true, color: '#2a3a42' },
    ticks: {
      color: COLOR_TEXT,
      callback: tickCallback,
    },
    border: { display: false },
  };
}

function monthName(value: number | string): string {
  return new Date(value).toLocaleDateString('en-GB', { month: 'short' });
}

function monthLetter(value: number | string): string {
  return new Date(value).toLocaleDateString('en-GB', { month: 'narrow' });
}

function yearLabel(value: number | string): string {
  return new Date(value).toLocaleDateString('en-GB', { year: 'numeric' });
}

const X_AXIS_BASE = {
  grid: {
    display: true,
    color: 'transparent',
    drawTicks: true,
    tickLength: 6,
    tickColor: COLOR_TEXT_MUTED,
  },
  border: { display: true, color: COLOR_TEXT_MUTED },
  ticks: { color: COLOR_TEXT_MUTED, maxRotation: 0 },
} as const;

function buildXAxis(period: TrendPeriod): ChartOptions<'line'>['scales'] {
  if (period === 'all') {
    return {
      x: {
        ...X_AXIS_BASE,
        type: 'time',
        time: { unit: 'month' },
        ticks: {
          ...X_AXIS_BASE.ticks,
          major: { enabled: true },
          source: 'auto',
          callback(value, _index, ticks) {
            if (ticks[_index].major) return yearLabel(value);
            return monthLetter(value);
          },
        },
      },
    };
  }

  return {
    x: {
      ...X_AXIS_BASE,
      type: 'time',
      time: { unit: 'month' },
      ticks: {
        ...X_AXIS_BASE.ticks,
        source: 'auto',
        callback(value) {
          return monthName(value);
        },
      },
    },
  };
}

export function buildChartOptions(
  secondMetric: RoutineTrendData['secondMetric'],
  period: TrendPeriod
): ChartOptions<'line'> {
  const isWeight = secondMetric === 'weight';
  const yTickCallback = isWeight
    ? (value: number | string) => formatWeightKThousands(Number(value))
    : (value: number | string) => formatMinutes(Number(value));

  return {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    onHover(event, elements, chart) {
      const canvas = event.native?.target as HTMLCanvasElement | undefined;
      if (canvas === undefined) return;
      const isDot = elements.some((el) => chart.data.datasets[el.datasetIndex].label !== 'Trend');
      canvas.style.cursor = isDot ? 'pointer' : 'default';
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        position: 'offsetFromPoint',
        backgroundColor: COLOR_CHART_BG,
        borderColor: COLOR_TEXT,
        borderWidth: 1,
        titleColor: COLOR_TEXT,
        bodyColor: COLOR_TEXT,
        displayColors: false,
        filter(item) {
          return item.dataset.label === 'Trend';
        },
        callbacks: {
          title: () => '',
          label(context) {
            const raw = context.raw as { y: number };
            if (isWeight) {
              return `Average session weight: ${formatWeightKThousands(raw.y)}`;
            }
            return `Average session duration: ${formatMinutes(raw.y)}`;
          },
        },
      },
    },
    scales: {
      ...buildXAxis(period),
      y: buildYAxis('left', yTickCallback),
    },
  };
}
