<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RoutineDetail } from 'gym-pwa-api/types';
import { authFetchJson } from '../../lib/api/client';
import baseStyles from '../../styles/base-classes.module.css';
import { authService } from '../../lib/auth/oauth';
import {
  createWorkout,
  getActiveWorkout,
  type LocalWorkout,
  type LocalWorkoutExercise,
} from '../../lib/db';

const route = useRoute();
const router = useRouter();
const routine = ref<RoutineDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const startingWorkout = ref(false);

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

async function handleStartWorkout() {
  if (!routine.value) return;

  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    return;
  }

  try {
    startingWorkout.value = true;

    const existingWorkout = await getActiveWorkout(userId);
    if (existingWorkout) {
      router.push(`/workouts/${existingWorkout.id}`);
      return;
    }

    const workoutId = crypto.randomUUID();
    const exercisesCompleted: LocalWorkoutExercise[] = routine.value.exercises.map((ex) => {
      const rawEx = toRaw(ex);
      return {
        id: rawEx.id,
        label: rawEx.label,
        recordSetsType: rawEx.recordSetsType,
        primaryMuscleGroups: [...rawEx.primaryMuscleGroups],
        secondaryMuscleGroups: [...rawEx.secondaryMuscleGroups],
        completed: false,
      };
    });

    const workout: LocalWorkout = {
      id: workoutId,
      userId,
      routineId: Number(route.params.routineId),
      routineLabel: routine.value.label,
      startedAt: new Date().toISOString(),
      exercisesCompleted,
    };

    await createWorkout(workout);
    router.push(`/workouts/${workoutId}`);
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
