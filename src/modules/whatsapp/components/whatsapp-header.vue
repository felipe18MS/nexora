<template>
  <div class="whatsapp-header">
    <div class="header-content">
      <div class="header-icon">
        <q-icon name="chat" size="22px" />
      </div>

      <div class="header-info">
        <div class="header-title">WhatsApp</div>

        <div class="header-subtitle">Gestiona tus conversaciones y mensajes de WhatsApp</div>
      </div>
    </div>

    <div v-if="conexion" class="connection-status" :class="`status-${conexion.estado}`">
      <span class="status-dot" />

      <span>
        {{ obtenerNombreEstado(conexion.estado) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConexionWhatsApp } from '../types/whatsapp.types';

defineProps<{
  conexion: ConexionWhatsApp | null;
}>();

const obtenerNombreEstado = (estado: ConexionWhatsApp['estado']): string => {
  const nombres: Record<ConexionWhatsApp['estado'], string> = {
    conectado: 'Conectado',
    desconectado: 'Desconectado',
    pendiente: 'Pendiente',
  };

  return nombres[estado];
};
</script>

<style scoped>
.whatsapp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.header-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eef2f7;
  color: #334155;
}

.header-info {
  min-width: 0;
}

.header-title {
  color: #1f2937;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.header-subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
}

.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94a3b8;
}

.status-conectado .status-dot {
  background: #64748b;
}

.status-pendiente .status-dot {
  background: #94a3b8;
}

.status-desconectado .status-dot {
  background: #cbd5e1;
}

@media (max-width: 600px) {
  .whatsapp-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .connection-status {
    align-self: flex-start;
  }
}
</style>
