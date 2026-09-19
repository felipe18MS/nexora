<template>
  <q-page class="q-pa-lg">
    <div class="schedule-page">
      <div class="schedule-page__header">
        <div>
          <div class="text-h4 text-weight-bold">Horario</div>

          <div class="text-body1 text-grey-6 q-mt-sm">
            Configura cuándo tu negocio está disponible para recibir citas.
          </div>
        </div>

        <q-btn
          unelevated
          color="primary"
          icon="save"
          label="Guardar cambios"
          no-caps
          :loading="loading"
          @click="guardarHorario"
        />
      </div>

      <q-banner rounded class="schedule-page__info">
        <template #avatar>
          <q-icon name="info_outline" color="primary" />
        </template>

        Este horario define la disponibilidad general del negocio. Más adelante podremos combinarlo
        con los horarios de los profesionales, bloqueos y citas existentes.
      </q-banner>

      <ScheduleForm />

      <div class="schedule-page__footer">
        <q-btn
          flat
          no-caps
          color="grey-7"
          label="Restablecer horario"
          :disable="loading"
          @click="restablecerHorario"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import ScheduleForm from '@/modules/schedule/components/schedule-form.vue';
import { useSchedule } from '@/modules/schedule/composables/use-schedule';
import { useNotifications } from '@/composables/use-notifications';

const { loading, cargarHorario } = useSchedule();

const { mostrarExito } = useNotifications();

onMounted(() => {
  cargarHorario();
});

const guardarHorario = (): void => {
  mostrarExito('Horario guardado correctamente.');
};

const restablecerHorario = (): void => {
  cargarHorario();
  mostrarExito('Horario restablecido correctamente.');
};
</script>

<style scoped>
.schedule-page {
  width: 100%;
  margin: 0;
}

.schedule-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.schedule-page__info {
  margin-bottom: 24px;
  border: 1px solid rgba(25, 118, 210, 0.12);
  background: rgba(25, 118, 210, 0.05);
  color: #475467;
}

.schedule-page__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .schedule-page__header {
    flex-direction: column;
  }

  .schedule-page__header .q-btn {
    width: 100%;
  }

  .schedule-page__footer {
    justify-content: flex-start;
  }
}
</style>
