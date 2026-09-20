<template>
  <div class="ai-header">
    <div class="ai-header__content">
      <div class="ai-header__icon">
        <q-icon name="auto_awesome" size="28px" />
      </div>

      <div class="ai-header__text">
        <div class="ai-header__title">Agente IA</div>

        <div class="ai-header__subtitle">
          Configura y administra el asistente inteligente de NEXORA.
        </div>
      </div>
    </div>

    <div v-if="agente" class="ai-header__status">
      <q-icon :name="iconoEstado" size="18px" />

      <span>
        {{ etiquetaEstado }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { AgenteIA } from '../types/ai.types';

interface Props {
  agente: AgenteIA | null;
}

const props = defineProps<Props>();

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
</script>

<style scoped>
.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 4px 0;
}

.ai-header__content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.ai-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 14px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.ai-header__text {
  min-width: 0;
}

.ai-header__title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--q-dark);
}

.ai-header__subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.ai-header__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 7px 11px;
  border: 1px solid rgba(25, 118, 210, 0.14);
  border-radius: 999px;
  background: rgba(25, 118, 210, 0.06);
  color: var(--q-primary);
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .ai-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .ai-header__status {
    margin-left: 66px;
  }

  .ai-header__title {
    font-size: 21px;
  }
}
</style>
