import { Router } from 'express';
import authRouter from './auth';
import dashboardRouter from './dashboard/dashboard';
import exercisesRouter from './exercises/exercises';
import healthRouter from './health';
import routinesRouter from './routines/routines';
import sessionTrendsRouter from './session-trends/session-trends';
import usersRouter from './users/users';
import workoutsRouter from './workouts/workouts';

const router = Router();

router.use('/auth', authRouter);
router.use(healthRouter);
router.use(dashboardRouter);
router.use(exercisesRouter);
router.use(routinesRouter);
router.use(sessionTrendsRouter);
router.use(usersRouter);
router.use(workoutsRouter);

export default router;
