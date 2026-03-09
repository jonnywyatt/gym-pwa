<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type {UserWorkoutSummary} from 'gym-pwa-api/types';
import styles from './WorkoutsListPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {
  fetchWorkouts,
  calculateDuration,
  formatDateTime,
  formatDuration,
  formatTotalWeight,
  getFilterStartDate,
  type FilterPeriod,
} from './helpers';

const FILTER_OPTIONS: Array<{ period: FilterPeriod; label: string }> = [
  {period: '30d', label: '30 days'},
  {period: '1y', label: '1 year'},
  {period: 'all', label: 'All'},
];

const workouts = ref<UserWorkoutSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedFilter = ref<FilterPeriod>('30d');

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
    const since = getFilterStartDate(selectedFilter.value);
    workouts.value = await fetchWorkouts(userId, since ?? undefined);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch workouts';
  } finally {
    loading.value = false;
  }
}

async function selectFilter(period: FilterPeriod) {
  selectedFilter.value = period;
  await loadWorkouts();
}

onMounted(() => {
  loadWorkouts();
});
</script>

<template>
  <main class="main">
    <header class="header marginBottom4">
      <h1 class="heading-l heading-l-session">Sessions</h1>
    </header>
    <div class="flexVerticalCenter flexGap2Units marginBottom4">
      <button
          v-for="option in FILTER_OPTIONS"
          :key="option.period"
          :class="['buttonSecondary', selectedFilter === option.period ? styles.filterActive : '']"
          @click="selectFilter(option.period)"
      >
        {{ option.label }}
      </button>
    </div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else>
      <p class="marginBottom4">{{ workouts.length }} {{ workouts.length === 1 ? 'session' : 'sessions' }}</p>
      <p v-if="workouts.length === 0 && selectedFilter === 'all'">No sessions yet. Start a routine to log your first
        session!</p>
      <p v-else-if="workouts.length === 0">No sessions in this period.</p>
      <ul v-else class="list">
        <li v-for="workout in workouts" :key="workout.id" class="highlightCard highlightCardSecondary">
          <router-link :to="`/sessions/${workout.id}`" :class="styles.workoutLink">
            <div class="uppercase uppercase--small marginBottom1">{{ formatDateTime(workout.startedAt) }}</div>
            <h2 class="heading-m marginBottom2">
              {{ workout.routineLabel }}
            </h2>
            <div class="highlightCardContents">
              <div class="flexSpaceBetween">
                <div>
                  <div v-if="workout.durationSeconds !== undefined">{{
                      formatDuration(workout.durationSeconds)
                    }}</div>
                  <div v-else>{{ calculateDuration(workout.startedAt, workout.finishedAt) }} minutes</div>
                  <div>{{ workout.exerciseCount }} exercises</div>
                </div>
                <span v-if="workout.totalWeightKg" class="accentPrimary">{{
                    formatTotalWeight(workout.totalWeightKg)
                  }} total</span>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </template>

  </main>
</template>
