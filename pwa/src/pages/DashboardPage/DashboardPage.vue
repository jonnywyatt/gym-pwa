<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary, UserWorkoutSummary} from 'gym-pwa-api/types';
import styles from './DashboardPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {createWorkout, getActiveWorkout, type LocalWorkout} from '../../lib/db';
import {loadDashboardData, handleNewWorkout, createRoutine, consumeDashboardPrefetch} from './helpers';
import SessionCalendar from '../../components/SessionCalendar/SessionCalendar.vue';
import {buildRoutineColourMap, getRoutineSummaries} from '../../components/SessionCalendar/helpers';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const sessionHistory = ref<UserWorkoutSummary[]>([]);
const activeWorkout = ref<LocalWorkout | null>(null);
const routinesLoading = ref(true);
const workoutLoading = ref(true);
const routinesError = ref<string | null>(null);
const workoutError = ref<string | null>(null);
const startingRoutineId = ref<number | null>(null);
const creating = ref(false);

const calendarEnd = computed(() => new Date());
const calendarStart = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() - 27);
  d.setHours(0, 0, 0, 0);
  return d;
});

const colourMap = computed(() => buildRoutineColourMap(sessionHistory.value));
const routineSummaries = computed(() => getRoutineSummaries(sessionHistory.value, colourMap.value));

async function loadData() {
  const userId = authService.getUserId();
  const data = await (consumeDashboardPrefetch() ?? loadDashboardData(userId));

  routines.value = data.routines;
  sessionHistory.value = data.sessionHistory;
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
        <h2 class="uppercase marginBottom4">Start a session</h2>
        <p v-if="routinesLoading" :class="styles.loading">Loading...</p>
        <p v-else-if="routinesError" :class="styles.error">Error: {{ routinesError }}</p>
        <template v-else>
          <div :class="styles.routineList">
            <button v-for="routine in routines" :key="routine.id" class="highlightCard"
                    type="button"
                    :class="startingRoutineId === routine.id ? styles.routineButtonLoading : ''"
                    :disabled="startingRoutineId === routine.id"
                    @click="onNewWorkout(routine.id)">
              <span class="heading-m">{{ routine.label }}</span>
            </button>
          </div>
          <div class="flexVerticalCenter flexGap3Units">
            <router-link to="/routines" class="buttonLink buttonLink--secondary">All routines</router-link>
            <span aria-hidden="true" class="linkDivider">|</span>
            <button type="button" class="buttonLink buttonLink--secondary" :disabled="creating" @click="onCreateRoutine">Create new routine</button>
          </div>
        </template>
      </section>
    </template>

    <section :class="styles.section">
      <h2 class="uppercase marginBottom4">Last 4 weeks sessions</h2>
      <p v-if="workoutLoading" :class="styles.loading">Loading sessions...</p>
      <p v-else-if="workoutError" :class="styles.error">Error: {{ workoutError }}</p>
      <template v-else>
        <div :class="styles.habitLayout">
          <div class="flexVerticalColumn flexGap3Units">
            <div
              v-for="summary in routineSummaries"
              :key="summary.routineId"
              class="flexVerticalEnd flexGap2Units"
            >
              <span :class="styles.summaryCount" :style="{ color: summary.colour }">{{ summary.count }}</span>
              <span :class="styles.summaryLabel">{{ summary.label }}</span>
            </div>
          </div>
          <SessionCalendar
            :startDate="calendarStart"
            :endDate="calendarEnd"
            :sessions="sessionHistory"
          />
        </div>
        <div>
          <router-link to="/sessions" class="buttonLink buttonLink--secondary">All sessions</router-link>
        </div>
      </template>
    </section>
  </main>
</template>
