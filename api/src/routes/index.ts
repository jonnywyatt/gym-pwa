import { Router } from 'express';
import authRouter from './auth';
import exercisesRouter from './exercises/exercises';
import healthRouter from './health';
import routinesRouter from './routines/routines';

const router = Router();

router.use('/auth', authRouter);
router.use(healthRouter);
router.use(exercisesRouter);
router.use(routinesRouter);

export default router;
