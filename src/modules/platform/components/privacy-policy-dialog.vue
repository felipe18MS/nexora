<template>
  <PlatformLegalDocumentDialog v-model="modelValue" tipo="privacidad" />
</template>

<script setup lang="ts">
import PlatformLegalDocumentDialog from './platform-legal-document-dialog.vue';

const modelValue = defineModel<boolean>({
  required: true,
});
</script>
