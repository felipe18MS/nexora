<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  void router.replace('/app/dashboard');
});
</script>

<template>
  <q-page class="flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>
