<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CompletedWorkoutExercise } from 'gym-pwa-api/types';
import {
  calculateCompletedSetsTotalWeightKg,
  formatSetDetails,
} from '../../pages/WorkoutPage/helpers';
import { formatTotalWeight } from '../../pages/WorkoutsListPage/helpers';
import styles from './ExerciseSummary.module.css';
import chevronDownSvg from '../../assets/chevron-down.svg';
import chevronUpSvg from '../../assets/chevron-up.svg';

interface Props {
  exercise: CompletedWorkoutExercise;
  bodyWeightKg: number;
}

const props = defineProps<Props>();

const isOpen = ref(false);

const totalWeightKg = computed(() =>
  calculateCompletedSetsTotalWeightKg(
    props.exercise.recordSetsType,
    props.bodyWeightKg,
    props.exercise.sets,
    props.exercise.bwFactor
  )
);
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
        <span v-if="totalWeightKg > 0" :class="styles.totalWeight">{{ formatTotalWeight(totalWeightKg) }}</span>
        <img :src="isOpen ? chevronUpSvg : chevronDownSvg" :alt="isOpen ? 'Collapse' : 'Expand'" width="27" height="11" />
      </div>
    </button>

    <div v-if="isOpen" :class="styles.setContent">
      <div :class="styles.setsContainer">
        <span v-for="(set, index) in exercise.sets" :key="index">
          {{ formatSetDetails(set, exercise.recordSetsType) }}
        </span>
      </div>
    </div>
  </div>
</template>
