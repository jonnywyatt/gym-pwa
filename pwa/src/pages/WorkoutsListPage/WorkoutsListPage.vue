<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import type {UserWorkoutSummary} from 'gym-pwa-api/types';
import styles from './WorkoutsListPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {fetchWorkouts, buildMonthGroups, calculateMonthCount} from './helpers';
import SessionCalendar from '../../components/SessionCalendar/SessionCalendar.vue';
import {buildRoutineColourMap, getRoutineSummaries} from '../../components/SessionCalendar/helpers';

const workouts = ref<UserWorkoutSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const colourMap = computed(() => buildRoutineColourMap(workouts.value));

const monthGroups = computed(() =>
  buildMonthGroups(workouts.value, calculateMonthCount(workouts.value))
);

async function loadWorkouts() {
  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    workouts.value = await fetchWorkouts(userId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch workouts';
  } finally {
    loading.value = false;
  }
}

function getMonthSummaries(sessions: UserWorkoutSummary[]) {
  return getRoutineSummaries(sessions, colourMap.value);
}

onMounted(() => {
  loadWorkouts();
});
</script>

<template>
  <main class="main">
    <header :class="[styles.header, 'marginBottom4']">
      <h1 class="heading-l">Sessions</h1>
      <router-link to="/sessions/start" class="buttonPrimary">Start session</router-link>
    </header>
    <div class="flexVerticalCenter flexGap3Units marginBottom4">
      <router-link to="/sessions" class="buttonLink buttonLink--secondary buttonLink--active">By month</router-link>
      <span aria-hidden="true" class="linkDivider">|</span>
      <router-link to="/session-trends" class="buttonLink buttonLink--secondary">Trends</router-link>
    </div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else>
      <section
        v-for="month in monthGroups"
        :key="month.key"
        :class="styles.monthSection"
      >
        <h2 :class="[styles.monthHeading, 'uppercase', 'marginBottom4']">{{ month.label }}</h2>
        <template v-if="month.sessions.length > 0">
          <div class="habitLayout">
            <div class="summariesRow">
              <div
                v-for="summary in getMonthSummaries(month.sessions)"
                :key="summary.routineId"
                class="summaryItem"
              >
                <span class="summaryCount" :style="{ color: summary.colour }">{{ summary.count }}</span>
                <span :class="['summaryLabel', styles.summaryLabel]">{{ summary.label }}</span>
              </div>
            </div>
            <SessionCalendar
              :startDate="month.startDate"
              :endDate="month.endDate"
              :sessions="month.sessions"
            />
          </div>
        </template>
      </section>
    </template>
  </main>
</template>
