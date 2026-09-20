<template>
  <div class="call-filters">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-5">
        <q-input
          :model-value="filtros.busqueda"
          outlined
          dense
          clearable
          label="Buscar llamada"
          placeholder="Cliente o teléfono"
          @update:model-value="
            actualizarFiltros({
              busqueda: String($event ?? ''),
            })
          "
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3">
        <q-select
          :model-value="filtros.direccion"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Dirección"
          :options="opcionesDireccion"
          @update:model-value="
            actualizarFiltros({
              direccion: $event,
            })
          "
        />
      </div>

      <div class="col-12 col-md-3">
        <q-select
          :model-value="filtros.estado"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Estado"
          :options="opcionesEstado"
          @update:model-value="
            actualizarFiltros({
              estado: $event,
            })
          "
        />
      </div>

      <div class="col-12 col-md-1 flex items-center justify-end">
        <q-btn
          flat
          round
          icon="filter_alt_off"
          color="grey-7"
          :disable="!hayFiltrosActivos"
          @click="limpiarFiltros"
        >
          <q-tooltip>Limpiar filtros</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-12 col-md-4">
        <q-select
          :model-value="filtros.resultado"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Resultado"
          :options="opcionesResultado"
          @update:model-value="
            actualizarFiltros({
              resultado: $event,
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useCalls } from '../composables/use-calls';

import type { DireccionLlamada, EstadoLlamada, ResultadoLlamada } from '../types/call.types';

const { filtros, actualizarFiltros, limpiarFiltros } = useCalls();

const opcionesDireccion: Array<{
  label: string;
  value: DireccionLlamada;
}> = [
  {
    label: 'Entrantes',
    value: 'entrante',
  },
  {
    label: 'Salientes',
    value: 'saliente',
  },
];

const opcionesEstado: Array<{
  label: string;
  value: EstadoLlamada;
}> = [
  {
    label: 'Completada',
    value: 'completada',
  },
  {
    label: 'Perdida',
    value: 'perdida',
  },
  {
    label: 'Rechazada',
    value: 'rechazada',
  },
  {
    label: 'En curso',
    value: 'en-curso',
  },
  {
    label: 'Programada',
    value: 'programada',
  },
];

const opcionesResultado: Array<{
  label: string;
  value: ResultadoLlamada;
}> = [
  {
    label: 'Cita agendada',
    value: 'cita-agendada',
  },
  {
    label: 'Consulta',
    value: 'consulta',
  },
  {
    label: 'Seguimiento',
    value: 'seguimiento',
  },
  {
    label: 'Sin respuesta',
    value: 'sin-respuesta',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const hayFiltrosActivos = computed(() => {
  return (
    filtros.value.busqueda.trim() !== '' ||
    filtros.value.direccion !== null ||
    filtros.value.estado !== null ||
    filtros.value.resultado !== null
  );
});
</script>
