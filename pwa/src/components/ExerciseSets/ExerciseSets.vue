<script setup lang="ts">
import { computed, ref } from 'vue';
import type { LocalWorkoutExercise, SetType } from '../../lib/db';
import {
  calculateExerciseTotalWeightKg,
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
import WeightKg from '../WeightKg/WeightKg.vue';
import ExerciseTimer from '../ExerciseTimer/ExerciseTimer.vue';
import MuscleGroupModal from '../MuscleGroupModal/MuscleGroupModal.vue';
import chevronDownSvg from '../../assets/chevron-down.svg';
import chevronUpSvg from '../../assets/chevron-up.svg';
import stopwatchSvg from '../../assets/stopwatch.svg';

interface Props {
  exercise: LocalWorkoutExercise;
  bodyWeightKg: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  start: [exerciseId: number];
  updateSet: [exerciseId: number, setId: string, updates: { weightKg?: number; reps?: number; timeSeconds?: number }];
  addSet: [exerciseId: number];
  changeSetType: [exerciseId: number, setId: string, setType: SetType];
}>();

const inputFields = computed(() => getSetInputFields(props.exercise.recordSetsType));

const useShortSetTypeLabels = computed(() => props.exercise.recordSetsType === 'WEIGHT_AND_TIME');

const exerciseTotalWeightKg = computed(() => {
  if (!props.exercise.sets) return 0;
  return calculateExerciseTotalWeightKg(
    props.exercise.recordSetsType,
    props.bodyWeightKg,
    props.exercise.sets,
    props.exercise.bwFactor
  );
});

const completedTimeSummary = computed((): string | null => {
  if (!props.exercise.completed || !inputFields.value.showTime || !props.exercise.sets) return null;
  const total = getCompletedTotalTimeSeconds(props.exercise.sets);
  return total > 0 ? formatTotalTime(total) : null;
});

const completedWeightSummary = computed((): number | null => {
  if (!props.exercise.completed || !inputFields.value.showWeight || !inputFields.value.showTime || !props.exercise.sets) return null;
  const weight = getRepresentativeWeightKg(props.exercise.sets);
  return weight !== undefined ? weight : null;
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

const timerOpenForSetId = ref<string | null>(null);

function openTimer(setId: string) {
  timerOpenForSetId.value = setId;
}

function handleTimerFinish(timeSeconds: number) {
  if (timerOpenForSetId.value !== null) {
    emit('updateSet', props.exercise.id, timerOpenForSetId.value, { timeSeconds });
  }
  timerOpenForSetId.value = null;
}

const showMuscleGroupModal = ref(false);

function openMuscleGroupModal() {
  showMuscleGroupModal.value = true;
}

function closeMuscleGroupModal() {
  showMuscleGroupModal.value = false;
}

</script>

<template>
  <div :class="styles.exercise">
    <button
      :class="styles.exerciseHeader"
      @click="togglePanel"
      @keydown.enter="togglePanel"
      @keydown.space.prevent="togglePanel"
    >
      <span>{{ exercise.label }}</span>
      <div :class="styles.headerRight">
        <template v-if="completedTimeSummary">
          <span v-if="completedWeightSummary !== null" :class="styles.totalWeight"><WeightKg :kg="completedWeightSummary" /></span>
          <span :class="styles.totalWeight">{{ completedTimeSummary }}</span>
        </template>
        <span v-else-if="exerciseTotalWeightKg > 0" :class="styles.totalWeight"><WeightKg :kg="exerciseTotalWeightKg" /></span>
        <span v-else-if="completedRepsSummary" :class="styles.totalWeight">{{ completedRepsSummary }}</span>
        <img :src="isOpen ? chevronUpSvg : chevronDownSvg" :alt="isOpen ? 'Collapse' : 'Expand'" width="27" height="11" />
      </div>
    </button>

    <div v-if="isOpen && exercise.sets" :class="styles.setContent">
      <div :class="styles.setsContainer">
        <div
          v-for="(set, index) in exercise.sets"
          :key="set.id"
          :class="styles.setRow"
        >
          <input
            v-if="inputFields.showWeight"
            type="number"
            class="inputCompact"
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
            class="inputCompact"
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
                class="inputCompact"
                placeholder="Min"
                :aria-label="`Minutes for set ${index + 1}`"
                :value="getMinutes(set.timeSeconds)"
                min="0"
                @input="(e) => handleTimeUpdate(set.id, set.timeSeconds, 'minutes', (e.target as HTMLInputElement).value)"
              />
              <span :class="styles.timeSeparator">:</span>
              <input
                type="number"
                class="inputCompact"
                placeholder="Sec"
                :aria-label="`Seconds for set ${index + 1}`"
                :value="getSeconds(set.timeSeconds)"
                min="0"
                max="59"
                @input="(e) => handleTimeUpdate(set.id, set.timeSeconds, 'seconds', (e.target as HTMLInputElement).value)"
              />
            </div>
            <button
              type="button"
              :class="styles.stopwatchButton"
              :aria-label="`Open timer for set ${index + 1}`"
              @click="openTimer(set.id)"
            >
              <img :src="stopwatchSvg" alt="" width="24" height="24" />
            </button>
          </template>

          <select
            :class="['inputBordered', 'inputSelect']"
            :value="set.setType"
            :aria-label="`Set type for set ${index + 1}`"
            @change="(e) => emit('changeSetType', exercise.id, set.id, (e.target as HTMLSelectElement).value as SetType)"
          >
            <option value="Warmup">{{ useShortSetTypeLabels ? 'W' : 'Warmup' }}</option>
            <option value="Standard">{{ useShortSetTypeLabels ? 'S' : 'Standard' }}</option>
            <option value="Failure">{{ useShortSetTypeLabels ? 'F' : 'Failure' }}</option>
          </select>

        </div>
      </div>

      <div :class="styles.actionButtons">
        <button type="button" :class="styles.addSetButton" @click="emit('addSet', exercise.id)">
          Add Set
        </button>
        <button type="button" :class="styles.muscleGroupsButton" @click="openMuscleGroupModal">
          Muscle groups
        </button>
      </div>
    </div>

    <ExerciseTimer
      v-if="timerOpenForSetId !== null"
      :open="timerOpenForSetId !== null"
      :exercise-label="exercise.label"
      @finish="handleTimerFinish"
    />

    <MuscleGroupModal
      v-if="showMuscleGroupModal"
      :open="showMuscleGroupModal"
      :exercise-label="exercise.label"
      :primary-muscle-groups="exercise.primaryMuscleGroups"
      :secondary-muscle-groups="exercise.secondaryMuscleGroups"
      :tertiary-muscle-groups="exercise.tertiaryMuscleGroups"
      @close="closeMuscleGroupModal"
    />
  </div>
</template>
