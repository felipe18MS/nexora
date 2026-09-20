<template>
  <q-table
    flat
    bordered
    :rows="pedidos"
    :columns="columnas"
    row-key="id"
    :loading="cargando"
    no-data-label="No hay pedidos"
    loading-label="Cargando pedidos..."
    :rows-per-page-options="[10, 20, 50]"
  >
    <template #body-cell-id="props">
      <q-td :props="props">
        <span class="text-weight-medium">
          {{ props.row.id }}
        </span>
      </q-td>
    </template>

    <template #body-cell-clienteNombre="props">
      <q-td :props="props">
        {{ props.row.clienteNombre }}
      </q-td>
    </template>

    <template #body-cell-items="props">
      <q-td :props="props">
        {{ props.row.items.length }}
      </q-td>
    </template>

    <template #body-cell-total="props">
      <q-td :props="props">
        {{ formatearMoneda(props.row.total) }}
      </q-td>
    </template>

    <template #body-cell-estado="props">
      <q-td :props="props">
        <q-badge
          :color="obtenerColorEstado(props.row.estado)"
          :label="obtenerTextoEstado(props.row.estado)"
        />
      </q-td>
    </template>

    <template #body-cell-metodoPago="props">
      <q-td :props="props">
        {{ obtenerTextoMetodoPago(props.row.metodoPago) }}
      </q-td>
    </template>

    <template #body-cell-creadoEn="props">
      <q-td :props="props">
        {{ formatearFecha(props.row.creadoEn) }}
      </q-td>
    </template>

    <template #body-cell-acciones="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          dense
          color="primary"
          icon="visibility"
          aria-label="Ver pedido"
          @click="verPedido(props.row)"
        >
          <q-tooltip> Ver pedido </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          color="secondary"
          icon="sync_alt"
          aria-label="Cambiar estado"
          @click="cambiarEstado(props.row)"
        >
          <q-tooltip> Cambiar estado </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { EstadoPedido, MetodoPago, Pedido } from '../types/order.types';

interface Props {
  pedidos: Pedido[];
  cargando: boolean;
}

interface Emits {
  (event: 'ver', pedido: Pedido): void;
  (event: 'cambiar-estado', pedido: Pedido): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();

const columnas: QTableColumn<Pedido>[] = [
  {
    name: 'id',
    label: 'Pedido',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'clienteNombre',
    label: 'Cliente',
    field: 'clienteNombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'items',
    label: 'Items',
    field: 'items',
    align: 'center',
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'right',
    sortable: true,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
    sortable: true,
  },
  {
    name: 'metodoPago',
    label: 'Pago',
    field: 'metodoPago',
    align: 'left',
  },
  {
    name: 'creadoEn',
    label: 'Fecha',
    field: 'creadoEn',
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

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerTextoEstado = (estado: EstadoPedido): string => {
  const textos: Record<EstadoPedido, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    'en-preparacion': 'En preparación',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  return textos[estado];
};

const obtenerColorEstado = (estado: EstadoPedido): string => {
  const colores: Record<EstadoPedido, string> = {
    pendiente: 'warning',
    confirmado: 'primary',
    'en-preparacion': 'info',
    listo: 'secondary',
    entregado: 'positive',
    cancelado: 'negative',
  };

  return colores[estado];
};

const obtenerTextoMetodoPago = (metodo: MetodoPago): string => {
  const textos: Record<MetodoPago, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    otro: 'Otro',
  };

  return textos[metodo];
};

const verPedido = (pedido: Pedido): void => {
  emit('ver', pedido);
};

const cambiarEstado = (pedido: Pedido): void => {
  emit('cambiar-estado', pedido);
};
</script>
