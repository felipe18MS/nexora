<template>
  <div class="call-table">
    <q-table
      flat
      bordered
      :rows="llamadas"
      :columns="columns"
      row-key="id"
      :loading="cargando"
      :pagination="pagination"
      no-data-label="No hay llamadas para mostrar"
      loading-label="Cargando llamadas..."
    >
      <template #body-cell-cliente="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="36px" color="grey-2" text-color="grey-8" class="q-mr-sm">
              {{ obtenerIniciales(props.row.clienteNombre) }}
            </q-avatar>

            <div>
              <div class="text-weight-medium">
                {{ props.row.clienteNombre }}
              </div>

              <div class="text-caption text-grey-6">
                {{ props.row.telefono }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-direccion="props">
        <q-td :props="props">
          <q-badge outline :color="props.row.direccion === 'entrante' ? 'primary' : 'grey-7'">
            <q-icon
              :name="props.row.direccion === 'entrante' ? 'call_received' : 'call_made'"
              size="14px"
              class="q-mr-xs"
            />

            {{ props.row.direccion === 'entrante' ? 'Entrante' : 'Saliente' }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-estado="props">
        <q-td :props="props">
          <q-badge outline :color="obtenerColorEstado(props.row.estado)">
            <q-icon :name="obtenerIconoEstado(props.row.estado)" size="14px" class="q-mr-xs" />

            {{ obtenerLabelEstado(props.row.estado) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-duracion="props">
        <q-td :props="props">
          {{ formatearDuracion(props.row.duracionSegundos) }}
        </q-td>
      </template>

      <template #body-cell-fechaHora="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ formatearFecha(props.row.fechaHora) }}
          </div>

          <div class="text-caption text-grey-6">
            {{ formatearHora(props.row.fechaHora) }}
          </div>
        </q-td>
      </template>

      <template #body-cell-resultado="props">
        <q-td :props="props">
          <span v-if="props.row.resultado" class="text-grey-8">
            {{ obtenerLabelResultado(props.row.resultado) }}
          </span>

          <span v-else class="text-grey-5"> Sin resultado </span>
        </q-td>
      </template>

      <template #body-cell-acciones="props">
        <q-td :props="props">
          <div class="row justify-end no-wrap">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="grey-7"
              @click="emit('details', props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>

            <q-btn flat round dense icon="edit" color="grey-7" @click="emit('edit', props.row)">
              <q-tooltip>Editar llamada</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="negative"
              @click="emit('delete', props.row)"
            >
              <q-tooltip>Eliminar llamada</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #bottom>
        <div class="full-width row items-center justify-between q-px-sm q-py-sm">
          <div class="text-caption text-grey-6">
            {{ llamadas.length }}
            {{ llamadas.length === 1 ? 'llamada' : 'llamadas' }}
          </div>

          <div class="text-caption text-grey-6">Página {{ pagination.page }}</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { Llamada, EstadoLlamada, ResultadoLlamada } from '../types/call.types';

defineProps<{
  llamadas: Llamada[];
  cargando: boolean;
}>();

const emit = defineEmits<{
  details: [llamada: Llamada];
  edit: [llamada: Llamada];
  delete: [llamada: Llamada];
}>();

const pagination = {
  page: 1,
  rowsPerPage: 10,
};

const columns = [
  {
    name: 'cliente',
    label: 'Cliente',
    field: 'clienteNombre',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'direccion',
    label: 'Dirección',
    field: 'direccion',
    align: 'left' as const,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'left' as const,
  },
  {
    name: 'duracion',
    label: 'Duración',
    field: 'duracionSegundos',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'fechaHora',
    label: 'Fecha y hora',
    field: 'fechaHora',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'resultado',
    label: 'Resultado',
    field: 'resultado',
    align: 'left' as const,
  },
  {
    name: 'acciones',
    label: '',
    field: 'id',
    align: 'right' as const,
  },
];

const obtenerIniciales = (nombre: string): string => {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');
};

const formatearDuracion = (segundos: number): string => {
  if (segundos <= 0) {
    return '—';
  }

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  if (minutos === 0) {
    return `${segundosRestantes}s`;
  }

  return `${minutos}m ${segundosRestantes.toString().padStart(2, '0')}s`;
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(fecha));
};

const formatearHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerLabelEstado = (estado: EstadoLlamada): string => {
  const labels: Record<EstadoLlamada, string> = {
    completada: 'Completada',
    perdida: 'Perdida',
    rechazada: 'Rechazada',
    'en-curso': 'En curso',
    programada: 'Programada',
  };

  return labels[estado];
};

const obtenerIconoEstado = (estado: EstadoLlamada): string => {
  const iconos: Record<EstadoLlamada, string> = {
    completada: 'check_circle',
    perdida: 'phone_missed',
    rechazada: 'call_end',
    'en-curso': 'phone_in_talk',
    programada: 'schedule',
  };

  return iconos[estado];
};

const obtenerColorEstado = (estado: EstadoLlamada): string => {
  const colores: Record<EstadoLlamada, string> = {
    completada: 'positive',
    perdida: 'warning',
    rechazada: 'negative',
    'en-curso': 'primary',
    programada: 'grey-7',
  };

  return colores[estado];
};

const obtenerLabelResultado = (resultado: ResultadoLlamada): string => {
  const labels: Record<ResultadoLlamada, string> = {
    'cita-agendada': 'Cita agendada',
    consulta: 'Consulta',
    seguimiento: 'Seguimiento',
    'sin-respuesta': 'Sin respuesta',
    otro: 'Otro',
  };

  return labels[resultado];
};
</script>
