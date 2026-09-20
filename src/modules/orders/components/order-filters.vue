<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-5">
      <q-input
        v-model="filtrosLocal.busqueda"
        outlined
        dense
        clearable
        label="Buscar pedido"
        placeholder="Cliente o número de pedido"
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
        v-model="filtrosLocal.metodoPago"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Método de pago"
        :options="opcionesMetodoPago"
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
import { reactive, watch } from 'vue';

import type { EstadoPedido, FiltrosPedido, MetodoPago } from '../types/order.types';

interface Props {
  modelValue: FiltrosPedido;
}

interface Emits {
  (event: 'update:modelValue', value: FiltrosPedido): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const filtrosLocal = reactive<FiltrosPedido>({
  busqueda: props.modelValue.busqueda,
  estado: props.modelValue.estado,
  metodoPago: props.modelValue.metodoPago,
});

const opcionesEstado = [
  {
    label: 'Pendiente',
    value: 'pendiente' as EstadoPedido,
  },
  {
    label: 'Confirmado',
    value: 'confirmado' as EstadoPedido,
  },
  {
    label: 'En preparación',
    value: 'en-preparacion' as EstadoPedido,
  },
  {
    label: 'Listo',
    value: 'listo' as EstadoPedido,
  },
  {
    label: 'Entregado',
    value: 'entregado' as EstadoPedido,
  },
  {
    label: 'Cancelado',
    value: 'cancelado' as EstadoPedido,
  },
];

const opcionesMetodoPago = [
  {
    label: 'Efectivo',
    value: 'efectivo' as MetodoPago,
  },
  {
    label: 'Tarjeta',
    value: 'tarjeta' as MetodoPago,
  },
  {
    label: 'Transferencia',
    value: 'transferencia' as MetodoPago,
  },
  {
    label: 'Otro',
    value: 'otro' as MetodoPago,
  },
];

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
    filtrosLocal.metodoPago = nuevosFiltros.metodoPago;
  },
  {
    deep: true,
  },
);

const limpiarFiltros = (): void => {
  filtrosLocal.busqueda = '';
  filtrosLocal.estado = null;
  filtrosLocal.metodoPago = null;
};
</script>
