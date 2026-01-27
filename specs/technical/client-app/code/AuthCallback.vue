<!-- src/routes/AuthCallback.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../lib/auth/oauth';

const router = useRouter();
const error = ref<string | null>(null);

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const errorParam = urlParams.get('error');

  if (errorParam) {
    error.value = 'Authentication failed';
    return;
  }

  if (!code) {
    error.value = 'No authorization code received';
    return;
  }

  try {
    await authService.handleCallback(code);
    router.push('/'); // Redirect to home
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  }
});
</script>

<template>
  <div v-if="error" class="error">
    <p>{{ error }}</p>
    <router-link to="/login">Back to login</router-link>
  </div>
  <div v-else class="loading">
    <p>Completing sign in...</p>
  </div>
</template>

<style scoped>
.error, .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.error {
  color: #d32f2f;
}
</style>
