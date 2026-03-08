<script setup lang="ts">
import { computed } from 'vue';
import type { UserWorkout } from 'gym-pwa-api/types';
import styles from './SessionCalendar.module.css';
import { buildCalendarDays, buildRoutineColourMap, getDotBackground } from './helpers';

const props = defineProps<{
  startDate: Date;
  endDate: Date;
  sessions: UserWorkout[];
}>();

const WEEK_DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const colourMap = computed(() => buildRoutineColourMap(props.sessions));

const calendarDays = computed(() =>
  buildCalendarDays(props.startDate, props.endDate, props.sessions)
);

function dotStyle(routineIds: number[]) {
  return { background: getDotBackground(routineIds, colourMap.value) };
}

function dateNumberStyle(hasSession: boolean) {
  if (hasSession) {
    return { color: 'var(--em-text-inverse)' };
  }
  return { color: 'color-mix(in srgb, var(--em-text-primary) 60%, transparent)' };
}
</script>

<template>
  <div :class="styles.calendar">
    <div :class="styles.weekHeaders" aria-hidden="true">
      <span v-for="(label, i) in WEEK_DAY_LABELS" :key="i" :class="styles.weekHeader">
        {{ label }}
      </span>
    </div>
    <div :class="styles.calendarGrid">
      <div v-for="day in calendarDays" :key="day.key" :class="styles.dayCell">
        <div
          v-if="day.dateNumber !== null"
          :class="styles.dot"
          :style="dotStyle(day.routineIds)"
        >
          <span :class="styles.dateNumber" :style="dateNumberStyle(day.hasSession)">
            {{ day.dateNumber }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
