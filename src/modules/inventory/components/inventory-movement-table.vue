<template>
  <q-table
    flat
    bordered
    :rows="movimientos"
    :columns="columnas"
    row-key="id"
    :loading="cargando"
    no-data-label="No hay movimientos registrados"
    loading-label="Cargando movimientos..."
    :rows-per-page-options="[10, 20, 50]"
  >
    <template #body-cell-producto="props">
      <q-td :props="props">
        <div class="text-weight-medium">
          {{ obtenerNombreProducto(props.row.productoId) }}
        </div>

        <div class="text-caption text-grey-6">
          {{ props.row.productoId }}
        </div>
      </q-td>
    </template>

    <template #body-cell-tipo="props">
      <q-td :props="props">
        <q-badge
          :color="obtenerColorTipo(props.row.tipo)"
          :label="obtenerTextoTipo(props.row.tipo)"
        />
      </q-td>
    </template>

    <template #body-cell-cantidad="props">
      <q-td :props="props">
        <span class="text-weight-medium" :class="obtenerClaseCantidad(props.row.tipo)">
          {{ obtenerPrefijoCantidad(props.row.tipo) }}{{ props.row.cantidad }}
        </span>
      </q-td>
    </template>

    <template #body-cell-creadoEn="props">
      <q-td :props="props">
        {{ formatearFecha(props.row.creadoEn) }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { MovimientoInventario, TipoMovimientoInventario } from '../types/inventory.types';

interface Props {
  movimientos: MovimientoInventario[];
  cargando: boolean;
  nombresProductos: Record<string, string>;
}

const props = defineProps<Props>();

const columnas: QTableColumn<MovimientoInventario>[] = [
  {
    name: 'producto',
    label: 'Producto',
    field: 'productoId',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cantidad',
    label: 'Cantidad',
    field: 'cantidad',
    align: 'center',
    sortable: true,
  },
  {
    name: 'motivo',
    label: 'Motivo',
    field: 'motivo',
    align: 'left',
  },
  {
    name: 'creadoPor',
    label: 'Registrado por',
    field: 'creadoPor',
    align: 'left',
  },
  {
    name: 'creadoEn',
    label: 'Fecha',
    field: 'creadoEn',
    align: 'left',
    sortable: true,
  },
];

const obtenerNombreProducto = (productoId: string): string => {
  return props.nombresProductos[productoId] ?? productoId;
};

const obtenerTextoTipo = (tipo: TipoMovimientoInventario): string => {
  const textos: Record<TipoMovimientoInventario, string> = {
    entrada: 'Entrada',
    salida: 'Salida',
    ajuste: 'Ajuste',
  };

  return textos[tipo];
};

const obtenerColorTipo = (tipo: TipoMovimientoInventario): string => {
  const colores: Record<TipoMovimientoInventario, string> = {
    entrada: 'positive',
    salida: 'negative',
    ajuste: 'warning',
  };

  return colores[tipo];
};

const obtenerClaseCantidad = (tipo: TipoMovimientoInventario): string => {
  if (tipo === 'entrada') {
    return 'text-positive';
  }

  if (tipo === 'salida') {
    return 'text-negative';
  }

  return 'text-warning';
};

const obtenerPrefijoCantidad = (tipo: TipoMovimientoInventario): string => {
  if (tipo === 'entrada') {
    return '+';
  }

  if (tipo === 'salida') {
    return '-';
  }

  return '';
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};
</script>
