import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import { formatDuration } from '../../pages/WorkoutsListPage/helpers';

export const ROUTINE_COLOURS = [
  'var(--em-accent-mint)',
  'var(--em-accent-aqua)',
  'var(--em-accent-flat-purple)',
  'var(--em-accent-purple)',
] as const;

export interface RoutineSummaryItem {
  routineId: number;
  label: string;
  count: number;
  colour: string;
}

export interface CalendarDay {
  key: string;
  date: Date | null;
  dateNumber: number | null;
  routineIds: number[];
  daySessions: UserWorkoutSummary[];
  hasSession: boolean;
  isToday: boolean;
}

export function formatSessionStat(
  totalWeightKg: number,
  durationSeconds: number | undefined
): string {
  if (totalWeightKg > 0) {
    return `${totalWeightKg} kg`;
  }
  return durationSeconds !== undefined ? formatDuration(durationSeconds) : '';
}

export function buildRoutineColourMap(sessions: UserWorkoutSummary[]): Map<number, string> {
  const countMap = new Map<number, number>();
  for (const session of sessions) {
    countMap.set(session.routineId, (countMap.get(session.routineId) ?? 0) + 1);
  }

  const sorted = [...countMap.entries()].sort((a, b) => b[1] - a[1]);

  return new Map(
    sorted.map(([routineId], index) => [routineId, ROUTINE_COLOURS[index % ROUTINE_COLOURS.length]])
  );
}

export function getRoutineSummaries(
  sessions: UserWorkoutSummary[],
  colourMap: Map<number, string>
): RoutineSummaryItem[] {
  const dataMap = new Map<number, { label: string; count: number }>();
  for (const session of sessions) {
    const existing = dataMap.get(session.routineId);
    if (existing) {
      existing.count++;
    } else {
      dataMap.set(session.routineId, { label: session.routineLabel, count: 1 });
    }
  }

  return [...dataMap.entries()]
    .map(([routineId, { label, count }]) => ({
      routineId,
      label,
      count,
      colour: colourMap.get(routineId) ?? ROUTINE_COLOURS[0],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

interface DateSessions {
  routineIds: Set<number>;
  sessions: UserWorkoutSummary[];
}

export function buildCalendarDays(
  startDate: Date,
  endDate: Date,
  sessions: UserWorkoutSummary[],
  today = new Date()
): CalendarDay[] {
  const sessionsByDate = new Map<string, DateSessions>();
  for (const session of sessions) {
    const date = new Date(session.startedAt);
    const key = toDateKey(date);
    const existing = sessionsByDate.get(key);
    if (existing) {
      existing.routineIds.add(session.routineId);
      existing.sessions.push(session);
    } else {
      sessionsByDate.set(key, { routineIds: new Set([session.routineId]), sessions: [session] });
    }
  }

  const normalizedStart = normalizeToDay(startDate);
  const normalizedEnd = normalizeToDay(endDate);
  const todayKey = toDateKey(normalizeToDay(today));
  const gridStart = getMondayOnOrBefore(normalizedStart);
  const gridEnd = getSundayOnOrAfter(normalizedEnd);

  const days: CalendarDay[] = [];
  const current = new Date(gridStart);
  let index = 0;

  while (current <= gridEnd) {
    const isInRange = current >= normalizedStart && current <= normalizedEnd;
    const key = toDateKey(current);
    const dateSessions = isInRange ? sessionsByDate.get(key) : undefined;
    const routineIds = dateSessions ? [...dateSessions.routineIds] : [];
    const daySessions = dateSessions ? dateSessions.sessions : [];

    days.push({
      key: `${key}-${index}`,
      date: isInRange ? new Date(current) : null,
      dateNumber: isInRange ? current.getDate() : null,
      routineIds,
      daySessions,
      hasSession: routineIds.length > 0,
      isToday: isInRange && key === todayKey,
    });

    current.setDate(current.getDate() + 1);
    index++;
  }

  return days;
}

export function getDotBackground(routineIds: number[], colourMap: Map<number, string>): string {
  if (routineIds.length === 0) {
    return 'color-mix(in srgb, var(--em-neutral) 30%, transparent)';
  }

  const colourOrder = [...colourMap.keys()];
  const sortedIds = [...routineIds].sort((a, b) => colourOrder.indexOf(a) - colourOrder.indexOf(b));
  const colours = sortedIds.map((id) => colourMap.get(id) ?? ROUTINE_COLOURS[0]);

  if (colours.length === 1) {
    return colours[0];
  }

  const segmentSize = 100 / colours.length;
  const stops = colours
    .map(
      (colour, i) =>
        `${colour} ${(i * segmentSize).toFixed(2)}% ${((i + 1) * segmentSize).toFixed(2)}%`
    )
    .join(', ');

  return `conic-gradient(${stops})`;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeToDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMondayOnOrBefore(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function getSundayOnOrAfter(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
