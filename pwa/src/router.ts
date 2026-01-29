import { createRouter, createWebHistory } from 'vue-router';
import { authService } from './lib/auth/oauth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./pages/LoginPage.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('./pages/AuthCallbackPage.vue'),
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('./pages/ExercisesPage.vue'),
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
