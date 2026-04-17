<template>
  <svg
      :width="size"
      :height="size"
      viewBox="0 0 17 16.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
  >
    <path d="M2.85714 0L4 0L1.14286 16.5H0L2.85714 0Z" :class="styles.bar1"/>
    <path d="M5.85714 0H9L6.14286 16.5H3L5.85714 0Z" :class="styles.bar2"/>
    <path d="M10.8571 0L17 0L14.1429 16.5H8L10.8571 0Z" :class="styles.bar3"/>
  </svg>
</template>

<script setup lang="ts">
import styles from './LoadingIndicator.module.css';

withDefaults(defineProps<{ size?: number }>(), { size: 20 });
</script>
