<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model="localFilters.search"
        outlined
        dense
        clearable
        label="Buscar empleado"
        placeholder="Nombre, teléfono, correo..."
        @update:model-value="emitFilters"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <q-select
        v-model="localFilters.role"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Rol"
        :options="roleOptions"
        @update:model-value="emitFilters"
      />
    </div>

    <div class="col-12 col-md-2">
      <q-select
        v-model="localFilters.isActive"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        :options="statusOptions"
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

import type { EmployeeFilters, EmployeeRole } from '../types/employee.types';

const props = defineProps<{
  filters: EmployeeFilters;
}>();

const emit = defineEmits<{
  'update:filters': [filters: EmployeeFilters];
}>();

interface LocalEmployeeFilters {
  search: string;
  role: EmployeeRole | null;
  isActive: boolean | null;
}

const localFilters = reactive<LocalEmployeeFilters>({
  search: props.filters.search ?? '',
  role: props.filters.role ?? null,
  isActive: props.filters.isActive ?? null,
});

const roleOptions: {
  label: string;
  value: EmployeeRole;
}[] = [
  { label: 'Administrador', value: 'owner' },
  { label: 'Gerente', value: 'manager' },
  { label: 'Profesional', value: 'professional' },
  { label: 'Asistente', value: 'assistant' },
];

const statusOptions = [
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false },
];

const emitFilters = (): void => {
  const filters: EmployeeFilters = {};

  if (localFilters.search.trim()) {
    filters.search = localFilters.search.trim();
  }

  if (localFilters.role !== null) {
    filters.role = localFilters.role;
  }

  if (localFilters.isActive !== null) {
    filters.isActive = localFilters.isActive;
  }

  emit('update:filters', filters);
};

const limpiar = (): void => {
  localFilters.search = '';
  localFilters.role = null;
  localFilters.isActive = null;

  emitFilters();
};
</script>
