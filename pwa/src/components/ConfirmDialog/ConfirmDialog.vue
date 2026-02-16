<script setup lang="ts">
import { ref, watch } from 'vue';
import styles from './ConfirmDialog.module.css';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  }
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

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
  emit('cancel');
}

function handleConfirm() {
  emit('confirm');
}
</script>

<template>
  <dialog ref="dialogRef" :class="styles.dialog" @cancel.prevent="handleCancel">
    <h2 :class="styles.title">{{ title }}</h2>
    <p :class="styles.message">{{ message }}</p>
    <div :class="styles.actions">
      <button type="button" :class="styles.cancelButton" @click="handleCancel">
        {{ cancelLabel }}
      </button>
      <button type="button" :class="styles.confirmButton" @click="handleConfirm">
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>
