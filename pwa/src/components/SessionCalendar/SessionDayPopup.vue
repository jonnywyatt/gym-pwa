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
  <div :class="styles.backdrop" @click="emit('close')">
    <div :class="styles.popup" role="dialog" aria-modal="true" @click.stop>
      <ul :class="styles.sessionList">
        <li v-for="session in sessions" :key="session.id" :class="styles.sessionItem">
          <router-link :to="`/sessions/${session.id}`" :class="styles.sessionName" @click="emit('close')">
            {{ session.routineLabel }}
          </router-link>
          <span :class="styles.sessionWeight">{{ formatSessionStat(session.totalWeightKg, session.durationSeconds) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
