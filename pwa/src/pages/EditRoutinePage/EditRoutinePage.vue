<script setup lang="ts">
import {ref, computed, onMounted, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {Exercise} from 'gym-pwa-api/types';
import styles from './EditRoutinePage.module.css';
import {
  fetchRoutineDetail,
  fetchAllExercises,
  filterExercises,
  saveRoutineLabel,
  addExercise,
  removeExercise,
} from './helpers';
import DeleteIconButton from '../../components/DeleteIconButton/DeleteIconButton.vue';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator.vue';
import MuscleGroupModal from '../../components/MuscleGroupModal/MuscleGroupModal.vue';
import {getBodyAreasForExercise} from '../../utils/muscleGroups';

const route = useRoute();
const router = useRouter();

const routineId = route.params.routineId;

const routineName = ref('');
const nameInput = ref<HTMLInputElement | null>(null);
const exercises = ref<Exercise[]>([]);
const allExercises = ref<Exercise[]>([]);
const searchQuery = ref('');
const loading = ref(true);
const exercisesLoading = ref(true);
const error = ref<string | null>(null);
const addingExercise = ref<Exercise | null>(null);
const showMuscleGroupModal = ref(false);
const selectedExercise = ref<Exercise | null>(null);
const searchActive = computed(() => searchQuery.value.trim().length > 0);
const MIN_SEARCH_LENGTH = 2;
const canSearch = computed(() => searchQuery.value.trim().length >= MIN_SEARCH_LENGTH);
const searchResults = computed(() =>
  canSearch.value
    ? filterExercises(allExercises.value, searchQuery.value).filter(
        (r) => !exercises.value.some((e) => e.id === r.id)
      )
    : []
);

async function loadRoutine() {
  try {
    const routine = await fetchRoutineDetail(routineId);
    routineName.value = routine.label ?? '';
    exercises.value = routine.exercises;
  } catch {
    error.value = 'Exercises didn\'t load - please refresh the page';
  } finally {
    loading.value = false;
    await nextTick();
    nameInput.value?.focus();
  }

  try {
    allExercises.value = await fetchAllExercises();
  } catch {
    error.value = 'Exercises didn\'t load - please refresh the page';
  } finally {
    exercisesLoading.value = false;
  }
}

async function onNameBlur() {
  try {
    await saveRoutineLabel(routineId, routineName.value);
  } catch {
    // name save failure is non-critical, will retry on next blur
  }
}


async function onAddExercise(exercise: Exercise) {
  addingExercise.value = exercise;
  try {
    await addExercise(routineId, exercise.id);
    exercises.value = [...exercises.value, exercise];
    searchQuery.value = '';
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to add exercise';
  } finally {
    addingExercise.value = null;
  }
}

function clearSearch() {
  searchQuery.value = '';
}

async function onRemoveExercise(exerciseId: number) {
  try {
    await removeExercise(routineId, exerciseId);
    exercises.value = exercises.value.filter((e) => e.id !== exerciseId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to remove exercise';
  }
}

function openMuscleGroupModal(exercise: Exercise) {
  selectedExercise.value = exercise;
  showMuscleGroupModal.value = true;
}

function closeMuscleGroupModal() {
  showMuscleGroupModal.value = false;
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
    <p v-else-if="error" class="error">{{ error }}</p>
    <template v-else>
      <div :class="['marginBottom6', styles.searchWrapper]">
        <input
            :value="searchQuery"
            type="search"
            placeholder="Search exercises to add..."
            class="inputSearch"
            @input="searchQuery = ($event.target as HTMLInputElement).value"
            @search="searchQuery = ($event.target as HTMLInputElement).value"
        />
        <div
            v-if="searchActive"
            :class="styles.searchBackdrop"
            data-testid="search-backdrop"
            @click="clearSearch"
        />
        <div
            v-if="canSearch && exercisesLoading"
            :class="styles.searchLoadingOverlay"
            data-testid="search-loading-overlay"
        >
          <LoadingIndicator :size="20" />
          <span>Searching</span>
        </div>
        <ul
            v-if="canSearch && !exercisesLoading"
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
              <p class="bodyAreaList">
                <template v-for="(area, i) in getBodyAreasForExercise(result.primaryMuscleGroups, result.secondaryMuscleGroups, result.tertiaryMuscleGroups)" :key="area">
                  <span v-if="i > 0" class="pipeSeparator">|</span>{{ area }}
                </template>
              </p>
            </button>
          </li>
        </ul>
      </div>

      <div v-if="exercises.length === 0" >
        <p class="marginBottom2">No exercises yet.</p>
        <p>Search above to add exercises to this routine.</p>
      </div>
      <ul v-else class="list">
        <li
            v-for="exercise in exercises"
            :key="exercise.id"
            class="flexSpaceBetween flexGap2Units"
        >
          <button
              type="button"
              :class="['highlightCard', 'highlightCardButton', 'marginBottom2', styles.exerciseCard]"
              @click="openMuscleGroupModal(exercise)"
          >
            <div class="heading-s">{{ exercise.label }}</div>
            <p class="bodyAreaList">
              <template v-for="(area, i) in getBodyAreasForExercise(exercise.primaryMuscleGroups, exercise.secondaryMuscleGroups, exercise.tertiaryMuscleGroups)" :key="area">
                <span v-if="i > 0" class="pipeSeparator">|</span>{{ area }}
              </template>
            </p>
          </button>
          <DeleteIconButton
              :label="`Remove ${exercise.label}`"
              confirm-title="Remove exercise?"
              confirm-message="This action cannot be undone."
              @confirm="onRemoveExercise(exercise.id)"
          />
        </li>
      </ul>
    </template>
    <div v-if="addingExercise" :class="styles.addingOverlay">
      <LoadingIndicator :size="32" />
      <span>Adding {{ addingExercise.label }}</span>
    </div>

    <MuscleGroupModal
        v-if="selectedExercise"
        :open="showMuscleGroupModal"
        :exercise-label="selectedExercise.label"
        :primary-muscle-groups="selectedExercise.primaryMuscleGroups"
        :secondary-muscle-groups="selectedExercise.secondaryMuscleGroups"
        :tertiary-muscle-groups="selectedExercise.tertiaryMuscleGroups"
        @close="closeMuscleGroupModal"
    />
  </main>
</template>
