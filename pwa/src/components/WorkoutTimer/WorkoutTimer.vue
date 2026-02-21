<script setup lang="ts">
import { computed } from 'vue';
import { formatDurationSeconds } from '../../utils/time';
import styles from './WorkoutTimer.module.css';

interface Props {
  elapsedSeconds: number;
  isPaused: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pause: [];
  resume: [];
}>();

const formattedTime = computed(() => formatDurationSeconds(props.elapsedSeconds));

function handleButtonClick() {
  if (props.isPaused) {
    emit('resume');
  } else {
    emit('pause');
  }
}
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.time">{{ formattedTime }}</div>
    <button type="button" :class="styles.button" :aria-label="isPaused ? 'Resume' : 'Pause'" @click="handleButtonClick">
      <svg v-if="isPaused" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="1em" height="1em">
        <polygon points="5,3 19,12 5,21" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="1em" height="1em">
        <rect x="5" y="3" width="4" height="18" rx="1" />
        <rect x="15" y="3" width="4" height="18" rx="1" />
      </svg>
    </button>
  </div>
</template>
