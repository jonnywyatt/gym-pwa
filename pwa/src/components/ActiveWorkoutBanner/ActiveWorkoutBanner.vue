<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '../../lib/auth/oauth';
import { getActiveWorkout, type LocalWorkout } from '../../lib/db';
import styles from './ActiveWorkoutBanner.module.css';

const route = useRoute();
const router = useRouter();
const activeWorkout = ref<LocalWorkout | null>(null);

const hiddenRoutes = ['login', 'auth-callback', 'workout-detail'];
const showBanner = computed(
  () => activeWorkout.value !== null && !hiddenRoutes.includes(route.name as string)
);

async function checkActiveWorkout() {
  const userId = authService.getUserId();
  if (!userId) {
    activeWorkout.value = null;
    return;
  }
  activeWorkout.value = (await getActiveWorkout(userId)) ?? null;
}

async function handleContinue() {
  if (!activeWorkout.value) return;
  await router.push(`/sessions/${activeWorkout.value.id}`);
}

watch(() => route.name, checkActiveWorkout, { immediate: true });
</script>

<template>
  <div v-if="showBanner" :class="styles.banner">
    <div :class="styles.inner">
      <span>In-progress session: {{ activeWorkout?.routineLabel }}</span>
      <button type="button" class="buttonPrimary" @click="handleContinue">Continue</button>
    </div>
  </div>
</template>
