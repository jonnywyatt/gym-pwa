<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RoutineDetail } from 'gym-pwa-api/types';
import baseStyles from '../../styles/base-classes.module.css';
import { authService } from '../../lib/auth/oauth';
import { createWorkout, getActiveWorkout } from '../../lib/db';
import { fetchRoutine, prepareWorkoutStart } from './helpers';

const route = useRoute();
const router = useRouter();
const routine = ref<RoutineDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const startingWorkout = ref(false);

async function loadRoutine() {
  try {
    routine.value = await fetchRoutine(route.params.routineId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch routine';
  } finally {
    loading.value = false;
  }
}

async function handleStartWorkout() {
  if (!routine.value) return;

  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    return;
  }

  startingWorkout.value = true;
  error.value = null;

  try {
    const action = await prepareWorkoutStart(
      userId,
      Number(route.params.routineId),
      routine.value,
      getActiveWorkout
    );

    switch (action.type) {
      case 'navigate-to-existing':
        await router.push(`/workouts/${action.workoutId}`);
        break;

      case 'navigate-to-user-page':
        error.value = action.error;
        await router.push(`/users/${action.userId}`);
        break;

      case 'create-new-workout':
        await createWorkout(action.workout);
        await router.push(`/workouts/${action.workout.id}`);
        break;

      case 'error':
        error.value = action.error;
        break;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to start workout';
  } finally {
    startingWorkout.value = false;
  }
}

onMounted(() => {
  loadRoutine();
});
</script>

<template>
  <main class="main">
    <header class="header">
      <h1 v-if="routine" :class="baseStyles.heading">{{ routine.label }}</h1>
      <button
        v-if="routine && !loading"
        type="button"
        :disabled="startingWorkout"
        @click="handleStartWorkout"
      >
        {{ startingWorkout ? 'Starting...' : 'Start workout' }}
      </button>
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
