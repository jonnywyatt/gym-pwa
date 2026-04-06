<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from './components/AppLayout/AppLayout.vue';
import { authService } from './lib/auth/oauth';
import { prefetchDashboardData } from './pages/DashboardPage/helpers';
import { prefetchSessionTrends } from './pages/SessionTrendsPage/helpers';

onMounted(() => {
  if (authService.isAuthenticated()) {
    prefetchDashboardData(authService.getUserId());
    prefetchSessionTrends(authService.getUserId());
  }
});
</script>

<template>
  <AppLayout />
</template>
