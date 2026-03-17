import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import type { DashboardResponse } from '../../types';
import { getRoutinesWithExerciseCount } from '../routines/queries';
import { transformRoutineSummaries } from '../routines/transforms';
import { getUserWorkoutSummaries } from '../workouts/queries';
import { transformUserWorkoutSummaries } from '../workouts/transforms';

const router = Router();

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sinceParam = typeof req.query.since === 'string' ? req.query.since : undefined;
    const since = sinceParam ? new Date(sinceParam) : undefined;

    const [routines, workoutSummaries] = await Promise.all([
      getRoutinesWithExerciseCount(userId),
      getUserWorkoutSummaries(userId, since),
    ]);

    const response: DashboardResponse = {
      routines: transformRoutineSummaries(routines),
      recentWorkouts: transformUserWorkoutSummaries(workoutSummaries),
    };

    res.set('Cache-Control', 'private, max-age=0');
    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
