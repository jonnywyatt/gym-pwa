<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {UserWorkout} from 'gym-pwa-api/types';
import styles from './SessionSummaryPage.module.css';
import {authService} from '../../lib/auth/oauth';
import {
  calculateCompletedSetsTotalWeightKg,
  fetchWorkout,
  formatSetDetails,
} from '../WorkoutPage/helpers';
import {
  deleteWorkoutApi,
  formatDateTime,
  formatDuration,
  formatTotalWeight,
} from '../WorkoutsListPage/helpers';
import { toMuscleGroupBreakdown } from './helpers';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue';
import MuscleGroupBreakdown from '../../components/MuscleGroupBreakdown/MuscleGroupBreakdown.vue';

const route = useRoute();
const router = useRouter();
const completedWorkout = ref<UserWorkout | null>(null);

const muscleGroupBreakdown = computed(() =>
  completedWorkout.value ? toMuscleGroupBreakdown(completedWorkout.value.muscleGroupStats) : { muscleGroups: [], bodyAreas: [] }
);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteDialog = ref(false);
const deleting = ref(false);

async function loadWorkout() {
  try {
    const userId = authService.getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return;
    }

    const workoutId = parseInt(String(route.params.workoutId), 10);
    if (Number.isNaN(workoutId)) {
      error.value = 'Workout not found';
      return;
    }

    completedWorkout.value = await fetchWorkout(userId, workoutId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load workout';
  } finally {
    loading.value = false;
  }
}

async function handleDeleteWorkout() {
  if (!completedWorkout.value) return;

  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    return;
  }

  deleting.value = true;
  error.value = null;

  try {
    await deleteWorkoutApi(userId, completedWorkout.value.id);
    await router.push('/sessions');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete workout';
  } finally {
    deleting.value = false;
    showDeleteDialog.value = false;
  }
}

onMounted(() => {
  loadWorkout();
});
</script>

<template>
  <main class="main">
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>

    <template v-else-if="completedWorkout">
      <header class="header marginBottom4">
        <div class="uppercase marginBottom1">{{ formatDateTime(completedWorkout.startedAt) }}</div>
        <h1 class="heading-l">{{ completedWorkout.routineLabel }} session</h1>
      </header>

      <div :class="styles.metaRow" class="marginBottom1">
        <span class="accentPrimary" v-if="completedWorkout.totalWeightKg">{{ formatTotalWeight(completedWorkout.totalWeightKg) }}</span>
        <span v-if="completedWorkout.totalWeightKg && completedWorkout.durationSeconds !== undefined" :class="styles.metaRowDivider">|</span>
        <span v-if="completedWorkout.durationSeconds !== undefined">{{ formatDuration(completedWorkout.durationSeconds) }}</span>
      </div>

      <MuscleGroupBreakdown :breakdown="muscleGroupBreakdown" class="marginBottom3" />

      <ul class="list marginTop2">
        <li
            v-for="exercise in completedWorkout.exercisesCompleted"
            :key="exercise.id"
            class="highlightCard"
        >
          <h2 class="heading-m marginBottom1">{{ exercise.label }}</h2>
          <div class="highlightCardContents">
            <span
                v-if="calculateCompletedSetsTotalWeightKg(exercise.recordSetsType, completedWorkout.bodyWeightKg, exercise.sets) > 0"
                class="accentPrimary">
              {{
                formatTotalWeight(calculateCompletedSetsTotalWeightKg(exercise.recordSetsType, completedWorkout.bodyWeightKg, exercise.sets))
              }}
            </span>
            <span
                v-for="(set, index) in exercise.sets"
                :key="index"
            >
              {{ formatSetDetails(set, exercise.recordSetsType) }}
            </span>
          </div>
        </li>
      </ul>

      <div :class="styles.summaryActions">
        <button
            type="button"
            class="buttonDelete"
            :disabled="deleting"
            @click="showDeleteDialog = true"
        >
          Delete session
        </button>
      </div>

      <ConfirmDialog
          :open="showDeleteDialog"
          title="Delete session?"
          message="This action cannot be undone."
          @confirm="handleDeleteWorkout"
          @cancel="showDeleteDialog = false"
      />
    </template>
  </main>
</template>
