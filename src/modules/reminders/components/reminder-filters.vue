<template>
  <div class="row q-col-gutter-md items-center">
    <div class="col-12 col-md-4">
      <q-input
        v-model="filtrosLocales.busqueda"
        outlined
        dense
        clearable
        label="Buscar"
        placeholder="Cliente o título..."
        @update:model-value="emitirCambios"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-select
        v-model="filtrosLocales.estado"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        :options="opcionesEstado"
        @update:model-value="emitirCambios"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-select
        v-model="filtrosLocales.tipo"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Tipo"
        :options="opcionesTipo"
        @update:model-value="emitirCambios"
      />
    </div>

    <div class="col-12 col-md-2">
      <q-btn
        flat
        color="grey-7"
        icon="filter_alt_off"
        label="Limpiar"
        class="full-width"
        @click="limpiar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type {
  EstadoRecordatorio,
  FiltrosRecordatorio,
  TipoRecordatorio,
} from '../types/reminder.types';

interface Props {
  modelValue: FiltrosRecordatorio;
}

interface Emits {
  (event: 'update:model-value', value: FiltrosRecordatorio): void;
  (event: 'limpiar'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const filtrosLocales = reactive<FiltrosRecordatorio>({
  busqueda: props.modelValue.busqueda,
  estado: props.modelValue.estado,
  tipo: props.modelValue.tipo,
  canal: props.modelValue.canal,
});

const opcionesEstado: Array<{
  label: string;
  value: EstadoRecordatorio;
}> = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Enviado', value: 'enviado' },
  { label: 'Cancelado', value: 'cancelado' },
];

const opcionesTipo: Array<{
  label: string;
  value: TipoRecordatorio;
}> = [
  { label: 'Cita', value: 'cita' },
  { label: 'Pago', value: 'pago' },
  { label: 'Seguimiento', value: 'seguimiento' },
  { label: 'Cumpleaños', value: 'cumpleanos' },
  { label: 'General', value: 'general' },
];

const emitirCambios = (): void => {
  emit('update:model-value', {
    ...filtrosLocales,
  });
};

const limpiar = (): void => {
  filtrosLocales.busqueda = '';
  filtrosLocales.estado = null;
  filtrosLocales.tipo = null;
  filtrosLocales.canal = null;

  emit('limpiar');
};
</script>
