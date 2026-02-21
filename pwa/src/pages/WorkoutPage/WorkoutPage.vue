<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { UserWorkout } from 'gym-pwa-api/types';
import baseStyles from '../../styles/base-classes.module.css';
import styles from './WorkoutPage.module.css';
import { authService } from '../../lib/auth/oauth';
import { db, updateWorkoutExercises, finishWorkout, deleteWorkout, updateWorkoutTimer } from '../../lib/db';
import type { LocalWorkout, SetType } from '../../lib/db';
import WorkoutTimer from '../../components/WorkoutTimer/WorkoutTimer.vue';
import ExerciseSets from '../../components/ExerciseSets/ExerciseSets.vue';
import {
  saveWorkout,
  createWorkoutPayload,
  calculateElapsedSeconds,
  calculateFinalDurationSeconds,
  calculateWorkoutTotalWeightKg,
  calculateCompletedSetsTotalWeightKg,
  startExercise,
  createNewSet,
  fetchWorkout,
  formatSetDetails,
} from './helpers';
import {
  deleteWorkoutApi,
  formatDateTime,
  formatDuration,
  formatTotalWeight,
} from '../WorkoutsListPage/helpers';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue';

const route = useRoute();
const router = useRouter();
const mode = ref<'active' | 'summary'>('active');
const workout = ref<LocalWorkout | null>(null);
const completedWorkout = ref<UserWorkout | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const finishing = ref(false);
const elapsedSeconds = ref(0);
const isPaused = ref(false);
const showDeleteDialog = ref(false);
const deleting = ref(false);
let timerInterval: number | null = null;

const workoutTotalWeightKg = computed(() => {
  if (!workout.value) return 0;
  return calculateWorkoutTotalWeightKg(workout.value.exercisesCompleted, workout.value.bodyWeightKg);
});

function updateElapsedTime() {
  if (!workout.value) return;

  elapsedSeconds.value = calculateElapsedSeconds(
    workout.value.startedAt,
    workout.value.totalPausedSeconds || 0,
    isPaused.value,
    workout.value.pausedAt
  );
}

function startTimer() {
  if (timerInterval !== null) return;

  updateElapsedTime();
  timerInterval = window.setInterval(() => {
    updateElapsedTime();
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

async function loadWorkout() {
  try {
    const workoutId = String(route.params.workoutId);
    const workoutData = await db.workouts.get(workoutId);

    if (workoutData) {
      mode.value = 'active';
      workout.value = workoutData;
      isPaused.value = Boolean(workoutData.pausedAt);

      if (!isPaused.value) {
        startTimer();
      } else {
        updateElapsedTime();
      }
      return;
    }

    const userId = authService.getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return;
    }

    const numericWorkoutId = parseInt(workoutId, 10);
    if (Number.isNaN(numericWorkoutId)) {
      error.value = 'Workout not found';
      return;
    }

    const apiWorkout = await fetchWorkout(userId, numericWorkoutId);
    mode.value = 'summary';
    completedWorkout.value = apiWorkout;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load workout';
  } finally {
    loading.value = false;
  }
}

async function handleTimerPause() {
  if (!workout.value) return;

  try {
    const pausedAt = new Date().toISOString();
    isPaused.value = true;
    stopTimer();

    await updateWorkoutTimer(workout.value.id, {
      pausedAt,
      elapsedSeconds: elapsedSeconds.value,
    });

    workout.value.pausedAt = pausedAt;
    workout.value.elapsedSeconds = elapsedSeconds.value;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to pause timer';
  }
}

async function handleTimerResume() {
  if (!workout.value || !workout.value.pausedAt) return;

  try {
    const pausedAtTime = new Date(workout.value.pausedAt).getTime();
    const now = Date.now();
    const pauseDuration = Math.floor((now - pausedAtTime) / 1000);
    const newTotalPausedSeconds = (workout.value.totalPausedSeconds || 0) + pauseDuration;

    isPaused.value = false;

    await updateWorkoutTimer(workout.value.id, {
      pausedAt: undefined,
      totalPausedSeconds: newTotalPausedSeconds,
    });

    workout.value.pausedAt = undefined;
    workout.value.totalPausedSeconds = newTotalPausedSeconds;

    startTimer();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to resume timer';
  }
}

async function updateExercises(updatedExercises: LocalWorkout['exercisesCompleted']) {
  if (!workout.value) return;

  try {
    workout.value = { ...workout.value, exercisesCompleted: updatedExercises };
    const rawExercises = JSON.parse(JSON.stringify(toRaw(updatedExercises)));
    await updateWorkoutExercises(workout.value.id, rawExercises);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update exercise';
  }
}

function handleStartExercise(exerciseId: number) {
  if (!workout.value) return;

  const updatedExercises = workout.value.exercisesCompleted.map((ex) =>
    ex.id === exerciseId ? startExercise(ex) : ex
  );
  updateExercises(updatedExercises);
}

function handleUpdateSet(
  exerciseId: number,
  setId: string,
  updates: { weightKg?: number; reps?: number; timeSeconds?: number; completed?: boolean }
) {
  if (!workout.value) return;

  const bodyWeightKg = workout.value.bodyWeightKg;
  const updatedExercises = workout.value.exercisesCompleted.map((ex) => {
    if (ex.id !== exerciseId) return ex;

    const updatedSets = (ex.sets ?? []).map((set) =>
      set.id === setId ? { ...set, ...updates } : set
    );

    if ('completed' in updates) {
      const completed = updatedSets.some((s) => s.completed);
      return { ...ex, sets: updatedSets, completed };
    }

    return { ...ex, sets: updatedSets };
  });
  updateExercises(updatedExercises);
}

function handleAddSet(exerciseId: number) {
  if (!workout.value) return;

  const updatedExercises = workout.value.exercisesCompleted.map((ex) => {
    if (ex.id !== exerciseId) return ex;
    return {
      ...ex,
      sets: [...(ex.sets ?? []), createNewSet()],
    };
  });
  updateExercises(updatedExercises);
}

function handleChangeSetType(exerciseId: number, setId: string, setType: SetType) {
  if (!workout.value) return;

  const updatedExercises = workout.value.exercisesCompleted.map((ex) => {
    if (ex.id !== exerciseId) return ex;
    return {
      ...ex,
      sets: (ex.sets ?? []).map((set) =>
        set.id === setId ? { ...set, setType } : set
      ),
    };
  });
  updateExercises(updatedExercises);
}


async function handleFinish() {
  if (!workout.value) return;

  const userId = authService.getUserId();
  if (!userId) {
    error.value = 'User not authenticated';
    return;
  }

  finishing.value = true;
  error.value = null;

  try {
    stopTimer();

    const finishedAt = new Date().toISOString();
    const durationSeconds = calculateFinalDurationSeconds(
      workout.value.startedAt,
      finishedAt,
      workout.value.totalPausedSeconds || 0
    );

    await finishWorkout(workout.value.id, finishedAt);

    const workoutPayload = createWorkoutPayload(workout.value, finishedAt, durationSeconds);
    await saveWorkout(userId, workoutPayload);

    await deleteWorkout(workout.value.id);
    await router.push('/workouts');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to finish workout';
  } finally {
    finishing.value = false;
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
    await router.push('/workouts');
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

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <main class="main">
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>

    <!-- Active workout mode -->
    <template v-else-if="mode === 'active' && workout">
      <nav :class="styles.nav">
        <div :class="styles.navLeft">
          <WorkoutTimer
            :elapsed-seconds="elapsedSeconds"
            :is-paused="isPaused"
            @pause="handleTimerPause"
            @resume="handleTimerResume"
          />
          <span v-if="workoutTotalWeightKg > 0" :class="styles.workoutTotalWeight">
            {{ workoutTotalWeightKg }} Kg
          </span>
        </div>
        <button type="button" :disabled="finishing" @click="handleFinish" class="buttonSecondary">
          {{ finishing ? 'Finishing...' : 'Finish' }}
        </button>
      </nav>

      <header class="header">
        <h1 :class="baseStyles.heading">{{ workout.routineLabel }}</h1>
      </header>

      <ul class="list">
        <li
          v-for="exercise in workout.exercisesCompleted"
          :key="exercise.id"
        >
          <ExerciseSets
            :exercise="exercise"
            :body-weight-kg="workout.bodyWeightKg"
            @start="handleStartExercise"
            @update-set="handleUpdateSet"
            @add-set="handleAddSet"
            @change-set-type="handleChangeSetType"
          />
        </li>
      </ul>
    </template>

    <!-- Summary mode -->
    <template v-else-if="mode === 'summary' && completedWorkout">
      <header class="header">
        <h1 :class="baseStyles.heading">{{ completedWorkout.routineLabel }}</h1>
      </header>

      <div :class="styles.summaryMeta">
        <span>{{ formatDateTime(completedWorkout.startedAt) }}</span>
        <span v-if="completedWorkout.durationSeconds !== undefined">{{ formatDuration(completedWorkout.durationSeconds) }}</span>
        <span v-if="completedWorkout.bodyWeightKg">Body weight: {{ formatTotalWeight(completedWorkout.bodyWeightKg) }}</span>
        <span v-if="completedWorkout.totalWeightKg">{{ formatTotalWeight(completedWorkout.totalWeightKg) }} total</span>
      </div>

      <ul class="list">
        <li
          v-for="exercise in completedWorkout.exercisesCompleted"
          :key="exercise.id"
          :class="styles.summaryExercise"
        >
          <div :class="styles.summaryExerciseHeader">
            <strong>{{ exercise.label }}</strong>
            <span v-if="calculateCompletedSetsTotalWeightKg(exercise.recordSetsType, completedWorkout.bodyWeightKg, exercise.sets) > 0" :class="styles.summaryExerciseWeight">
              {{ formatTotalWeight(calculateCompletedSetsTotalWeightKg(exercise.recordSetsType, completedWorkout.bodyWeightKg, exercise.sets)) }}
            </span>
          </div>
          <ul :class="styles.summarySetsList">
            <li
              v-for="(set, index) in exercise.sets"
              :key="index"
              :class="styles.summarySetItem"
            >
              {{ formatSetDetails(set, exercise.recordSetsType) }}
            </li>
          </ul>
        </li>
      </ul>

      <div :class="styles.summaryActions">
        <button
          type="button"
          :class="styles.deleteButton"
          :disabled="deleting"
          @click="showDeleteDialog = true"
        >
          Delete workout
        </button>
      </div>

      <ConfirmDialog
        :open="showDeleteDialog"
        title="Delete workout?"
        message="This action cannot be undone."
        @confirm="handleDeleteWorkout"
        @cancel="showDeleteDialog = false"
      />
    </template>
  </main>
</template>
