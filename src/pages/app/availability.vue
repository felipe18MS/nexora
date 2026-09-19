<template>
  <q-page class="q-pa-lg">
    <div class="availability-page">
      <div class="availability-page__header">
        <div>
          <div class="text-h4 text-weight-bold">Disponibilidad</div>

          <div class="text-body1 text-grey-6 q-mt-sm">
            Gestiona los días y horarios en los que tu negocio o tus profesionales no estarán
            disponibles para recibir citas.
          </div>
        </div>

        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nuevo bloqueo"
          no-caps
          @click="mostrarFormulario = true"
        />
      </div>

      <q-banner rounded class="availability-page__info">
        <template #avatar>
          <q-icon name="info_outline" color="primary" />
        </template>

        Los bloqueos permiten indicar períodos en los que no se deben ofrecer citas. Posteriormente
        estos datos serán utilizados por el motor de disponibilidad y el agente IA.
      </q-banner>

      <div class="availability-page__stats">
        <div class="availability-stat">
          <q-icon name="event_busy" size="22px" />

          <div>
            <div class="text-caption text-grey-6">Bloqueos</div>

            <div class="text-h6 text-weight-bold">
              {{ cantidadBloqueos }}
            </div>
          </div>
        </div>

        <div class="availability-stat">
          <q-icon name="today" size="22px" />

          <div>
            <div class="text-caption text-grey-6">Días completos</div>

            <div class="text-h6 text-weight-bold">
              {{ bloqueosDiaCompleto.length }}
            </div>
          </div>
        </div>

        <div class="availability-stat">
          <q-icon name="schedule" size="22px" />

          <div>
            <div class="text-caption text-grey-6">Horarios parciales</div>

            <div class="text-h6 text-weight-bold">
              {{ bloqueosParciales.length }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="blocks.length" class="availability-list">
        <div v-for="block in blocks" :key="block.id" class="availability-card">
          <div class="availability-card__icon">
            <q-icon :name="block.isAllDay ? 'event_busy' : 'schedule'" size="22px" />
          </div>

          <div class="availability-card__content">
            <div class="text-subtitle1 text-weight-bold">
              {{ block.reason }}
            </div>

            <div class="text-body2 text-grey-6 q-mt-xs">
              {{ block.date }}
              <span v-if="!block.isAllDay"> · {{ block.startTime }} - {{ block.endTime }} </span>
              <span v-else> · Todo el día </span>
            </div>

            <div v-if="block.notes" class="text-caption text-grey-6 q-mt-sm">
              {{ block.notes }}
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="delete_outline"
            color="negative"
            @click="eliminarBloqueo(block.id)"
          >
            <q-tooltip> Eliminar bloqueo </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div v-else class="availability-empty">
        <q-icon name="event_available" size="48px" />

        <div class="text-subtitle1 text-weight-bold q-mt-md">No hay bloqueos configurados</div>

        <div class="text-body2 text-grey-6 q-mt-xs">
          Puedes bloquear días completos o determinados horarios.
        </div>

        <q-btn
          flat
          no-caps
          color="primary"
          icon="add"
          label="Crear bloqueo"
          class="q-mt-md"
          @click="mostrarFormulario = true"
        />
      </div>
    </div>

    <!-- Formulario temporal -->
    <AvailabilityBlockForm v-model="mostrarFormulario" @saved="manejarFormularioGuardado" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AvailabilityBlockForm from '@/modules/availability-blocks/components/availability-block-form.vue';
import { useAvailabilityBlocks } from '@/modules/availability-blocks';

import type { CreateAvailabilityBlockRequest } from '@/modules/availability-blocks/types/availability-block.types';

const mostrarFormulario = ref(false);

const {
  blocks,
  cantidadBloqueos,
  bloqueosDiaCompleto,
  bloqueosParciales,
  cargarBloqueos,
  crearBloqueo,
  eliminarBloqueo,
} = useAvailabilityBlocks();

onMounted(() => {
  cargarBloqueos();
});

const manejarFormularioGuardado = (datos: CreateAvailabilityBlockRequest): void => {
  crearBloqueo(datos);

  mostrarFormulario.value = false;
};
</script>

<style scoped>
.availability-page {
  width: 100%;
  margin: 0;
}

.availability-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.availability-page__info {
  margin-bottom: 24px;
  border: 1px solid rgba(25, 118, 210, 0.12);
  background: rgba(25, 118, 210, 0.05);
  color: #475467;
}

.availability-page__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.availability-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e7eaf0;
  border-radius: 14px;
  background: #ffffff;
  color: var(--q-primary);
}

.availability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e7eaf0;
  border-radius: 14px;
  background: #ffffff;
}

.availability-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.availability-card__content {
  flex: 1;
  min-width: 0;
}

.availability-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 32px;
  border: 1px dashed #d9deea;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
  color: #98a2b3;
}

@media (max-width: 700px) {
  .availability-page__header {
    flex-direction: column;
  }

  .availability-page__header .q-btn {
    width: 100%;
  }

  .availability-page__stats {
    grid-template-columns: 1fr;
  }
}
</style>
