<script setup lang="ts">
import styles from './BaseModalActions.module.css';
</script>

<template>
  <div :class="styles.actions">
    <slot />
  </div>
</template>
