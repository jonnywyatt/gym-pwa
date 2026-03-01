<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary} from 'gym-pwa-api/types';
import {authService} from '../../lib/auth/oauth';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue';
import styles from './RoutinesPage.module.css';
import {
  fetchRoutines,
  fetchPreferences,
  savePreferences,
  createRoutine,
  deleteRoutineApi,
  filterRoutines,
} from './helpers';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showRecommended = ref(true);
const showDeleteDialog = ref(false);
const routineToDelete = ref<RoutineSummary | null>(null);
const creating = ref(false);

const userId = authService.getUserId();

const visibleRoutines = computed(() => {
  if (!userId) return routines.value;
  return filterRoutines(routines.value, showRecommended.value, userId);
});

async function loadData() {
  try {
    const routinesPromise = fetchRoutines();
    const prefsPromise = userId ? fetchPreferences(userId) : Promise.resolve(null);
    const [fetchedRoutines, prefs] = await Promise.all([routinesPromise, prefsPromise]);
    routines.value = fetchedRoutines;
    if (prefs) {
      showRecommended.value = prefs.showRecommendedRoutines;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load routines';
  } finally {
    loading.value = false;
  }
}

async function onShowRecommendedChange(event: Event) {
  if (!userId) return;
  const checked = (event.target as HTMLInputElement).checked;
  showRecommended.value = checked;
  try {
    await savePreferences(userId, { showRecommendedRoutines: checked });
  } catch {
    // preference save failure is non-critical
  }
}

async function onCreateRoutine() {
  creating.value = true;
  try {
    const id = await createRoutine();
    await router.push(`/routines/${id}/edit`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create routine';
  } finally {
    creating.value = false;
  }
}

function openDeleteDialog(routine: RoutineSummary) {
  routineToDelete.value = routine;
  showDeleteDialog.value = true;
}

function cancelDelete() {
  showDeleteDialog.value = false;
  routineToDelete.value = null;
}

async function confirmDelete() {
  if (!routineToDelete.value) return;
  const routineId = routineToDelete.value.id;
  try {
    await deleteRoutineApi(routineId);
    routines.value = routines.value.filter((r) => r.id !== routineId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete routine';
  } finally {
    showDeleteDialog.value = false;
    routineToDelete.value = null;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <main class="main">
    <header :class="['marginBottom6', styles.header]">
      <h1 class="heading-l">Routines</h1>
      <button
          type="button"
          class="buttonPrimary"
          :disabled="creating"
          @click="onCreateRoutine"
      >
        Create routine
      </button>
    </header>

    <label :class="['highlightCardContents', 'marginBottom6', styles.checkboxLabel]">
      <input
          type="checkbox"
          :checked="showRecommended"
          @change="onShowRecommendedChange"
      />
      Show recommended routines
    </label>

    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <p v-else-if="visibleRoutines.length === 0">No routines found.</p>
    <ul v-else class="list">
      <li
          v-for="routine in visibleRoutines"
          :key="routine.id"
          class="highlightCard marginBottom2"
      >
        <router-link :to="`/routines/${routine.id}`" :class="styles.routineLink">
          <p v-if="routine.userId === null" class="labelCaps labelCaps--small marginBottom2">Recommended</p>
          <h2 class="heading-m marginBottom2">{{ routine.label || 'Untitled routine' }}</h2>
          <div class="highlightCardContents">
            {{ routine.exerciseCount }} exercises
          </div>
        </router-link>
        <div v-if="routine.userId === userId" :class="styles.routineActions">
          <router-link :to="`/routines/${routine.id}/edit`" class="buttonSecondary">
            Edit
          </router-link>
          <button
              type="button"
              class="buttonDelete"
              :aria-label="`Delete ${routine.label || 'Untitled routine'}`"
              @click="openDeleteDialog(routine)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>

    <ConfirmDialog
        :open="showDeleteDialog"
        title="Delete routine?"
        message="This action cannot be undone."
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </main>
</template>
