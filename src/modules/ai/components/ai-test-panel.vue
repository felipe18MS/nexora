<template>
  <q-card flat bordered class="ai-test-panel">
    <q-card-section class="ai-test-panel__header">
      <div>
        <div class="ai-test-panel__title">Probar agente IA</div>

        <div class="ai-test-panel__subtitle">
          Simula una conversación para comprobar el comportamiento del asistente.
        </div>
      </div>

      <q-btn
        flat
        dense
        no-caps
        icon="restart_alt"
        label="Reiniciar"
        :disable="procesandoMensaje"
        @click="reiniciar"
      />
    </q-card-section>

    <q-separator />

    <q-card-section class="ai-test-panel__body">
      <div ref="contenedorMensajes" class="ai-test-panel__messages">
        <div v-if="!mensajes.length" class="ai-test-panel__empty">
          <q-icon name="forum" size="32px" />

          <div>
            <div class="ai-test-panel__empty-title">Inicia una conversación</div>

            <div class="ai-test-panel__empty-text">Escribe un mensaje para probar el agente.</div>
          </div>
        </div>

        <div
          v-for="mensaje in mensajes"
          :key="mensaje.id"
          class="ai-test-panel__message-row"
          :class="{
            'ai-test-panel__message-row--user': mensaje.rol === 'usuario',
          }"
        >
          <div
            class="ai-test-panel__message"
            :class="{
              'ai-test-panel__message--user': mensaje.rol === 'usuario',
              'ai-test-panel__message--agent': mensaje.rol === 'agente',
            }"
          >
            <div class="ai-test-panel__message-role">
              {{ mensaje.rol === 'usuario' ? 'Tú' : 'Agente IA' }}
            </div>

            <div class="ai-test-panel__message-content">
              {{ mensaje.contenido }}
            </div>

            <div class="ai-test-panel__message-time">
              {{ formatearHora(mensaje.creadoEn) }}
            </div>
          </div>
        </div>

        <div v-if="procesandoMensaje" class="ai-test-panel__message-row">
          <div class="ai-test-panel__message ai-test-panel__message--agent">
            <div class="ai-test-panel__message-role">Agente IA</div>

            <div class="ai-test-panel__typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <q-form class="ai-test-panel__form" @submit.prevent="enviar">
        <q-input
          v-model="mensaje"
          outlined
          dense
          autogrow
          maxlength="500"
          counter
          placeholder="Escribe un mensaje..."
          :disable="procesandoMensaje"
        >
          <template #prepend>
            <q-icon name="chat" />
          </template>
        </q-input>

        <q-btn
          unelevated
          round
          color="primary"
          icon="send"
          type="submit"
          :disable="!mensaje.trim() || procesandoMensaje"
          :loading="procesandoMensaje"
        >
          <q-tooltip> Enviar mensaje </q-tooltip>
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import type { MensajePruebaIA } from '../types/ai.types';

interface Props {
  mensajes: MensajePruebaIA[];
  procesandoMensaje?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  procesandoMensaje: false,
});

const emit = defineEmits<{
  enviar: [contenido: string];
  reiniciar: [];
}>();

const mensaje = ref('');
const contenedorMensajes = ref<HTMLElement | null>(null);

const mensajes = computed(() => props.mensajes);

const enviar = (): void => {
  const contenido = mensaje.value.trim();

  if (!contenido) {
    return;
  }

  emit('enviar', contenido);

  mensaje.value = '';
};

const reiniciar = (): void => {
  emit('reiniciar');
};

const formatearHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
};

const desplazarAlFinal = async (): Promise<void> => {
  await nextTick();

  const elemento = contenedorMensajes.value;

  if (!elemento) {
    return;
  }

  elemento.scrollTop = elemento.scrollHeight;
};

watch(
  () => props.mensajes.length,
  () => {
    void desplazarAlFinal();
  },
);

watch(
  () => props.procesandoMensaje,
  () => {
    void desplazarAlFinal();
  },
);
</script>

<style scoped>
.ai-test-panel {
  display: flex;
  flex-direction: column;
  min-height: 620px;
  border-radius: 16px;
  background: #ffffff;
}

.ai-test-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ai-test-panel__title {
  color: var(--q-dark);
  font-size: 17px;
  font-weight: 700;
}

.ai-test-panel__subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.ai-test-panel__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
}

.ai-test-panel__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 420px;
  max-height: 520px;
  padding: 8px 4px;
  overflow-y: auto;
}

.ai-test-panel__message-row {
  display: flex;
  justify-content: flex-start;
}

.ai-test-panel__message-row--user {
  justify-content: flex-end;
}

.ai-test-panel__message {
  width: fit-content;
  max-width: 78%;
  padding: 11px 13px;
  border: 1px solid #e8ebf0;
  border-radius: 13px;
  background: #fafbfc;
}

.ai-test-panel__message--user {
  border-color: rgba(25, 118, 210, 0.12);
  background: rgba(25, 118, 210, 0.07);
}

.ai-test-panel__message-role {
  margin-bottom: 4px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
}

.ai-test-panel__message-content {
  color: #374151;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ai-test-panel__message-time {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 10px;
  text-align: right;
}

.ai-test-panel__typing {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 18px;
}

.ai-test-panel__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: ai-typing 1.2s infinite ease-in-out;
}

.ai-test-panel__typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-test-panel__typing span:nth-child(3) {
  animation-delay: 0.3s;
}

.ai-test-panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 360px;
  color: #9ca3af;
  text-align: left;
}

.ai-test-panel__empty-title {
  color: #374151;
  font-size: 14px;
  font-weight: 700;
}

.ai-test-panel__empty-text {
  margin-top: 3px;
  font-size: 12px;
}

.ai-test-panel__form {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding-top: 4px;
}

.ai-test-panel__form .q-input {
  flex: 1;
}

@keyframes ai-typing {
  0%,
  60%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@media (max-width: 600px) {
  .ai-test-panel {
    min-height: 540px;
  }

  .ai-test-panel__header {
    align-items: flex-start;
  }

  .ai-test-panel__messages {
    min-height: 340px;
    max-height: 420px;
  }

  .ai-test-panel__message {
    max-width: 90%;
  }
}
</style>
