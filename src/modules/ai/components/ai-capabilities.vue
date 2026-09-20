<template>
  <q-card flat bordered class="ai-capabilities">
    <q-card-section class="ai-capabilities__header">
      <div>
        <div class="ai-capabilities__title">Capacidades y canales</div>

        <div class="ai-capabilities__subtitle">
          Consulta las funciones que el agente tiene habilitadas actualmente.
        </div>
      </div>

      <q-icon name="extension" size="24px" color="primary" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="ai-capabilities__groups">
        <div class="ai-capabilities__group">
          <div class="ai-capabilities__group-header">
            <div class="ai-capabilities__group-title">
              <q-icon name="hub" size="19px" />

              Canales de atención
            </div>

            <span class="ai-capabilities__count">
              {{ canales.length }}
            </span>
          </div>

          <div v-if="canales.length" class="ai-capabilities__items">
            <div v-for="canal in canales" :key="canal" class="ai-capabilities__item">
              <div class="ai-capabilities__item-icon">
                <q-icon :name="obtenerIconoCanal(canal)" size="18px" />
              </div>

              <div class="ai-capabilities__item-content">
                <div class="ai-capabilities__item-name">
                  {{ obtenerEtiquetaCanal(canal) }}
                </div>

                <div class="ai-capabilities__item-description">
                  {{ obtenerDescripcionCanal(canal) }}
                </div>
              </div>

              <q-icon name="check_circle" size="18px" color="positive" />
            </div>
          </div>

          <div v-else class="ai-capabilities__empty">
            <q-icon name="link_off" size="20px" />

            No hay canales configurados.
          </div>
        </div>

        <div class="ai-capabilities__group">
          <div class="ai-capabilities__group-header">
            <div class="ai-capabilities__group-title">
              <q-icon name="psychology" size="19px" />

              Capacidades del agente
            </div>

            <span class="ai-capabilities__count">
              {{ capacidades.length }}
            </span>
          </div>

          <div v-if="capacidades.length" class="ai-capabilities__items">
            <div v-for="capacidad in capacidades" :key="capacidad" class="ai-capabilities__item">
              <div class="ai-capabilities__item-icon">
                <q-icon :name="obtenerIconoCapacidad(capacidad)" size="18px" />
              </div>

              <div class="ai-capabilities__item-content">
                <div class="ai-capabilities__item-name">
                  {{ obtenerEtiquetaCapacidad(capacidad) }}
                </div>

                <div class="ai-capabilities__item-description">
                  {{ obtenerDescripcionCapacidad(capacidad) }}
                </div>
              </div>

              <q-icon name="check_circle" size="18px" color="positive" />
            </div>
          </div>

          <div v-else class="ai-capabilities__empty">
            <q-icon name="block" size="20px" />

            No hay capacidades configuradas.
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { CanalAgenteIA, CapacidadAgenteIA } from '../types/ai.types';

interface Props {
  canales: CanalAgenteIA[];
  capacidades: CapacidadAgenteIA[];
}

defineProps<Props>();

const obtenerEtiquetaCanal = (canal: CanalAgenteIA): string => {
  switch (canal) {
    case 'whatsapp':
      return 'WhatsApp';

    case 'llamada':
      return 'Llamadas';

    case 'web':
      return 'Sitio web';
  }
};

const obtenerDescripcionCanal = (canal: CanalAgenteIA): string => {
  switch (canal) {
    case 'whatsapp':
      return 'Atención mediante mensajes de WhatsApp.';

    case 'llamada':
      return 'Atención automatizada mediante llamadas.';

    case 'web':
      return 'Atención desde el sitio web.';
  }
};

const obtenerIconoCanal = (canal: CanalAgenteIA): string => {
  switch (canal) {
    case 'whatsapp':
      return 'chat';

    case 'llamada':
      return 'phone';

    case 'web':
      return 'language';
  }
};

const obtenerEtiquetaCapacidad = (capacidad: CapacidadAgenteIA): string => {
  switch (capacidad) {
    case 'gestionar-citas':
      return 'Gestionar citas';

    case 'consultar-servicios':
      return 'Consultar servicios';

    case 'consultar-horarios':
      return 'Consultar horarios';

    case 'consultar-precios':
      return 'Consultar precios';

    case 'responder-preguntas':
      return 'Responder preguntas';

    case 'confirmar-citas':
      return 'Confirmar citas';

    case 'cancelar-citas':
      return 'Cancelar citas';

    case 'reprogramar-citas':
      return 'Reprogramar citas';

    case 'capturar-clientes':
      return 'Capturar clientes';

    case 'transferir-humano':
      return 'Transferir a un humano';
  }
};

const obtenerDescripcionCapacidad = (capacidad: CapacidadAgenteIA): string => {
  switch (capacidad) {
    case 'gestionar-citas':
      return 'Crear y gestionar reservas.';

    case 'consultar-servicios':
      return 'Informar sobre los servicios disponibles.';

    case 'consultar-horarios':
      return 'Consultar horarios disponibles.';

    case 'consultar-precios':
      return 'Informar sobre precios y tarifas.';

    case 'responder-preguntas':
      return 'Resolver preguntas frecuentes.';

    case 'confirmar-citas':
      return 'Confirmar citas existentes.';

    case 'cancelar-citas':
      return 'Gestionar cancelaciones de citas.';

    case 'reprogramar-citas':
      return 'Cambiar fecha u hora de una cita.';

    case 'capturar-clientes':
      return 'Registrar información de nuevos clientes.';

    case 'transferir-humano':
      return 'Derivar conversaciones al equipo.';
  }
};

const obtenerIconoCapacidad = (capacidad: CapacidadAgenteIA): string => {
  switch (capacidad) {
    case 'gestionar-citas':
      return 'event';

    case 'consultar-servicios':
      return 'category';

    case 'consultar-horarios':
      return 'schedule';

    case 'consultar-precios':
      return 'payments';

    case 'responder-preguntas':
      return 'help_outline';

    case 'confirmar-citas':
      return 'event_available';

    case 'cancelar-citas':
      return 'event_busy';

    case 'reprogramar-citas':
      return 'event_repeat';

    case 'capturar-clientes':
      return 'person_add';

    case 'transferir-humano':
      return 'support_agent';
  }
};
</script>

<style scoped>
.ai-capabilities {
  border-radius: 16px;
  background: #ffffff;
}

.ai-capabilities__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ai-capabilities__title {
  color: var(--q-dark);
  font-size: 17px;
  font-weight: 700;
}

.ai-capabilities__subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.ai-capabilities__groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.ai-capabilities__group {
  min-width: 0;
}

.ai-capabilities__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.ai-capabilities__group-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--q-dark);
  font-size: 14px;
  font-weight: 700;
}

.ai-capabilities__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 24px;
  padding: 0 7px;
  border-radius: 999px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
  font-size: 12px;
  font-weight: 700;
}

.ai-capabilities__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-capabilities__item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid #edf0f4;
  border-radius: 11px;
  background: #fafbfc;
}

.ai-capabilities__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 9px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.ai-capabilities__item-content {
  min-width: 0;
  flex: 1;
}

.ai-capabilities__item-name {
  color: var(--q-dark);
  font-size: 13px;
  font-weight: 600;
}

.ai-capabilities__item-description {
  margin-top: 2px;
  color: #6b7280;
  font-size: 11px;
  line-height: 1.4;
}

.ai-capabilities__empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 1px dashed #d9dee7;
  border-radius: 11px;
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 800px) {
  .ai-capabilities__groups {
    grid-template-columns: 1fr;
  }
}
</style>
