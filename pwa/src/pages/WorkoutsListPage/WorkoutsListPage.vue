<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { UserWorkout } from 'gym-pwa-api/types';
import baseStyles from '../../styles/base-classes.module.css';
import styles from './WorkoutsListPage.module.css';
import { authService } from '../../lib/auth/oauth';
import { fetchWorkouts, calculateDuration, formatDate, formatTime, formatDuration, formatTotalWeight } from './helpers';

const workouts = ref<UserWorkout[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadWorkouts() {
  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    loading.value = false;
    return;
  }

  try {
    workouts.value = await fetchWorkouts(userId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch workouts';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadWorkouts();
});
</script>

<template>
  <main class="main">
    <header class="header">
      <h1 :class="baseStyles.heading">Workouts</h1>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else>
      <p v-if="workouts.length === 0">No workouts yet. Start a routine to log your first workout!</p>
      <ul v-else class="list">
        <li v-for="workout in workouts" :key="workout.id" :class="styles.workoutItem">
          <div :class="styles.workoutHeader">
            <strong>{{ workout.routineLabel }}</strong>
          </div>
          <div :class="styles.workoutMeta">
            <span>{{ formatDate(workout.startedAt) }} at {{ formatTime(workout.startedAt) }}</span>
            <span v-if="workout.durationSeconds !== undefined">{{ formatDuration(workout.durationSeconds) }}</span>
            <span v-else>{{ calculateDuration(workout.startedAt, workout.finishedAt) }} minutes</span>
            <span>{{ workout.exercisesCompleted.length }} exercises</span>
            <span v-if="workout.totalWeightKg">{{ formatTotalWeight(workout.totalWeightKg) }} total</span>
          </div>
        </li>
      </ul>
    </template>
  </main>
</template>
