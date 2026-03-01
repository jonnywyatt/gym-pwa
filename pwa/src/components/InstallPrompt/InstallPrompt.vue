<script setup lang="ts">
import { onMounted, ref } from 'vue';
import shareIcon from '../../assets/ios-share.svg';
import { canInstall, initInstallPromptListener, isIos, promptInstall } from './InstallPrompt.helpers';
import styles from './InstallPrompt.module.css';

const isVisible = ref(false);
const isIosDevice = ref(false);
const showIosInstructions = ref(false);

onMounted(() => {
  initInstallPromptListener();
  isVisible.value = canInstall();
  isIosDevice.value = isIos();

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
    <button class="buttonSecondary" @click="handleInstall">Add Duro to your home screen</button>
  </div>
  <div v-else-if="isIosDevice" :class="styles.container">
    <button class="buttonSecondary" @click="showIosInstructions = true">Add Duro to your iPhone home screen</button>
  </div>
  <div
    v-if="showIosInstructions"
    :class="styles.overlay"
    @click.self="showIosInstructions = false"
  >
    <div :class="styles.instructionsPanel">
      <h2 :class="styles.instructionsTitle">Add Duro to your iPhone Home Screen</h2>
      <ol :class="styles.instructionsList">
        <li>
          Tap the
          <img :src="shareIcon" :class="styles.shareIcon" alt="Share" />
          button at the bottom of your browser
        </li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
      </ol>
      <div :class="styles.panelActions">
        <button type="button" class="buttonSecondary" @click="showIosInstructions = false">
          Got it
        </button>
      </div>
    </div>
  </div>
</template>
