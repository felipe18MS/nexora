<template>
  <div class="message-list">
    <div class="list-header">
      <div>
        <div class="list-title">Mensajes recientes</div>

        <div class="list-subtitle">Historial de mensajes de WhatsApp</div>
      </div>

      <q-badge v-if="mensajes.length" :label="mensajes.length" class="messages-count" />
    </div>

    <div v-if="mensajes.length === 0" class="empty-state">
      <q-icon name="chat_bubble_outline" size="40px" />

      <div class="empty-title">No hay mensajes</div>

      <div class="empty-text">Todavía no se han registrado mensajes de WhatsApp.</div>
    </div>

    <div v-else class="messages">
      <div v-for="mensaje in mensajes" :key="mensaje.id" class="message-item">
        <div class="message-avatar">
          {{ obtenerIniciales(mensaje.clienteNombre) }}
        </div>

        <div class="message-content">
          <div class="message-top">
            <div class="message-client">
              {{ mensaje.clienteNombre }}
            </div>

            <div class="message-time">
              {{ formatearHora(mensaje.creadoEn) }}
            </div>
          </div>

          <div class="message-phone">
            {{ mensaje.telefono }}
          </div>

          <div class="message-bottom">
            <div
              class="message-preview"
              :class="{
                'message-outgoing': mensaje.direccion === 'saliente',
              }"
            >
              <q-icon v-if="mensaje.direccion === 'saliente'" name="arrow_forward" size="13px" />

              {{ mensaje.contenido }}
            </div>

            <div class="message-status">
              <q-icon :name="obtenerIconoEstado(mensaje.estado)" size="15px" />

              <span>
                {{ obtenerNombreEstado(mensaje.estado) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EstadoMensajeWhatsApp, MensajeWhatsApp } from '../types/whatsapp.types';

defineProps<{
  mensajes: MensajeWhatsApp[];
}>();

const obtenerIniciales = (nombre: string): string => {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase();
};

const formatearHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
};

const obtenerNombreEstado = (estado: EstadoMensajeWhatsApp): string => {
  const nombres: Record<EstadoMensajeWhatsApp, string> = {
    pendiente: 'Pendiente',
    enviado: 'Enviado',
    entregado: 'Entregado',
    leido: 'Leído',
    fallido: 'Fallido',
  };

  return nombres[estado];
};

const obtenerIconoEstado = (estado: EstadoMensajeWhatsApp): string => {
  const iconos: Record<EstadoMensajeWhatsApp, string> = {
    pendiente: 'schedule',
    enviado: 'check',
    entregado: 'done_all',
    leido: 'done_all',
    fallido: 'error_outline',
  };

  return iconos[estado];
};
</script>

<style scoped>
.message-list {
  min-height: 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 18px;
}

.list-title {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.list-subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.messages-count {
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
}

.messages {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid #f1f5f9;
}

.message-item:first-child {
  border-top: 0;
}

.message-avatar {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e8eef7;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.message-client {
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.message-time {
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 10px;
}

.message-phone {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 10px;
}

.message-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 7px;
}

.message-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  color: #64748b;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-outgoing {
  color: #475569;
}

.message-status {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 10px;
}

.empty-state {
  padding: 40px 20px 25px;
  text-align: center;
  color: #94a3b8;
}

.empty-title {
  margin-top: 10px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.empty-text {
  margin-top: 4px;
  font-size: 11px;
}

@media (max-width: 600px) {
  .message-list {
    padding: 16px;
  }

  .message-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .message-status {
    align-self: flex-start;
  }
}
</style>
