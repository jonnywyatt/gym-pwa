<script setup lang="ts">
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import type { RoutineTrendData } from 'gym-pwa-api/types';
import styles from './SessionTrendsPage.module.css';
import { authService } from '../../lib/auth/oauth';
import {
  TREND_PERIOD_OPTIONS,
  type SessionPopup,
  type TrendPeriod,
  buildChartData,
  buildChartOptions,
  buildMetricSubtitle,
  buildSessionPopup,
  fetchSessionTrends,
} from './helpers';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, TimeScale);

const routines = ref<RoutineTrendData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedPeriod = ref<TrendPeriod>('3m');
const sessionPopups = ref<Map<number, SessionPopup | null>>(new Map());
const popupRefs = ref<Map<number, HTMLElement>>(new Map());

function setPopupRef(routineId: number, el: HTMLElement | null) {
  if (el !== null) {
    popupRefs.value.set(routineId, el);
  } else {
    popupRefs.value.delete(routineId);
  }
}

async function loadTrends() {
  const userId = authService.getUserId();
  if (userId === null) {
    error.value = 'Not authenticated';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  sessionPopups.value = new Map();
  try {
    routines.value = await fetchSessionTrends(userId, selectedPeriod.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load trends';
  } finally {
    loading.value = false;
  }
}

async function selectPeriod(period: TrendPeriod) {
  selectedPeriod.value = period;
  await loadTrends();
}

function closeSessionPopup(routineId: number) {
  sessionPopups.value = new Map(sessionPopups.value).set(routineId, null);
}

function handleChartClick(event: MouseEvent, routine: RoutineTrendData) {
  const canvas = (event.target as HTMLElement).closest('canvas') as HTMLCanvasElement | null;
  if (canvas === null) {
    sessionPopups.value = new Map(sessionPopups.value).set(routine.routineId, null);
    return;
  }

  const chart = ChartJS.getChart(canvas);
  if (chart === undefined) return;

  const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
  const dotElement = elements.find((el) => chart.data.datasets[el.datasetIndex].label !== 'Trend');
  if (dotElement === undefined) {
    sessionPopups.value = new Map(sessionPopups.value).set(routine.routineId, null);
    return;
  }

  const session = routine.sessions[dotElement.index];
  const rect = canvas.getBoundingClientRect();
  sessionPopups.value = new Map(sessionPopups.value).set(
    routine.routineId,
    buildSessionPopup(session, routine.secondMetric, event.clientX - rect.left, event.clientY - rect.top),
  );

  nextTick(() => {
    const popupEl = popupRefs.value.get(routine.routineId);
    if (popupEl === undefined) return;
    const popupRect = popupEl.getBoundingClientRect();
    const overflow = popupRect.right - (window.innerWidth - 10);
    if (overflow > 0) {
      const popup = sessionPopups.value.get(routine.routineId);
      if (popup === null || popup === undefined) return;
      sessionPopups.value = new Map(sessionPopups.value).set(routine.routineId, {
        ...popup,
        x: popup.x - overflow,
      });
    }
  });
}

onMounted(() => {
  loadTrends();
});
</script>

<template>
  <main class="main">
    <h1 class="heading-l heading-l-session marginBottom4">Session trends</h1>
    <div class="flexVerticalCenter flexGap3Units marginBottom4">
      <router-link to="/sessions" class="buttonLink buttonLink--secondary">By month</router-link>
      <span aria-hidden="true" class="linkDivider">|</span>
      <router-link to="/session-trends" class="buttonLink buttonLink--secondary buttonLink--active">Trends</router-link>
    </div>
    <div class="flexVerticalCenter flexGap3Units marginBottom4">
      <button
        v-for="option in TREND_PERIOD_OPTIONS"
        :key="option.period"
        type="button"
        :class="['buttonLink', 'buttonLink--secondary', selectedPeriod === option.period ? 'buttonLink--active' : '']"
        @click="selectPeriod(option.period)"
      >
        {{ option.label }}
      </button>
    </div>
    <p v-if="loading" :class="styles.loading">Loading...</p>
    <p v-else-if="error" :class="styles.error">Error: {{ error }}</p>
    <p v-else-if="routines.length === 0" class="textSecondary textSecondary--small">No session data in this period.</p>
    <template v-else>
      <section
        v-for="routine in routines"
        :key="routine.routineId"
        :class="styles.routineSection"
      >
        <h2 class="heading-m marginBottom2">{{ routine.routineLabel }}</h2>
        <p v-if="routine.sessions.length === 0" class="textSecondary textSecondary--small">No sessions recorded.</p>
        <template v-else>
          <p :class="styles.metricLabel">{{ buildMetricSubtitle(routine) }}</p>
          <div :class="styles.chartWrapper" @click="(e) => handleChartClick(e, routine)">
            <Line
              :data="buildChartData(routine, selectedPeriod)"
              :options="buildChartOptions(routine.secondMetric, selectedPeriod)"
            />
            <template v-if="sessionPopups.get(routine.routineId) != null">
              <div
                :ref="(el) => setPopupRef(routine.routineId, el as HTMLElement | null)"
                :class="styles.sessionPopup"
                :style="{ left: `${sessionPopups.get(routine.routineId)?.x}px`, top: `${sessionPopups.get(routine.routineId)?.y}px` }"
                @click.stop
              >
                <button
                  type="button"
                  :class="styles.closeButton"
                  aria-label="Close"
                  @click="closeSessionPopup(routine.routineId)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="currentColor"/>
                    <line x1="8" y1="8" x2="16" y2="16" stroke="var(--em-surface)" stroke-width="2" stroke-linecap="round"/>
                    <line x1="16" y1="8" x2="8" y2="16" stroke="var(--em-surface)" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <p class="uppercase uppercase--small marginBottom3">{{ sessionPopups.get(routine.routineId)?.date }}</p>
                <p>{{ sessionPopups.get(routine.routineId)?.metric }}</p>
              </div>
            </template>
          </div>
        </template>
      </section>
    </template>
  </main>
</template>
