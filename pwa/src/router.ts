import { createRouter, createWebHistory } from 'vue-router';
import { authService } from './lib/auth/oauth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./pages/LoginPage/LoginPage.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('./pages/AuthCallbackPage/AuthCallbackPage.vue'),
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('./pages/ExercisesPage/ExercisesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/routines',
      name: 'routines',
      component: () => import('./pages/RoutinesPage/RoutinesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/routines/:routineId',
      name: 'routine-detail',
      component: () => import('./pages/RoutinePage/RoutinePage.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
