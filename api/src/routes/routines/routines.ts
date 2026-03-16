import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import {
  addExerciseToRoutine,
  copyRoutine,
  createRoutine,
  deleteRoutine,
  getRoutinesWithExerciseCount,
  getRoutineWithExercises,
  removeExerciseFromRoutine,
  updateRoutineLabel,
} from './queries';
import { transformRoutineDetail, transformRoutineSummaries } from './transforms';

const router = Router();

router.get('/routines', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const routines = await getRoutinesWithExerciseCount(userId);
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

router.post('/routines', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const routine = await createRoutine(userId);
    res.status(201).json({ id: routine.id });
  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({ error: 'Failed to create routine' });
  }
});

router.post('/routines/:routineId/copy', authenticate, async (req, res) => {
  try {
    const routineId = parseInt(String(req.params.routineId), 10);
    if (Number.isNaN(routineId)) {
      res.status(400).json({ error: 'Invalid routine ID' });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const routine = await copyRoutine(routineId, userId);
    res.status(201).json({ id: routine.id });
  } catch (error) {
    console.error('Error copying routine:', error);
    res.status(500).json({ error: 'Failed to copy routine' });
  }
});

router.patch('/routines/:routineId/label', authenticate, async (req, res) => {
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

    if (routine.userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { label } = req.body;
    if (typeof label !== 'string') {
      res.status(400).json({ error: 'label must be a string' });
      return;
    }

    await updateRoutineLabel(routineId, label);
    res.status(204).end();
  } catch (error) {
    console.error('Error updating routine label:', error);
    res.status(500).json({ error: 'Failed to update routine label' });
  }
});

router.post('/routines/:routineId/exercises', authenticate, async (req, res) => {
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

    if (routine.userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { exerciseId } = req.body;
    if (typeof exerciseId !== 'number') {
      res.status(400).json({ error: 'exerciseId must be a number' });
      return;
    }

    await addExerciseToRoutine(routineId, exerciseId);
    res.status(204).end();
  } catch (error) {
    console.error('Error adding exercise to routine:', error);
    res.status(500).json({ error: 'Failed to add exercise to routine' });
  }
});

router.delete('/routines/:routineId/exercises/:exerciseId', authenticate, async (req, res) => {
  try {
    const routineId = parseInt(String(req.params.routineId), 10);
    const exerciseId = parseInt(String(req.params.exerciseId), 10);
    if (Number.isNaN(routineId) || Number.isNaN(exerciseId)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const routine = await getRoutineWithExercises(routineId);
    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    if (routine.userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await removeExerciseFromRoutine(routineId, exerciseId);
    res.status(204).end();
  } catch (error) {
    console.error('Error removing exercise from routine:', error);
    res.status(500).json({ error: 'Failed to remove exercise from routine' });
  }
});

router.delete('/routines/:routineId', authenticate, async (req, res) => {
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

    if (routine.userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await deleteRoutine(routineId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({ error: 'Failed to delete routine' });
  }
});

export default router;
