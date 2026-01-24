import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/records - All personal records for user
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const records = await prisma.personalRecord.findMany({
      where: { userId: req.userId },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            recordingType: true
          }
        }
      },
      orderBy: { achievedAt: 'desc' }
    });

    res.json(records);
  } catch (error) {
    next(error);
  }
});

export default router;
