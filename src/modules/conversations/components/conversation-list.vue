<template>
  <div class="conversation-list">
    <div v-if="conversaciones.length === 0" class="empty-state">
      <q-icon name="forum" size="40px" />
      <div class="empty-title">No hay conversaciones</div>
      <div class="empty-text">No encontramos conversaciones con los filtros actuales.</div>
    </div>

    <button
      v-for="conversacion in conversaciones"
      :key="conversacion.id"
      type="button"
      class="conversation-item"
      :class="{ active: conversacion.id === conversacionSeleccionadaId }"
      @click="seleccionar(conversacion)"
    >
      <div class="avatar">
        {{ obtenerIniciales(conversacion.clienteNombre) }}
      </div>

      <div class="conversation-content">
        <div class="conversation-top">
          <span class="client-name">
            {{ conversacion.clienteNombre }}
          </span>

          <span class="conversation-time">
            {{ formatearHora(conversacion.ultimoMensajeEn) }}
          </span>
        </div>

        <div class="conversation-middle">
          <span class="conversation-subject">
            {{ conversacion.asunto }}
          </span>

          <q-icon :name="obtenerIconoCanal(conversacion.canal)" size="15px" class="channel-icon" />
        </div>

        <div class="conversation-bottom">
          <span class="last-message">
            {{ conversacion.ultimoMensaje }}
          </span>

          <q-badge
            v-if="conversacion.mensajesNoLeidos > 0"
            rounded
            :label="conversacion.mensajesNoLeidos"
            class="unread-badge"
          />
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CanalConversacion, Conversacion } from '../types/conversation.types';

defineProps<{
  conversaciones: Conversacion[];
  conversacionSeleccionadaId: string | null;
}>();

const emit = defineEmits<{
  seleccionar: [conversacion: Conversacion];
}>();

const seleccionar = (conversacion: Conversacion): void => {
  emit('seleccionar', conversacion);
};

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

const obtenerIconoCanal = (canal: CanalConversacion): string => {
  const iconos: Record<CanalConversacion, string> = {
    whatsapp: 'chat',
    llamada: 'phone',
    email: 'mail',
    interno: 'forum',
  };

  return iconos[canal];
};
</script>

<style scoped>
.conversation-list {
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
}

.conversation-item {
  display: flex;
  width: 100%;
  padding: 15px;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid #f0f1f3;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.conversation-item:hover {
  background: #f8fafc;
}

.conversation-item.active {
  background: #f1f5f9;
}

.avatar {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8eef7;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-top,
.conversation-middle,
.conversation-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversation-top {
  justify-content: space-between;
}

.client-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 11px;
}

.conversation-middle {
  margin-top: 3px;
}

.conversation-subject {
  color: #64748b;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channel-icon {
  flex-shrink: 0;
  color: #94a3b8;
}

.conversation-bottom {
  margin-top: 5px;
  justify-content: space-between;
}

.last-message {
  color: #64748b;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  flex-shrink: 0;
  background: #334155;
  color: #ffffff;
  font-size: 10px;
}

.empty-state {
  padding: 40px 20px;
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
  font-size: 12px;
}
</style>
