<template>
  <q-table
    flat
    :rows="recordatorios"
    :columns="columnas"
    row-key="id"
    :loading="cargando"
    no-data-label="No hay recordatorios registrados"
    loading-label="Cargando recordatorios..."
  >
    <template #body-cell-id="props">
      <q-td :props="props">
        <span class="text-weight-medium">
          {{ props.row.id }}
        </span>
      </q-td>
    </template>

    <template #body-cell-titulo="props">
      <q-td :props="props">
        <div class="text-weight-medium">
          {{ props.row.titulo }}
        </div>

        <div class="text-caption text-grey-7">
          {{ props.row.clienteNombre }}
        </div>
      </q-td>
    </template>

    <template #body-cell-tipo="props">
      <q-td :props="props">
        <q-chip dense outline :color="obtenerColorTipo(props.row.tipo)">
          {{ obtenerLabelTipo(props.row.tipo) }}
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-canal="props">
      <q-td :props="props">
        <div class="row items-center q-gutter-xs">
          <q-icon :name="obtenerIconoCanal(props.row.canal)" />

          <span>
            {{ obtenerLabelCanal(props.row.canal) }}
          </span>
        </div>
      </q-td>
    </template>

    <template #body-cell-fechaProgramada="props">
      <q-td :props="props">
        {{ formatearFecha(props.row.fechaProgramada) }}
      </q-td>
    </template>

    <template #body-cell-estado="props">
      <q-td :props="props">
        <q-badge
          :color="obtenerColorEstado(props.row.estado)"
          :label="obtenerLabelEstado(props.row.estado)"
        />
      </q-td>
    </template>

    <template #body-cell-acciones="props">
      <q-td :props="props">
        <div class="row justify-end q-gutter-xs">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            @click="$emit('ver', props.row)"
          >
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="edit" color="secondary" @click="$emit('editar', props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>

          <q-btn
            v-if="props.row.estado === 'pendiente'"
            flat
            round
            dense
            icon="send"
            color="positive"
            @click="$emit('enviar', props.row)"
          >
            <q-tooltip>Marcar como enviado</q-tooltip>
          </q-btn>

          <q-btn
            v-if="props.row.estado === 'pendiente'"
            flat
            round
            dense
            icon="cancel"
            color="negative"
            @click="$emit('cancelar', props.row)"
          >
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type {
  CanalRecordatorio,
  EstadoRecordatorio,
  Recordatorio,
  TipoRecordatorio,
} from '../types/reminder.types';

interface Props {
  recordatorios: Recordatorio[];
  cargando: boolean;
}

defineProps<Props>();

defineEmits<{
  (event: 'ver', recordatorio: Recordatorio): void;
  (event: 'editar', recordatorio: Recordatorio): void;
  (event: 'enviar', recordatorio: Recordatorio): void;
  (event: 'cancelar', recordatorio: Recordatorio): void;
}>();

const columnas: QTableColumn<Recordatorio>[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
  },
  {
    name: 'titulo',
    label: 'Recordatorio',
    field: 'titulo',
    align: 'left',
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'left',
  },
  {
    name: 'canal',
    label: 'Canal',
    field: 'canal',
    align: 'left',
  },
  {
    name: 'fechaProgramada',
    label: 'Programado',
    field: 'fechaProgramada',
    align: 'left',
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'id',
    align: 'right',
  },
];

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerLabelTipo = (tipo: TipoRecordatorio): string => {
  const labels: Record<TipoRecordatorio, string> = {
    cita: 'Cita',
    pago: 'Pago',
    seguimiento: 'Seguimiento',
    cumpleanos: 'Cumpleaños',
    general: 'General',
  };

  return labels[tipo];
};

const obtenerColorTipo = (tipo: TipoRecordatorio): string => {
  const colores: Record<TipoRecordatorio, string> = {
    cita: 'primary',
    pago: 'orange',
    seguimiento: 'secondary',
    cumpleanos: 'pink',
    general: 'grey',
  };

  return colores[tipo];
};

const obtenerLabelCanal = (canal: CanalRecordatorio): string => {
  const labels: Record<CanalRecordatorio, string> = {
    whatsapp: 'WhatsApp',
    llamada: 'Llamada',
    email: 'Email',
    interno: 'Interno',
  };

  return labels[canal];
};

const obtenerIconoCanal = (canal: CanalRecordatorio): string => {
  const iconos: Record<CanalRecordatorio, string> = {
    whatsapp: 'chat',
    llamada: 'phone',
    email: 'email',
    interno: 'notifications',
  };

  return iconos[canal];
};

const obtenerLabelEstado = (estado: EstadoRecordatorio): string => {
  const labels: Record<EstadoRecordatorio, string> = {
    pendiente: 'Pendiente',
    enviado: 'Enviado',
    cancelado: 'Cancelado',
  };

  return labels[estado];
};

const obtenerColorEstado = (estado: EstadoRecordatorio): string => {
  const colores: Record<EstadoRecordatorio, string> = {
    pendiente: 'orange',
    enviado: 'positive',
    cancelado: 'negative',
  };

  return colores[estado];
};
</script>
