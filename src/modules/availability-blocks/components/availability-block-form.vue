<template>
  <q-dialog v-model="mostrarDialogo" persistent>
    <q-card class="availability-form">
      <!-- Header -->
      <q-card-section class="availability-form__header">
        <div>
          <div class="text-h6 text-weight-bold">Nuevo bloqueo</div>

          <div class="text-body2 text-grey-6 q-mt-xs">
            Define cuándo no estará disponible el negocio o un profesional.
          </div>
        </div>

        <q-btn flat round dense icon="close" color="grey-7" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <!-- Formulario -->
      <q-form @submit.prevent="guardar">
        <q-card-section class="availability-form__content">
          <!-- Fecha -->
          <q-input
            v-model="formulario.date"
            outlined
            label="Fecha"
            mask="####-##-##"
            :rules="[reglas.fecha]"
            readonly
          >
            <template #prepend>
              <q-icon name="event" />
            </template>

            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formulario.date" mask="YYYY-MM-DD" today-btn />
            </q-popup-proxy>
          </q-input>

          <!-- Motivo -->
          <q-select
            v-model="formulario.reason"
            outlined
            label="Motivo"
            :options="opcionesMotivo"
            emit-value
            map-options
            :rules="[reglas.motivo]"
          >
            <template #prepend>
              <q-icon name="block" />
            </template>
          </q-select>

          <!-- Todo el día -->
          <q-card flat bordered class="availability-form__all-day">
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-body1 text-weight-medium">Bloquear todo el día</div>

                <div class="text-caption text-grey-6">
                  No se podrán crear citas durante toda la fecha.
                </div>
              </div>

              <q-toggle v-model="formulario.isAllDay" color="primary" />
            </q-card-section>
          </q-card>

          <!-- Horario -->
          <div v-if="!formulario.isAllDay" class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="formulario.startTime"
                outlined
                label="Hora de inicio"
                mask="##:##"
                :rules="[reglas.horaInicio]"
              >
                <template #prepend>
                  <q-icon name="schedule" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="formulario.endTime"
                outlined
                label="Hora de finalización"
                mask="##:##"
                :rules="[reglas.horaFin]"
              >
                <template #prepend>
                  <q-icon name="schedule" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Profesional -->
          <q-select
            v-model="formulario.employeeId"
            outlined
            label="Profesional"
            :options="opcionesProfesionales"
            emit-value
            map-options
            clearable
          >
            <template #prepend>
              <q-icon name="badge" />
            </template>
          </q-select>

          <!-- Notas -->
          <q-input
            v-model="formulario.notes"
            outlined
            type="textarea"
            label="Notas"
            placeholder="Agrega información adicional sobre este bloqueo..."
            autogrow
            maxlength="500"
            counter
          >
            <template #prepend>
              <q-icon name="notes" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <!-- Footer -->
        <q-card-actions class="availability-form__actions">
          <q-btn flat no-caps label="Cancelar" color="grey-7" @click="cerrar" />

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Crear bloqueo"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

import type { CreateAvailabilityBlockRequest } from '../types/availability-block.types';

interface OpcionSelect {
  label: string;
  value: string;
}

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [data: CreateAvailabilityBlockRequest];
}>();

const formulario = reactive<CreateAvailabilityBlockRequest>({
  date: '',
  startTime: null,
  endTime: null,
  isAllDay: true,
  reason: '',
  notes: null,
  employeeId: null,
});

const opcionesMotivo: OpcionSelect[] = [
  {
    label: 'Día personal',
    value: 'Día personal',
  },
  {
    label: 'Motivos personales',
    value: 'Motivos personales',
  },
  {
    label: 'Reunión',
    value: 'Reunión',
  },
  {
    label: 'Día libre',
    value: 'Día libre',
  },
  {
    label: 'Mantenimiento',
    value: 'Mantenimiento',
  },
  {
    label: 'Otro',
    value: 'Otro',
  },
];

const opcionesProfesionales: OpcionSelect[] = [
  {
    label: 'Todos los profesionales',
    value: '',
  },
  {
    label: 'Carlos Rodríguez',
    value: 'employee-1',
  },
  {
    label: 'Laura Gómez',
    value: 'employee-2',
  },
];

const mostrarDialogo = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number);

  return (horas ?? 0) * 60 + (minutos ?? 0);
};

const reglas = {
  fecha: (valor: string): true | string => {
    if (valor) {
      return true;
    }

    return 'Selecciona una fecha';
  },

  motivo: (valor: string): true | string => {
    if (valor) {
      return true;
    }

    return 'Selecciona un motivo';
  },

  horaInicio: (valor: string | null): true | string => {
    if (formulario.isAllDay) {
      return true;
    }

    if (!valor) {
      return 'Ingresa la hora de inicio';
    }

    const minutos = convertirHoraAMinutos(valor);

    if (minutos < 0 || minutos >= 1440) {
      return 'Ingresa una hora válida';
    }

    return true;
  },

  horaFin: (valor: string | null): true | string => {
    if (formulario.isAllDay) {
      return true;
    }

    if (!valor) {
      return 'Ingresa la hora de finalización';
    }

    const minutosInicio = formulario.startTime ? convertirHoraAMinutos(formulario.startTime) : null;

    const minutosFin = convertirHoraAMinutos(valor);

    if (minutosFin < 0 || minutosFin > 1440) {
      return 'Ingresa una hora válida';
    }

    if (minutosInicio !== null && minutosFin <= minutosInicio) {
      return 'Debe ser posterior a la hora de inicio';
    }

    return true;
  },
};

const limpiarFormulario = (): void => {
  formulario.date = '';
  formulario.startTime = null;
  formulario.endTime = null;
  formulario.isAllDay = true;
  formulario.reason = '';
  formulario.notes = null;
  formulario.employeeId = null;
};

const cerrar = (): void => {
  mostrarDialogo.value = false;
  limpiarFormulario();
};

const guardar = (): void => {
  const datos: CreateAvailabilityBlockRequest = {
    date: formulario.date,
    startTime: formulario.isAllDay ? null : (formulario.startTime ?? null),
    endTime: formulario.isAllDay ? null : (formulario.endTime ?? null),
    isAllDay: formulario.isAllDay,
    reason: formulario.reason,
    notes: formulario.notes ?? null,
    employeeId: formulario.employeeId ?? null,
  };

  emit('saved', datos);
  limpiarFormulario();
};
</script>

<style scoped lang="scss">
.availability-form {
  width: 100%;
  max-width: 560px;
  border-radius: 18px;
  overflow: hidden;
}

.availability-form__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.availability-form__content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 65vh;
  overflow-y: auto;
  padding: 22px 24px;
}

.availability-form__all-day {
  border-radius: 12px;
  background: #fafbfc;
}

.availability-form__actions {
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 24px;
}

@media (max-width: 600px) {
  .availability-form {
    max-width: calc(100vw - 24px);
    border-radius: 16px;
  }

  .availability-form__header,
  .availability-form__content,
  .availability-form__actions {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
