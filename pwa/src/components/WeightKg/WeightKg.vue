<script setup lang="ts">
import { computed } from 'vue';
import styles from './WeightKg.module.css';

const props = defineProps<{ kg: number }>();

const displayKg = computed(() => Math.round(props.kg * 10) / 10);
</script>

<template><span :class="styles.weight">{{ displayKg }}<span :class="styles.weightUnitKg">kg</span></span></template>
