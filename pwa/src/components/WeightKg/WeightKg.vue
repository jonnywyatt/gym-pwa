<script setup lang="ts">
import styles from './WeightKg.module.css';

defineProps<{ kg: number }>();
</script>

<template>{{ kg }}<span :class="styles.weightUnitKg">kg</span></template>
