<template>
  <div class="row q-col-gutter-md items-center">
    <!-- Búsqueda -->
    <div class="col-12 col-md-6">
      <q-input
        :model-value="filtros.busqueda"
        outlined
        dense
        clearable
        label="Buscar producto"
        placeholder="Nombre, código o categoría"
        @update:model-value="actualizarBusqueda"
      >
        <template #prepend>
          <q-icon name="search" color="grey-6" />
        </template>
      </q-input>
    </div>

    <!-- Categoría -->
    <div class="col-12 col-sm-6 col-md-2">
      <q-select
        :model-value="filtros.categoria"
        :options="categorias"
        outlined
        dense
        clearable
        label="Categoría"
        @update:model-value="actualizarCategoria"
      />
    </div>

    <!-- Estado -->
    <div class="col-12 col-sm-6 col-md-2">
      <q-select
        :model-value="filtros.estado"
        :options="opcionesEstado"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        @update:model-value="actualizarEstado"
      />
    </div>

    <!-- Limpiar -->
    <div class="col-12 col-md-2">
      <q-btn
        flat
        no-caps
        icon="filter_alt_off"
        label="Limpiar"
        color="grey-7"
        class="full-width"
        @click="limpiarFiltros"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FiltrosProducto } from '../types/product.types';

interface Props {
  filtros: FiltrosProducto;
  categorias: string[];
}

defineProps<Props>();

const emit = defineEmits<{
  actualizar: [filtros: Partial<FiltrosProducto>];
  limpiar: [];
}>();

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

function actualizarBusqueda(valor: string | number | null): void {
  emit('actualizar', {
    busqueda: String(valor ?? ''),
  });
}

function actualizarCategoria(valor: string | null): void {
  emit('actualizar', {
    categoria: valor,
  });
}

function actualizarEstado(valor: boolean | null): void {
  emit('actualizar', {
    estado: valor,
  });
}

function limpiarFiltros(): void {
  emit('limpiar');
}
</script>
