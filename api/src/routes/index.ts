import { Router } from 'express';
import authRouter from './auth';
import exercisesRouter from './exercises/exercises';
import healthRouter from './health';

const router = Router();

router.use('/auth', authRouter);
router.use(healthRouter);
router.use(exercisesRouter);

export default router;
