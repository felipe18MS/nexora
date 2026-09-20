<template>
  <PlatformLegalDocumentDialog v-model="modelValue" tipo="terminos" />
</template>

<script setup lang="ts">
import PlatformLegalDocumentDialog from '../../platform/components/platform-legal-document-dialog.vue';

const modelValue = defineModel<boolean>({
  required: true,
});
</script>
