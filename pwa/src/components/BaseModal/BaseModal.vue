<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import styles from './BaseModal.module.css';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

onMounted(() => {
  if (props.open && dialogRef.value) {
    dialogRef.value.showModal();
  }
});

watch(
  () => props.open,
  (isOpen) => {
    if (!dialogRef.value) return;

    if (isOpen) {
      dialogRef.value.showModal();
    } else {
      dialogRef.value.close();
    }
  }
);

function handleCancel() {
  emit('close');
}
</script>

<template>
  <dialog ref="dialogRef" :class="styles.dialog" @cancel.prevent="handleCancel">
    <slot />
  </dialog>
</template>
