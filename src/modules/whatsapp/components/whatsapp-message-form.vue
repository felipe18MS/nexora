<template>
  <div class="message-form">
    <div class="form-header">
      <div>
        <div class="form-title">Enviar mensaje</div>

        <div class="form-subtitle">Simula el envío de un mensaje de WhatsApp</div>
      </div>

      <q-icon name="send" size="18px" class="form-icon" />
    </div>

    <div class="form-fields">
      <q-input
        v-model="formulario.clienteNombre"
        outlined
        dense
        label="Cliente"
        :disable="enviando"
      />

      <q-input
        v-model="formulario.telefono"
        outlined
        dense
        label="Número de WhatsApp"
        :disable="enviando"
      />

      <q-input
        v-model="formulario.contenido"
        outlined
        type="textarea"
        autogrow
        label="Mensaje"
        placeholder="Escribe el mensaje..."
        :maxlength="1000"
        :disable="enviando"
      />
    </div>

    <div class="form-footer">
      <span class="character-count"> {{ formulario.contenido.length }}/1000 </span>

      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="send"
        label="Enviar mensaje"
        :loading="enviando"
        :disable="!formularioValido"
        @click="enviar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

import type { CrearMensajeWhatsApp } from '../types/whatsapp.types';

const emit = defineEmits<{
  enviar: [datos: CrearMensajeWhatsApp];
}>();

const formulario = reactive<CrearMensajeWhatsApp>({
  clienteId: `cli-${Date.now()}`,
  clienteNombre: '',
  telefono: '',
  contenido: '',
});

const enviando = false;

const formularioValido = computed(() => {
  return (
    formulario.clienteNombre.trim().length > 0 &&
    formulario.telefono.trim().length > 0 &&
    formulario.contenido.trim().length > 0
  );
});

const enviar = (): void => {
  if (!formularioValido.value) {
    return;
  }

  emit('enviar', {
    clienteId: formulario.clienteId,
    clienteNombre: formulario.clienteNombre.trim(),
    telefono: formulario.telefono.trim(),
    contenido: formulario.contenido.trim(),
  });

  formulario.contenido = '';
};
</script>

<style scoped>
.message-form {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 18px;
}

.form-title {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.form-subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.form-icon {
  color: #64748b;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 14px;
}

.character-count {
  color: #94a3b8;
  font-size: 10px;
}

@media (max-width: 600px) {
  .message-form {
    padding: 16px;
  }

  .form-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-footer .q-btn {
    width: 100%;
  }
}
</style>
