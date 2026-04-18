<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary} from 'gym-pwa-api/types';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout} from '../../lib/db';
import {fetchRoutines, handleNewWorkout} from '../DashboardPage/helpers';
import StartSessionBlock from '../../components/StartSessionBlock/StartSessionBlock.vue';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const startingRoutineId = ref<number | null>(null);

async function loadRoutines() {
  try {
    routines.value = await fetchRoutines();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load routines';
  } finally {
    loading.value = false;
  }
}

async function onStartSession(routineId: number) {
  const userId = authService.getUserId();
  startingRoutineId.value = routineId;
  error.value = null;

  const result = await handleNewWorkout(userId, routineId, getActiveWorkout, createWorkout);

  switch (result.type) {
    case 'navigate':
      await router.push(result.path);
      break;
    case 'navigate-with-error':
      error.value = result.error;
      await router.push(result.path);
      break;
    case 'error':
      error.value = result.error;
      break;
  }

  startingRoutineId.value = null;
}

onMounted(() => {
  loadRoutines();
});
</script>

<template>
  <main class="main">
    <header class="header marginBottom6">
      <h1 class="heading-l">Start a session</h1>
    </header>
    <StartSessionBlock
      :routines="routines"
      :loading="loading"
      :error="error"
      :startingRoutineId="startingRoutineId"
      :vertical="true"
      @startSession="onStartSession"
    />
  </main>
</template>
