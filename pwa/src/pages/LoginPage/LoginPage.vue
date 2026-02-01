<script setup lang="ts">
import { authService } from '../../lib/auth/oauth';
import styles from './LoginPage.module.css';

function handleLogin() {
  authService.initiateLogin();
}
</script>

<template>
  <main :class="styles.main">
    <h1 :class="styles.heading">Gym PWA</h1>
    <p :class="styles.description">Track your workouts and progress</p>
    <button @click="handleLogin" :class="styles.loginButton">Sign in with Google</button>
  </main>
</template>
