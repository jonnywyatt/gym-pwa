<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RoutineDetail } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import { authService } from '../../lib/auth/oauth';
import baseStyles from '../../styles/base-classes.module.css';

const router = useRouter();
const route = useRoute();
const routine = ref<RoutineDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadRoutine() {
  try {
    const routineId = route.params.routineId;
    routine.value = await authFetchJson<RoutineDetail>(`/routines/${routineId}`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch routine';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authService.logout();
  router.replace('/');
}

onMounted(() => {
  loadRoutine();
});
</script>

<template>
  <main class="main">
    <header class="header">
      <h1 v-if="routine" :class="baseStyles.heading">{{ routine.label }}</h1>
      <button @click="handleLogout" class="buttonSecondary">Logout</button>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else-if="routine">
      <p v-if="routine.exercises.length === 0">No exercises in this routine.</p>
      <ul v-else class="list">
        <li v-for="exercise in routine.exercises" :key="exercise.id" class="listItem">
          <strong>{{ exercise.label }}</strong>
          <div>Primary: {{ exercise.primaryMuscleGroups.join(', ') }}</div>
          <div>Secondary: {{ exercise.secondaryMuscleGroups.join(', ') }}</div>
        </li>
      </ul>
    </template>
  </main>
</template>
