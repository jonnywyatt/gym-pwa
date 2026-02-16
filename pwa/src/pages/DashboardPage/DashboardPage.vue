<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { RoutineSummary, UserWorkout } from 'gym-pwa-api/types';
import styles from './DashboardPage.module.css';
import { authService } from '../../lib/auth/oauth';
import { createWorkout, getActiveWorkout } from '../../lib/db';
import { loadDashboardData, handleNewWorkout } from './helpers';
import {
  formatDate,
  formatTime,
  formatDuration,
  formatTotalWeight,
} from '../WorkoutsListPage/helpers';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const latestWorkout = ref<UserWorkout | null>(null);
const routinesLoading = ref(true);
const workoutLoading = ref(true);
const routinesError = ref<string | null>(null);
const workoutError = ref<string | null>(null);
const startingRoutineId = ref<number | null>(null);

async function loadData() {
  const userId = authService.getUserId();
  const data = await loadDashboardData(userId);

  routines.value = data.routines;
  latestWorkout.value = data.latestWorkout;
  routinesError.value = data.routinesError;
  workoutError.value = data.workoutError;
  routinesLoading.value = false;
  workoutLoading.value = false;
}

async function onNewWorkout(routineId: number) {
  const userId = authService.getUserId();
  startingRoutineId.value = routineId;
  routinesError.value = null;

  const result = await handleNewWorkout(userId, routineId, getActiveWorkout, createWorkout);

  switch (result.type) {
    case 'navigate':
      await router.push(result.path);
      break;
    case 'navigate-with-error':
      routinesError.value = result.error;
      await router.push(result.path);
      break;
    case 'error':
      routinesError.value = result.error;
      break;
  }

  startingRoutineId.value = null;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="main">
    <section :class="styles.section">
      <h2 :class="styles.sectionHeading">Routines</h2>
      <p v-if="routinesLoading" :class="styles.loading">Loading...</p>
      <p v-else-if="routinesError" :class="styles.error">Error: {{ routinesError }}</p>
      <template v-else>
        <p v-if="routines.length === 0" :class="styles.emptyText">No routines available.</p>
        <ul v-else :class="styles.routineList">
          <li v-for="routine in routines" :key="routine.id" :class="styles.routineItem">
            <span :class="styles.routineLabel">{{ routine.label }}</span>
            <span :class="styles.routineActions">
              <router-link :to="`/routines/${routine.id}`" :class="styles.routineDetailLink">Details</router-link>
              <button
                type="button"
                :class="styles.newWorkoutButton"
                :disabled="startingRoutineId === routine.id"
                @click="onNewWorkout(routine.id)"
              >
                {{ startingRoutineId === routine.id ? 'Starting...' : 'New workout' }}
              </button>
            </span>
          </li>
        </ul>
      </template>
    </section>

    <section :class="styles.section">
      <h2 :class="styles.sectionHeading">Workouts</h2>
      <p v-if="workoutLoading" :class="styles.loading">Loading workouts...</p>
      <p v-else-if="workoutError" :class="styles.error">Error: {{ workoutError }}</p>
      <template v-else>
        <p v-if="!latestWorkout" :class="styles.emptyText">No workouts yet.</p>
        <template v-else>
          <div :class="styles.workoutCard">
            <div :class="styles.workoutCardHeader">Last workout</div>
            <span :class="styles.workoutRoutineName">{{ latestWorkout.routineLabel }}</span>
            <div :class="styles.workoutMeta">
              <span>{{ formatDate(latestWorkout.startedAt) }} at {{ formatTime(latestWorkout.startedAt) }}</span>
              <span v-if="latestWorkout.totalWeightKg">{{ formatTotalWeight(latestWorkout.totalWeightKg) }} total</span>
              <span v-if="latestWorkout.durationSeconds !== undefined">{{ formatDuration(latestWorkout.durationSeconds) }}</span>
            </div>
            <router-link :to="`/workouts/${latestWorkout.id}`" :class="styles.workoutLink">Summary</router-link>
          </div>
          <router-link to="/workouts" :class="styles.allWorkoutsLink">All workouts</router-link>
        </template>
      </template>
    </section>
  </main>
</template>
