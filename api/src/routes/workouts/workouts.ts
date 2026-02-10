import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import type { CreateWorkoutRequest } from '../../types';
import { createUserWorkout, getUserWorkouts } from './queries';
import { transformUserWorkout, transformUserWorkouts } from './transforms';

const router = Router();

router.post('/users/:userId/workouts', authenticate, async (req, res) => {
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

    const workout = req.body as CreateWorkoutRequest;

    console.log('Received workout data:', workout);
    console.log('routineId:', workout.routineId, 'type:', typeof workout.routineId);

    if (!workout.routineId || typeof workout.routineId !== 'number') {
      res.status(400).json({ error: 'routineId is required and must be a number' });
      return;
    }

    if (!workout.routineLabel || typeof workout.routineLabel !== 'string') {
      res.status(400).json({ error: 'routineLabel is required and must be a string' });
      return;
    }

    if (!workout.startedAt || typeof workout.startedAt !== 'string') {
      res.status(400).json({ error: 'startedAt is required and must be an ISO string' });
      return;
    }

    if (!workout.finishedAt || typeof workout.finishedAt !== 'string') {
      res.status(400).json({ error: 'finishedAt is required and must be an ISO string' });
      return;
    }

    if (!Array.isArray(workout.exercisesCompleted)) {
      res.status(400).json({ error: 'exercisesCompleted must be an array' });
      return;
    }

    const createdWorkout = await createUserWorkout(userId, workout);
    const transformed = transformUserWorkout(createdWorkout);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

router.get('/users/:userId/workouts', authenticate, async (req, res) => {
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

    const workouts = await getUserWorkouts(userId);
    const transformed = transformUserWorkouts(workouts);
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

export default router;
