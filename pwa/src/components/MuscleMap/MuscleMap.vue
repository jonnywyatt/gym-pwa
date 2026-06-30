<script setup lang="ts">
import type { MuscleGroupDisplayName } from 'gym-pwa-api/types';
import { computed } from 'vue';
import { getMuscleMapSvgIds, getVisibleViews } from '../../utils/muscleGroups';
import MuscleMapFront from './MuscleMapFront.vue';
import MuscleMapBack from './MuscleMapBack.vue';
import styles from './MuscleMap.module.css';

const props = defineProps<{
  primaryMuscleGroups: MuscleGroupDisplayName[];
  secondaryMuscleGroups: MuscleGroupDisplayName[];
  tertiaryMuscleGroups: MuscleGroupDisplayName[];
}>();

const primaryIds = computed(() => getMuscleMapSvgIds(props.primaryMuscleGroups));
const secondaryIds = computed(() => getMuscleMapSvgIds(props.secondaryMuscleGroups));
const tertiaryIds = computed(() => getMuscleMapSvgIds(props.tertiaryMuscleGroups));

const allIds = computed(() => [...primaryIds.value, ...secondaryIds.value, ...tertiaryIds.value]);
const views = computed(() => getVisibleViews(allIds.value));
</script>

<template>
  <div :class="styles.container">
    <MuscleMapFront
      v-if="views.front"
      :class="styles.diagram"
      :primary="primaryIds"
      :secondary="secondaryIds"
      :tertiary="tertiaryIds"
    />
    <MuscleMapBack
      v-if="views.back"
      :class="styles.diagram"
      :primary="primaryIds"
      :secondary="secondaryIds"
      :tertiary="tertiaryIds"
    />
  </div>
</template>
