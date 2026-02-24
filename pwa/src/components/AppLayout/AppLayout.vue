<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '../../lib/auth/oauth';
import styles from './AppLayout.module.css';
import duroLogo from '../../assets/duro-logo.svg';
import profileIcon from '../../assets/profile.svg';
import InstallPrompt from '../InstallPrompt/InstallPrompt.vue';

const route = useRoute();
const router = useRouter();

const showUserNav = computed(() => {
  const noNavRoutes = ['login', 'auth-callback'];
  return !noNavRoutes.includes(route.name as string);
});

// Access route.path to create a reactive dependency that
// re-evaluates after navigation (e.g. after login redirect)
const userName = computed(() => { route.path; return authService.getUserName(); });
const userId = computed(() => { route.path; return authService.getUserId(); });

const isDashboard = computed(() => route.path === '/');
const isRoutinesActive = computed(() => route.path.startsWith('/routines'));
const isWorkoutsActive = computed(() => route.path.startsWith('/workouts'));

</script>

<template>
  <div>
    <nav v-if="showUserNav" :class="styles.nav">
      <div :class="styles.navLeft">
        <router-link to="/" :class="styles.brandLogo">
          <img :src="duroLogo" alt="Duro" width="78" height="17" />
        </router-link>
        <template v-if="!isDashboard">
          <router-link to="/workouts" :class="[styles.navLink, isWorkoutsActive && styles.navLinkActive]">Workouts</router-link>
          <router-link to="/routines" :class="[styles.navLink, isRoutinesActive && styles.navLinkActive]">Routines</router-link>
        </template>
      </div>
      <div :class="styles.navRight">
        <router-link
          v-if="userName && userId"
          :to="`/users/${userId}`"
          :class="styles.userLink"
          :aria-label="userName"
        >
          <img :src="profileIcon" alt="" width="18" height="20" />
        </router-link>
      </div>
    </nav>
    <InstallPrompt />
    <router-view />
  </div>
</template>
