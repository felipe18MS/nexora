<template>
  <div class="status-card">
    <div class="status-card-header">
      <div>
        <div class="status-card-title">Estado de la conexión</div>

        <div class="status-card-subtitle">Información de tu cuenta de WhatsApp</div>
      </div>

      <div class="status-icon">
        <q-icon name="wifi" size="20px" />
      </div>
    </div>

    <div class="status-content">
      <div class="connection-main">
        <div
          class="connection-indicator"
          :class="`indicator-${conexion?.estado ?? 'desconectado'}`"
        >
          <span class="indicator-dot" />
        </div>

        <div>
          <div class="connection-label">
            {{ obtenerNombreEstado }}
          </div>

          <div class="connection-number">
            {{ conexion?.numero || 'Sin número configurado' }}
          </div>
        </div>
      </div>

      <div class="connection-details">
        <div class="detail-item">
          <span class="detail-label"> Cuenta </span>

          <span class="detail-value">
            {{ conexion?.nombreCuenta || 'Sin configurar' }}
          </span>
        </div>

        <div class="detail-item">
          <span class="detail-label"> Última conexión </span>

          <span class="detail-value">
            {{ conexion ? formatearFecha(conexion.ultimaConexion) : '—' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { ConexionWhatsApp } from '../types/whatsapp.types';

const props = defineProps<{
  conexion: ConexionWhatsApp | null;
}>();

const obtenerNombreEstado = computed(() => {
  const nombres: Record<ConexionWhatsApp['estado'], string> = {
    conectado: 'Conectado',
    desconectado: 'Desconectado',
    pendiente: 'Pendiente',
  };

  return nombres[props.conexion?.estado ?? 'desconectado'];
});

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};
</script>

<style scoped>
.status-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.status-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.status-card-title {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.status-card-subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.status-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f1f5f9;
  color: #64748b;
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-top: 22px;
}

.connection-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connection-indicator {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #94a3b8;
}

.indicator-conectado .indicator-dot {
  background: #64748b;
}

.indicator-pendiente .indicator-dot {
  background: #94a3b8;
}

.indicator-desconectado .indicator-dot {
  background: #cbd5e1;
}

.connection-label {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.connection-number {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}

.connection-details {
  display: flex;
  gap: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #94a3b8;
  font-size: 10px;
}

.detail-value {
  color: #475569;
  font-size: 12px;
}

@media (max-width: 700px) {
  .status-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .connection-details {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
