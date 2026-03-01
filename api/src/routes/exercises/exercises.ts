import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getExercisesWithMuscleGroups, searchExercises } from './queries';
import { transformExercises } from './transforms';

const router = Router();

router.get('/exercises', authenticate, async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const exercises = search ? await searchExercises(search) : await getExercisesWithMuscleGroups();
    const transformedExercises = transformExercises(exercises);
    res.json(transformedExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

export default router;
