<template>
  <div class="automation-filters">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-5">
        <q-input
          :model-value="filtros.busqueda"
          outlined
          dense
          clearable
          label="Buscar automatización"
          placeholder="Nombre o descripción"
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

      <div class="col-12 col-md-3">
        <q-select
          :model-value="filtros.disparador"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Disparador"
          :options="opcionesDisparador"
          @update:model-value="
            actualizarFiltros({
              disparador: $event,
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useAutomations } from '../composables/use-automations';

import type { EstadoAutomatizacion, TipoDisparadorAutomatizacion } from '../types/automation.types';

const { filtros, actualizarFiltros, limpiarFiltros } = useAutomations();

const opcionesEstado: Array<{
  label: string;
  value: EstadoAutomatizacion;
}> = [
  {
    label: 'Activa',
    value: 'activa',
  },
  {
    label: 'Inactiva',
    value: 'inactiva',
  },
  {
    label: 'Borrador',
    value: 'borrador',
  },
];

const opcionesDisparador: Array<{
  label: string;
  value: TipoDisparadorAutomatizacion;
}> = [
  {
    label: 'Cita creada',
    value: 'cita-creada',
  },
  {
    label: 'Cita confirmada',
    value: 'cita-confirmada',
  },
  {
    label: 'Cita cancelada',
    value: 'cita-cancelada',
  },
  {
    label: 'Recordatorio',
    value: 'recordatorio',
  },
  {
    label: 'Cliente creado',
    value: 'cliente-creado',
  },
  {
    label: 'Pago pendiente',
    value: 'pago-pendiente',
  },
  {
    label: 'Mensaje recibido',
    value: 'mensaje-recibido',
  },
  {
    label: 'Llamada perdida',
    value: 'llamada-perdida',
  },
  {
    label: 'Manual',
    value: 'manual',
  },
];

const hayFiltrosActivos = computed(() => {
  return (
    filtros.value.busqueda.trim() !== '' ||
    filtros.value.estado !== null ||
    filtros.value.disparador !== null
  );
});
</script>
