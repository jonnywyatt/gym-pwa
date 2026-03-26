<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { UserWorkoutSummary } from 'gym-pwa-api/types';
import styles from './SessionCalendar.module.css';
import { buildCalendarDays, buildRoutineColourMap, getDotBackground, type CalendarDay } from './helpers';
import SessionDayPopup from './SessionDayPopup.vue';

const props = defineProps<{
  startDate: Date;
  endDate: Date;
  sessions: UserWorkoutSummary[];
}>();

const WEEK_DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const colourMap = computed(() => buildRoutineColourMap(props.sessions));

const calendarDays = computed(() => {
  const days = buildCalendarDays(props.startDate, props.endDate, props.sessions);
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks.reverse().flat();
});

const activeDay = ref<CalendarDay | null>(null);

function dotStyle(routineIds: number[]) {
  return { background: getDotBackground(routineIds, colourMap.value) };
}

function dateNumberStyle(hasSession: boolean) {
  if (hasSession) {
    return { color: 'var(--em-text-inverse)' };
  }
  return { color: 'color-mix(in srgb, var(--em-text-primary) 60%, transparent)' };
}

function onDotClick(event: MouseEvent, day: CalendarDay) {
  if (!day.hasSession) return;
  event.stopPropagation();
  activeDay.value = activeDay.value?.key === day.key ? null : day;
}

function onDocumentClick() {
  activeDay.value = null;
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});
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
        <button
          v-if="day.dateNumber !== null && day.hasSession"
          type="button"
          :class="[styles.dot, styles.dotButton, day.isToday && styles.dotToday]"
          :style="dotStyle(day.routineIds)"
          :aria-label="`Sessions on day ${day.dateNumber}`"
          @click="onDotClick($event, day)"
        >
          <span :class="styles.dateNumber" :style="dateNumberStyle(true)">
            {{ day.dateNumber }}
          </span>
        </button>
        <div
          v-else-if="day.dateNumber !== null"
          :class="[styles.dot, day.isToday && styles.dotToday]"
          :style="dotStyle(day.routineIds)"
        >
          <span :class="styles.dateNumber" :style="dateNumberStyle(false)">
            {{ day.dateNumber }}
          </span>
        </div>
      </div>
    </div>
    <SessionDayPopup
      v-if="activeDay !== null"
      :sessions="activeDay.daySessions"
      @close="activeDay = null"
    />
  </div>
</template>
