<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Exercise } from 'gym-pwa-api/types';
import { fetchExercises } from './utils/api';

const exercises = ref<Exercise[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadExercises() {
  try {
    exercises.value = await fetchExercises();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch exercises';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadExercises();
});

</script>

<template>
  <main>
    <h1>Exercises</h1>
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

h1 {
  margin-bottom: 1rem;
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
