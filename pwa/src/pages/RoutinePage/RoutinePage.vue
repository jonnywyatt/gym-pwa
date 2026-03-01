<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {RoutineDetail} from 'gym-pwa-api/types';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout} from '../../lib/db';
import {fetchRoutine, prepareWorkoutStart} from './helpers';

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
    <h1 v-if="routine" class="heading-l marginBottom4">{{ routine.label }} routine</h1>
    <div v-if="routine && !loading" class="flexVerticalCenter flexGap3Units marginBottom6">
      <button
          type="button"
          class="buttonPrimary"
          :disabled="startingWorkout"
          @click="handleStartWorkout"
      >
        {{ startingWorkout ? 'Starting...' : 'Start workout' }}
      </button>
      <router-link
          :to="`/routines/${route.params.routineId}/edit`"
          class="buttonSecondary"
      >Edit</router-link>
    </div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else-if="routine">
      <p v-if="routine.exercises.length === 0">No exercises in this routine.</p>
      <ul v-else class="list">
        <li v-for="exercise in routine.exercises" :key="exercise.id" class="highlightCard marginBottom4">
          <h2 class="heading-m">{{ exercise.label }}</h2>
          <div class="highlightCardContents">
            <div class="marginBottom2">{{ exercise.primaryMuscleGroups.join(', ') }}</div>
            <div>Secondary muscle groups: {{ exercise.secondaryMuscleGroups.join(', ') }}</div>
          </div>
        </li>
      </ul>
    </template>
  </main>
</template>
