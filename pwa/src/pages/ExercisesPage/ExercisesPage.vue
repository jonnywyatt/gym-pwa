<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Exercise } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import { authService } from '../../lib/auth/oauth';
import baseStyles from '../../styles/base-classes.module.css';

const router = useRouter();
const exercises = ref<Exercise[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadExercises() {
  try {
    exercises.value = await authFetchJson<Exercise[]>('/exercises');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch exercises';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authService.logout();
  router.replace('/');
}

onMounted(() => {
  loadExercises();
});
</script>

<template>
  <main class="main">
    <header class="header">
      <h1 :class="baseStyles.heading">Exercises</h1>
      <button @click="handleLogout" class="buttonSecondary">Logout</button>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <p v-else-if="exercises.length === 0">No exercises found.</p>
    <ul v-else class="list">
      <li v-for="exercise in exercises" :key="exercise.id" class="listItem">
        {{ exercise.name }}
      </li>
    </ul>
  </main>
</template>
