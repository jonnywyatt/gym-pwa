<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../lib/auth/oauth';

const router = useRouter();
const error = ref<string | null>(null);

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    error.value = 'No authorization code received';
    return;
  }

  try {
    await authService.handleCallback(code);
    router.replace('/routines');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed';
  }
});
</script>

<template>
  <main class="main-centered">
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else>Signing in...</p>
  </main>
</template>
