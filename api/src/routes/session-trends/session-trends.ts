import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { type BodyAreaLabel, RecordSetsType } from '../../prisma-client';
import type { BodyAreaDisplayName, RoutineTrendData, SessionTrendsResponse } from '../../types';
import { bodyAreaDisplayNames } from '../../utils/display-names';
import { getRoutineWithExercises } from '../routines/queries';
import { getUserWorkoutSummaries } from '../workouts/queries';

const router = Router();

const WEIGHT_RECORD_TYPES = new Set<RecordSetsType>([
  RecordSetsType.WEIGHT,
  RecordSetsType.BODYWEIGHT_PLUS_WEIGHT,
  RecordSetsType.BODYWEIGHT_MINUS_OFFSET,
]);

const NON_METRIC_TYPES = new Set<RecordSetsType>([
  RecordSetsType.TIME,
  RecordSetsType.WEIGHT_AND_TIME,
]);

function determineSecondMetric(recordSetsTypes: RecordSetsType[]): 'weight' | 'reps' | null {
  if (recordSetsTypes.some((t) => WEIGHT_RECORD_TYPES.has(t))) return 'weight';
  if (recordSetsTypes.some((t) => !NON_METRIC_TYPES.has(t))) return 'reps';
  return null;
}

router.get('/users/:userId/session-trends', authenticate, async (req, res) => {
  try {
    const userId = parseInt(String(req.params.userId), 10);
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const sinceParam = typeof req.query.since === 'string' ? req.query.since : undefined;
    const since = sinceParam ? new Date(sinceParam) : undefined;

    const summaries = await getUserWorkoutSummaries(userId, since);

    const routineIds = [...new Set(summaries.map((s) => s.routineId))];

    const routineDetails = await Promise.all(routineIds.map((id) => getRoutineWithExercises(id)));

    const routineDetailMap = new Map(routineIds.map((id, i) => [id, routineDetails[i]]));

    const summariesByRoutine = new Map<number, typeof summaries>();
    for (const summary of summaries) {
      const existing = summariesByRoutine.get(summary.routineId) ?? [];
      existing.push(summary);
      summariesByRoutine.set(summary.routineId, existing);
    }

    const response: SessionTrendsResponse = routineIds.map((routineId): RoutineTrendData => {
      const detail = routineDetailMap.get(routineId);
      const routineSummaries = summariesByRoutine.get(routineId) ?? [];
      const firstSummary = routineSummaries[routineSummaries.length - 1];
      const routineLabel = detail?.label ?? firstSummary?.routineLabel ?? 'Unnamed routine';

      const recordSetsTypes = (detail?.routineExercises ?? []).map(
        (re) => re.exercise.recordSetsType
      );
      const secondMetric = determineSecondMetric(recordSetsTypes);

      const sessions = [...routineSummaries].reverse().map((s) => {
        const bodyAreaPercentages: Partial<Record<BodyAreaDisplayName, number>> = {};
        for (const stat of s.muscleGroupStats) {
          const bodyArea = bodyAreaDisplayNames[stat.bodyArea as BodyAreaLabel];
          const existing = bodyAreaPercentages[bodyArea] ?? 0;
          bodyAreaPercentages[bodyArea] = existing + Number(stat.percentage);
        }
        return {
          date: s.startedAt.toISOString(),
          durationSeconds: s.durationSeconds ?? 0,
          totalWeightKg: s.totalWeightKg ?? 0,
          totalReps: s.totalReps ?? 0,
          bodyAreaPercentages,
        };
      });

      return { routineId, routineLabel, secondMetric, sessions };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching session trends:', error);
    res.status(500).json({ error: 'Failed to fetch session trends' });
  }
});

export default router;
