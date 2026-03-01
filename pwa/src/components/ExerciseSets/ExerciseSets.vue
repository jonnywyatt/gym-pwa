<script setup lang="ts">
import { computed, ref } from 'vue';
import type { LocalWorkoutExercise, SetType } from '../../lib/db';
import {
  calculateExerciseTotalWeightKg,
  getSetDisplayLabel,
  getSetInputFields,
} from '../../pages/WorkoutPage/helpers';
import {
  combineTimeSeconds,
  formatTotalTime,
  getCompletedTotalReps,
  getCompletedTotalTimeSeconds,
  getMinutes,
  getRepresentativeWeightKg,
  getSeconds,
} from './helpers';
import styles from './ExerciseSets.module.css';
import chevronDownSvg from '../../assets/chevron-down.svg';
import chevronUpSvg from '../../assets/chevron-up.svg';

interface Props {
  exercise: LocalWorkoutExercise;
  bodyWeightKg: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  start: [exerciseId: number];
  updateSet: [exerciseId: number, setId: string, updates: { weightKg?: number; reps?: number; timeSeconds?: number; completed?: boolean }];
  addSet: [exerciseId: number];
  changeSetType: [exerciseId: number, setId: string, setType: SetType];
}>();

const inputFields = computed(() => getSetInputFields(props.exercise.recordSetsType));

const exerciseTotalWeightKg = computed(() => {
  if (!props.exercise.sets) return 0;
  return calculateExerciseTotalWeightKg(
    props.exercise.recordSetsType,
    props.bodyWeightKg,
    props.exercise.sets
  );
});

const completedTimeSummary = computed((): string | null => {
  if (!props.exercise.completed || !inputFields.value.showTime || !props.exercise.sets) return null;
  const total = getCompletedTotalTimeSeconds(props.exercise.sets);
  return total > 0 ? formatTotalTime(total) : null;
});

const completedWeightSummary = computed((): string | null => {
  if (!props.exercise.completed || !inputFields.value.showWeight || !inputFields.value.showTime || !props.exercise.sets) return null;
  const weight = getRepresentativeWeightKg(props.exercise.sets);
  return weight !== undefined ? `${weight} Kg` : null;
});

const completedRepsSummary = computed((): string | null => {
  if (props.exercise.recordSetsType !== 'REPS' || !props.exercise.sets) return null;
  const total = getCompletedTotalReps(props.exercise.sets);
  return total > 0 ? `${total} reps` : null;
});

const isOpen = ref(false);
const hasEmittedStart = ref(false);

function togglePanel() {
  if (!isOpen.value && !props.exercise.startedAt && !hasEmittedStart.value) {
    emit('start', props.exercise.id);
    hasEmittedStart.value = true;
  }
  isOpen.value = !isOpen.value;
}

function handleTimeUpdate(setId: string, currentTimeSeconds: number | undefined, field: 'minutes' | 'seconds', value: string) {
  const timeSeconds = combineTimeSeconds(currentTimeSeconds, field, value);
  emit('updateSet', props.exercise.id, setId, { timeSeconds });
}
</script>

<template>
  <div :class="styles.exercise">
    <div
      :class="styles.exerciseHeader"
      role="button"
      tabindex="0"
      @click="togglePanel"
      @keydown.enter="togglePanel"
      @keydown.space.prevent="togglePanel"
    >
      <span>{{ exercise.label }}</span>
      <div :class="styles.headerRight">
        <template v-if="completedTimeSummary">
          <span v-if="completedWeightSummary" :class="styles.totalWeight">{{ completedWeightSummary }}</span>
          <span :class="styles.totalWeight">{{ completedTimeSummary }}</span>
        </template>
        <span v-else-if="exerciseTotalWeightKg > 0" :class="styles.totalWeight">{{ exerciseTotalWeightKg }} Kg</span>
        <span v-else-if="completedRepsSummary" :class="styles.totalWeight">{{ completedRepsSummary }}</span>
        <img :src="isOpen ? chevronUpSvg : chevronDownSvg" :alt="isOpen ? 'Collapse' : 'Expand'" width="27" height="11" />
      </div>
    </div>

    <div v-if="isOpen && exercise.sets">
      <div :class="styles.setsContainer">
        <div
          v-for="(set, index) in exercise.sets"
          :key="set.id"
          :class="styles.setRow"
        >
          <span :class="styles.setLabel">{{ getSetDisplayLabel(exercise.sets ?? [], index) }}</span>

          <input
            v-if="inputFields.showWeight"
            type="number"
            :class="styles.setInput"
            :placeholder="inputFields.weightLabel"
            :aria-label="`${inputFields.weightLabel} for set ${index + 1}`"
            :value="set.weightKg ?? ''"
            min="0"
            @input="(e) => {
              const value = (e.target as HTMLInputElement).value;
              emit('updateSet', exercise.id, set.id, { weightKg: value === '' ? undefined : Number(value) });
            }"
          />

          <input
            v-if="inputFields.showReps"
            type="number"
            :class="styles.setInput"
            placeholder="Reps"
            :aria-label="`Reps for set ${index + 1}`"
            :value="set.reps ?? ''"
            min="0"
            @input="(e) => {
              const value = (e.target as HTMLInputElement).value;
              emit('updateSet', exercise.id, set.id, { reps: value === '' ? undefined : Number(value) });
            }"
          />

          <template v-if="inputFields.showTime">
            <div :class="styles.timeInputGroup">
              <input
                type="number"
                :class="styles.timeInput"
                placeholder="Min"
                :aria-label="`Minutes for set ${index + 1}`"
                :value="getMinutes(set.timeSeconds)"
                min="0"
                @input="(e) => handleTimeUpdate(set.id, set.timeSeconds, 'minutes', (e.target as HTMLInputElement).value)"
              />
              <span :class="styles.timeSeparator">:</span>
              <input
                type="number"
                :class="styles.timeInput"
                placeholder="Sec"
                :aria-label="`Seconds for set ${index + 1}`"
                :value="getSeconds(set.timeSeconds)"
                min="0"
                max="59"
                @input="(e) => handleTimeUpdate(set.id, set.timeSeconds, 'seconds', (e.target as HTMLInputElement).value)"
              />
            </div>
          </template>

          <select
            :class="styles.setTypeSelect"
            :value="set.setType"
            :aria-label="`Set type for set ${index + 1}`"
            @change="(e) => emit('changeSetType', exercise.id, set.id, (e.target as HTMLSelectElement).value as SetType)"
          >
            <option value="Warmup">Warmup</option>
            <option value="Standard">Standard</option>
            <option value="Failure">Failure</option>
          </select>

          <input
            type="checkbox"
            :checked="set.completed"
            :aria-label="`Complete set ${index + 1}`"
            @change="(e) => emit('updateSet', exercise.id, set.id, { completed: (e.target as HTMLInputElement).checked })"
          />
        </div>
      </div>

      <div :class="styles.actionButtons">
        <button type="button" :class="styles.addSetButton" @click="emit('addSet', exercise.id)">
          Add Set
        </button>
      </div>
    </div>
  </div>
</template>
