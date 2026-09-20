<template>
  <article class="integration-card">
    <div class="integration-card__top">
      <div class="integration-card__icon">
        <q-icon :name="integracion.icono" size="22px" />
      </div>

      <span
        class="integration-card__status"
        :class="`integration-card__status--${integracion.estado}`"
      >
        <q-icon :name="iconoEstado" size="15px" />

        {{ textoEstado }}
      </span>
    </div>

    <div class="integration-card__body">
      <h2 class="integration-card__title">
        {{ integracion.nombre }}
      </h2>

      <div class="integration-card__category">
        {{ integracion.categoria }}
      </div>

      <p class="integration-card__description">
        {{ integracion.descripcion }}
      </p>
    </div>

    <div class="integration-card__footer">
      <div class="integration-card__connection">
        <q-icon :name="integracion.configurada ? 'check_circle' : 'info'" size="17px" />

        {{ integracion.configurada ? 'Configurada' : 'Requiere configuración' }}
      </div>

      <q-btn
        flat
        no-caps
        label="Ver detalles"
        icon="visibility"
        color="primary"
        class="integration-card__button"
        @click="$emit('ver', integracion)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Integracion } from '../types/integration.types';

const props = defineProps<{
  integracion: Integracion;
}>();

defineEmits<{
  ver: [integracion: Integracion];
}>();

const textoEstado = computed(() => {
  const estados: Record<Integracion['estado'], string> = {
    conectada: 'Conectada',
    pendiente: 'Pendiente',
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
.integration-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.integration-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}

.integration-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.integration-card__icon {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #f3f4f6;
  color: #374151;
}

.integration-card__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.integration-card__status--conectada {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
}

.integration-card__status--pendiente {
  background: rgba(245, 158, 11, 0.09);
  color: #b45309;
}

.integration-card__status--desconectada {
  background: #f3f4f6;
  color: #6b7280;
}

.integration-card__body {
  flex: 1;
  margin-top: 16px;
}

.integration-card__title {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.integration-card__category {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 500;
}

.integration-card__description {
  min-height: 58px;
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.55;
}

.integration-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #f0f1f3;
}

.integration-card__connection {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 11px;
}

.integration-card__button {
  border-radius: 8px;
  font-size: 12px;
}

@media (max-width: 500px) {
  .integration-card {
    padding: 16px;
  }

  .integration-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .integration-card__button {
    width: 100%;
  }
}
</style>
