<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import type {RoutineSummary} from 'gym-pwa-api/types';
import {authService} from '../../lib/auth/oauth';
import styles from './RoutinesPage.module.css';
import {
  fetchRoutines,
  fetchPreferences,
  savePreferences,
  createRoutine,
  filterRoutines,
} from './helpers';

const router = useRouter();
const routines = ref<RoutineSummary[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showRecommended = ref(true);
const creating = ref(false);

const userId = authService.getUserId();

const visibleRoutines = computed(() => {
  if (!userId) return routines.value;
  return filterRoutines(routines.value, showRecommended.value, userId);
});

async function loadData() {
  try {
    routines.value = await fetchRoutines();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load routines';
  } finally {
    loading.value = false;
  }

  if (userId) {
    try {
      const prefs = await fetchPreferences(userId);
      showRecommended.value = prefs.showRecommendedRoutines;
    } catch {
      // preference fetch failure is non-critical
    }
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

    <label :class="[ 'marginBottom6', styles.checkboxLabel]">
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
          class="highlightCard"
      >
        <router-link :to="`/routines/${routine.id}`" :class="styles.routineLink">
          <p v-if="routine.userId === null" class="labelCaps labelCaps--small marginBottom2">Recommended</p>
          <h2 class="heading-m marginBottom2">{{ routine.label || 'Untitled routine' }}</h2>
          <div class="highlightCardContents">
            {{ routine.exerciseCount }} exercises
          </div>
        </router-link>
      </li>
    </ul>

  </main>
</template>
