<script setup lang="ts">
import baseStyles from '../../styles/base-classes.module.css';
import styles from './DashboardPage.module.css';
</script>

<template>
  <main class="main">
    <h1 :class="baseStyles.heading">Axis gym companion</h1>
    <nav :class="styles.dashboardNav">
      <router-link to="/routines" :class="styles.navCard">
        <strong>Routines</strong>
        <span>Browse and start a workout</span>
      </router-link>
      <router-link to="/workouts" :class="styles.navCard">
        <strong>Workouts</strong>
        <span>View your workout history</span>
      </router-link>
    </nav>
  </main>
</template>
