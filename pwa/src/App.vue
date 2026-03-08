<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from './components/AppLayout/AppLayout.vue';
import { authService } from './lib/auth/oauth';
import { prefetchDashboardData } from './pages/DashboardPage/helpers';

onMounted(() => {
  if (authService.isAuthenticated()) {
    prefetchDashboardData(authService.getUserId());
  }
});
</script>

<template>
  <AppLayout />
</template>
