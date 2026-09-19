<template>
  <div class="q-pa-lg">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Citas</div>

        <div class="text-grey-7">Gestiona y organiza las citas de tus clientes.</div>
      </div>

      <q-btn color="primary" icon="add" label="Nueva cita" unelevated @click="manejarCrear" />
    </div>

    <!-- Estadísticas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Total</div>

                <div class="text-h5 text-weight-bold">
                  {{ cantidadCitas }}
                </div>
              </div>

              <q-icon name="event" size="32px" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Pendientes</div>

                <div class="text-h5 text-weight-bold">
                  {{ citasPendientes.length }}
                </div>
              </div>

              <q-icon name="schedule" size="32px" color="orange" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Confirmadas</div>

                <div class="text-h5 text-weight-bold">
                  {{ citasConfirmadas.length }}
                </div>
              </div>

              <q-icon name="check_circle" size="32px" color="positive" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Para hoy</div>

                <div class="text-h5 text-weight-bold">
                  {{ citasHoy.length }}
                </div>
              </div>

              <q-icon name="today" size="32px" color="info" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros -->
    <AppointmentFilters :filters="filters" @update:filters="manejarFiltros" />

    <!-- Barra de herramientas -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-medium">
        {{ citasFiltradas.length }} citas encontradas
      </div>

      <q-btn-toggle
        v-model="vistaActual"
        unelevated
        toggle-color="primary"
        :options="opcionesVista"
      />
    </div>

    <!-- Tabla -->
    <AppointmentTable
      v-if="vistaActual === 'tabla'"
      :appointments="citasFiltradas"
      :loading="loading"
      @ver="manejarVer"
      @editar="manejarEditar"
      @eliminar="manejarEliminar"
    />

    <!-- Calendario -->
    <AppointmentCalendar
      v-if="vistaActual === 'calendario'"
      :appointments="citasFiltradas"
      :availability-blocks="availabilityBlocks"
      @seleccionar="manejarSeleccionarDesdeCalendario"
    />
    <!-- Formulario -->
    <AppointmentForm
      v-model="mostrarFormulario"
      :appointment="selectedAppointment"
      @saved="manejarFormularioGuardado"
    />

    <!-- Confirmación de eliminación -->
    <AppConfirmDialog
      v-model="mostrarConfirmacionEliminar"
      titulo="Eliminar cita"
      mensaje="¿Estás seguro de que deseas eliminar esta cita?"
      texto-confirmar="Eliminar"
      tipo="danger"
      @confirm="confirmarEliminacion"
    />

    <!-- Detalles -->
    <q-dialog v-model="mostrarDetalles" @hide="mostrarDetalles = false">
      <q-card v-if="citaSeleccionada" class="appointment-details">
        <!-- Header -->
        <q-card-section class="details-header">
          <div class="header-content">
            <div class="customer-avatar">
              {{
                obtenerIniciales(
                  citaSeleccionada.customerName.split(' ')[0] ?? '',
                  citaSeleccionada.customerName.split(' ').slice(1).join(' '),
                )
              }}
            </div>

            <div class="header-info">
              <div class="customer-name">
                {{ citaSeleccionada.customerName }}
              </div>

              <div class="service-name">
                {{ citaSeleccionada.serviceName }}
              </div>
            </div>

            <q-btn
              flat
              round
              dense
              icon="close"
              class="close-button"
              @click="mostrarDetalles = false"
            />
          </div>

          <div class="status-container">
            <AppointmentStatusBadge :status="citaSeleccionada.status" />
          </div>
        </q-card-section>

        <q-separator />

        <!-- Contenido -->
        <q-card-section class="details-content">
          <!-- Información de la cita -->
          <div class="details-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="event" size="18px" />
              </div>

              <div>
                <div class="section-title">Información de la cita</div>

                <div class="section-description">Información relacionada con la programación.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Fecha -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="calendar_today" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Fecha</div>

                    <div class="detail-value">
                      {{ formatearFecha(citaSeleccionada.date) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Horario -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="schedule" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Horario</div>

                    <div class="detail-value">
                      {{ citaSeleccionada.startTime }}
                      -
                      {{ citaSeleccionada.endTime }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cliente -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="person" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Cliente</div>

                    <div class="detail-value">
                      {{ citaSeleccionada.customerName }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Servicio -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="medical_services" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Servicio</div>

                    <div class="detail-value">
                      {{ citaSeleccionada.serviceName }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Profesional -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="badge" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Profesional</div>

                    <div class="detail-value">
                      {{ citaSeleccionada.employeeName }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Origen -->
              <div class="col-12 col-sm-6">
                <div class="detail-card">
                  <div class="detail-icon">
                    <q-icon name="source" size="19px" />
                  </div>

                  <div class="detail-info">
                    <div class="detail-label">Origen</div>

                    <div class="detail-value">
                      {{ obtenerEtiquetaOrigen(citaSeleccionada.source) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div v-if="citaSeleccionada.notes" class="details-section notes-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="notes" size="18px" />
              </div>

              <div>
                <div class="section-title">Notas</div>

                <div class="section-description">Información adicional de la cita.</div>
              </div>
            </div>

            <div class="notes-container">
              {{ citaSeleccionada.notes }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Footer -->
        <q-card-actions class="details-actions">
          <q-btn
            flat
            no-caps
            label="Cerrar"
            color="grey-7"
            class="cancel-button"
            @click="mostrarDetalles = false"
          />

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Editar cita"
            class="edit-button"
            @click="manejarEditarDesdeDetalles"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import AppConfirmDialog from '@/components/common/app-confirm-dialog.vue';
import { useNotifications } from '@/composables/use-notifications';

import AppointmentCalendar from '@/modules/appointments/components/appointment-calendar.vue';
import AppointmentFilters from '@/modules/appointments/components/appointment-filters.vue';
import AppointmentForm from '@/modules/appointments/components/appointment-form.vue';
import AppointmentStatusBadge from '@/modules/appointments/components/appointment-status-badge.vue';
import AppointmentTable from '@/modules/appointments/components/appointment-table.vue';

import { useAppointments } from '@/modules/appointments/composables/use-appointments';
import { useAvailabilityBlocks } from '@/modules/availability-blocks';
import type {
  Appointment,
  AppointmentFilters as AppointmentFiltersType,
  AppointmentSource,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/modules/appointments/types/appointment.types';

import { formatearFecha, obtenerIniciales } from '@/utils';

type VistaActual = 'tabla' | 'calendario';

const { blocks: availabilityBlocks } = useAvailabilityBlocks();
const {
  appointments,
  selectedAppointment,
  loading,
  error,
  filters,
  citasPendientes,
  citasConfirmadas,
  citasHoy,
  cantidadCitas,
  cargarCitas,
  crearCita,
  actualizarCita,
  eliminarCita,
  seleccionarCita,
  establecerFiltros,
} = useAppointments();

const { mostrarExito, mostrarError } = useNotifications();

const vistaActual = ref<VistaActual>('tabla');

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarConfirmacionEliminar = ref(false);

const citaPendienteEliminar = ref<Appointment | null>(null);

const citaSeleccionada = computed(() => selectedAppointment.value);

const opcionesVista = [
  {
    label: 'Tabla',
    value: 'tabla',
    icon: 'view_list',
  },
  {
    label: 'Calendario',
    value: 'calendario',
    icon: 'calendar_month',
  },
];

const citasFiltradas = computed(() => {
  const texto = filters.value.search?.trim().toLowerCase();

  return appointments.value.filter((cita) => {
    const coincideBusqueda =
      !texto ||
      cita.customerName.toLowerCase().includes(texto) ||
      cita.serviceName.toLowerCase().includes(texto) ||
      cita.employeeName.toLowerCase().includes(texto);

    const coincideFecha = !filters.value.date || cita.date === filters.value.date;

    const coincideEstado = !filters.value.status || cita.status === filters.value.status;

    const coincideEmpleado =
      !filters.value.employeeId || cita.employeeId === filters.value.employeeId;

    const coincideCliente =
      !filters.value.customerId || cita.customerId === filters.value.customerId;

    return (
      coincideBusqueda && coincideFecha && coincideEstado && coincideEmpleado && coincideCliente
    );
  });
});

onMounted(() => {
  cargarCitas();
});

const manejarFiltros = (filtrosNuevos: AppointmentFiltersType): void => {
  establecerFiltros(filtrosNuevos);
};

const manejarCrear = (): void => {
  seleccionarCita(null);
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarVer = (cita: Appointment): void => {
  seleccionarCita(cita);
  mostrarDetalles.value = true;
};

const manejarEditar = (cita: Appointment): void => {
  seleccionarCita(cita);
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarEditarDesdeDetalles = (): void => {
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarEliminar = (cita: Appointment): void => {
  citaPendienteEliminar.value = cita;
  mostrarConfirmacionEliminar.value = true;
};

const confirmarEliminacion = (): void => {
  const cita = citaPendienteEliminar.value;

  if (!cita) {
    return;
  }

  eliminarCita(cita.id);

  mostrarConfirmacionEliminar.value = false;
  citaPendienteEliminar.value = null;

  mostrarExito('Cita eliminada correctamente.');
};

const manejarFormularioGuardado = (
  datos: CreateAppointmentRequest | UpdateAppointmentRequest,
): void => {
  const citaActual = selectedAppointment.value;

  if (citaActual) {
    const datosActualizacion: UpdateAppointmentRequest = {
      customerId: datos.customerId,
      serviceId: datos.serviceId,
      employeeId: datos.employeeId,
      date: datos.date,
      startTime: datos.startTime,
      endTime: datos.endTime,
      status: datos.status ?? citaActual.status,
      source: datos.source ?? citaActual.source,
      ...(datos.notes !== undefined ? { notes: datos.notes } : {}),
    };

    const resultado = actualizarCita(citaActual.id, datosActualizacion);

    if (!resultado) {
      if (error.value) {
        mostrarError(error.value);
      }

      return;
    }

    mostrarExito('Cita actualizada correctamente.');
  } else {
    const resultado = crearCita(datos);

    if (!resultado) {
      if (error.value) {
        mostrarError(error.value);
      }

      return;
    }

    mostrarExito('Cita creada correctamente.');
  }

  mostrarFormulario.value = false;
};
const manejarSeleccionarDesdeCalendario = (cita: Appointment): void => {
  seleccionarCita(cita);
  mostrarDetalles.value = true;
};
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

<style scoped lang="scss">
/* =========================================
   MODAL DETALLE DE CITA
========================================= */

.appointment-details {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

/* =========================================
   HEADER
========================================= */

.details-header {
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  min-width: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: rgba(25, 118, 210, 0.1);
  color: var(--q-primary);

  font-size: 15px;
  font-weight: 700;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
}

.service-name {
  margin-top: 3px;
  font-size: 13px;
  color: #6b7280;
}

.close-button {
  color: #6b7280;
}

.close-button:hover {
  background: #f3f4f6;
}

.status-container {
  margin-top: 16px;
}

/* =========================================
   CONTENT
========================================= */

.details-content {
  max-height: 65vh;
  overflow-y: auto;
  padding: 22px 24px;
}

/* Scrollbar */

.details-content::-webkit-scrollbar {
  width: 6px;
}

.details-content::-webkit-scrollbar-track {
  background: transparent;
}

.details-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

/* =========================================
   SECTIONS
========================================= */

.details-section {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eef0f3;
}

.details-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: rgba(25, 118, 210, 0.09);
  color: var(--q-primary);
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.section-description {
  margin-top: 2px;
  font-size: 12px;
  color: #9ca3af;
}

/* =========================================
   DETAIL CARDS
========================================= */

.detail-card {
  display: flex;
  align-items: center;
  gap: 12px;

  min-height: 68px;
  padding: 13px 14px;

  border: 1px solid #eef0f3;
  border-radius: 11px;

  background: #fafbfc;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.detail-card:hover {
  border-color: #dfe3e8;
  background: #f8fafc;
}

.detail-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #ffffff;
  color: #7b8490;

  border: 1px solid #eef0f3;
}

.detail-info {
  min-width: 0;
}

.detail-label {
  margin-bottom: 3px;

  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  color: #9ca3af;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;

  color: #374151;

  word-break: break-word;
}

/* =========================================
   NOTES
========================================= */

.notes-container {
  padding: 14px 16px;

  border: 1px solid #eef0f3;
  border-radius: 11px;

  background: #fafbfc;

  color: #4b5563;

  font-size: 14px;
  line-height: 1.6;

  white-space: pre-wrap;
}

/* =========================================
   FOOTER
========================================= */

.details-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  padding: 14px 24px;

  background: #ffffff;
}

.cancel-button,
.edit-button {
  min-height: 40px;
  border-radius: 9px;
  padding: 0 18px;
}

.edit-button {
  font-weight: 600;
}

/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 600px) {
  .appointment-details {
    max-width: calc(100vw - 24px);
    max-height: 94vh;
    border-radius: 16px;
  }

  .details-header {
    padding: 18px;
  }

  .details-content {
    padding: 18px;
    max-height: 72vh;
  }

  .details-actions {
    padding: 12px 18px;
  }

  .customer-name {
    font-size: 17px;
  }

  .details-actions .q-btn {
    flex: 1;
  }
}
</style>
