<template>
  <q-table
    flat
    bordered
    :rows="inventarios"
    :columns="columnas"
    row-key="id"
    :loading="cargando"
    no-data-label="No hay registros de inventario"
    loading-label="Cargando inventario..."
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

    <template #body-cell-stock="props">
      <q-td :props="props">
        <span class="text-weight-medium">
          {{ props.row.stock }}
        </span>
      </q-td>
    </template>

    <template #body-cell-estado="props">
      <q-td :props="props">
        <q-badge :color="obtenerColorEstado(props.row)" :label="obtenerTextoEstado(props.row)" />
      </q-td>
    </template>

    <template #body-cell-ultimaActualizacion="props">
      <q-td :props="props">
        {{ formatearFecha(props.row.ultimaActualizacion) }}
      </q-td>
    </template>

    <template #body-cell-acciones="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          dense
          color="primary"
          icon="swap_vert"
          aria-label="Registrar movimiento"
          @click="emitirMovimiento(props.row)"
        >
          <q-tooltip> Registrar movimiento </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { Inventario } from '../types/inventory.types';

interface Props {
  inventarios: Inventario[];
  cargando: boolean;
  nombresProductos: Record<string, string>;
}

interface Emits {
  (event: 'registrar-movimiento', inventario: Inventario): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const columnas: QTableColumn<Inventario>[] = [
  {
    name: 'producto',
    label: 'Producto',
    field: 'productoId',
    align: 'left',
    sortable: true,
  },
  {
    name: 'stock',
    label: 'Stock',
    field: 'stock',
    align: 'center',
    sortable: true,
  },
  {
    name: 'stockMinimo',
    label: 'Stock mínimo',
    field: 'stockMinimo',
    align: 'center',
    sortable: true,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'stock',
    align: 'center',
  },
  {
    name: 'ubicacion',
    label: 'Ubicación',
    field: 'ubicacion',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ultimaActualizacion',
    label: 'Última actualización',
    field: 'ultimaActualizacion',
    align: 'left',
    sortable: true,
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'id',
    align: 'center',
  },
];

const obtenerNombreProducto = (productoId: string): string => {
  return props.nombresProductos[productoId] ?? productoId;
};

const obtenerTextoEstado = (inventario: Inventario): string => {
  if (inventario.stock === 0) {
    return 'Agotado';
  }

  if (inventario.stock <= inventario.stockMinimo) {
    return 'Stock bajo';
  }

  return 'Disponible';
};

const obtenerColorEstado = (inventario: Inventario): string => {
  if (inventario.stock === 0) {
    return 'negative';
  }

  if (inventario.stock <= inventario.stockMinimo) {
    return 'warning';
  }

  return 'positive';
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const emitirMovimiento = (inventario: Inventario): void => {
  emit('registrar-movimiento', inventario);
};
</script>
