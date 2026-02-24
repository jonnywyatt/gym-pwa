<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { canInstall, initInstallPromptListener, promptInstall } from './InstallPrompt.helpers';
import styles from './InstallPrompt.module.css';

const isVisible = ref(false);

onMounted(() => {
  initInstallPromptListener();
  isVisible.value = canInstall();

  window.addEventListener('beforeinstallprompt', () => {
    isVisible.value = true;
  });
});

async function handleInstall(): Promise<void> {
  await promptInstall();
  isVisible.value = false;
}
</script>

<template>
  <div v-if="isVisible" :class="styles.container">
    <button class="buttonSecondary" @click="handleInstall">Add to home screen</button>
  </div>
</template>
