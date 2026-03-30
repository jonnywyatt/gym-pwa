import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { RecordSetsType } from '../../prisma-client';
import type { RoutineTrendData, SessionTrendsResponse } from '../../types';
import { getRoutineWithExercises } from '../routines/queries';
import { getUserWorkoutSummaries } from '../workouts/queries';
import { transformUserWorkoutSummaries } from '../workouts/transforms';

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
    const workouts = transformUserWorkoutSummaries(summaries);

    const routineIds = [...new Set(workouts.map((w) => w.routineId))];

    const routineDetails = await Promise.all(routineIds.map((id) => getRoutineWithExercises(id)));

    const routineDetailMap = new Map(routineIds.map((id, i) => [id, routineDetails[i]]));

    const workoutsByRoutine = new Map<number, typeof workouts>();
    for (const workout of workouts) {
      const existing = workoutsByRoutine.get(workout.routineId) ?? [];
      existing.push(workout);
      workoutsByRoutine.set(workout.routineId, existing);
    }

    const response: SessionTrendsResponse = routineIds.map((routineId): RoutineTrendData => {
      const detail = routineDetailMap.get(routineId);
      const routineWorkouts = workoutsByRoutine.get(routineId) ?? [];
      const firstWorkout = routineWorkouts[routineWorkouts.length - 1];
      const routineLabel = detail?.label ?? firstWorkout?.routineLabel ?? 'Unnamed routine';

      const recordSetsTypes = (detail?.routineExercises ?? []).map(
        (re) => re.exercise.recordSetsType
      );
      const secondMetric = determineSecondMetric(recordSetsTypes);

      const sessions = [...routineWorkouts].reverse().map((w) => ({
        date: w.startedAt,
        durationSeconds: w.durationSeconds ?? 0,
        totalWeightKg: w.totalWeightKg,
        totalReps: w.totalReps,
      }));

      return { routineId, routineLabel, secondMetric, sessions };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching session trends:', error);
    res.status(500).json({ error: 'Failed to fetch session trends' });
  }
});

export default router;
