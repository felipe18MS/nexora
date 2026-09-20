<template>
  <q-form class="q-gutter-md" @submit.prevent="guardarMovimiento">
    <div class="text-subtitle1 text-weight-medium">Registrar movimiento</div>

    <div v-if="inventario" class="q-pa-md bg-grey-1 rounded-borders">
      <div class="text-body1 text-weight-medium">
        {{ nombreProducto }}
      </div>

      <div class="text-caption text-grey-7">Stock actual: {{ inventario.stock }}</div>

      <div class="text-caption text-grey-7">Stock mínimo: {{ inventario.stockMinimo }}</div>
    </div>

    <q-select
      v-model="formulario.tipo"
      outlined
      dense
      emit-value
      map-options
      label="Tipo de movimiento"
      :options="opcionesTipo"
      :rules="[(valor) => Boolean(valor) || 'Selecciona un tipo de movimiento']"
    />

    <q-input
      v-model.number="formulario.cantidad"
      outlined
      dense
      type="number"
      min="1"
      :label="formulario.tipo === 'ajuste' ? 'Nuevo stock' : 'Cantidad'"
      :hint="formulario.tipo === 'ajuste' ? 'Indica el nuevo stock total' : 'Cantidad de unidades'"
      :rules="[(valor) => valor > 0 || 'La cantidad debe ser mayor que 0']"
    />

    <q-input
      v-model="formulario.motivo"
      outlined
      dense
      type="textarea"
      autogrow
      label="Motivo"
      maxlength="200"
      counter
      :rules="[(valor) => Boolean(valor?.trim()) || 'Ingresa el motivo del movimiento']"
    />

    <div class="row justify-end q-gutter-sm">
      <q-btn flat label="Cancelar" color="grey-7" @click="cancelar" />

      <q-btn unelevated color="primary" label="Registrar movimiento" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type {
  CrearMovimientoInventario,
  Inventario,
  TipoMovimientoInventario,
} from '../types/inventory.types';

interface Props {
  inventario: Inventario | null;
  nombreProducto: string;
}

interface Emits {
  (event: 'guardar', datos: CrearMovimientoInventario): void;

  (event: 'cancelar'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const formulario = reactive<{
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
}>({
  tipo: 'entrada',
  cantidad: 1,
  motivo: '',
});

const opcionesTipo = [
  {
    label: 'Entrada',
    value: 'entrada' as TipoMovimientoInventario,
  },
  {
    label: 'Salida',
    value: 'salida' as TipoMovimientoInventario,
  },
  {
    label: 'Ajuste',
    value: 'ajuste' as TipoMovimientoInventario,
  },
];

watch(
  () => props.inventario,
  () => {
    formulario.tipo = 'entrada';
    formulario.cantidad = 1;
    formulario.motivo = '';
  },
);

const guardarMovimiento = (): void => {
  if (!props.inventario) {
    return;
  }

  const datos: CrearMovimientoInventario = {
    inventarioId: props.inventario.id,
    tipo: formulario.tipo,
    cantidad: formulario.cantidad,
    motivo: formulario.motivo.trim(),
    creadoPor: 'Administrador',
  };

  emit('guardar', datos);
};

const cancelar = (): void => {
  emit('cancelar');
};
</script>
