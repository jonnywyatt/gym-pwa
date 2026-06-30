<script setup lang="ts">
import type { MuscleGroupDisplayName } from 'gym-pwa-api/types';
import styles from './MuscleGroupModal.module.css';
import BaseModal from '../BaseModal/BaseModal.vue';
import MuscleMap from '../MuscleMap/MuscleMap.vue';

defineProps<{
  open: boolean;
  exerciseLabel: string;
  primaryMuscleGroups: MuscleGroupDisplayName[];
  secondaryMuscleGroups: MuscleGroupDisplayName[];
  tertiaryMuscleGroups: MuscleGroupDisplayName[];
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleClose() {
  emit('close');
}
</script>

<template>
  <BaseModal :open="open" @close="handleClose">
    <button type="button" :class="styles.closeButton" @click="handleClose" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="var(--background-surface)" stroke="currentColor" stroke-width="0.75"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <h2 :class="styles.title">{{ exerciseLabel }}</h2>
    <MuscleMap
      :class="styles.muscleMap"
      :primary-muscle-groups="primaryMuscleGroups"
      :secondary-muscle-groups="secondaryMuscleGroups"
      :tertiary-muscle-groups="tertiaryMuscleGroups"
    />
    <div :class="styles.section" v-if="primaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Main muscles worked</h3>
      <p :class="[styles.muscleList, styles.muscleListPrimary]">
        <template v-for="(mg, i) in primaryMuscleGroups" :key="mg">
          <span :class="styles.muscleItem"><span v-if="i > 0" class="pipeSeparator">|</span>{{ mg }}</span>
        </template>
      </p>
    </div>
    <div :class="styles.section" v-if="secondaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Secondary muscles</h3>
      <p :class="[styles.muscleList, styles.muscleListSecondary]">
        <template v-for="(mg, i) in secondaryMuscleGroups" :key="mg">
          <span :class="styles.muscleItem"><span v-if="i > 0" class="pipeSeparator">|</span>{{ mg }}</span>
        </template>
      </p>
    </div>
    <div :class="styles.section" v-if="tertiaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Stabilizing muscles</h3>
      <p :class="[styles.muscleList, styles.muscleListTertiary]">
        <template v-for="(mg, i) in tertiaryMuscleGroups" :key="mg">
          <span :class="styles.muscleItem"><span v-if="i > 0" class="pipeSeparator">|</span>{{ mg }}</span>
        </template>
      </p>
    </div>
  </BaseModal>
</template>
