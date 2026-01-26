import { Router } from 'express';
import exercisesRouter from './exercises';
import healthRouter from './health';

const router = Router();

router.use(healthRouter);
router.use(exercisesRouter);

export default router;
