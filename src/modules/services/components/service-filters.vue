<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-5">
      <q-input
        v-model="localFilters.search"
        outlined
        dense
        clearable
        label="Buscar servicio"
        placeholder="Nombre, categoría..."
        @update:model-value="emitFilters"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <q-select
        v-model="localFilters.category"
        outlined
        dense
        clearable
        label="Categoría"
        :options="categoryOptions"
        @update:model-value="emitFilters"
      />
    </div>

    <div class="col-12 col-md-3">
      <q-select
        v-model="localFilters.isActive"
        outlined
        dense
        clearable
        label="Estado"
        :options="statusOptions"
        emit-value
        map-options
        @update:model-value="emitFilters"
      />
    </div>

    <div class="col-12 col-md-1 flex items-center">
      <q-btn flat round icon="filter_alt_off" color="grey-7" @click="limpiar">
        <q-tooltip>Limpiar filtros</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type { ServiceFilters } from '../types/service.types';

const props = defineProps<{
  filters: ServiceFilters;
}>();

const emit = defineEmits<{
  'update:filters': [filters: ServiceFilters];
}>();

interface LocalServiceFilters {
  search: string;
  category: string | null;
  isActive: boolean | null;
}

const localFilters = reactive<LocalServiceFilters>({
  search: props.filters.search ?? '',
  category: props.filters.category ?? null,
  isActive: props.filters.isActive ?? null,
});

const categoryOptions = ['Cabello', 'Uñas', 'Barbería', 'Bienestar', 'Estética'];

const statusOptions = [
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false },
];

const emitFilters = (): void => {
  const filters: ServiceFilters = {};

  if (localFilters.search.trim()) {
    filters.search = localFilters.search.trim();
  }

  if (localFilters.category !== null) {
    filters.category = localFilters.category;
  }

  if (localFilters.isActive !== null) {
    filters.isActive = localFilters.isActive;
  }

  emit('update:filters', filters);
};

const limpiar = (): void => {
  localFilters.search = '';
  localFilters.category = null;
  localFilters.isActive = null;

  emitFilters();
};
</script>
