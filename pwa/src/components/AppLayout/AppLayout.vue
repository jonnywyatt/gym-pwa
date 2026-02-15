<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '../../lib/auth/oauth';
import styles from './AppLayout.module.css';

const route = useRoute();
const router = useRouter();

const showUserNav = computed(() => {
  const noNavRoutes = ['login', 'auth-callback'];
  return !noNavRoutes.includes(route.name as string);
});

const backLink = computed(() => {
  const backLinks: Record<string, { to: string; label: string }> = {
    routines: { to: '/', label: 'Dashboard' },
    'workouts-list': { to: '/', label: 'Dashboard' },
    'routine-detail': { to: '/routines', label: 'Routines' },
    'workout-detail': { to: '/workouts', label: 'Workouts' },
    'user-profile': { to: '/', label: 'Dashboard' },
  };
  return backLinks[route.name as string] ?? null;
});

// Access route.path to create a reactive dependency that
// re-evaluates after navigation (e.g. after login redirect)
const userName = computed(() => { route.path; return authService.getUserName(); });
const userId = computed(() => { route.path; return authService.getUserId(); });

function handleLogout() {
  authService.logout();
  router.replace('/login');
}
</script>

<template>
  <div>
    <nav v-if="showUserNav" :class="styles.nav">
      <router-link v-if="backLink" :to="backLink.to" :class="styles.backLink">
        &larr; {{ backLink.label }}
      </router-link>
      <span v-else :class="styles.navSpacer" />
      <div :class="styles.navRight">
        <router-link
          v-if="userName && userId"
          :to="`/users/${userId}`"
          :class="styles.userLink"
        >
          {{ userName }}
        </router-link>
        <button @click="handleLogout" class="buttonSecondary">Logout</button>
      </div>
    </nav>
    <router-view />
  </div>
</template>
