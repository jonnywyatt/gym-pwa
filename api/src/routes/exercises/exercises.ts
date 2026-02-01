import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getExercisesWithMuscleGroups } from './queries';
import { transformExercises } from './transforms';

const router = Router();

router.get('/exercises', authenticate, async (_req, res) => {
  try {
    const exercises = await getExercisesWithMuscleGroups();
    const transformedExercises = transformExercises(exercises);
    res.json(transformedExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

export default router;
