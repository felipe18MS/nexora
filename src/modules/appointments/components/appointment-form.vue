<template>
  <q-dialog v-model="mostrarDialogo" persistent @hide="manejarCerrar">
    <q-card class="appointment-form">
      <!-- Header -->
      <q-card-section class="form-header">
        <div class="header-content">
          <div class="header-icon">
            <q-icon :name="modoEdicion ? 'edit_calendar' : 'event_available'" size="24px" />
          </div>

          <div class="header-info">
            <div class="form-title">
              {{ modoEdicion ? 'Editar cita' : 'Nueva cita' }}
            </div>

            <div class="form-description">
              {{
                modoEdicion
                  ? 'Actualiza la información de la cita.'
                  : 'Programa una nueva cita para tu cliente.'
              }}
            </div>
          </div>

          <q-btn flat round dense icon="close" class="close-button" @click="cerrarFormulario" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Formulario -->
      <q-form @submit.prevent="manejarGuardar">
        <q-card-section class="form-content">
          <!-- Participantes -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="people" size="18px" />
              </div>

              <div>
                <div class="section-title">Participantes</div>

                <div class="section-description">Define quién participa en la cita.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Cliente -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.customerId"
                  outlined
                  dense
                  label="Cliente *"
                  :options="opcionesClientes"
                  emit-value
                  map-options
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="person" />
                  </template>
                </q-select>
              </div>

              <!-- Profesional -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.employeeId"
                  outlined
                  dense
                  label="Profesional *"
                  :options="opcionesProfesionales"
                  emit-value
                  map-options
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="badge" />
                  </template>
                </q-select>
              </div>

              <!-- Servicio -->
              <div class="col-12">
                <q-select
                  v-model="formulario.serviceId"
                  outlined
                  dense
                  label="Servicio *"
                  :options="opcionesServicios"
                  emit-value
                  map-options
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="medical_services" />
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <!-- Fecha y horario -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="schedule" size="18px" />
              </div>

              <div>
                <div class="section-title">Fecha y horario</div>

                <div class="section-description">Selecciona cuándo se realizará la cita.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Fecha -->
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.date"
                  outlined
                  dense
                  type="date"
                  label="Fecha *"
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>

              <!-- Inicio -->
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="formulario.startTime"
                  outlined
                  dense
                  type="time"
                  label="Hora de inicio *"
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="schedule" />
                  </template>
                </q-input>
              </div>

              <!-- Finalización -->
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="formulario.endTime"
                  outlined
                  dense
                  type="time"
                  label="Hora de finalización *"
                  :rules="[reglaRequerido]"
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="schedule" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Configuración -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="tune" size="18px" />
              </div>

              <div>
                <div class="section-title">Configuración</div>

                <div class="section-description">Define el estado y origen de la cita.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Estado -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.status"
                  outlined
                  dense
                  label="Estado"
                  :options="opcionesEstado"
                  emit-value
                  map-options
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="event_available" />
                  </template>
                </q-select>
              </div>

              <!-- Origen -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.source"
                  outlined
                  dense
                  label="Origen"
                  :options="opcionesOrigen"
                  emit-value
                  map-options
                  class="form-field"
                >
                  <template #prepend>
                    <q-icon name="source" />
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="form-section notes-section">
            <div class="section-header">
              <div class="section-icon">
                <q-icon name="notes" size="18px" />
              </div>

              <div>
                <div class="section-title">Notas</div>

                <div class="section-description">Agrega información adicional sobre la cita.</div>
              </div>
            </div>

            <q-input
              v-model="formulario.notes"
              outlined
              type="textarea"
              autogrow
              label="Notas de la cita"
              placeholder="Agrega información adicional..."
              maxlength="500"
              counter
              class="form-field"
            />
          </div>
        </q-card-section>

        <q-separator />

        <!-- Footer -->
        <q-card-actions class="form-actions">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="grey-7"
            class="cancel-button"
            @click="cerrarFormulario"
          />

          <q-btn
            unelevated
            no-caps
            color="primary"
            type="submit"
            :icon="modoEdicion ? 'save' : 'add'"
            :label="modoEdicion ? 'Guardar cambios' : 'Crear cita'"
            class="submit-button"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type {
  Appointment,
  AppointmentSource,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../types/appointment.types';

interface Props {
  modelValue: boolean;
  appointment?: Appointment | null;
}

const props = withDefaults(defineProps<Props>(), {
  appointment: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [datos: CreateAppointmentRequest | UpdateAppointmentRequest];
}>();

const mostrarDialogo = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

const modoEdicion = computed(() => {
  return Boolean(props.appointment);
});

interface FormularioCita {
  customerId: string;
  serviceId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes: string;
}

const formulario = reactive<FormularioCita>({
  customerId: '',
  serviceId: '',
  employeeId: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'pending',
  source: 'manual',
  notes: '',
});

const opcionesClientes = [
  {
    label: 'María Rodríguez',
    value: '1',
  },
  {
    label: 'Carlos Gómez',
    value: '2',
  },
  {
    label: 'Laura Martínez',
    value: '3',
  },
  {
    label: 'Andrés López',
    value: '4',
  },
  {
    label: 'Sofía Torres',
    value: '5',
  },
];

const opcionesServicios = [
  {
    label: 'Consulta general',
    value: '1',
  },
  {
    label: 'Limpieza',
    value: '2',
  },
  {
    label: 'Valoración',
    value: '3',
  },
  {
    label: 'Seguimiento',
    value: '4',
  },
];

const opcionesProfesionales = [
  {
    label: 'Laura Gómez',
    value: '1',
  },
  {
    label: 'Andrés Martínez',
    value: '2',
  },
  {
    label: 'Sofía Torres',
    value: '3',
  },
];

const opcionesEstado = [
  {
    label: 'Pendiente',
    value: 'pending',
  },
  {
    label: 'Confirmada',
    value: 'confirmed',
  },
  {
    label: 'En curso',
    value: 'in_progress',
  },
  {
    label: 'Completada',
    value: 'completed',
  },
  {
    label: 'Cancelada',
    value: 'cancelled',
  },
  {
    label: 'No asistió',
    value: 'no_show',
  },
];

const opcionesOrigen = [
  {
    label: 'Manual',
    value: 'manual',
  },
  {
    label: 'WhatsApp',
    value: 'whatsapp',
  },
  {
    label: 'Llamada',
    value: 'phone',
  },
  {
    label: 'Web',
    value: 'web',
  },
];

const reglaRequerido = (valor: string): true | string => {
  return valor?.trim() ? true : 'Este campo es obligatorio.';
};

const limpiarFormulario = (): void => {
  formulario.customerId = '';
  formulario.serviceId = '';
  formulario.employeeId = '';
  formulario.date = '';
  formulario.startTime = '';
  formulario.endTime = '';
  formulario.status = 'pending';
  formulario.source = 'manual';
  formulario.notes = '';
};

const cargarCitaEnFormulario = (cita: Appointment): void => {
  formulario.customerId = cita.customerId;
  formulario.serviceId = cita.serviceId;
  formulario.employeeId = cita.employeeId;
  formulario.date = cita.date;
  formulario.startTime = cita.startTime;
  formulario.endTime = cita.endTime;
  formulario.status = cita.status;
  formulario.source = cita.source;
  formulario.notes = cita.notes ?? '';
};

const construirDatosCita = (): CreateAppointmentRequest => {
  const datosCita: CreateAppointmentRequest = {
    customerId: formulario.customerId,
    serviceId: formulario.serviceId,
    employeeId: formulario.employeeId,
    date: formulario.date,
    startTime: formulario.startTime,
    endTime: formulario.endTime,
    status: formulario.status,
    source: formulario.source,
  };

  if (formulario.notes.trim()) {
    datosCita.notes = formulario.notes.trim();
  }

  return datosCita;
};

const construirDatosActualizacion = (): UpdateAppointmentRequest => {
  const datosCita: UpdateAppointmentRequest = {
    customerId: formulario.customerId,
    serviceId: formulario.serviceId,
    employeeId: formulario.employeeId,
    date: formulario.date,
    startTime: formulario.startTime,
    endTime: formulario.endTime,
    status: formulario.status,
    source: formulario.source,
  };

  if (formulario.notes.trim()) {
    datosCita.notes = formulario.notes.trim();
  }

  return datosCita;
};

const manejarGuardar = (): void => {
  if (modoEdicion.value) {
    emit('saved', construirDatosActualizacion());
    return;
  }

  emit('saved', construirDatosCita());
};

const cerrarFormulario = (): void => {
  mostrarDialogo.value = false;
};

const manejarCerrar = (): void => {
  limpiarFormulario();
};

watch(
  () => props.appointment,
  (cita) => {
    if (cita) {
      cargarCitaEnFormulario(cita);
      return;
    }

    limpiarFormulario();
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.appointment-form {
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

/* ================================
   HEADER
================================ */

.form-header {
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 46px;
  height: 46px;
  min-width: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  color: var(--q-primary);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
}

.form-description {
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

/* ================================
   CONTENT
================================ */

.form-content {
  max-height: 68vh;
  overflow-y: auto;
  padding: 22px 24px;
}

/* Scrollbar */

.form-content::-webkit-scrollbar {
  width: 6px;
}

.form-content::-webkit-scrollbar-track {
  background: transparent;
}

.form-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

/* ================================
   SECTIONS
================================ */

.form-section {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eef0f3;
}

.form-section:last-child {
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

/* ================================
   FIELDS
================================ */

.form-field {
  margin-bottom: 4px;
}

:deep(.q-field__control) {
  border-radius: 10px;
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: #dfe3e8;
}

:deep(.q-field--outlined:hover .q-field__control:before) {
  border-color: #b9c0c9;
}

:deep(.q-field--focused .q-field__control:before) {
  border-color: var(--q-primary);
}

:deep(.q-field__prepend) {
  color: #7b8490;
}

/* ================================
   FOOTER
================================ */

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: #ffffff;
}

.cancel-button,
.submit-button {
  min-height: 40px;
  border-radius: 9px;
  padding: 0 18px;
}

.submit-button {
  font-weight: 600;
}

/* ================================
   RESPONSIVE
================================ */

@media (max-width: 600px) {
  .appointment-form {
    max-width: calc(100vw - 24px);
    max-height: 94vh;
    border-radius: 16px;
  }

  .form-header {
    padding: 18px;
  }

  .form-content {
    padding: 18px;
    max-height: 72vh;
  }

  .form-actions {
    padding: 12px 18px;
  }

  .form-title {
    font-size: 17px;
  }

  .form-description {
    font-size: 12px;
  }

  .header-icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
  }

  .form-actions .q-btn {
    flex: 1;
  }
}
</style>
