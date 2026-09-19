<template>
  <q-badge
    :color="isActive ? 'positive' : 'grey'"
    :label="isActive ? 'Activo' : 'Inactivo'"
    rounded
  />
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean;
}>();
</script>
