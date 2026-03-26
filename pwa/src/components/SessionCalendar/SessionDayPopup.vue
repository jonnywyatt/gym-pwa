<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import styles from './SessionDayPopup.module.css';
import { formatSessionStat } from './helpers';

defineProps<{
  sessions: UserWorkoutSummary[];
}>();

const emit = defineEmits<{
  close: [];
}>();

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div :class="styles.popup" role="dialog" aria-modal="true" @click.stop>
    <button type="button" :class="styles.closeButton" aria-label="Close" @click="emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <line x1="8" y1="8" x2="16" y2="16" stroke="var(--em-surface)" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="8" x2="8" y2="16" stroke="var(--em-surface)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <ul :class="styles.sessionList">
      <li v-for="session in sessions" :key="session.id" :class="styles.sessionItem">
        <router-link :to="`/sessions/${session.id}`" :class="styles.sessionName" @click="emit('close')">
          {{ session.routineLabel }}
        </router-link>
        <span :class="styles.sessionWeight">{{ formatSessionStat(session.totalWeightKg, session.durationSeconds) }}</span>
      </li>
    </ul>
  </div>
</template>
