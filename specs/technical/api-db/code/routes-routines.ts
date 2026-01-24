import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/routines - List seed + user routines
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const routines = await prisma.routine.findMany({
      where: {
        OR: [
          { isSeedData: true },
          { userId: req.userId }
        ]
      },
      include: {
        routineExercises: {
          orderBy: { orderIndex: 'asc' },
          include: {
            exercise: true
          }
        }
      },
      orderBy: [
        { isSeedData: 'desc' }, // Seed routines first
        { createdAt: 'desc' }
      ]
    });

    res.json(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines - Create user routine
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const data = req.body;

    const routine = await prisma.routine.create({
      data: {
        userId: req.userId!,
        name: data.name,
        routineExercises: {
          create: data.exercises.map((exerciseId: number, index: number) => ({
            exerciseId,
            orderIndex: index
          }))
        }
      },
      include: {
        routineExercises: {
          include: { exercise: true }
        }
      }
    });

    res.status(201).json(routine);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const routineId = parseInt(req.params.id);

    // Verify ownership and not seed data
    const routine = await prisma.routine.findFirst({
      where: {
        id: routineId,
        userId: req.userId,
        isSeedData: false
      }
    });

    if (!routine) {
      return res.status(404).json({ error: 'Routine not found or cannot be deleted' });
    }

    await prisma.routine.delete({
      where: { id: routineId }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
