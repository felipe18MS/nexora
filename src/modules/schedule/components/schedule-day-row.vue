<template>
  <div class="schedule-day-row" :class="{ 'schedule-day-row--closed': !day.isOpen }">
    <div class="schedule-day-row__header">
      <div class="schedule-day-row__day">
        <div class="schedule-day-row__indicator">
          <span>{{ day.shortLabel }}</span>
        </div>

        <div>
          <div class="text-body1 text-weight-medium">
            {{ day.label }}
          </div>

          <div class="text-caption text-grey-6">
            {{ day.isOpen ? 'Horario de atención' : 'Día cerrado' }}
          </div>
        </div>
      </div>

      <q-toggle
        :model-value="day.isOpen"
        color="primary"
        :disable="loading"
        @update:model-value="manejarCambioEstado"
      />
    </div>

    <div v-if="day.isOpen" class="schedule-day-row__intervals">
      <div v-for="(interval, index) in day.intervals" :key="interval.id" class="schedule-interval">
        <div class="schedule-interval__fields">
          <q-input
            :model-value="interval.startTime"
            outlined
            dense
            label="Desde"
            type="time"
            class="schedule-time-input"
            @update:model-value="manejarCambioHora(index, 'startTime', $event)"
          />

          <div class="schedule-interval__separator">
            <q-icon name="arrow_forward" size="18px" />
          </div>

          <q-input
            :model-value="interval.endTime"
            outlined
            dense
            label="Hasta"
            type="time"
            class="schedule-time-input"
            @update:model-value="manejarCambioHora(index, 'endTime', $event)"
          />

          <q-btn
            flat
            round
            dense
            icon="delete_outline"
            color="negative"
            :disable="loading"
            @click="manejarEliminarIntervalo(interval.id)"
          >
            <q-tooltip>Eliminar horario</q-tooltip>
          </q-btn>
        </div>

        <div v-if="index === day.intervals.length - 1" class="schedule-interval__add">
          <q-btn
            flat
            dense
            no-caps
            icon="add"
            label="Agregar horario"
            color="primary"
            :disable="loading"
            @click="manejarAgregarIntervalo"
          />
        </div>
      </div>

      <div v-if="day.intervals.length === 0" class="schedule-day-row__empty">
        <q-icon name="schedule" size="22px" />
        <span>No hay horarios configurados.</span>

        <q-btn
          flat
          dense
          no-caps
          label="Agregar horario"
          color="primary"
          @click="manejarAgregarIntervalo"
        />
      </div>
    </div>

    <div v-else class="schedule-day-row__closed">
      <q-icon name="event_busy" size="20px" />
      <span>El negocio permanecerá cerrado este día.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BusinessScheduleDay, ScheduleInterval } from '../types/schedule.types';

interface Props {
  day: BusinessScheduleDay;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  toggle: [isOpen: boolean];
  updateInterval: [
    intervalId: string,
    field: keyof Pick<ScheduleInterval, 'startTime' | 'endTime'>,
    value: string,
  ];
  addInterval: [];
  removeInterval: [intervalId: string];
}>();

const manejarCambioEstado = (isOpen: boolean): void => {
  emit('toggle', isOpen);
};

const manejarCambioHora = (
  index: number,
  field: keyof Pick<ScheduleInterval, 'startTime' | 'endTime'>,
  value: string | number | null,
): void => {
  const interval = props.day.intervals[index];

  if (!interval || typeof value !== 'string') {
    return;
  }

  emit('updateInterval', interval.id, field, value);
};

const manejarAgregarIntervalo = (): void => {
  emit('addInterval');
};

const manejarEliminarIntervalo = (intervalId: string): void => {
  emit('removeInterval', intervalId);
};
</script>

<style scoped>
.schedule-day-row {
  padding: 20px;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  background: #ffffff;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.schedule-day-row:hover {
  border-color: #d9deea;
}

.schedule-day-row--closed {
  background: #fafbfc;
}

.schedule-day-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.schedule-day-row__day {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.schedule-day-row__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
  font-size: 12px;
  font-weight: 700;
}

.schedule-day-row__intervals {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #eef0f4;
}

.schedule-interval + .schedule-interval {
  margin-top: 14px;
}

.schedule-interval__fields {
  display: flex;
  align-items: center;
  gap: 10px;
}

.schedule-time-input {
  width: 150px;
}

.schedule-interval__separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #98a2b3;
}

.schedule-interval__add {
  margin-top: 4px;
}

.schedule-day-row__empty {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #667085;
}

.schedule-day-row__closed {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef0f4;
  color: #98a2b3;
  font-size: 14px;
}

@media (max-width: 600px) {
  .schedule-day-row {
    padding: 16px;
  }

  .schedule-interval__fields {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .schedule-time-input {
    width: calc(50% - 20px);
  }

  .schedule-interval__separator {
    height: 40px;
  }
}
</style>
