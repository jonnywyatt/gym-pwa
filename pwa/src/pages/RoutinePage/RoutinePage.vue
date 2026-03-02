<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {RoutineDetail} from 'gym-pwa-api/types';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout, type LocalWorkout} from '../../lib/db';
import {fetchRoutine, prepareWorkoutStart, deleteRoutine} from './helpers';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue';

const route = useRoute();
const router = useRouter();
const routine = ref<RoutineDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const startingWorkout = ref(false);
const activeWorkout = ref<LocalWorkout | null>(null);
const deleting = ref(false);
const showDeleteDialog = ref(false);

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

async function checkActiveWorkout() {
  const userId = authService.getUserId();
  if (!userId) return;
  activeWorkout.value = (await getActiveWorkout(userId)) ?? null;
}

function openDeleteDialog() {
  showDeleteDialog.value = true;
}

function cancelDelete() {
  showDeleteDialog.value = false;
}

async function confirmDelete() {
  showDeleteDialog.value = false;
  deleting.value = true;
  error.value = null;
  try {
    await deleteRoutine(route.params.routineId);
    await router.push('/routines');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete routine';
    deleting.value = false;
  }
}

onMounted(() => {
  loadRoutine();
  checkActiveWorkout();
});
</script>

<template>
  <main class="main">
    <h1 v-if="routine" class="heading-l marginBottom4">{{ routine.label }} routine</h1>
    <div v-if="routine && !loading" class="flexSpaceBetween marginBottom6">
      <div class="flexVerticalCenter flexGap3Units">
        <button
            type="button"
            class="buttonPrimary"
            v-if="activeWorkout === null || activeWorkout.routineId === Number(route.params.routineId)"
            :disabled="startingWorkout"
            @click="handleStartWorkout"
        >
          {{ startingWorkout ? 'Starting...' : activeWorkout?.routineId === Number(route.params.routineId) ? 'Continue workout' : 'Start workout' }}
        </button>
        <router-link
            :to="`/routines/${route.params.routineId}/edit`"
            class="buttonSecondary"
        >Edit</router-link>
      </div>
      <button
          type="button"
          class="buttonDelete"
          aria-label="Delete routine"
          :disabled="deleting"
          @click="openDeleteDialog"
      >
        Delete
      </button>
    </div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else-if="routine">
      <p v-if="routine.exercises.length === 0">No exercises in this routine.</p>
      <ul v-else class="list">
        <li v-for="exercise in routine.exercises" :key="exercise.id" class="highlightCard">
          <h2 class="heading-m">{{ exercise.label }}</h2>
          <div class="highlightCardContents">
            <div class="marginBottom2">{{ exercise.primaryMuscleGroups.join(', ') }}</div>
            <div>Secondary muscle groups: {{ exercise.secondaryMuscleGroups.join(', ') }}</div>
          </div>
        </li>
      </ul>
    </template>

    <ConfirmDialog
        :open="showDeleteDialog"
        title="Delete routine?"
        message="This action cannot be undone."
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </main>
</template>
