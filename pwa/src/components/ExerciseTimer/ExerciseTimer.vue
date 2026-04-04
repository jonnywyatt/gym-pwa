<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import styles from './ExerciseTimer.module.css';
import { formatElapsed } from './helpers';

const props = defineProps<{
  open: boolean;
  exerciseLabel: string;
}>();

const emit = defineEmits<{
  finish: [timeSeconds: number];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const elapsed = ref(0);
const running = ref(false);
const intervalId = ref<ReturnType<typeof setInterval> | null>(null);
const animating = ref(false);
const animatingPlay = ref(false);

onMounted(() => {
  if (props.open && dialogRef.value) {
    dialogRef.value.showModal();
  }
});

watch(
  () => props.open,
  (isOpen) => {
    if (!dialogRef.value) return;
    if (isOpen) {
      elapsed.value = 0;
      running.value = false;
      animating.value = false;
      dialogRef.value.showModal();
    } else {
      stopInterval();
      dialogRef.value.close();
    }
  }
);

function stopInterval() {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

function togglePlayPause() {
  const wasRunning = running.value;
  animating.value = false;
  requestAnimationFrame(() => {
    animating.value = true;
    animatingPlay.value = !wasRunning;
  });

  if (running.value) {
    stopInterval();
    running.value = false;
  } else {
    running.value = true;
    intervalId.value = setInterval(() => {
      elapsed.value += 1;
    }, 1000);
  }
}

function handleFinish() {
  stopInterval();
  emit('finish', elapsed.value);
}

function handleAnimationEnd() {
  animating.value = false;
}

onUnmounted(() => {
  stopInterval();
});
</script>

<template>
  <dialog ref="dialogRef" :class="styles.dialog" @cancel.prevent="handleFinish">
    <div :class="styles.circle">
      <p :class="styles.title">{{ exerciseLabel }}</p>
      <div v-if="animating" :class="styles.animationOverlay" aria-hidden="true">
        <svg
          v-if="animatingPlay"
          :class="styles.popIcon"
          viewBox="0 0 24 24"
          fill="currentColor"
          @animationend="handleAnimationEnd"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <svg
          v-else
          :class="styles.popIcon"
          viewBox="0 0 24 24"
          fill="currentColor"
          @animationend="handleAnimationEnd"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      </div>

      <span :class="styles.timerDisplay" aria-live="polite" aria-label="Elapsed time">
        {{ formatElapsed(elapsed) }}
      </span>

      <div :class="styles.iconButtons">
        <button
          type="button"
          :class="styles.playPauseButton"
          :aria-label="running ? 'Pause timer' : 'Start timer'"
          @click="togglePlayPause"
        >
          <svg
            v-if="!running"
            :class="styles.playPauseIcon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <svg
            v-else
            :class="styles.playPauseIcon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </button>

        <button
          type="button"
          :class="styles.iconButton"
          aria-label="Finish"
          @click="handleFinish"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      </div>
    </div>
  </dialog>
</template>
