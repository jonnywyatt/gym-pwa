<script setup lang="ts">
import { ref } from 'vue';
import type { MuscleGroupBreakdown } from '../../pages/WorkoutPage/helpers';
import styles from './MuscleGroupBreakdown.module.css';
import chevronDownSvg from '../../assets/chevron-down.svg';
import chevronUpSvg from '../../assets/chevron-up.svg';

defineProps<{
  breakdown: MuscleGroupBreakdown;
}>();

const bodyAreaColours: Record<string, string> = {
  Chest: 'var(--em-accent-teal)',
  Back: 'var(--em-accent-aqua)',
  Shoulders: 'var(--em-accent-purple)',
  Arms: 'var(--em-accent-flat-purple)',
  Core: 'var(--em-accent-fuchsia)',
  Legs: 'var(--em-accent-emerald)',
};

const isExpanded = ref(false);
</script>

<template>
  <section v-if="breakdown.bodyAreas.length > 0" :class="styles.root" aria-label="Muscle group breakdown">
      <div :class="styles.bar" role="img" aria-label="Body area breakdown bar" class="marginBottom1">
        <div
          v-for="area in breakdown.bodyAreas"
          :key="area.bodyArea"
          :class="styles.barSegment"
          :style="{ width: `${area.percentage}%`, background: bodyAreaColours[area.bodyArea] ?? 'var(--accent-primary)' }"
          :title="`${area.bodyArea}: ${area.percentage}%`"
        />
      </div>

      <button
        type="button"
        :class="styles.summaryRow"
        :aria-expanded="isExpanded"
        aria-controls="muscle-detail-panel"
        @click="isExpanded = !isExpanded"
      >
        <ul :class="styles.legend" aria-label="Body areas">
          <li v-for="area in breakdown.bodyAreas" :key="area.bodyArea" :class="styles.legendItem">
            <span
              :class="styles.legendDot"
              :style="{ background: bodyAreaColours[area.bodyArea] ?? 'var(--accent-primary)' }"
            />
            <span :class="[styles.legendLabel]">{{ area.bodyArea }}</span>
            <span :class="styles.legendPct">{{ area.percentage }}%</span>
          </li>
        </ul>
        <img
          :src="isExpanded ? chevronUpSvg : chevronDownSvg"
          :alt="isExpanded ? 'Collapse muscle detail' : 'Expand muscle detail'"
          width="27"
          height="11"
        />
      </button>

      <div v-if="isExpanded" id="muscle-detail-panel" :class="styles.musclePanel">
        <ul :class="styles.muscleList" aria-label="Muscle groups">
          <li v-for="mg in breakdown.muscleGroups" :key="mg.muscleGroup" :class="styles.muscleItem">
            <span :class="styles.muscleName">{{ mg.muscleGroup }}</span>
            <div :class="styles.muscleBarTrack">
              <div
                :class="styles.muscleBarFill"
                :style="{
                  width: `${mg.percentage}%`,
                  background: bodyAreaColours[mg.bodyArea] ?? 'var(--accent-primary)',
                }"
              />
            </div>
            <span :class="styles.musclePct">{{ mg.percentage }}%</span>
          </li>
        </ul>
      </div>
  </section>
</template>
