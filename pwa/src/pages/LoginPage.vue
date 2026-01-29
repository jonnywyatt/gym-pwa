<script setup lang="ts">
import { authService } from '../lib/auth/oauth';

function handleLogin() {
  authService.initiateLogin();
}
</script>

<template>
  <main>
    <h1>Gym PWA</h1>
    <p>Track your workouts and progress</p>
    <button @click="handleLogin">Sign in with Google</button>
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

h1 {
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #3367d6;
}
</style>
