<template>
  <div class="schedule-form">
    <div class="schedule-form__intro">
      <div class="schedule-form__intro-icon">
        <q-icon name="schedule" size="24px" />
      </div>

      <div>
        <div class="text-subtitle1 text-weight-bold">Horario de atención</div>

        <div class="text-body2 text-grey-6 q-mt-xs">
          Define los días y las horas en las que tu negocio recibe citas.
        </div>
      </div>
    </div>

    <div class="schedule-form__summary">
      <div class="schedule-summary-item">
        <q-icon name="event_available" size="20px" />

        <div>
          <div class="text-caption text-grey-6">Días abiertos</div>

          <div class="text-subtitle2 text-weight-bold">
            {{ cantidadDiasAbiertos }}
          </div>
        </div>
      </div>

      <q-separator vertical />

      <div class="schedule-summary-item">
        <q-icon name="event_busy" size="20px" />

        <div>
          <div class="text-caption text-grey-6">Días cerrados</div>

          <div class="text-subtitle2 text-weight-bold">
            {{ cantidadDiasCerrados }}
          </div>
        </div>
      </div>
    </div>

    <div class="schedule-form__days">
      <ScheduleDayRow
        v-for="day in schedule"
        :key="day.day"
        :day="day"
        :loading="loading"
        @toggle="manejarCambioEstado(day.day, $event)"
        @update-interval="
          (intervalId, field, value) =>
            manejarActualizarIntervalo(day.day, intervalId, field, value)
        "
        @add-interval="manejarAgregarIntervalo(day.day)"
        @remove-interval="manejarEliminarIntervalo(day.day, $event)"
      />
    </div>

    <div v-if="error" class="schedule-form__error">
      <q-icon name="error_outline" size="20px" />

      <span>{{ error }}</span>

      <q-btn flat dense round icon="close" color="negative" @click="limpiarError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScheduleDayRow from './schedule-day-row.vue';

import { useSchedule } from '../composables/use-schedule';

import type { DayOfWeek } from '../types/schedule.types';

const {
  schedule,
  loading,
  error,
  cantidadDiasAbiertos,
  cantidadDiasCerrados,
  establecerEstadoDia,
  agregarIntervalo,
  eliminarIntervalo,
  actualizarDia,
  limpiarError,
} = useSchedule();

const manejarCambioEstado = (day: DayOfWeek, isOpen: boolean): void => {
  establecerEstadoDia(day, isOpen);
};

const manejarAgregarIntervalo = (day: DayOfWeek): void => {
  agregarIntervalo(day);
};

const manejarEliminarIntervalo = (day: DayOfWeek, intervalId: string): void => {
  eliminarIntervalo(day, intervalId);
};

const manejarActualizarIntervalo = (
  day: DayOfWeek,
  intervalId: string,
  field: 'startTime' | 'endTime',
  value: string,
): void => {
  const dia = schedule.value.find((item) => item.day === day);

  if (!dia) {
    return;
  }

  const interval = dia.intervals.find((item) => item.id === intervalId);

  if (!interval) {
    return;
  }

  actualizarDia(day, {
    isOpen: dia.isOpen,
    intervals: dia.intervals.map((item) =>
      item.id === intervalId
        ? {
            ...item,
            [field]: value,
          }
        : item,
    ),
  });
};
</script>

<style scoped>
.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.schedule-form__intro {
  display: flex;
  align-items: center;
  gap: 14px;
}

.schedule-form__intro-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 14px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.schedule-form__summary {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 18px;
  border: 1px solid #e7eaf0;
  border-radius: 14px;
  background: #fafbfc;
}

.schedule-summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--q-primary);
}

.schedule-form__days {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-form__error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fef2f2;
  color: #b42318;
}

.schedule-form__error span {
  flex: 1;
}

@media (max-width: 600px) {
  .schedule-form__summary {
    gap: 16px;
  }

  .schedule-form__intro {
    align-items: flex-start;
  }
}
</style>
