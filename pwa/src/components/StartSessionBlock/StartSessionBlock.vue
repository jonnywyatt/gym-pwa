<script setup lang="ts">
import type {RoutineSummary} from 'gym-pwa-api/types';
import styles from './StartSessionBlock.module.css';

const props = defineProps<{
  routines: RoutineSummary[];
  loading: boolean;
  error: string | null;
  startingRoutineId: number | null;
}>();

const emit = defineEmits<{
  startSession: [routineId: number];
}>();
</script>

<template>
  <p v-if="props.loading" :class="styles.loading">Loading...</p>
  <p v-else-if="props.error" :class="styles.error">Error: {{ props.error }}</p>
  <div v-else :class="styles.routineList">
    <button
      v-for="routine in props.routines"
      :key="routine.id"
      class="highlightCard"
      type="button"
      :class="props.startingRoutineId === routine.id ? styles.routineButtonLoading : ''"
      :disabled="props.startingRoutineId !== null"
      @click="emit('startSession', routine.id)"
    >
      <span class="heading-m">{{ routine.label }}</span>
    </button>
  </div>
</template>
