<template>
  <div class="settings-card">
    <div class="settings-header">
      <div>
        <div class="settings-title">Configuración de WhatsApp</div>

        <div class="settings-subtitle">Configura el comportamiento de la integración.</div>
      </div>

      <div class="settings-icon">
        <q-icon name="settings" size="20px" />
      </div>
    </div>

    <div v-if="formulario" class="settings-content">
      <div class="settings-section">
        <div class="section-title">Cuenta</div>

        <div class="section-grid">
          <q-input v-model="formulario.nombreCuenta" outlined dense label="Nombre de la cuenta" />

          <q-input v-model="formulario.numero" outlined dense label="Número de WhatsApp" />
        </div>
      </div>

      <q-separator />

      <div class="settings-section">
        <div class="section-title">Automatización</div>

        <div class="option-list">
          <div class="option-item">
            <div class="option-info">
              <div class="option-title">Webhook activo</div>

              <div class="option-description">Permite recibir eventos y mensajes de WhatsApp.</div>
            </div>

            <q-toggle v-model="formulario.webhookActivo" color="primary" />
          </div>

          <div class="option-item">
            <div class="option-info">
              <div class="option-title">Respuestas automáticas</div>

              <div class="option-description">Permite que NEXORA responda automáticamente.</div>
            </div>

            <q-toggle v-model="formulario.respuestasAutomaticas" color="primary" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <q-btn flat no-caps label="Restablecer" color="grey-7" @click="restablecer" />

      <q-btn
        unelevated
        no-caps
        label="Guardar cambios"
        color="primary"
        icon="save"
        :disable="!formularioValido"
        @click="guardar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { ConfiguracionWhatsApp } from '../types/whatsapp.types';

const props = defineProps<{
  configuracion: ConfiguracionWhatsApp | null;
}>();

const emit = defineEmits<{
  guardar: [configuracion: ConfiguracionWhatsApp];
}>();

const formulario = reactive<ConfiguracionWhatsApp>({
  nombreCuenta: '',
  numero: '',
  webhookActivo: false,
  respuestasAutomaticas: false,
});

const cargarFormulario = (configuracion: ConfiguracionWhatsApp | null): void => {
  if (!configuracion) {
    return;
  }

  formulario.nombreCuenta = configuracion.nombreCuenta;
  formulario.numero = configuracion.numero;
  formulario.webhookActivo = configuracion.webhookActivo;
  formulario.respuestasAutomaticas = configuracion.respuestasAutomaticas;
};

watch(
  () => props.configuracion,
  (configuracion) => {
    cargarFormulario(configuracion);
  },
  { immediate: true },
);

const formularioValido = computed(() => {
  return formulario.nombreCuenta.trim().length > 0 && formulario.numero.trim().length > 0;
});

const guardar = (): void => {
  if (!formularioValido.value) {
    return;
  }

  emit('guardar', {
    nombreCuenta: formulario.nombreCuenta.trim(),
    numero: formulario.numero.trim(),
    webhookActivo: formulario.webhookActivo,
    respuestasAutomaticas: formulario.respuestasAutomaticas,
  });
};

const restablecer = (): void => {
  cargarFormulario(props.configuracion);
};
</script>

<style scoped>
.settings-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.settings-title {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.settings-subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.settings-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f1f5f9;
  color: #64748b;
}

.settings-section {
  padding: 4px 0 20px;
}

.section-title {
  margin-bottom: 14px;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 0;
}

.option-info {
  min-width: 0;
}

.option-title {
  color: #475569;
  font-size: 12px;
  font-weight: 500;
}

.option-description {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.4;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 18px;
}

@media (max-width: 600px) {
  .settings-card {
    padding: 16px;
  }

  .section-grid {
    grid-template-columns: 1fr;
  }

  .settings-footer {
    flex-direction: column-reverse;
  }

  .settings-footer .q-btn {
    width: 100%;
  }
}
</style>
