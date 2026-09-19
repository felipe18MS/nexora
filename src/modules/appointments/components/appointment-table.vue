<template>
  <q-table
    flat
    bordered
    :rows="appointments"
    :columns="columnas"
    :loading="loading"
    row-key="id"
    :rows-per-page-options="[10, 20, 50]"
    class="appointment-table"
  >
    <template #body-cell-customerName="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar size="36px" color="primary" text-color="white">
            {{
              obtenerIniciales(
                props.row.customerName.split(' ')[0] ?? '',
                props.row.customerName.split(' ').slice(1).join(' '),
              )
            }}
          </q-avatar>

          <div class="q-ml-sm">
            <div class="text-weight-medium">
              {{ props.row.customerName }}
            </div>

            <div class="text-caption text-grey-6">
              {{ obtenerEtiquetaOrigen(props.row.source) }}
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-serviceName="props">
      <q-td :props="props">
        <div class="text-weight-medium">
          {{ props.row.serviceName }}
        </div>

        <div class="text-caption text-grey-6">
          {{ props.row.employeeName }}
        </div>
      </q-td>
    </template>

    <template #body-cell-date="props">
      <q-td :props="props">
        <div class="text-weight-medium">
          {{ formatearFecha(props.row.date) }}
        </div>

        <div class="text-caption text-grey-6">
          {{ props.row.startTime }} -
          {{ props.row.endTime }}
        </div>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <AppointmentStatusBadge :status="props.row.status" />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <div class="row justify-end no-wrap">
          <q-btn flat round dense color="grey-7" icon="visibility" @click="emit('ver', props.row)">
            <q-tooltip>Ver cita</q-tooltip>
          </q-btn>

          <q-btn flat round dense color="primary" icon="edit" @click="emit('editar', props.row)">
            <q-tooltip>Editar cita</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            @click="emit('eliminar', props.row)"
          >
            <q-tooltip>Eliminar cita</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>

    <template #no-data>
      <div class="full-width row flex-center q-pa-xl text-grey-6">
        <div class="text-center">
          <q-icon name="event_busy" size="48px" class="q-mb-sm" />

          <div class="text-subtitle1">No hay citas para mostrar</div>

          <div class="text-caption">Prueba cambiando los filtros o crea una nueva cita.</div>
        </div>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import { formatearFecha, obtenerIniciales } from '@/utils';

import AppointmentStatusBadge from './appointment-status-badge.vue';

import type { Appointment, AppointmentSource } from '../types/appointment.types';

interface Props {
  appointments: Appointment[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  ver: [cita: Appointment];
  editar: [cita: Appointment];
  eliminar: [cita: Appointment];
}>();

const columnas: QTableColumn<Appointment>[] = [
  {
    name: 'customerName',
    label: 'Cliente',
    field: 'customerName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'serviceName',
    label: 'Servicio / Profesional',
    field: 'serviceName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Fecha y hora',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: () => '',
    align: 'right',
  },
];

const obtenerEtiquetaOrigen = (origen: AppointmentSource): string => {
  const etiquetas: Record<AppointmentSource, string> = {
    manual: 'Manual',
    whatsapp: 'WhatsApp',
    phone: 'Llamada',
    web: 'Web',
  };

  return etiquetas[origen];
};
</script>

<style scoped>
.appointment-table {
  border-radius: 12px;
}
</style>
