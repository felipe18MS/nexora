<template>
  <q-page class="conversations-page">
    <div class="page-container">
      <!-- Encabezado -->
      <div class="page-header">
        <div>
          <div class="page-title-row">
            <q-icon name="forum" size="24px" class="page-title-icon" />

            <h1 class="page-title">Conversaciones</h1>
          </div>

          <p class="page-subtitle">
            Gestiona las conversaciones con tus clientes desde un solo lugar.
          </p>
        </div>

        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nueva conversación"
          no-caps
          @click="abrirNuevaConversacion"
        />
      </div>

      <!-- Resumen -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon">
            <q-icon name="forum" size="20px" />
          </div>

          <div>
            <div class="summary-label">Total</div>

            <div class="summary-value">
              {{ totalConversaciones }}
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon">
            <q-icon name="chat" size="20px" />
          </div>

          <div>
            <div class="summary-label">Abiertas</div>

            <div class="summary-value">
              {{ abiertas }}
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon">
            <q-icon name="schedule" size="20px" />
          </div>

          <div>
            <div class="summary-label">Pendientes</div>

            <div class="summary-value">
              {{ pendientes }}
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon">
            <q-icon name="mark_chat_unread" size="20px" />
          </div>

          <div>
            <div class="summary-label">No leídas</div>

            <div class="summary-value">
              {{ noLeidas }}
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <ConversationFilters @filtrar="actualizarFiltros" />
      </div>

      <!-- Bandeja -->
      <div class="inbox-card">
        <div class="inbox-list">
          <ConversationList
            :conversaciones="conversacionesFiltradas"
            :conversacion-seleccionada-id="conversacionSeleccionada?.id ?? null"
            @seleccionar="seleccionarConversacion"
          />
        </div>

        <div class="inbox-conversation">
          <ConversationView
            :conversacion="conversacionSeleccionada"
            :mensajes="mensajes"
            @enviar="enviarMensajeDesdeVista"
            @marcar-leida="marcarConversacionLeida"
          />
        </div>

        <ConversationDetails
          v-if="mostrarDetalles"
          :conversacion="conversacionSeleccionada"
          @cerrar="mostrarDetalles = false"
        />

        <button
          v-if="conversacionSeleccionada"
          type="button"
          class="details-toggle"
          @click="mostrarDetalles = !mostrarDetalles"
        >
          <q-icon :name="mostrarDetalles ? 'close' : 'info'" size="18px" />

          <q-tooltip>
            {{ mostrarDetalles ? 'Ocultar información' : 'Ver información' }}
          </q-tooltip>
        </button>
      </div>
    </div>

    <!-- Nueva conversación -->
    <q-dialog v-model="mostrarFormulario">
      <q-card class="modal-card">
        <div class="modal-header">
          <div class="modal-header-icon">
            <q-icon name="chat" />
          </div>

          <div>
            <div class="modal-title">Nueva conversación</div>

            <div class="modal-subtitle">Inicia una conversación con un cliente.</div>
          </div>

          <q-space />

          <q-btn flat round dense icon="close" color="grey-7" v-close-popup />
        </div>

        <q-card-section class="modal-body">
          <q-input
            v-model="formulario.clienteNombre"
            outlined
            dense
            label="Nombre del cliente"
            class="q-mb-md"
          />

          <q-input
            v-model="formulario.clienteTelefono"
            outlined
            dense
            label="Teléfono"
            class="q-mb-md"
          />

          <q-select
            v-model="formulario.canal"
            :options="opcionesCanal"
            outlined
            dense
            emit-value
            map-options
            label="Canal"
            class="q-mb-md"
          />

          <q-input v-model="formulario.asunto" outlined dense label="Asunto" class="q-mb-md" />

          <q-input
            v-model="formulario.mensajeInicial"
            outlined
            type="textarea"
            autogrow
            label="Mensaje inicial"
          />
        </q-card-section>

        <div class="modal-footer">
          <q-btn flat label="Cancelar" no-caps color="grey-7" v-close-popup />

          <q-btn
            unelevated
            label="Crear conversación"
            no-caps
            color="primary"
            :disable="!formularioValido"
            @click="crearNuevaConversacion"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';

import {
  ConversationDetails,
  ConversationFilters,
  ConversationList,
  ConversationView,
  useConversations,
} from '../../modules/conversations';

import type {
  CanalConversacion,
  Conversacion,
  CrearConversacion,
  FiltrosConversacion,
} from '../../modules/conversations';

const {
  conversaciones,
  mensajes,
  totalConversaciones,
  abiertas,
  pendientes,
  noLeidas,
  cargarConversaciones,
  cargarMensajes,
  crearConversacion,
  enviarMensaje,
  marcarLeida,
} = useConversations();

const filtros = ref<FiltrosConversacion>({
  busqueda: '',
  estado: null,
  canal: null,
});

const conversacionSeleccionada = ref<Conversacion | null>(null);

const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);

const formulario = reactive<CrearConversacion>({
  clienteId: '',
  clienteNombre: '',
  clienteTelefono: '',
  canal: 'whatsapp',
  asunto: '',
  mensajeInicial: '',
});

const opcionesCanal: Array<{
  label: string;
  value: CanalConversacion;
}> = [
  {
    label: 'WhatsApp',
    value: 'whatsapp',
  },
  {
    label: 'Llamada',
    value: 'llamada',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Interno',
    value: 'interno',
  },
];

const conversacionesFiltradas = computed(() => {
  const busqueda = filtros.value.busqueda.trim().toLowerCase();

  return conversaciones.value.filter((conversacion) => {
    const coincideBusqueda =
      !busqueda ||
      conversacion.clienteNombre.toLowerCase().includes(busqueda) ||
      conversacion.asunto.toLowerCase().includes(busqueda) ||
      conversacion.ultimoMensaje.toLowerCase().includes(busqueda);

    const coincideEstado = !filtros.value.estado || conversacion.estado === filtros.value.estado;

    const coincideCanal = !filtros.value.canal || conversacion.canal === filtros.value.canal;

    return coincideBusqueda && coincideEstado && coincideCanal;
  });
});

const formularioValido = computed(() => {
  return (
    formulario.clienteNombre.trim().length > 0 &&
    formulario.clienteTelefono.trim().length > 0 &&
    formulario.asunto.trim().length > 0
  );
});

const actualizarFiltros = (nuevosFiltros: FiltrosConversacion): void => {
  filtros.value = nuevosFiltros;
};

const seleccionarConversacion = (conversacion: Conversacion): void => {
  conversacionSeleccionada.value = conversacion;

  cargarMensajes(conversacion.id);

  if (conversacion.mensajesNoLeidos > 0) {
    marcarLeida(conversacion.id);
  }
};

const enviarMensajeDesdeVista = (contenido: string): void => {
  if (!conversacionSeleccionada.value) {
    return;
  }

  const enviado = enviarMensaje({
    conversacionId: conversacionSeleccionada.value.id,
    contenido,
  });

  if (!enviado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible enviar el mensaje.',
    });

    return;
  }

  const conversacionActualizada = conversaciones.value.find(
    (item) => item.id === conversacionSeleccionada.value?.id,
  );

  if (conversacionActualizada) {
    conversacionSeleccionada.value = conversacionActualizada;
  }
};

const marcarConversacionLeida = (): void => {
  if (!conversacionSeleccionada.value) {
    return;
  }

  marcarLeida(conversacionSeleccionada.value.id);

  const conversacionActualizada = conversaciones.value.find(
    (item) => item.id === conversacionSeleccionada.value?.id,
  );

  if (conversacionActualizada) {
    conversacionSeleccionada.value = conversacionActualizada;
  }
};

const abrirNuevaConversacion = (): void => {
  formulario.clienteNombre = '';
  formulario.clienteTelefono = '';
  formulario.canal = 'whatsapp';
  formulario.asunto = '';
  formulario.mensajeInicial = '';

  mostrarFormulario.value = true;
};

const crearNuevaConversacion = (): void => {
  if (!formularioValido.value) {
    return;
  }

  const mensajeInicial = formulario.mensajeInicial?.trim() ?? '';

  const datosConversacion = {
    clienteId: `cli-${Date.now()}`,
    clienteNombre: formulario.clienteNombre.trim(),
    clienteTelefono: formulario.clienteTelefono.trim(),
    canal: formulario.canal,
    asunto: formulario.asunto.trim(),
    ...(mensajeInicial ? { mensajeInicial } : {}),
  };

  const conversacion = crearConversacion(datosConversacion);
  mostrarFormulario.value = false;

  seleccionarConversacion(conversacion);

  Notify.create({
    type: 'positive',
    message: 'Conversación creada correctamente.',
  });
};

onMounted(() => {
  cargarConversaciones();
});
</script>

<style scoped>
.conversations-page {
  background: #f8fafc;
}

.page-container {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title-icon {
  color: #475569;
}

.page-title {
  margin: 0;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
}

.page-subtitle {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.summary-card {
  min-height: 78px;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
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
  color: #475569;
}

.summary-label {
  color: #94a3b8;
  font-size: 11px;
}

.summary-value {
  margin-top: 2px;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
}

.filters-card {
  padding: 14px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
}

.inbox-card {
  position: relative;
  display: flex;
  height: calc(100vh - 340px);
  min-height: 560px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgb(15 23 42 / 4%);
}

.inbox-list {
  width: 320px;
  min-width: 320px;
}

.inbox-conversation {
  flex: 1;
  min-width: 0;
}

.details-toggle {
  position: absolute;
  right: 14px;
  top: 76px;
  width: 34px;
  height: 34px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  z-index: 3;
}

.details-toggle:hover {
  background: #f8fafc;
}

.modal-card {
  width: min(560px, 95vw);
  max-width: 560px;
  border-radius: 12px;
}

.modal-header {
  min-height: 70px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f1f5f9;
  color: #475569;
}

.modal-title {
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
}

.modal-subtitle {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .inbox-list {
    width: 280px;
    min-width: 280px;
  }
}

@media (max-width: 800px) {
  .page-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .inbox-card {
    height: calc(100vh - 430px);
    min-height: 500px;
  }

  .inbox-list {
    width: 100%;
    min-width: 0;
  }

  .inbox-conversation {
    display: none;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 20px;
  }
}
</style>
