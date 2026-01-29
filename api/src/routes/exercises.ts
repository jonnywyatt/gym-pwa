import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/exercises', authenticate, async (_req, res) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

export default router;
