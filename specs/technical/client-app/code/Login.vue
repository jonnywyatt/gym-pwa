<!-- src/routes/Login.vue -->
<script setup lang="ts">
import { authService } from '../lib/auth/oauth';

function handleLogin() {
  authService.initiateLogin();
}
</script>

<template>
  <div class="login-page">
    <h1>Gym PWA</h1>
    <button @click="handleLogin">
      Sign in with Google
    </button>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: #4285f4;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #357ae8;
}
</style>
