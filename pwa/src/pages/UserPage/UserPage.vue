<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { UserProfile } from 'gym-pwa-api/types';
import baseStyles from '../../styles/base-classes.module.css';
import styles from './UserPage.module.css';
import { fetchUserProfile, saveBodyWeight } from './helpers';
import {authService} from "../../lib/auth/oauth";

const route = useRoute();
const router = useRouter();
const profile = ref<UserProfile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weight = ref('');
const saving = ref(false);
const saveSuccess = ref(false);
const isFirstTimeUser = ref(false);

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
});
</script>

<template>
  <main class="main">
    <header class="header">
      <div class="flexSpaceBetween">
      <h1 v-if="profile" :class="baseStyles.heading">{{ profile.name }}</h1>
      <button @click="handleLogout" class="buttonSecondary">Logout</button>
      </div>
    </header>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
    <template v-else-if="profile">
      <form :class="styles.weightForm" @submit.prevent="handleSaveWeight">
        <label :class="styles.label" for="body-weight">Body weight (kg)</label>
        <div :class="styles.inputRow">
          <input
            id="body-weight"
            v-model="weight"
            type="number"
            step="0.01"
            min="0"
            :class="styles.weightInput"
            placeholder="e.g. 75.50"
          />
          <button
            type="submit"
            class="buttonPrimary"
            :disabled="saving || !weight"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <p v-if="saveSuccess" :class="styles.successMessage">Weight saved</p>
      </form>

    </template>
  </main>
</template>
