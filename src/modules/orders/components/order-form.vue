<template>
  <q-form class="q-gutter-md" @submit.prevent="guardar">
    <q-select
      v-model="formulario.clienteId"
      outlined
      dense
      emit-value
      map-options
      label="Cliente"
      :options="clientes"
      :rules="[(valor) => Boolean(valor) || 'Selecciona un cliente']"
      @update:model-value="actualizarCliente"
    />

    <q-separator />

    <div class="text-subtitle1 text-weight-medium">Items del pedido</div>

    <div
      v-for="(item, index) in formulario.items"
      :key="item.id"
      class="row q-col-gutter-sm items-start"
    >
      <div class="col-12 col-md-5">
        <q-select
          v-model="item.productoId"
          outlined
          dense
          emit-value
          map-options
          label="Producto o servicio"
          :options="opcionesItems"
          @update:model-value="(id) => actualizarItem(item, id)"
        />
      </div>

      <div class="col-4 col-md-2">
        <q-input
          v-model.number="item.cantidad"
          outlined
          dense
          type="number"
          min="1"
          label="Cantidad"
          @update:model-value="calcularItem(item)"
        />
      </div>

      <div class="col-6 col-md-3">
        <q-input
          v-model.number="item.precioUnitario"
          outlined
          dense
          type="number"
          min="0"
          label="Precio"
          prefix="$"
          @update:model-value="calcularItem(item)"
        />
      </div>

      <div class="col-2 col-md-1 flex flex-center">
        <div class="text-weight-medium">
          {{ formatearMoneda(item.subtotal) }}
        </div>
      </div>

      <div class="col-12 col-md-1 flex justify-end">
        <q-btn
          flat
          round
          dense
          color="negative"
          icon="delete"
          :disable="formulario.items.length === 1"
          @click="eliminarItem(index)"
        />
      </div>
    </div>

    <q-btn flat color="primary" icon="add" label="Agregar item" @click="agregarItem" />

    <q-input
      v-model.number="formulario.descuento"
      outlined
      dense
      type="number"
      min="0"
      label="Descuento"
      prefix="$"
    />

    <q-select
      v-model="formulario.metodoPago"
      outlined
      dense
      emit-value
      map-options
      label="Método de pago"
      :options="opcionesMetodoPago"
    />

    <q-input v-model="formulario.notas" outlined dense autogrow type="textarea" label="Notas" />

    <q-separator />

    <div class="row justify-end">
      <div class="text-h6">
        Total:
        {{ formatearMoneda(total) }}
      </div>
    </div>

    <div class="row justify-end q-gutter-sm">
      <q-btn flat label="Cancelar" color="grey-7" @click="cancelar" />

      <q-btn unelevated color="primary" label="Crear pedido" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

import type { CrearPedido, ItemPedido, MetodoPago } from '../types/order.types';

interface Props {
  clientes: Array<{
    label: string;
    value: string;
  }>;
  opcionesItems: Array<{
    label: string;
    value: string;
    precio: number;
  }>;
}

interface Emits {
  (event: 'guardar', datos: CrearPedido): void;
  (event: 'cancelar'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const opcionesMetodoPago: Array<{
  label: string;
  value: MetodoPago;
}> = [
  {
    label: 'Efectivo',
    value: 'efectivo',
  },
  {
    label: 'Tarjeta',
    value: 'tarjeta',
  },
  {
    label: 'Transferencia',
    value: 'transferencia',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const crearItem = (): ItemPedido => ({
  id: `item-${Date.now()}-${Math.random()}`,
  nombre: '',
  cantidad: 1,
  precioUnitario: 0,
  subtotal: 0,
});

const formulario = reactive<{
  clienteId: string;
  clienteNombre: string;
  items: ItemPedido[];
  descuento: number;
  metodoPago: MetodoPago;
  notas: string;
}>({
  clienteId: '',
  clienteNombre: '',
  items: [crearItem()],
  descuento: 0,
  metodoPago: 'efectivo',
  notas: '',
});

const total = computed(() => {
  const subtotal = formulario.items.reduce((suma, item) => suma + item.subtotal, 0);

  return Math.max(0, subtotal - formulario.descuento);
});

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const actualizarCliente = (clienteId: string): void => {
  const cliente = props.clientes.find((item) => item.value === clienteId);

  formulario.clienteNombre = cliente?.label ?? '';
};

const actualizarItem = (item: ItemPedido, id: string): void => {
  const opcion = props.opcionesItems.find((itemOption) => itemOption.value === id);

  if (!opcion) {
    return;
  }

  item.productoId = id;
  item.nombre = opcion.label;
  item.precioUnitario = opcion.precio;

  calcularItem(item);
};

const calcularItem = (item: ItemPedido): void => {
  item.cantidad = Math.max(1, Number(item.cantidad) || 1);
  item.precioUnitario = Math.max(0, Number(item.precioUnitario) || 0);

  item.subtotal = item.cantidad * item.precioUnitario;
};

const agregarItem = (): void => {
  formulario.items.push(crearItem());
};

const eliminarItem = (index: number): void => {
  if (formulario.items.length === 1) {
    return;
  }

  formulario.items.splice(index, 1);
};

const guardar = (): void => {
  if (!formulario.clienteId) {
    return;
  }

  const itemsValidos = formulario.items.filter(
    (item) => item.nombre && item.cantidad > 0 && item.precioUnitario >= 0,
  );

  if (!itemsValidos.length) {
    return;
  }

  emit('guardar', {
    clienteId: formulario.clienteId,
    clienteNombre: formulario.clienteNombre,
    items: itemsValidos,
    descuento: formulario.descuento,
    metodoPago: formulario.metodoPago,
    notas: formulario.notas.trim(),
  });
};

const cancelar = (): void => {
  emit('cancelar');
};
</script>
