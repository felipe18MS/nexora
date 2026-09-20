<template>
  <q-card flat bordered class="ai-status-card">
    <q-card-section>
      <div class="ai-status-card__header">
        <div class="ai-status-card__identity">
          <div class="ai-status-card__avatar">
            <q-icon name="smart_toy" size="26px" />
          </div>

          <div class="ai-status-card__info">
            <div class="ai-status-card__name">
              {{ agente?.nombre || 'Agente IA' }}
            </div>

            <div class="ai-status-card__description">
              {{ agente?.descripcion || 'Asistente virtual de NEXORA' }}
            </div>
          </div>
        </div>

        <q-btn
          flat
          dense
          no-caps
          :icon="iconoAccion"
          :label="etiquetaAccion"
          :loading="guardando"
          @click="alternarEstado"
        />
      </div>

      <q-separator class="q-my-lg" />

      <div class="ai-status-card__status">
        <div class="ai-status-card__status-info">
          <span class="ai-status-card__label"> Estado del agente </span>

          <span class="ai-status-card__state">
            <q-icon :name="iconoEstado" size="18px" />

            {{ etiquetaEstado }}
          </span>
        </div>

        <div v-if="agente?.ultimaActividad" class="ai-status-card__activity">
          <span class="ai-status-card__label"> Última actividad </span>

          <span class="ai-status-card__date">
            {{ fechaUltimaActividad }}
          </span>
        </div>
      </div>

      <div class="ai-status-card__metrics">
        <div class="ai-status-card__metric">
          <q-icon name="forum" size="20px" />

          <div>
            <div class="ai-status-card__metric-value">
              {{ conversacionesAtendidas }}
            </div>

            <div class="ai-status-card__metric-label">Conversaciones atendidas</div>
          </div>
        </div>

        <div class="ai-status-card__metric">
          <q-icon name="event_available" size="20px" />

          <div>
            <div class="ai-status-card__metric-value">
              {{ citasGestionadas }}
            </div>

            <div class="ai-status-card__metric-label">Citas gestionadas</div>
          </div>
        </div>

        <div class="ai-status-card__metric">
          <q-icon name="psychology" size="20px" />

          <div>
            <div class="ai-status-card__metric-value">
              {{ capacidadesActivas }}
            </div>

            <div class="ai-status-card__metric-label">Capacidades activas</div>
          </div>
        </div>

        <div class="ai-status-card__metric">
          <q-icon name="hub" size="20px" />

          <div>
            <div class="ai-status-card__metric-value">
              {{ canalesActivos }}
            </div>

            <div class="ai-status-card__metric-label">Canales activos</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { AgenteIA } from '../types/ai.types';

interface Props {
  agente: AgenteIA | null;
  guardando?: boolean;
  conversacionesAtendidas?: number;
  citasGestionadas?: number;
  capacidadesActivas?: number;
  canalesActivos?: number;
}

const props = withDefaults(defineProps<Props>(), {
  guardando: false,
  conversacionesAtendidas: 0,
  citasGestionadas: 0,
  capacidadesActivas: 0,
  canalesActivos: 0,
});

const emit = defineEmits<{
  cambiarEstado: [];
}>();

const etiquetaEstado = computed((): string => {
  switch (props.agente?.estado) {
    case 'activo':
      return 'Activo';

    case 'inactivo':
      return 'Inactivo';

    case 'configuracion-incompleta':
      return 'Configuración incompleta';

    default:
      return 'Sin configurar';
  }
});

const iconoEstado = computed((): string => {
  switch (props.agente?.estado) {
    case 'activo':
      return 'check_circle';

    case 'inactivo':
      return 'pause_circle';

    case 'configuracion-incompleta':
      return 'error_outline';

    default:
      return 'help_outline';
  }
});

const etiquetaAccion = computed((): string => {
  return props.agente?.estado === 'activo' ? 'Desactivar' : 'Activar';
});

const iconoAccion = computed((): string => {
  return props.agente?.estado === 'activo' ? 'pause' : 'play_arrow';
});

const fechaUltimaActividad = computed((): string => {
  if (!props.agente?.ultimaActividad) {
    return '';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(props.agente.ultimaActividad));
});

const alternarEstado = (): void => {
  emit('cambiarEstado');
};
</script>

<style scoped>
.ai-status-card {
  border-radius: 16px;
  background: #ffffff;
}

.ai-status-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ai-status-card__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.ai-status-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 13px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.ai-status-card__info {
  min-width: 0;
}

.ai-status-card__name {
  overflow: hidden;
  color: var(--q-dark);
  font-size: 17px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-status-card__description {
  max-width: 620px;
  margin-top: 3px;
  overflow: hidden;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-status-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.ai-status-card__status-info,
.ai-status-card__activity {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ai-status-card__label {
  color: #6b7280;
  font-size: 12px;
}

.ai-status-card__state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--q-primary);
  font-size: 14px;
  font-weight: 600;
}

.ai-status-card__date {
  color: #374151;
  font-size: 13px;
}

.ai-status-card__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.ai-status-card__metric {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 14px;
  border: 1px solid #edf0f4;
  border-radius: 12px;
  background: #fafbfc;
  color: var(--q-primary);
}

.ai-status-card__metric-value {
  color: var(--q-dark);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.ai-status-card__metric-label {
  margin-top: 3px;
  color: #6b7280;
  font-size: 11px;
  line-height: 1.3;
}

@media (max-width: 900px) {
  .ai-status-card__metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .ai-status-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .ai-status-card__status {
    align-items: flex-start;
    flex-direction: column;
  }

  .ai-status-card__metrics {
    grid-template-columns: 1fr;
  }

  .ai-status-card__description {
    white-space: normal;
  }
}
</style>
