<script setup lang="ts">
import {ref, computed, onMounted, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {Exercise} from 'gym-pwa-api/types';
import styles from './EditRoutinePage.module.css';
import {
  fetchRoutineDetail,
  searchExercises,
  saveRoutineLabel,
  addExercise,
  removeExercise,
} from './helpers';
import DeleteIconButton from '../../components/DeleteIconButton/DeleteIconButton.vue';

const route = useRoute();
const router = useRouter();

const routineId = route.params.routineId;

const routineName = ref('');
const nameInput = ref<HTMLInputElement | null>(null);
const exercises = ref<Exercise[]>([]);
const searchQuery = ref('');
const searchResults = ref<Exercise[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchActive = computed(() => searchQuery.value.trim().length > 0);

async function loadRoutine() {
  try {
    const routine = await fetchRoutineDetail(routineId);
    routineName.value = routine.label ?? '';
    exercises.value = routine.exercises;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load routine';
  } finally {
    loading.value = false;
    await nextTick();
    nameInput.value?.focus();
  }
}

async function onNameBlur() {
  try {
    await saveRoutineLabel(routineId, routineName.value);
  } catch {
    // name save failure is non-critical, will retry on next blur
  }
}

async function onSearchInput() {
  const query = searchQuery.value.trim();
  if (!query) {
    searchResults.value = [];
    return;
  }
  try {
    const results = await searchExercises(query);
    searchResults.value = results.filter(
      (r) => !exercises.value.some((e) => e.id === r.id)
    );
  } catch {
    searchResults.value = [];
  }
}

async function onAddExercise(exercise: Exercise) {
  try {
    await addExercise(routineId, exercise.id);
    exercises.value = [...exercises.value, exercise];
    searchResults.value = searchResults.value.filter((r) => r.id !== exercise.id);
    searchQuery.value = '';
    searchResults.value = [];
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to add exercise';
  }
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
}

async function onRemoveExercise(exerciseId: number) {
  try {
    await removeExercise(routineId, exerciseId);
    exercises.value = exercises.value.filter((e) => e.id !== exerciseId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to remove exercise';
  }
}

async function onFinish() {
  await router.push(`/routines/${routineId}`);
}

onMounted(() => {
  loadRoutine();
});
</script>

<template>
  <main class="main">
    <header class="marginBottom6 flexSpaceBetween flexGap3Units">
      <input
          v-if="!loading"
          ref="nameInput"
          v-model="routineName"
          type="text"
          placeholder="New routine name"
          :class="['heading-l', 'inputInline', styles.nameInput]"
          @blur="onNameBlur"
      />
      <button
          v-if="exercises.length > 0 && routineName.trim().length > 0"
          type="button"
          class="buttonPrimary"
          @click="onFinish"
      >
        Finish
      </button>
    </header>

    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else>
      <div :class="['marginBottom6', styles.searchWrapper]">
        <input
            v-model="searchQuery"
            type="search"
            placeholder="Search exercises to add..."
            class="inputSearch"
            @input="onSearchInput"
        />
        <div
            v-if="searchActive"
            :class="styles.searchBackdrop"
            data-testid="search-backdrop"
            @click="clearSearch"
        />
        <ul
            v-if="searchActive"
            :class="['list', 'flexVerticalColumn', styles.searchResultsPanel]"
        >
          <li v-if="searchResults.length === 0" class="highlightCard highlightCardContents">
            No exercises found
          </li>
          <li
              v-for="result in searchResults"
              :key="result.id"
              class="highlightCard"
          >
            <button
                type="button"
                :class="[styles.searchResultButton, 'flexVerticalColumn', 'flexGap1Unit']"
                @click="onAddExercise(result)"
            >
              <div class="heading-s">{{ result.label }}</div>
              <div class="highlightCardContents">
                <div>{{ result.primaryMuscleGroups.join(', ') }}</div>
                <div v-if="result.secondaryMuscleGroups.length > 0">Secondary muscle groups: {{ result.secondaryMuscleGroups.join(', ') }}</div>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <p v-if="exercises.length === 0" class="highlightCardContents">
        No exercises yet. Search above to add exercises to this routine.
      </p>
      <ul v-else class="list">
        <li
            v-for="exercise in exercises"
            :key="exercise.id"
            class="flexSpaceBetween flexGap2Units"
        >
          <div :class="['highlightCard', 'marginBottom2', styles.exerciseCard]">
            <div class="heading-s">{{ exercise.label }}</div>
            <div class="highlightCardContents">
              <div>Primary groups: {{ exercise.primaryMuscleGroups.join(', ') }}</div>
              <div v-if="exercise.secondaryMuscleGroups.length > 0">Secondary groups: {{ exercise.secondaryMuscleGroups.join(', ') }}</div>
            </div>
          </div>
          <DeleteIconButton
              :label="`Remove ${exercise.label}`"
              confirm-title="Remove exercise?"
              confirm-message="This action cannot be undone."
              @confirm="onRemoveExercise(exercise.id)"
          />
        </li>
      </ul>
    </template>
  </main>
</template>
