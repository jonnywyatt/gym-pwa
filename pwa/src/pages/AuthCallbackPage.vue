<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../lib/auth/oauth';

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
    router.replace('/exercises');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed';
  }
});
</script>

<template>
  <main>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else>Signing in...</p>
  </main>
</template>

<style scoped>
main {
  max-width: 400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  font-family: system-ui, sans-serif;
}

.error {
  color: #c00;
}
</style>
