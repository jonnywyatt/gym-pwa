<script setup lang="ts">
import {ref} from 'vue';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.vue';
import binSvg from '../../assets/bin.svg';

defineProps<{
  label: string;
  confirmTitle: string;
  confirmMessage: string;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const showDialog = ref(false);

function handleClick() {
  showDialog.value = true;
}

function handleConfirm() {
  showDialog.value = false;
  emit('confirm');
}

function handleCancel() {
  showDialog.value = false;
}
</script>

<template>
  <button
      type="button"
      class="buttonIcon removeButton"
      :aria-label="label"
      @click="handleClick"
  >
    <img :src="binSvg" width="16" height="16" alt="" />
  </button>
  <ConfirmDialog
      :open="showDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  />
</template>
