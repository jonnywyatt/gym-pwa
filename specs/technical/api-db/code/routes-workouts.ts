import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/workouts - List user's workouts
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 50,
      include: {
        workoutSets: {
          orderBy: { setOrder: 'asc' },
          include: {
            exercise: {
              select: { id: true, name: true, recordingType: true }
            }
          }
        }
      }
    });

    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

// POST /api/workouts - Save completed workout
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId,
        routineSnapshot: data.routineSnapshot,
        bodyweightSnapshot: data.bodyweightSnapshot,
        startedAt: new Date(data.startedAt),
        completedAt: new Date(data.completedAt),
        durationSeconds: data.durationSeconds,
        totalWeightKg: data.totalWeightKg,
        recordsBroken: data.recordsBroken,
        muscleGroupBreakdown: data.muscleGroupBreakdown,
        workoutSets: {
          create: data.sets.map((set: any, index: number) => ({
            exerciseId: set.exerciseId,
            reps: set.reps,
            weightKg: set.weightKg,
            durationSeconds: set.durationSeconds,
            isWarmup: set.isWarmup || false,
            isFailure: set.isFailure || false,
            restDurationSeconds: set.restDurationSeconds,
            setOrder: index
          }))
        }
      },
      include: { workoutSets: true }
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/workouts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const workoutId = parseInt(req.params.id);

    const workout = await prisma.workout.findFirst({
      where: { id: workoutId, userId }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    await prisma.workout.delete({ where: { id: workoutId } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
