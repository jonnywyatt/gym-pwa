<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { BodyWeightEntry, UserProfile } from 'gym-pwa-api/types';
import styles from './UserPage.module.css';
import {
  buildBodyWeightChartData,
  buildBodyWeightChartOptions,
  fetchBodyWeightHistory,
  fetchUserProfile,
  saveBodyWeight,
} from './helpers';
import {authService} from "../../lib/auth/oauth";

const LazyLineChart = defineAsyncComponent(() => import('../SessionTrendsPage/LazyLineChart.vue'));

const route = useRoute();
const router = useRouter();
const profile = ref<UserProfile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weight = ref('');
const saving = ref(false);
const saveSuccess = ref(false);
const isFirstTimeUser = ref(false);
const bodyWeightHistory = ref<BodyWeightEntry[]>([]);

async function loadProfile() {
  try {
    profile.value = await fetchUserProfile(route.params.userId);
    if (profile.value.latestBodyWeight) {
      weight.value = String(profile.value.latestBodyWeight.weightKg);
    } else {
      isFirstTimeUser.value = true;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch profile';
  } finally {
    loading.value = false;
  }
}

async function loadBodyWeightHistory() {
  try {
    bodyWeightHistory.value = await fetchBodyWeightHistory(route.params.userId);
  } catch {
    bodyWeightHistory.value = [];
  }
}

async function handleSaveWeight() {
  const weightNum = parseFloat(weight.value);
  if (Number.isNaN(weightNum) || weightNum <= 0) {
    return;
  }

  saving.value = true;
  saveSuccess.value = false;

  try {
    await saveBodyWeight(route.params.userId, weightNum);
    saveSuccess.value = true;
    await loadBodyWeightHistory();

    // Redirect first-time users to home page after saving
    if (isFirstTimeUser.value) {
      router.push('/routines');
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save weight';
  } finally {
    saving.value = false;
  }
}

function handleLogout() {
  authService.logout();
  router.replace('/login');
}

onMounted(() => {
  loadProfile();
  loadBodyWeightHistory();
});
</script>

<template>
  <main class="main">
    <header class="flexSpaceBetween marginBottom4">
      <h1 class="heading-l">{{ profile?.name }}</h1>
      <button @click="handleLogout" class="buttonSecondary">Logout</button>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else-if="profile">
      <h2 class="heading-m marginBottom2">{{ isFirstTimeUser ? 'Body weight' : 'Update bodyweight' }}</h2>
      <form :class="styles.weightForm" @submit.prevent="handleSaveWeight">
        <div v-if="isFirstTimeUser" class="textSecondary textSecondary--small marginBottom4">Your bodyweight will be used to calculate the weight moved for some exercises eg tricep dips, pull up.</div>
        <label class="visuallyHidden" for="body-weight">{{ isFirstTimeUser ? 'Body weight' : 'Update bodyweight' }}</label>
        <div class="flexVerticalCenter flexGap4Units">
          <div class="flexVerticalCenter flexGap1Unit">
          <input
            id="body-weight"
            v-model="weight"
            type="number"
            step="0.01"
            min="0"
            :class="['inputBordered', styles.weightInput]"
          />
          <span>kg</span>
        </div>
          <button
            type="submit"
            class="buttonPrimary buttonPrimary--large"
            :disabled="saving || !weight"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <p v-if="saveSuccess" :class="styles.successMessage">Weight saved</p>
      </form>

      <div v-if="bodyWeightHistory.length >= 2" data-testid="bodyweight-chart" :class="styles.chartWrapper">
        <LazyLineChart
          :data="buildBodyWeightChartData(bodyWeightHistory)"
          :options="buildBodyWeightChartOptions()"
        />
      </div>
    </template>
  </main>
</template>
