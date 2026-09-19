<template>
  <q-badge
    :color="configuracion.color"
    :text-color="configuracion.textColor"
    rounded
    class="appointment-status-badge"
  >
    <q-icon :name="configuracion.icon" size="14px" class="q-mr-xs" />

    {{ configuracion.label }}
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { AppointmentStatus } from '../types/appointment.types';

interface Props {
  status: AppointmentStatus;
}

const props = defineProps<Props>();

interface ConfiguracionEstado {
  label: string;
  color: string;
  textColor: string;
  icon: string;
}

const configuraciones: Record<AppointmentStatus, ConfiguracionEstado> = {
  pending: {
    label: 'Pendiente',
    color: 'orange-2',
    textColor: 'orange-10',
    icon: 'schedule',
  },

  confirmed: {
    label: 'Confirmada',
    color: 'green-2',
    textColor: 'green-10',
    icon: 'check_circle',
  },

  in_progress: {
    label: 'En curso',
    color: 'blue-2',
    textColor: 'blue-10',
    icon: 'play_circle',
  },

  completed: {
    label: 'Completada',
    color: 'grey-3',
    textColor: 'grey-9',
    icon: 'task_alt',
  },

  cancelled: {
    label: 'Cancelada',
    color: 'red-2',
    textColor: 'red-10',
    icon: 'cancel',
  },

  no_show: {
    label: 'No asistió',
    color: 'purple-2',
    textColor: 'purple-10',
    icon: 'person_off',
  },
};

const configuracion = computed(() => {
  return configuraciones[props.status];
});
</script>

<style scoped>
.appointment-status-badge {
  padding: 6px 10px;
  font-weight: 600;
}
</style>
