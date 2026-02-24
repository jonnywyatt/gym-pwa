<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type {UserWorkout} from 'gym-pwa-api/types';
import baseStyles from '../../styles/base-classes.module.css';
import styles from './WorkoutsListPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {
  fetchWorkouts,
  deleteWorkoutApi,
  calculateDuration,
  formatDateTime,
  formatDuration,
  formatTotalWeight
} from './helpers';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue';

const workouts = ref<UserWorkout[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteDialog = ref(false);
const workoutToDelete = ref<UserWorkout | null>(null);

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

function openDeleteDialog(workout: UserWorkout) {
  workoutToDelete.value = workout;
  showDeleteDialog.value = true;
}

function cancelDelete() {
  showDeleteDialog.value = false;
  workoutToDelete.value = null;
}

async function confirmDelete() {
  if (!workoutToDelete.value) return;

  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    return;
  }

  const workoutId = workoutToDelete.value.id;

  try {
    await deleteWorkoutApi(userId, workoutId);
    workouts.value = workouts.value.filter((w) => w.id !== workoutId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete workout';
  } finally {
    showDeleteDialog.value = false;
    workoutToDelete.value = null;
  }
}

onMounted(() => {
  loadWorkouts();
});
</script>

<template>
  <main class="main">
    <header class="header marginBottom6">
      <h1 class="heading-l">Workouts</h1>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else>
      <p v-if="workouts.length === 0">No workouts yet. Start a routine to log your first workout!</p>
      <ul v-else class="list">
        <li v-for="workout in workouts" :key="workout.id" class="highlightCard marginBottom4">
          <div :class="styles.workoutRow">
            <router-link :to="`/workouts/${workout.id}`" :class="styles.workoutLink">
              <h2 class="heading-m marginBottom2">
               {{ workout.routineLabel }}
              </h2>
              <div class="flexVerticalColumn flexGap1Unit">
                <div class="highlightCardContents">
                  <span>{{ formatDateTime(workout.startedAt) }}</span>
                </div>
                <div class="highlightCardContents">
                  <span v-if="workout.durationSeconds !== undefined">{{
                      formatDuration(workout.durationSeconds)
                    }}</span>
                  <span v-else>{{ calculateDuration(workout.startedAt, workout.finishedAt) }} minutes</span>
                </div>
                <div class="highlightCardContents">
                  <span>{{ workout.exercisesCompleted.length }} exercises</span>
                </div>
                <div class="highlightCardContents">
                  <span v-if="workout.totalWeightKg" class="accentPrimary">{{
                      formatTotalWeight(workout.totalWeightKg)
                    }} total</span>
                </div>
              </div>
            </router-link>
            <button
                type="button"
                :class="styles.deleteButton"
                :aria-label="`Delete ${workout.routineLabel}`"
                @click="openDeleteDialog(workout)"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </template>

    <ConfirmDialog
        :open="showDeleteDialog"
        title="Delete workout?"
        message="This action cannot be undone."
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </main>
</template>
