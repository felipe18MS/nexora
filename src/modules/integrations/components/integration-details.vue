<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="integration-details">
      <div class="integration-details__header">
        <div class="integration-details__heading">
          <div class="integration-details__icon">
            <q-icon :name="integracion.icono" size="23px" />
          </div>

          <div class="integration-details__titles">
            <div class="integration-details__title">
              {{ integracion.nombre }}
            </div>

            <div class="integration-details__subtitle">
              {{ integracion.categoria }}
            </div>
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          color="grey-7"
          aria-label="Cerrar"
          @click="$emit('update:modelValue', false)"
        />
      </div>

      <q-separator />

      <q-card-section class="integration-details__body">
        <div class="integration-details__status">
          <span
            class="integration-details__status-pill"
            :class="`integration-details__status-pill--${integracion.estado}`"
          >
            <q-icon :name="iconoEstado" size="17px" />

            {{ textoEstado }}
          </span>
        </div>

        <p class="integration-details__description">
          {{ integracion.descripcion }}
        </p>

        <div class="integration-details__section">
          <div class="integration-details__section-title">Capacidades</div>

          <div class="integration-details__features">
            <div
              v-for="detalle in integracion.detalles"
              :key="detalle"
              class="integration-details__feature"
            >
              <q-icon name="check_circle" size="18px" />

              <span>{{ detalle }}</span>
            </div>
          </div>
        </div>

        <div class="integration-details__meta">
          <div class="integration-details__meta-item">
            <span>Configuración</span>

            <strong>
              {{ integracion.configurada ? 'Configurada' : 'Pendiente' }}
            </strong>
          </div>

          <div class="integration-details__meta-item">
            <span>Última conexión</span>

            <strong>
              {{
                integracion.ultimaConexion
                  ? formatearFecha(integracion.ultimaConexion)
                  : 'Sin conexión'
              }}
            </strong>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <div class="integration-details__footer">
        <q-btn
          flat
          no-caps
          label="Cerrar"
          color="grey-8"
          class="integration-details__cancel"
          @click="$emit('update:modelValue', false)"
        />

        <q-btn
          v-if="integracion.estado !== 'conectada'"
          unelevated
          no-caps
          icon="link"
          label="Conectar"
          color="primary"
          class="integration-details__action"
          @click="$emit('conectar', integracion)"
        />

        <q-btn
          v-else
          unelevated
          no-caps
          icon="link_off"
          label="Desconectar"
          color="grey-8"
          class="integration-details__action"
          @click="$emit('desconectar', integracion)"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { formatearFecha } from '../../../utils/date.utils';

import type { Integracion } from '../types/integration.types';

const props = defineProps<{
  modelValue: boolean;
  integracion: Integracion;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
  conectar: [integracion: Integracion];
  desconectar: [integracion: Integracion];
}>();

const textoEstado = computed(() => {
  const estados: Record<Integracion['estado'], string> = {
    conectada: 'Conectada',
    pendiente: 'Pendiente de configuración',
    desconectada: 'Desconectada',
  };

  return estados[props.integracion.estado];
});

const iconoEstado = computed(() => {
  const iconos: Record<Integracion['estado'], string> = {
    conectada: 'check_circle',
    pendiente: 'schedule',
    desconectada: 'link_off',
  };

  return iconos[props.integracion.estado];
});
</script>

<style scoped>
.integration-details {
  width: min(600px, 94vw);
  max-width: 600px;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
}

.integration-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.integration-details__heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.integration-details__icon {
  display: flex;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.integration-details__titles {
  min-width: 0;
}

.integration-details__title {
  color: #111827;
  font-size: 17px;
  font-weight: 700;
}

.integration-details__subtitle {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
}

.integration-details__body {
  padding: 20px;
}

.integration-details__status {
  margin-bottom: 14px;
}

.integration-details__status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.integration-details__status-pill--conectada {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
}

.integration-details__status-pill--pendiente {
  background: rgba(245, 158, 11, 0.09);
  color: #b45309;
}

.integration-details__status-pill--desconectada {
  background: #f3f4f6;
  color: #6b7280;
}

.integration-details__description {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.integration-details__section {
  margin-top: 22px;
}

.integration-details__section-title {
  color: #111827;
  font-size: 13px;
  font-weight: 700;
}

.integration-details__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.integration-details__feature {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border-radius: 9px;
  background: #f8fafc;
  color: #4b5563;
  font-size: 12px;
}

.integration-details__feature .q-icon {
  flex: 0 0 auto;
  color: #10b981;
}

.integration-details__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.integration-details__meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid #eef0f2;
  border-radius: 10px;
}

.integration-details__meta-item span {
  color: #9ca3af;
  font-size: 10px;
}

.integration-details__meta-item strong {
  color: #374151;
  font-size: 12px;
  font-weight: 600;
}

.integration-details__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
}

.integration-details__cancel,
.integration-details__action {
  min-height: 38px;
  border-radius: 9px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .integration-details {
    width: 94vw;
  }

  .integration-details__header,
  .integration-details__body {
    padding: 16px;
  }

  .integration-details__features,
  .integration-details__meta {
    grid-template-columns: 1fr;
  }

  .integration-details__footer {
    flex-direction: column-reverse;
    padding: 12px 16px;
  }

  .integration-details__cancel,
  .integration-details__action {
    width: 100%;
  }
}
</style>
