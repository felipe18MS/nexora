<template>
  <div class="filters-container">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-subtitle1 text-weight-medium">Filtros</div>

        <div class="text-caption text-grey-6">Encuentra rápidamente una cita.</div>
      </div>

      <div class="col-auto">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          icon="filter_alt_off"
          label="Limpiar filtros"
          :disable="!hayFiltros"
          @click="limpiarFiltros"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Búsqueda -->
      <div class="col-12 col-md-5">
        <q-input
          v-model="filtrosLocales.search"
          outlined
          dense
          clearable
          label="Buscar cita"
          placeholder="Cliente, servicio o profesional"
          clear-icon="close"
          @update:model-value="manejarCambio"
          @clear="manejarCambio"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Fecha -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-input
          v-model="filtrosLocales.date"
          outlined
          dense
          clearable
          type="date"
          label="Fecha"
          clear-icon="close"
          @update:model-value="manejarCambio"
          @clear="manejarCambio"
        />
      </div>

      <!-- Estado -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-select
          v-model="filtrosLocales.status"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Estado"
          clear-icon="close"
          :options="opcionesEstado"
          @update:model-value="manejarCambio"
          @clear="manejarCambio"
        >
          <template #prepend>
            <q-icon name="event_available" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Indicadores de filtros activos -->
    <div v-if="hayFiltros" class="row items-center q-gutter-sm q-mt-md">
      <div class="text-caption text-grey-7">Filtros activos:</div>

      <q-chip
        v-if="filtrosLocales.search"
        removable
        dense
        color="primary"
        text-color="white"
        icon="search"
        @remove="limpiarBusqueda"
      >
        {{ filtrosLocales.search }}
      </q-chip>

      <q-chip
        v-if="filtrosLocales.date"
        removable
        dense
        color="primary"
        text-color="white"
        icon="event"
        @remove="limpiarFecha"
      >
        {{ filtrosLocales.date }}
      </q-chip>

      <q-chip
        v-if="filtrosLocales.status"
        removable
        dense
        color="primary"
        text-color="white"
        icon="event_available"
        @remove="limpiarEstado"
      >
        {{ obtenerEtiquetaEstado(filtrosLocales.status) }}
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { AppointmentFilters, AppointmentStatus } from '../types/appointment.types';

interface Props {
  filters: AppointmentFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:filters': [filters: AppointmentFilters];
}>();

interface FiltrosLocales {
  search: string;
  date: string;
  status: AppointmentStatus | null;
}

const filtrosLocales = reactive<FiltrosLocales>({
  search: props.filters.search ?? '',
  date: props.filters.date ?? '',
  status: props.filters.status ?? null,
});

const opcionesEstado = [
  {
    label: 'Pendiente',
    value: 'pending',
  },
  {
    label: 'Confirmada',
    value: 'confirmed',
  },
  {
    label: 'En curso',
    value: 'in_progress',
  },
  {
    label: 'Completada',
    value: 'completed',
  },
  {
    label: 'Cancelada',
    value: 'cancelled',
  },
  {
    label: 'No asistió',
    value: 'no_show',
  },
];

const hayFiltros = computed(() => {
  return Boolean(filtrosLocales.search.trim() || filtrosLocales.date || filtrosLocales.status);
});

const emitirFiltros = (): void => {
  const filtros: AppointmentFilters = {
    page: 1,
  };

  const search = filtrosLocales.search.trim();

  if (search) {
    filtros.search = search;
  }

  if (filtrosLocales.date) {
    filtros.date = filtrosLocales.date;
  }

  if (filtrosLocales.status) {
    filtros.status = filtrosLocales.status;
  }

  emit('update:filters', filtros);
};

const manejarCambio = (): void => {
  emitirFiltros();
};

const limpiarBusqueda = (): void => {
  filtrosLocales.search = '';
  emitirFiltros();
};

const limpiarFecha = (): void => {
  filtrosLocales.date = '';
  emitirFiltros();
};

const limpiarEstado = (): void => {
  filtrosLocales.status = null;
  emitirFiltros();
};

const limpiarFiltros = (): void => {
  filtrosLocales.search = '';
  filtrosLocales.date = '';
  filtrosLocales.status = null;

  emit('update:filters', {
    page: 1,
  });
};

const obtenerEtiquetaEstado = (estado: AppointmentStatus): string => {
  const etiquetas: Record<AppointmentStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada',
    no_show: 'No asistió',
  };

  return etiquetas[estado];
};

watch(
  () => props.filters,
  (nuevosFiltros) => {
    filtrosLocales.search = nuevosFiltros.search ?? '';

    filtrosLocales.date = nuevosFiltros.date ?? '';

    filtrosLocales.status = nuevosFiltros.status ?? null;
  },
  {
    deep: true,
  },
);
</script>

<style scoped>
.filters-container {
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: var(--q-background);
}
</style>
