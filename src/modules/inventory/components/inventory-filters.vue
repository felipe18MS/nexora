<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-5">
      <q-input
        v-model="filtrosLocal.busqueda"
        outlined
        dense
        clearable
        label="Buscar producto"
        placeholder="Nombre o código del producto"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <q-select
        v-model="filtrosLocal.estado"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        :options="opcionesEstado"
      />
    </div>

    <div class="col-12 col-md-3">
      <q-select
        v-model="filtrosLocal.ubicacion"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Ubicación"
        :options="opcionesUbicacion"
      />
    </div>

    <div class="col-12 col-md-1 flex items-center">
      <q-btn
        flat
        round
        color="grey-7"
        icon="filter_alt_off"
        aria-label="Limpiar filtros"
        @click="limpiarFiltros"
      >
        <q-tooltip> Limpiar filtros </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { EstadoInventario, FiltrosInventario } from '../types/inventory.types';

interface Props {
  modelValue: FiltrosInventario;
  ubicaciones: string[];
}

interface Emits {
  (event: 'update:modelValue', value: FiltrosInventario): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const filtrosLocal = reactive<FiltrosInventario>({
  busqueda: props.modelValue.busqueda,
  estado: props.modelValue.estado,
  ubicacion: props.modelValue.ubicacion,
});

const opcionesEstado = [
  {
    label: 'Disponible',
    value: 'disponible' as EstadoInventario,
  },
  {
    label: 'Stock bajo',
    value: 'stock-bajo' as EstadoInventario,
  },
  {
    label: 'Agotado',
    value: 'agotado' as EstadoInventario,
  },
];

const opcionesUbicacion = computed(() =>
  props.ubicaciones.map((ubicacion) => ({
    label: ubicacion,
    value: ubicacion,
  })),
);

watch(
  filtrosLocal,
  (nuevosFiltros) => {
    emit('update:modelValue', {
      ...nuevosFiltros,
    });
  },
  {
    deep: true,
  },
);

watch(
  () => props.modelValue,
  (nuevosFiltros) => {
    filtrosLocal.busqueda = nuevosFiltros.busqueda;
    filtrosLocal.estado = nuevosFiltros.estado;
    filtrosLocal.ubicacion = nuevosFiltros.ubicacion;
  },
  {
    deep: true,
  },
);

const limpiarFiltros = (): void => {
  filtrosLocal.busqueda = '';
  filtrosLocal.estado = null;
  filtrosLocal.ubicacion = null;
};
</script>
