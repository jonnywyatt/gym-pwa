<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary, UserWorkout} from 'gym-pwa-api/types';
import styles from './DashboardPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout, type LocalWorkout} from '../../lib/db';
import {loadDashboardData, handleNewWorkout} from './helpers';
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="main">
    <section :class="styles.section">
      <h2 class="sectionHeading">Routines</h2>
      <p v-if="routinesLoading" :class="styles.loading">Loading...</p>
      <p v-else-if="routinesError" :class="styles.error">Error: {{ routinesError }}</p>
      <template v-else>
        <p v-if="routines.length === 0" :class="styles.emptyText">No routines available.</p>
        <template v-else>
          <ul :class="styles.routineList">
            <li v-for="routine in routines" :key="routine.id" class="highlightCard">
              <span class="heading-m">{{ routine.label }}</span>
              <span class="flexSpaceBetween">
                <router-link :to="`/routines/${routine.id}`" :class="styles.routineDetailLink">See exercises</router-link>
                <button
                    type="button"
                    class="buttonPrimary"
                    :disabled="startingRoutineId === routine.id"
                    @click="onNewWorkout(routine.id)"
                >
                  {{
                    startingRoutineId === routine.id ? 'Starting...' : activeWorkout?.routineId === routine.id ? 'Continue workout' : 'Start workout'
                  }}
                </button>
              </span>
            </li>
          </ul>
          <div class="indentToCardText"><router-link to="/routines" :class="styles.allWorkoutsLink">See all</router-link></div>
        </template>
      </template>
    </section>

    <section :class="styles.section">
      <h2 class="sectionHeading">Recent workouts</h2>
      <p v-if="workoutLoading" :class="styles.loading">Loading workouts...</p>
      <p v-else-if="workoutError" :class="styles.error">Error: {{ workoutError }}</p>
      <template v-else>
        <p v-if="recentWorkouts.length === 0" :class="styles.emptyText">No workouts yet.</p>
        <template v-else>
            <div v-for="workout in recentWorkouts" :key="workout.id" class="marginBottom2">
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
          <div class="indentToCardText"><router-link to="/workouts" :class="styles.allWorkoutsLink">See all</router-link></div>
        </template>
      </template>
    </section>
  </main>
</template>
