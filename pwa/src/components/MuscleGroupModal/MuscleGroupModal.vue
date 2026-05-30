<script setup lang="ts">
import type { MuscleGroupDisplayName } from 'gym-pwa-api/types';
import styles from './MuscleGroupModal.module.css';
import BaseModal from '../BaseModal/BaseModal.vue';
import BaseModalActions from '../BaseModal/BaseModalActions.vue';

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
    <h2 :class="styles.title">{{ exerciseLabel }}</h2>
    <div :class="styles.section" v-if="primaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Main muscles worked</h3>
      <p :class="styles.muscleList">
        <template v-for="(mg, i) in primaryMuscleGroups" :key="mg">
          <span v-if="i > 0" class="pipeSeparator">|</span><span :class="styles.muscleName">{{ mg }}</span>
        </template>
      </p>
    </div>
    <div :class="styles.section" v-if="secondaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Secondary muscles</h3>
      <p :class="styles.muscleList">
        <template v-for="(mg, i) in secondaryMuscleGroups" :key="mg">
          <span v-if="i > 0" class="pipeSeparator">|</span><span :class="styles.muscleName">{{ mg }}</span>
        </template>
      </p>
    </div>
    <div :class="styles.section" v-if="tertiaryMuscleGroups.length > 0">
      <h3 :class="styles.sectionHeading">Stabilizing muscles</h3>
      <p :class="styles.muscleList">
        <template v-for="(mg, i) in tertiaryMuscleGroups" :key="mg">
          <span v-if="i > 0" class="pipeSeparator">|</span><span :class="styles.muscleName">{{ mg }}</span>
        </template>
      </p>
    </div>
    <BaseModalActions>
      <button type="button" :class="styles.closeButton" @click="handleClose">
        Close
      </button>
    </BaseModalActions>
  </BaseModal>
</template>
