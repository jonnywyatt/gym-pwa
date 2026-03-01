<script setup lang="ts">
import { authService } from '../../lib/auth/oauth';
import baseStyles from '../../styles/base-classes.module.css';
import styles from "../../components/AppLayout/AppLayout.module.css";
import duroLogo from "../../assets/duro-logo.svg";

function handleLogin() {
  authService.initiateLogin();
}
</script>

<template>
  <main class="main-centered">
    <div class="flexVerticalColumnSpaced">
      <h1 :class="styles.brandName">
        <img :src="duroLogo" alt="Duro" width="117" height="26" /></h1>
    <p>Track your workouts and progress</p>
    <button @click="handleLogin" class="buttonPrimary buttonPrimary--large">Sign in with Google</button>
    </div>
  </main>
</template>
