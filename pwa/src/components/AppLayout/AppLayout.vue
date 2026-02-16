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

// Access route.path to create a reactive dependency that
// re-evaluates after navigation (e.g. after login redirect)
const userName = computed(() => { route.path; return authService.getUserName(); });
const userId = computed(() => { route.path; return authService.getUserId(); });

</script>

<template>
  <div>
    <nav v-if="showUserNav" :class="styles.nav">
      <div :class="styles.navLeft">
        <router-link to="/" :class="styles.brandName">Duro</router-link>
        <router-link to="/routines" :class="styles.navLink">Routines</router-link>
        <router-link to="/workouts" :class="styles.navLink">Workouts</router-link>
      </div>
      <div :class="styles.navRight">
        <router-link
          v-if="userName && userId"
          :to="`/users/${userId}`"
          :class="styles.userLink"
        >
          {{ userName }}
        </router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>
