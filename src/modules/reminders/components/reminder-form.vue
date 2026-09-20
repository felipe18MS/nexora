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

    <q-input
      v-model="formulario.titulo"
      outlined
      dense
      label="Título"
      :rules="[(valor) => Boolean(valor?.trim()) || 'Ingresa un título']"
    />

    <q-input
      v-model="formulario.mensaje"
      outlined
      dense
      autogrow
      type="textarea"
      label="Mensaje"
      :rules="[(valor) => Boolean(valor?.trim()) || 'Ingresa un mensaje']"
    />

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.tipo"
          outlined
          dense
          emit-value
          map-options
          label="Tipo"
          :options="opcionesTipo"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.canal"
          outlined
          dense
          emit-value
          map-options
          label="Canal"
          :options="opcionesCanal"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.fechaProgramada"
          outlined
          dense
          type="datetime-local"
          label="Fecha programada"
        />
      </div>
    </div>

    <q-input
      v-model="formulario.referenciaId"
      outlined
      dense
      label="Referencia"
      hint="Opcional: cita, pedido u otro registro relacionado"
    />

    <q-separator />

    <div class="row justify-end q-gutter-sm">
      <q-btn flat color="grey-7" label="Cancelar" @click="cancelar" />

      <q-btn unelevated color="primary" label="Crear recordatorio" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type {
  CanalRecordatorio,
  CrearRecordatorio,
  TipoRecordatorio,
} from '../types/reminder.types';

interface Props {
  clientes: Array<{
    label: string;
    value: string;
  }>;
}

interface Emits {
  (event: 'guardar', datos: CrearRecordatorio): void;
  (event: 'cancelar'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

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

const opcionesCanal: Array<{
  label: string;
  value: CanalRecordatorio;
}> = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Llamada', value: 'llamada' },
  { label: 'Email', value: 'email' },
  { label: 'Interno', value: 'interno' },
];

const obtenerFechaInicial = (): string => {
  const fecha = new Date();

  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

  return fecha.toISOString().slice(0, 16);
};

const formulario = reactive<{
  clienteId: string;
  clienteNombre: string;
  titulo: string;
  mensaje: string;
  tipo: TipoRecordatorio;
  canal: CanalRecordatorio;
  fechaProgramada: string;
  referenciaId: string;
}>({
  clienteId: '',
  clienteNombre: '',
  titulo: '',
  mensaje: '',
  tipo: 'cita',
  canal: 'whatsapp',
  fechaProgramada: obtenerFechaInicial(),
  referenciaId: '',
});

const actualizarCliente = (clienteId: string): void => {
  const cliente = props.clientes.find((item) => item.value === clienteId);

  formulario.clienteNombre = cliente?.label ?? '';
};

const guardar = (): void => {
  if (!formulario.clienteId || !formulario.titulo.trim() || !formulario.mensaje.trim()) {
    return;
  }

  const datos: CrearRecordatorio = {
    clienteId: formulario.clienteId,
    clienteNombre: formulario.clienteNombre,
    titulo: formulario.titulo.trim(),
    mensaje: formulario.mensaje.trim(),
    tipo: formulario.tipo,
    canal: formulario.canal,
    fechaProgramada: formulario.fechaProgramada,
    ...(formulario.referenciaId.trim()
      ? {
          referenciaId: formulario.referenciaId.trim(),
        }
      : {}),
  };

  emit('guardar', datos);
};

const cancelar = (): void => {
  emit('cancelar');
};
</script>
