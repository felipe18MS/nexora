<template>
  <q-page class="whatsapp-page">
    <WhatsAppHeader :conexion="conexion" />

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-icon">
          <q-icon name="chat" size="19px" />
        </div>

        <div>
          <div class="summary-label">Total mensajes</div>

          <div class="summary-value">
            {{ totalMensajes }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">
          <q-icon name="send" size="19px" />
        </div>

        <div>
          <div class="summary-label">Enviados</div>

          <div class="summary-value">
            {{ mensajesEnviados }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">
          <q-icon name="mark_chat_unread" size="19px" />
        </div>

        <div>
          <div class="summary-label">Recibidos</div>

          <div class="summary-value">
            {{ mensajesRecibidos }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">
          <q-icon name="wifi" size="19px" />
        </div>

        <div>
          <div class="summary-label">Estado</div>

          <div class="summary-value summary-status">
            {{ conexion ? obtenerNombreEstado(conexion.estado) : '—' }}
          </div>
        </div>
      </div>
    </div>

    <div class="main-grid">
      <div class="main-column">
        <WhatsAppStatusCard :conexion="conexion" />

        <WhatsAppMessageList :mensajes="mensajes" />

        <WhatsAppMessageForm @enviar="manejarEnvioMensaje" />
      </div>

      <div class="side-column">
        <WhatsAppSettings :configuracion="configuracion" @guardar="guardarConfiguracion" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Notify } from 'quasar';

import {
  WhatsAppHeader,
  WhatsAppMessageForm,
  WhatsAppMessageList,
  WhatsAppSettings,
  WhatsAppStatusCard,
  useWhatsApp,
} from '../../modules/whatsapp';

import type {
  ConfiguracionWhatsApp,
  CrearMensajeWhatsApp,
  EstadoConexionWhatsApp,
} from '../../modules/whatsapp';

const {
  conexion,
  mensajes,
  configuracion,
  totalMensajes,
  mensajesEnviados,
  mensajesRecibidos,
  cargarWhatsApp,
  enviarMensaje,
  actualizarConfiguracion,
} = useWhatsApp();

onMounted(() => {
  cargarWhatsApp();
});

const obtenerNombreEstado = (estado: EstadoConexionWhatsApp): string => {
  const nombres: Record<EstadoConexionWhatsApp, string> = {
    conectado: 'Conectado',
    desconectado: 'Desconectado',
    pendiente: 'Pendiente',
  };

  return nombres[estado];
};

const manejarEnvioMensaje = (datos: CrearMensajeWhatsApp): void => {
  const enviado = enviarMensaje(datos);

  if (!enviado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible enviar el mensaje.',
    });

    return;
  }

  Notify.create({
    type: 'positive',
    message: 'Mensaje enviado correctamente.',
  });
};

const guardarConfiguracion = (datos: ConfiguracionWhatsApp): void => {
  actualizarConfiguracion(datos);

  Notify.create({
    type: 'positive',
    message: 'Configuración actualizada correctamente.',
  });
};
</script>

<style scoped>
.whatsapp-page {
  padding: 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.summary-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f1f5f9;
  color: #64748b;
}

.summary-label {
  color: #94a3b8;
  font-size: 10px;
}

.summary-value {
  margin-top: 3px;
  color: #334155;
  font-size: 17px;
  font-weight: 700;
}

.summary-status {
  font-size: 13px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.8fr);
  gap: 18px;
  align-items: start;
}

.main-column,
.side-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 18px;
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .whatsapp-page {
    padding: 16px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
