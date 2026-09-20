<template>
  <div class="automation-table">
    <q-table
      flat
      bordered
      :rows="automatizaciones"
      :columns="columns"
      row-key="id"
      :loading="cargando"
      :pagination="pagination"
      no-data-label="No hay automatizaciones para mostrar"
      loading-label="Cargando automatizaciones..."
    >
      <template #body-cell-automatizacion="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="38px" color="grey-2" text-color="grey-8" class="q-mr-sm">
              <q-icon name="auto_awesome" size="20px" />
            </q-avatar>

            <div>
              <div class="text-weight-medium">
                {{ props.row.nombre }}
              </div>

              <div class="text-caption text-grey-6 ellipsis">
                {{ props.row.descripcion }}
              </div>
            </div>
          </div>
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

      <template #body-cell-disparador="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-icon
              :name="obtenerIconoDisparador(props.row.disparador)"
              size="18px"
              color="grey-7"
              class="q-mr-sm"
            />

            <span>
              {{ obtenerLabelDisparador(props.row.disparador) }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-ultimaEjecucion="props">
        <q-td :props="props">
          <span v-if="props.row.ultimaEjecucion" class="text-grey-8">
            {{ formatearFecha(props.row.ultimaEjecucion) }}
          </span>

          <span v-else class="text-grey-5"> Nunca </span>
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
              <q-tooltip>Editar automatización</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="props.row.estado === 'activa' ? 'pause_circle_outline' : 'play_circle_outline'"
              color="grey-7"
              @click="emit('toggle', props.row)"
            >
              <q-tooltip>
                {{ props.row.estado === 'activa' ? 'Desactivar' : 'Activar' }}
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="negative"
              @click="emit('delete', props.row)"
            >
              <q-tooltip>Eliminar automatización</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #bottom>
        <div class="full-width row items-center justify-between q-px-sm q-py-sm">
          <div class="text-caption text-grey-6">
            {{ automatizaciones.length }}
            {{ automatizaciones.length === 1 ? 'automatización' : 'automatizaciones' }}
          </div>

          <div class="text-caption text-grey-6">Página {{ pagination.page }}</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type {
  Automatizacion,
  EstadoAutomatizacion,
  TipoDisparadorAutomatizacion,
} from '../types/automation.types';

defineProps<{
  automatizaciones: Automatizacion[];
  cargando: boolean;
}>();

const emit = defineEmits<{
  details: [automatizacion: Automatizacion];
  edit: [automatizacion: Automatizacion];
  toggle: [automatizacion: Automatizacion];
  delete: [automatizacion: Automatizacion];
}>();

const pagination = {
  page: 1,
  rowsPerPage: 10,
};

const columns = [
  {
    name: 'automatizacion',
    label: 'Automatización',
    field: 'nombre',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'left' as const,
  },
  {
    name: 'disparador',
    label: 'Disparador',
    field: 'disparador',
    align: 'left' as const,
  },
  {
    name: 'ejecuciones',
    label: 'Ejecuciones',
    field: 'ejecuciones',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'ultimaEjecucion',
    label: 'Última ejecución',
    field: 'ultimaEjecucion',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'acciones',
    label: '',
    field: 'id',
    align: 'right' as const,
  },
];

const obtenerLabelEstado = (estado: EstadoAutomatizacion): string => {
  const labels: Record<EstadoAutomatizacion, string> = {
    activa: 'Activa',
    inactiva: 'Inactiva',
    borrador: 'Borrador',
  };

  return labels[estado];
};

const obtenerIconoEstado = (estado: EstadoAutomatizacion): string => {
  const iconos: Record<EstadoAutomatizacion, string> = {
    activa: 'check_circle',
    inactiva: 'pause_circle',
    borrador: 'edit_note',
  };

  return iconos[estado];
};

const obtenerColorEstado = (estado: EstadoAutomatizacion): string => {
  const colores: Record<EstadoAutomatizacion, string> = {
    activa: 'positive',
    inactiva: 'grey-7',
    borrador: 'warning',
  };

  return colores[estado];
};

const obtenerLabelDisparador = (disparador: TipoDisparadorAutomatizacion): string => {
  const labels: Record<TipoDisparadorAutomatizacion, string> = {
    'cita-creada': 'Cita creada',
    'cita-confirmada': 'Cita confirmada',
    'cita-cancelada': 'Cita cancelada',
    recordatorio: 'Recordatorio',
    'cliente-creado': 'Cliente creado',
    'pago-pendiente': 'Pago pendiente',
    'mensaje-recibido': 'Mensaje recibido',
    'llamada-perdida': 'Llamada perdida',
    manual: 'Manual',
  };

  return labels[disparador];
};

const obtenerIconoDisparador = (disparador: TipoDisparadorAutomatizacion): string => {
  const iconos: Record<TipoDisparadorAutomatizacion, string> = {
    'cita-creada': 'event',
    'cita-confirmada': 'event_available',
    'cita-cancelada': 'event_busy',
    recordatorio: 'notifications_active',
    'cliente-creado': 'person_add',
    'pago-pendiente': 'payments',
    'mensaje-recibido': 'chat',
    'llamada-perdida': 'phone_missed',
    manual: 'touch_app',
  };

  return iconos[disparador];
};

const formatearFecha = (fecha?: string): string => {
  if (!fecha) {
    return 'Nunca';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};
</script>
