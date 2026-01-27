// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { authService } from './lib/auth/oauth';

import Home from './routes/Home.vue';
import Login from './routes/Login.vue';
import AuthCallback from './routes/AuthCallback.vue';
import Routines from './routes/Routines.vue';
import Workout from './routes/Workout.vue';
import WorkoutHistory from './routes/WorkoutHistory.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/auth/callback',
    component: AuthCallback
  },
  {
    path: '/routines',
    component: Routines,
    meta: { requiresAuth: true }
  },
  {
    path: '/workout/:id',
    component: Workout,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    component: WorkoutHistory,
    meta: { requiresAuth: true }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});
