<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { RoutineSummary } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import { authService } from '../../lib/auth/oauth';
import baseStyles from '../../styles/base-classes.module.css';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadRoutines() {
  try {
    routines.value = await authFetchJson<RoutineSummary[]>('/routines');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch routines';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authService.logout();
  router.replace('/');
}

onMounted(() => {
  loadRoutines();
});
</script>

<template>
  <main class="main">
    <header class="header">
      <h1 :class="baseStyles.heading">Routines</h1>
      <button @click="handleLogout" class="buttonSecondary">Logout</button>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <p v-else-if="routines.length === 0">No routines found.</p>
    <ul v-else class="list">
      <li v-for="routine in routines" :key="routine.id" class="listItem">
        <router-link :to="`/routines/${routine.id}`" class="routineLink">
          <strong>{{ routine.label }}</strong>
          <span class="exerciseCount">{{ routine.exerciseCount }} exercises</span>
        </router-link>
      </li>
    </ul>
  </main>
</template>
