import type { ChartData, ChartOptions } from 'chart.js';
import type { BodyWeightEntry, UserProfile } from 'gym-pwa-api/types';
import { authFetch, authFetchJson } from '../../lib/api/client';

export async function fetchUserProfile(userId: string | string[]): Promise<UserProfile> {
  return authFetchJson<UserProfile>(`/users/${userId}`);
}

export async function saveBodyWeight(userId: string | string[], weight: number): Promise<void> {
  const response = await authFetch(`/users/${userId}/body-weights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weightKg: weight }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
}

export async function fetchBodyWeightHistory(
  userId: string | string[]
): Promise<BodyWeightEntry[]> {
  return authFetchJson<BodyWeightEntry[]>(`/users/${userId}/body-weights`);
}

const COLOR_CHART_BG = '#0b1215';
const COLOR_TEXT = '#94a3b8';
const COLOR_TEXT_MUTED = '#64748b';
const COLOR_LINE = '#FF00A5';

export function buildBodyWeightChartData(history: BodyWeightEntry[]): ChartData<'line'> {
  return {
    datasets: [
      {
        label: 'Bodyweight (kg)',
        data: history.map((entry) => ({
          x: new Date(entry.recordedAt).getTime(),
          y: entry.weightKg,
        })),
        borderColor: COLOR_LINE,
        backgroundColor: COLOR_LINE,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 1.5,
        tension: 0.3,
      },
    ],
  };
}

export function buildBodyWeightChartOptions(): ChartOptions<'line'> {
  return {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: COLOR_CHART_BG,
        borderColor: COLOR_TEXT,
        borderWidth: 1,
        titleColor: COLOR_TEXT,
        bodyColor: COLOR_TEXT,
        displayColors: false,
        callbacks: {
          title: (items) =>
            new Date(Number(items[0].parsed.x)).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          label: (context) => `${(context.raw as { y: number }).y} kg`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'month' },
        grid: {
          display: true,
          color: 'transparent',
          drawTicks: true,
          tickLength: 6,
          tickColor: COLOR_TEXT_MUTED,
        },
        border: { display: true, color: COLOR_TEXT_MUTED },
        ticks: { color: COLOR_TEXT_MUTED, maxRotation: 0 },
      },
      y: {
        position: 'left',
        grid: { display: true, color: '#2a3a42' },
        ticks: { color: COLOR_TEXT, callback: (value) => `${value}kg` },
        border: { display: false },
      },
    },
  };
}
