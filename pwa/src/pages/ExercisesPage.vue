<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Exercise } from 'gym-pwa-api/types';
import { authFetchJson } from '../lib/api/client';
import { authService } from '../lib/auth/oauth';

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
  <main>
    <header>
      <h1>Exercises</h1>
      <button @click="handleLogout" class="logout">Logout</button>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <p v-else-if="exercises.length === 0">No exercises found.</p>
    <ul v-else>
      <li v-for="exercise in exercises" :key="exercise.id">{{ exercise.name }}</li>
    </ul>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
}

.logout {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.logout:hover {
  background: #e5e5e5;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.error {
  color: #c00;
}
</style>
