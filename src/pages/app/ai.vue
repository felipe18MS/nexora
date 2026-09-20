<template>
  <q-page class="ai-page q-pa-lg">
    <div class="ai-page__container">
      <AiHeader :agente="agente" />

      <div v-if="cargando" class="ai-page__loading">
        <q-spinner color="primary" size="32px" />

        <span>Cargando agente IA...</span>
      </div>

      <template v-else>
        <div class="ai-page__grid">
          <div class="ai-page__main">
            <AiStatusCard
              :agente="agente"
              :guardando="guardando"
              :conversaciones-atendidas="conversacionesAtendidas"
              :citas-gestionadas="citasGestionadas"
              :capacidades-activas="capacidadesActivas"
              :canales-activos="canalesActivos"
              @cambiar-estado="mostrarConfirmacionEstado = true"
            />

            <AiConfigForm :agente="agente" :guardando="guardando" @guardar="guardarConfiguracion" />

            <AiCapabilities
              :canales="agente?.configuracion.canales ?? []"
              :capacidades="agente?.configuracion.capacidades ?? []"
            />
          </div>

          <div class="ai-page__side">
            <AiTestPanel
              :mensajes="mensajesPrueba"
              :procesando-mensaje="procesandoMensaje"
              @enviar="enviarMensaje"
              @reiniciar="reiniciarPrueba"
            />
          </div>
        </div>
      </template>
    </div>

    <AppConfirmDialog
      v-model="mostrarConfirmacionEstado"
      :titulo="agenteActivo ? 'Desactivar agente IA' : 'Activar agente IA'"
      :mensaje="
        agenteActivo
          ? 'El agente dejará de atender automáticamente hasta que vuelvas a activarlo.'
          : 'El agente comenzará a estar disponible para atender las solicitudes configuradas.'
      "
      :confirm-label="agenteActivo ? 'Desactivar' : 'Activar'"
      :confirm-color="agenteActivo ? 'negative' : 'primary'"
      @confirm="confirmarCambioEstado"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import AiHeader from '../../modules/ai/components/ai-header.vue';
import AiStatusCard from '../../modules/ai/components/ai-status-card.vue';
import AiConfigForm from '../../modules/ai/components/ai-config-form.vue';
import AiCapabilities from '../../modules/ai/components/ai-capabilities.vue';
import AiTestPanel from '../../modules/ai/components/ai-test-panel.vue';

import type { ConfiguracionAgenteIA } from '../../modules/ai/types/ai.types';

import { useAi } from '../../modules/ai/composables/use-ai';

const {
  agente,
  cargando,
  guardando,
  procesandoMensaje,
  agenteActivo,
  conversacionesAtendidas,
  citasGestionadas,
  capacidadesActivas,
  canalesActivos,
  mensajesPrueba,
  cargarAgente,
  actualizar,
  cambiarEstado,
  enviarMensajePrueba,
  reiniciarPrueba: reiniciarSesion,
} = useAi();

const mostrarConfirmacionEstado = ref(false);

const guardarConfiguracion = (configuracion: ConfiguracionAgenteIA): void => {
  actualizar({
    configuracion,
  });

  Notify.create({
    type: 'positive',
    message: 'Configuración del agente actualizada correctamente.',
  });
};

const confirmarCambioEstado = (): void => {
  const estabaActivo = agenteActivo.value;

  cambiarEstado(estabaActivo ? 'inactivo' : 'activo');

  mostrarConfirmacionEstado.value = false;

  Notify.create({
    type: 'positive',
    message: estabaActivo
      ? 'Agente IA desactivado correctamente.'
      : 'Agente IA activado correctamente.',
  });
};

const enviarMensaje = (contenido: string): void => {
  enviarMensajePrueba(contenido);
};

const reiniciarPrueba = (): void => {
  reiniciarSesion();

  Notify.create({
    type: 'info',
    message: 'La conversación de prueba fue reiniciada.',
  });
};

onMounted(() => {
  cargarAgente();
});
</script>

<style scoped>
.ai-page {
  background: #f7f8fa;
}

.ai-page__container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.ai-page__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 400px;
  color: #6b7280;
  font-size: 14px;
}

.ai-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(360px, 1fr);
  align-items: start;
  gap: 20px;
  margin-top: 24px;
}

.ai-page__main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.ai-page__side {
  min-width: 0;
  position: sticky;
  top: 20px;
}

@media (max-width: 1200px) {
  .ai-page__grid {
    grid-template-columns: 1fr;
  }

  .ai-page__side {
    position: static;
  }
}

@media (max-width: 600px) {
  .ai-page {
    padding: 16px !important;
  }

  .ai-page__grid {
    margin-top: 20px;
  }
}
</style>
