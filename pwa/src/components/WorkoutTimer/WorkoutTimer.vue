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
      {{ isPaused ? '▶' : '⏸' }}
    </button>
  </div>
</template>
