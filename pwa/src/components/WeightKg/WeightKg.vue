<script setup lang="ts">
import styles from './WeightKg.module.css';

defineProps<{ kg: number }>();
</script>

<template><span :class="styles.weight">{{ kg }}<span :class="styles.weightUnitKg">kg</span></span></template>
