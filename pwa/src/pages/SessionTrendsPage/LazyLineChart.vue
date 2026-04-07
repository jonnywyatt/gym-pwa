<script setup lang="ts">
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, TimeScale);

Tooltip.positioners.offsetFromPoint = (_items, eventPos) => {
  if (eventPos.x === null || eventPos.y === null) return false;
  return { x: eventPos.x + 10, y: eventPos.y };
};

defineProps<{
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
}>();
</script>

<template>
  <Line :data="data" :options="options" />
</template>
