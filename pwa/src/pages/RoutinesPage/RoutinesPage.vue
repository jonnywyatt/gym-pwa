<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type {RoutineSummary} from 'gym-pwa-api/types';
import {authFetchJson} from '../../lib/api/client';
import baseStyles from '../../styles/base-classes.module.css';

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

onMounted(() => {
  loadRoutines();
});
</script>

<template>
  <main class="main">
    <header class="header marginBottom6">
      <h1 class="heading-l">Routines</h1>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <p v-else-if="routines.length === 0">No routines found.</p>
    <ul v-else class="list">
      <li v-for="routine in routines" :key="routine.id" class="highlightCard">
        <router-link :to="`/routines/${routine.id}`" class="routineLink">
          <h2 class="heading-m marginBottom2">{{ routine.label }}</h2>
          <div class="highlightCardContents">
            <div class="exerciseCount">{{ routine.exerciseCount }} exercises</div>
          </div>
        </router-link>
      </li>
    </ul>
  </main>
</template>
