<script setup lang="ts">
import styles from './ConfirmDialog.module.css';
import BaseModal from '../BaseModal/BaseModal.vue';
import BaseModalActions from '../BaseModal/BaseModalActions.vue';

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

function handleCancel() {
  emit('cancel');
}

function handleConfirm() {
  emit('confirm');
}
</script>

<template>
  <BaseModal :open="open" @close="handleCancel">
    <h2 :class="styles.title">{{ title }}</h2>
    <p :class="styles.message">{{ message }}</p>
    <BaseModalActions>
      <button type="button" :class="styles.cancelButton" @click="handleCancel">
        {{ cancelLabel }}
      </button>
      <button type="button" :class="styles.confirmButton" @click="handleConfirm">
        {{ confirmLabel }}
      </button>
    </BaseModalActions>
  </BaseModal>
</template>
