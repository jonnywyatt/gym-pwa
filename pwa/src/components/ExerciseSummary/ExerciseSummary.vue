<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CompletedWorkoutExercise } from 'gym-pwa-api/types';
import {
  calculateCompletedSetsTotalWeightKg,
  formatSetDetails,
  getSetInputFields,
} from '../../pages/WorkoutPage/helpers';
import { formatTotalTime } from '../ExerciseSets/helpers';
import styles from './ExerciseSummary.module.css';
import WeightKg from '../WeightKg/WeightKg.vue';
import MuscleGroupModal from '../MuscleGroupModal/MuscleGroupModal.vue';
import chevronDownSvg from '../../assets/chevron-down.svg';
import chevronUpSvg from '../../assets/chevron-up.svg';

interface Props {
  exercise: CompletedWorkoutExercise;
  bodyWeightKg: number;
}

const props = defineProps<Props>();

const isOpen = ref(false);
const showMuscleGroupModal = ref(false);

const totalWeightKg = computed(() =>
  calculateCompletedSetsTotalWeightKg(
    props.exercise.recordSetsType,
    props.bodyWeightKg,
    props.exercise.sets,
    props.exercise.bwFactor
  )
);

const totalTimeSummary = computed((): string | null => {
  if (!getSetInputFields(props.exercise.recordSetsType).showTime) return null;
  const total = props.exercise.sets.reduce((sum, set) => sum + (set.timeSeconds ?? 0), 0);
  return total > 0 ? formatTotalTime(total) : null;
});
</script>

<template>
  <div :class="styles.exercise">
    <button
      :class="styles.exerciseHeader"
      @click="isOpen = !isOpen"
      @keydown.enter="isOpen = !isOpen"
      @keydown.space.prevent="isOpen = !isOpen"
    >
      <span>{{ exercise.label }}</span>
      <div :class="styles.headerRight">
        <span v-if="totalWeightKg > 0"><WeightKg :kg="totalWeightKg" /></span>
        <span v-if="totalTimeSummary">{{ totalTimeSummary }}</span>
        <img :src="isOpen ? chevronUpSvg : chevronDownSvg" :alt="isOpen ? 'Collapse' : 'Expand'" width="27" height="11" />
      </div>
    </button>

    <div v-if="isOpen" :class="styles.setContent">
      <div :class="styles.setsContainer">
        <span v-for="(set, index) in exercise.sets" :key="index">
          {{ formatSetDetails(set, exercise.recordSetsType) }}
        </span>
      </div>
      <div :class="styles.actionButtons">
        <button type="button" :class="styles.muscleGroupsButton" @click="showMuscleGroupModal = true">
          Muscle groups
        </button>
      </div>
    </div>

    <MuscleGroupModal
      v-if="showMuscleGroupModal"
      :open="showMuscleGroupModal"
      :exercise-label="exercise.label"
      :primary-muscle-groups="exercise.primaryMuscleGroups"
      :secondary-muscle-groups="exercise.secondaryMuscleGroups"
      :tertiary-muscle-groups="exercise.tertiaryMuscleGroups"
      @close="showMuscleGroupModal = false"
    />
  </div>
</template>
