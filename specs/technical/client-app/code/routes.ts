// src/routes.ts
import { wrap } from 'svelte-spa-router/wrap';
import { authService } from './lib/auth/oauth';

import Home from './routes/Home.svelte';
import Login from './routes/Login.svelte';
import AuthCallback from './routes/AuthCallback.svelte';
import Routines from './routes/Routines.svelte';
import Workout from './routes/Workout.svelte';
import WorkoutHistory from './routes/WorkoutHistory.svelte';

function requireAuth(detail: any) {
  if (!authService.isAuthenticated()) {
    return false; // Redirect handled by conditionsFailed
  }
  return true;
}

export const routes = {
  '/': wrap({
    component: Home,
    conditions: [requireAuth]
  }),
  '/login': Login,
  '/auth/callback': AuthCallback,
  '/routines': wrap({
    component: Routines,
    conditions: [requireAuth]
  }),
  '/workout/:id': wrap({
    component: Workout,
    conditions: [requireAuth]
  }),
  '/history': wrap({
    component: WorkoutHistory,
    conditions: [requireAuth]
  }),
};

export function conditionsFailed() {
  window.location.hash = '/login';
}
