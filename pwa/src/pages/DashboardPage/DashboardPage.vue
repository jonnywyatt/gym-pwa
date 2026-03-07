<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary, UserWorkout} from 'gym-pwa-api/types';
import styles from './DashboardPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout, type LocalWorkout} from '../../lib/db';
import {loadDashboardData, handleNewWorkout, createRoutine} from './helpers';
import {
  formatDateTime,
  formatDuration,
  formatTotalWeight,
} from '../WorkoutsListPage/helpers';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const recentWorkouts = ref<UserWorkout[]>([]);
const activeWorkout = ref<LocalWorkout | null>(null);
const routinesLoading = ref(true);
const workoutLoading = ref(true);
const routinesError = ref<string | null>(null);
const workoutError = ref<string | null>(null);
const startingRoutineId = ref<number | null>(null);
const creating = ref(false);

async function loadData() {
  const userId = authService.getUserId();
  const data = await loadDashboardData(userId);

  routines.value = data.routines;
  recentWorkouts.value = data.recentWorkouts;
  routinesError.value = data.routinesError;
  workoutError.value = data.workoutError;
  routinesLoading.value = false;
  workoutLoading.value = false;

  if (userId !== null) {
    activeWorkout.value = (await getActiveWorkout(userId)) ?? null;
  }
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

async function onCreateRoutine() {
  creating.value = true;
  routinesError.value = null;
  try {
    const id = await createRoutine();
    await router.push(`/routines/${id}/edit`);
  } catch (e) {
    routinesError.value = e instanceof Error ? e.message : 'Failed to create routine';
  } finally {
    creating.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="main">
    <template v-if="activeWorkout === null">
      <p v-if="!routinesLoading && !routinesError && routines.length === 0" :class="styles.createRoutinePrompt">
        <router-link to="/routines">Start by creating a routine</router-link>
      </p>
      <section v-else :class="styles.section">
        <h2 class="sectionHeading">Start a session</h2>
        <p v-if="routinesLoading" :class="styles.loading">Loading...</p>
        <p v-else-if="routinesError" :class="styles.error">Error: {{ routinesError }}</p>
        <template v-else>
          <div :class="styles.routineList">
            <button v-for="routine in routines" :key="routine.id" class="highlightCard"
                    type="button"
                    :disabled="startingRoutineId === routine.id"
                    @click="onNewWorkout(routine.id)">
              <span class="heading-m">{{ routine.label }}</span>
            </button>
          </div>
          <div class=" flexVerticalCenter flexGap3Units">
            <router-link to="/routines" class="buttonLink buttonLink--secondary">All routines</router-link>
            <span aria-hidden="true" class="linkDivider">|</span>
            <button type="button" class="buttonLink buttonLink--secondary" :disabled="creating" @click="onCreateRoutine">Create new routine</button>
          </div>
        </template>
      </section>
    </template>

    <section v-if="workoutLoading || workoutError || recentWorkouts.length > 0" :class="styles.section">
      <h2 class="sectionHeading">Recent sessions</h2>
      <p v-if="workoutLoading" :class="styles.loading">Loading sessions...</p>
      <p v-else-if="workoutError" :class="styles.error">Error: {{ workoutError }}</p>
      <template v-else>
        <div v-for="workout in recentWorkouts" :key="workout.id">
          <router-link :to="`/workouts/${workout.id}`" :data-testid="`workout-${workout.id}`">
            <div class="highlightCard highlightCardSecondary">
              <span class="heading-m">{{ workout.routineLabel }}</span>
              <div :class="styles.workoutMeta">
                <span>{{ formatDateTime(workout.startedAt) }}</span>
                <span v-if="workout.durationSeconds !== undefined">{{
                    formatDuration(workout.durationSeconds)
                  }}</span>
              </div>
              <div class="weight-sm" v-if="workout.totalWeightKg">{{
                  formatTotalWeight(workout.totalWeightKg)
                }} total</div>
            </div>
          </router-link>
        </div>
        <div><router-link to="/workouts" class="buttonLink buttonLink--secondary">All sessions</router-link></div>
      </template>
    </section>
  </main>
</template>
