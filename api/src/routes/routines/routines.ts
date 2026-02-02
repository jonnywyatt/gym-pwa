import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getRoutinesWithExerciseCount, getRoutineWithExercises } from './queries';
import { transformRoutineDetail, transformRoutineSummaries } from './transforms';

const router = Router();

router.get('/routines', authenticate, async (_req, res) => {
  try {
    const routines = await getRoutinesWithExerciseCount();
    const transformedRoutines = transformRoutineSummaries(routines);
    res.json(transformedRoutines);
  } catch (error) {
    console.error('Error fetching routines:', error);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

router.get('/routines/:routineId', authenticate, async (req, res) => {
  try {
    const routineId = parseInt(String(req.params.routineId), 10);
    if (Number.isNaN(routineId)) {
      res.status(400).json({ error: 'Invalid routine ID' });
      return;
    }

    const routine = await getRoutineWithExercises(routineId);
    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    const transformedRoutine = transformRoutineDetail(routine);
    res.json(transformedRoutine);
  } catch (error) {
    console.error('Error fetching routine:', error);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
});

export default router;
