<template>
  <div class="filters-container">
    <q-input
      v-model="filtros.busqueda"
      outlined
      dense
      clearable
      placeholder="Buscar conversación..."
      class="search-input"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-select
      v-model="filtros.estado"
      :options="opcionesEstado"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Estado"
      class="filter-select"
    />

    <q-select
      v-model="filtros.canal"
      :options="opcionesCanal"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Canal"
      class="filter-select"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type {
  CanalConversacion,
  EstadoConversacion,
  FiltrosConversacion,
} from '../types/conversation.types';

const emit = defineEmits<{
  filtrar: [filtros: FiltrosConversacion];
}>();

const filtros = reactive<FiltrosConversacion>({
  busqueda: '',
  estado: null,
  canal: null,
});

const opcionesEstado: Array<{
  label: string;
  value: EstadoConversacion;
}> = [
  { label: 'Abierta', value: 'abierta' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Resuelta', value: 'resuelta' },
  { label: 'Cerrada', value: 'cerrada' },
];

const opcionesCanal: Array<{
  label: string;
  value: CanalConversacion;
}> = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Llamada', value: 'llamada' },
  { label: 'Email', value: 'email' },
  { label: 'Interno', value: 'interno' },
];

watch(
  filtros,
  () => {
    emit('filtrar', { ...filtros });
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
.filters-container {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

.filter-select {
  width: 160px;
}

@media (max-width: 700px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }
}
</style>
