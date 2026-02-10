<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import baseStyles from '../../styles/base-classes.module.css';
import styles from './WorkoutPage.module.css';
import { authService } from '../../lib/auth/oauth';
import { db, updateWorkoutExercise, finishWorkout, deleteWorkout } from '../../lib/db';
import type { LocalWorkout } from '../../lib/db';
import { saveWorkout, formatStartTime, createWorkoutPayload } from './helpers';

const route = useRoute();
const router = useRouter();
const workout = ref<LocalWorkout | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const finishing = ref(false);

const startTime = computed(() => {
  if (!workout.value) return '';
  return formatStartTime(workout.value.startedAt);
});

async function loadWorkout() {
  try {
    const workoutId = String(route.params.workoutId);
    const workoutData = await db.workouts.get(workoutId);

    if (!workoutData) {
      error.value = 'Workout not found';
      return;
    }

    workout.value = workoutData;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load workout';
  } finally {
    loading.value = false;
  }
}

async function handleCheckboxChange(exerciseId: number, completed: boolean) {
  if (!workout.value) return;

  try {
    await updateWorkoutExercise(workout.value.id, exerciseId, completed);
    await loadWorkout();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update exercise';
  }
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
    const finishedAt = new Date().toISOString();
    await finishWorkout(workout.value.id, finishedAt);

    const workoutPayload = createWorkoutPayload(workout.value, finishedAt);
    await saveWorkout(userId, workoutPayload);

    await deleteWorkout(workout.value.id);
    await router.push('/workouts');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to finish workout';
  } finally {
    finishing.value = false;
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
    <template v-else-if="workout">
      <nav :class="styles.nav">
        <div :class="styles.navLeft">
          <span>Started: {{ startTime }}</span>
        </div>
        <button type="button" :disabled="finishing" @click="handleFinish">
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
          :class="styles.exerciseItem"
        >
          <div>
            <strong>{{ exercise.label }}</strong>
          </div>
          <input
            type="checkbox"
            :checked="exercise.completed"
            @change="(e) => handleCheckboxChange(exercise.id, (e.target as HTMLInputElement).checked)"
          />
        </li>
      </ul>
    </template>
  </main>
</template>
