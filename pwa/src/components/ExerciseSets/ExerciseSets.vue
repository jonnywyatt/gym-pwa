<script setup lang="ts">
import { computed } from 'vue';
import type { LocalWorkoutExercise, SetType } from '../../lib/db';
import {
  calculateExerciseTotalWeightKg,
  getSetDisplayLabel,
  getSetInputFields,
} from '../../pages/WorkoutPage/helpers';
import { combineTimeSeconds, getMinutes, getSeconds } from './helpers';
import styles from './ExerciseSets.module.css';

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
  finish: [exerciseId: number];
  discard: [exerciseId: number];
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

const isStarted = computed(() => Boolean(props.exercise.startedAt));
const isCompleted = computed(() => props.exercise.completed);

function handleTimeUpdate(setId: string, currentTimeSeconds: number | undefined, field: 'minutes' | 'seconds', value: string) {
  const timeSeconds = combineTimeSeconds(currentTimeSeconds, field, value);
  emit('updateSet', props.exercise.id, setId, { timeSeconds });
}
</script>

<template>
  <!-- Not started -->
  <div v-if="!isStarted && !isCompleted" :class="styles.exercise">
    <div :class="styles.exerciseHeader">
      <strong>{{ exercise.label }}</strong>
      <button type="button" :class="styles.startButton" @click="emit('start', exercise.id)">
        Start
      </button>
    </div>
  </div>

  <!-- In progress -->
  <div v-else-if="isStarted && !isCompleted" :class="styles.exercise">
    <div :class="styles.exerciseHeader">
      <strong>{{ exercise.label }}</strong>
      <span v-if="exerciseTotalWeightKg > 0" :class="styles.totalWeight">{{ exerciseTotalWeightKg }} Kg</span>
    </div>

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
          @input="(e) => emit('updateSet', exercise.id, set.id, { weightKg: Number((e.target as HTMLInputElement).value) || undefined })"
        />

        <input
          v-if="inputFields.showReps"
          type="number"
          :class="styles.setInput"
          placeholder="Reps"
          :aria-label="`Reps for set ${index + 1}`"
          :value="set.reps ?? ''"
          @input="(e) => emit('updateSet', exercise.id, set.id, { reps: Number((e.target as HTMLInputElement).value) || undefined })"
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
          <option value="Normal">Normal</option>
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
      <div :class="styles.finishDiscardButtons">
        <button type="button" :class="styles.discardButton" @click="emit('discard', exercise.id)">
          Discard
        </button>
        <button type="button" :class="styles.finishButton" @click="emit('finish', exercise.id)">
          Finish
        </button>
      </div>
    </div>
  </div>

  <!-- Completed -->
  <div v-else :class="styles.exercise">
    <div :class="styles.exerciseHeader">
      <strong>{{ exercise.label }}</strong>
      <span :class="styles.totalWeight">{{ exercise.totalWeightKg ?? 0 }} Kg</span>
    </div>
    <div :class="styles.completedSummary">
      <span>{{ exercise.sets?.length ?? 0 }} sets completed</span>
    </div>
  </div>
</template>
