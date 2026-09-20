<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="text-caption text-grey-7">Cliente</div>

        <div class="text-subtitle1 text-weight-medium">
          {{ recordatorio.clienteNombre }}
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="text-caption text-grey-7">Estado</div>

        <q-badge
          :color="obtenerColorEstado(recordatorio.estado)"
          :label="obtenerLabelEstado(recordatorio.estado)"
        />
      </div>

      <div class="col-12">
        <div class="text-caption text-grey-7">Título</div>

        <div class="text-subtitle1">
          {{ recordatorio.titulo }}
        </div>
      </div>

      <div class="col-12">
        <div class="text-caption text-grey-7">Mensaje</div>

        <div class="text-body1">
          {{ recordatorio.mensaje }}
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="text-caption text-grey-7">Tipo</div>

        <div>
          {{ obtenerLabelTipo(recordatorio.tipo) }}
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="text-caption text-grey-7">Canal</div>

        <div>
          {{ obtenerLabelCanal(recordatorio.canal) }}
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="text-caption text-grey-7">Programado</div>

        <div>
          {{ formatearFecha(recordatorio.fechaProgramada) }}
        </div>
      </div>

      <div v-if="recordatorio.referenciaId" class="col-12">
        <div class="text-caption text-grey-7">Referencia</div>

        <div>
          {{ recordatorio.referenciaId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CanalRecordatorio,
  EstadoRecordatorio,
  Recordatorio,
  TipoRecordatorio,
} from '../types/reminder.types';

interface Props {
  recordatorio: Recordatorio;
}

defineProps<Props>();

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

const obtenerLabelCanal = (canal: CanalRecordatorio): string => {
  const labels: Record<CanalRecordatorio, string> = {
    whatsapp: 'WhatsApp',
    llamada: 'Llamada',
    email: 'Email',
    interno: 'Interno',
  };

  return labels[canal];
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
