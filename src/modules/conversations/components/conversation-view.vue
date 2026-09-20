<template>
  <div v-if="conversacion" class="conversation-view">
    <div class="conversation-header">
      <div class="header-client">
        <div class="avatar">
          {{ obtenerIniciales(conversacion.clienteNombre) }}
        </div>

        <div>
          <div class="client-name">
            {{ conversacion.clienteNombre }}
          </div>

          <div class="client-info">
            {{ conversacion.clienteTelefono }}
            <span>·</span>
            {{ conversacion.asunto }}
          </div>
        </div>
      </div>

      <div class="header-actions">
        <q-btn flat round dense icon="done" color="grey-7" @click="marcarLeida">
          <q-tooltip>Marcar como leída</q-tooltip>
        </q-btn>

        <q-btn flat round dense icon="more_vert" color="grey-7" />
      </div>
    </div>

    <div ref="messagesContainer" class="messages-container">
      <div v-if="mensajes.length === 0" class="empty-messages">
        <q-icon name="forum" size="36px" />
        <span>Aún no hay mensajes.</span>
      </div>

      <div
        v-for="mensaje in mensajes"
        :key="mensaje.id"
        class="message-row"
        :class="mensaje.tipo === 'saliente' ? 'outgoing' : 'incoming'"
      >
        <div class="message-bubble">
          <div class="message-text">
            {{ mensaje.contenido }}
          </div>

          <div class="message-time">
            {{ formatearHora(mensaje.creadoEn) }}
          </div>
        </div>
      </div>
    </div>

    <div class="message-composer">
      <q-input
        v-model="mensaje"
        outlined
        dense
        autogrow
        placeholder="Escribe un mensaje..."
        :maxlength="1000"
        @keydown.enter.exact.prevent="enviar"
      >
        <template #prepend>
          <q-btn flat round dense icon="add" color="grey-7" />
        </template>

        <template #append>
          <q-btn
            round
            unelevated
            dense
            icon="send"
            color="primary"
            :disable="!mensaje.trim()"
            @click="enviar"
          />
        </template>
      </q-input>
    </div>
  </div>

  <div v-else class="no-conversation">
    <q-icon name="forum" size="56px" />
    <div class="no-conversation-title">Selecciona una conversación</div>
    <div class="no-conversation-text">Elige una conversación de la lista para comenzar.</div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import type { Conversacion, MensajeConversacion } from '../types/conversation.types';

const props = defineProps<{
  conversacion: Conversacion | null;
  mensajes: MensajeConversacion[];
}>();

const emit = defineEmits<{
  enviar: [contenido: string];
  marcarLeida: [];
}>();

const mensaje = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

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

const enviar = (): void => {
  const contenido = mensaje.value.trim();

  if (!contenido) {
    return;
  }

  emit('enviar', contenido);
  mensaje.value = '';
};

const marcarLeida = (): void => {
  emit('marcarLeida');
};

const desplazarAlFinal = async (): Promise<void> => {
  await nextTick();

  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(
  () => props.mensajes,
  () => {
    void desplazarAlFinal();
  },
  { deep: true },
);
</script>

<style scoped>
.conversation-view {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  background: #ffffff;
}

.conversation-header {
  min-height: 70px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.header-client {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
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

.client-name {
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
}

.client-info {
  display: flex;
  gap: 6px;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
}

.message-row {
  display: flex;
  margin-bottom: 12px;
}

.message-row.incoming {
  justify-content: flex-start;
}

.message-row.outgoing {
  justify-content: flex-end;
}

.message-bubble {
  max-width: min(70%, 520px);
  padding: 10px 13px;
  border-radius: 14px;
}

.incoming .message-bubble {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.outgoing .message-bubble {
  background: #e9eff7;
  border-bottom-right-radius: 4px;
}

.message-text {
  color: #334155;
  font-size: 13px;
  line-height: 1.5;
}

.message-time {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 10px;
  text-align: right;
}

.message-composer {
  padding: 14px 18px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

.empty-messages,
.no-conversation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  text-align: center;
}

.empty-messages {
  height: 100%;
  gap: 8px;
}

.no-conversation {
  height: 100%;
  padding: 30px;
  background: #f8fafc;
}

.no-conversation-title {
  margin-top: 14px;
  color: #475569;
  font-size: 15px;
  font-weight: 600;
}

.no-conversation-text {
  margin-top: 5px;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 700px) {
  .messages-container {
    padding: 16px;
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
