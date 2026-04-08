<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, toRaw} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import styles from './WorkoutPage.module.css';
import {db, updateWorkoutExercises, finishWorkout, deleteWorkout, updateWorkoutTimer} from '../../lib/db';
import type {LocalWorkout, SetType} from '../../lib/db';
import {authService} from '../../lib/auth/oauth';
import WorkoutTimer from '../../components/WorkoutTimer/WorkoutTimer.vue';
import ExerciseSets from '../../components/ExerciseSets/ExerciseSets.vue';
import MuscleGroupBreakdown from '../../components/MuscleGroupBreakdown/MuscleGroupBreakdown.vue';
import WeightKg from '../../components/WeightKg/WeightKg.vue';
import {
  saveWorkout,
  createWorkoutPayload,
  calculateElapsedSeconds,
  calculateFinalDurationSeconds,
  calculateWorkoutTotalWeightKg,
  calculateMuscleGroupBreakdown,
  startExercise,
  createNewSet,
  isSetFilledIn,
} from './helpers';

const route = useRoute();
const router = useRouter();
const workout = ref<LocalWorkout | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const finishing = ref(false);
const elapsedSeconds = ref(0);
const isPaused = ref(false);
let timerInterval: number | null = null;

const workoutTotalWeightKg = computed(() => {
  if (!workout.value) return 0;
  return calculateWorkoutTotalWeightKg(workout.value.exercisesCompleted, workout.value.bodyWeightKg);
});

const muscleGroupBreakdown = computed(() => {
  if (!workout.value) return { muscleGroups: [], bodyAreas: [] };
  return calculateMuscleGroupBreakdown(workout.value.exercisesCompleted);
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

    if (!workoutData) {
      error.value = 'Workout not found';
      return;
    }

    workout.value = workoutData;
    isPaused.value = Boolean(workoutData.pausedAt);

    if (!isPaused.value) {
      startTimer();
    } else {
      updateElapsedTime();
    }
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
    workout.value = {...workout.value, exercisesCompleted: updatedExercises};
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
    updates: { weightKg?: number; reps?: number; timeSeconds?: number }
) {
  if (!workout.value) return;

  const updatedExercises = workout.value.exercisesCompleted.map((ex) => {
    if (ex.id !== exerciseId) return ex;

    const updatedSets = (ex.sets ?? []).map((set) =>
        set.id === setId ? {...set, ...updates} : set
    );

    const completed = updatedSets.some((s) => isSetFilledIn(s, ex.recordSetsType));
    return {...ex, sets: updatedSets, completed};
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
          set.id === setId ? {...set, setType} : set
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
    await router.push('/sessions');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to finish workout';
  } finally {
    finishing.value = false;
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

    <template v-else-if="workout">
      <header class="marginTop4 marginBottom4">
        <h1 class="heading-l">{{ workout.routineLabel }} session</h1>
      </header>

      <nav :class="styles.nav">
        <div :class="styles.navLeft">
          <WorkoutTimer
              :elapsed-seconds="elapsedSeconds"
              :is-paused="isPaused"
              @pause="handleTimerPause"
              @resume="handleTimerResume"
          />
          <span v-if="workoutTotalWeightKg > 0" :class="styles.workoutTotalWeight"><WeightKg :kg="workoutTotalWeightKg" /></span>
        </div>
        <button type="button" :disabled="finishing" @click="handleFinish" class="buttonSecondary">
          {{ finishing ? 'Saving...' : 'Finish' }}
        </button>
      </nav>

      <MuscleGroupBreakdown :breakdown="muscleGroupBreakdown" />

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
  </main>
</template>
