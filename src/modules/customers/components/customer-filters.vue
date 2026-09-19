<template>
  <div class="row q-col-gutter-md q-mb-lg">
    <!-- Búsqueda -->
    <div class="col-12 col-md-6">
      <q-input
        v-model="filtrosLocales.search"
        outlined
        dense
        clearable
        label="Buscar cliente"
        placeholder="Nombre, teléfono o correo"
        @update:model-value="manejarCambio"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Estado -->
    <div class="col-12 col-md-3">
      <q-select
        v-model="filtrosLocales.isActive"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        :options="opcionesEstado"
        @update:model-value="manejarCambio"
      />
    </div>

    <!-- Limpiar -->
    <div class="col-12 col-md-3 flex items-center">
      <q-btn
        flat
        color="primary"
        icon="filter_alt_off"
        label="Limpiar filtros"
        :disable="!hayFiltros"
        @click="limpiarFiltros"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { CustomerFilters } from '../types/customer.types';

interface Props {
  filters: CustomerFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:filters': [filters: CustomerFilters];
}>();

interface FiltrosLocales {
  search: string;
  isActive: boolean | null;
}

const filtrosLocales = reactive<FiltrosLocales>({
  search: props.filters.search ?? '',
  isActive: props.filters.isActive ?? null,
});

const opcionesEstado = [
  {
    label: 'Activos',
    value: true,
  },
  {
    label: 'Inactivos',
    value: false,
  },
];

const hayFiltros = computed(() => {
  return Boolean(filtrosLocales.search.trim() || filtrosLocales.isActive !== null);
});

const manejarCambio = (): void => {
  const filtros: CustomerFilters = {
    page: 1,
  };

  const busqueda = filtrosLocales.search.trim();

  if (busqueda) {
    filtros.search = busqueda;
  }

  if (filtrosLocales.isActive !== null) {
    filtros.isActive = filtrosLocales.isActive;
  }

  emit('update:filters', filtros);
};

const limpiarFiltros = (): void => {
  filtrosLocales.search = '';
  filtrosLocales.isActive = null;

  emit('update:filters', {
    page: 1,
  });
};

watch(
  () => props.filters,
  (nuevosFiltros) => {
    filtrosLocales.search = nuevosFiltros.search ?? '';
    filtrosLocales.isActive = nuevosFiltros.isActive ?? null;
  },
  { deep: true },
);
</script>
