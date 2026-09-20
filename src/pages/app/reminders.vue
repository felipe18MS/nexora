<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Recordatorios</div>

        <div class="text-grey-7">Programa y gestiona recordatorios para tus clientes.</div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add_alert"
        label="Nuevo recordatorio"
        @click="abrirNuevo"
      />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Total</div>

            <div class="text-h5 text-weight-bold">
              {{ totalRecordatorios }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Pendientes</div>

            <div class="text-h5 text-weight-bold text-orange">
              {{ pendientes }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Enviados</div>

            <div class="text-h5 text-weight-bold text-positive">
              {{ enviados }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Cancelados</div>

            <div class="text-h5 text-weight-bold text-negative">
              {{ cancelados }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <ReminderFilters
          :model-value="filtros"
          @update:model-value="actualizarFiltros"
          @limpiar="limpiarFiltros"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <ReminderTable
          :recordatorios="recordatoriosFiltrados"
          :cargando="cargando"
          @ver="verDetalles"
          @editar="editarRecordatorio"
          @enviar="marcarEnviado"
          @cancelar="cancelarRecordatorioDesdeTabla"
        />
      </q-card-section>
    </q-card>

    <!-- Detalles -->
    <!-- Detalles -->
    <q-dialog v-model="mostrarDetalles">
      <q-card class="modal-card modal-card--details">
        <q-card-section class="modal-header">
          <div class="row items-center no-wrap">
            <div class="modal-icon modal-icon--primary">
              <q-icon name="notifications_active" size="22px" />
            </div>

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Detalle del recordatorio</div>

              <div class="text-caption text-grey-6">Información y estado del recordatorio</div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="mostrarDetalles = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <ReminderDetails
            v-if="recordatorioSeleccionado"
            :recordatorio="recordatorioSeleccionado"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat color="grey-7" label="Cerrar" @click="mostrarDetalles = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Crear / editar -->
    <!-- Crear / editar -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card class="modal-card modal-card--form">
        <q-card-section class="modal-header">
          <div class="row items-center no-wrap">
            <div class="modal-icon modal-icon--primary">
              <q-icon
                :name="recordatorioSeleccionado ? 'edit_notifications' : 'add_alert'"
                size="22px"
              />
            </div>

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">
                {{ recordatorioSeleccionado ? 'Editar recordatorio' : 'Nuevo recordatorio' }}
              </div>

              <div class="text-caption text-grey-6">
                {{
                  recordatorioSeleccionado
                    ? 'Actualiza la información del recordatorio'
                    : 'Programa un nuevo recordatorio para un cliente'
                }}
              </div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrarFormulario" />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <!-- CREAR -->
          <ReminderForm
            v-if="!recordatorioSeleccionado"
            :clientes="opcionesClientes"
            @guardar="guardarRecordatorio"
            @cancelar="cerrarFormulario"
          />

          <!-- EDITAR -->
          <div v-else>
            <!-- Información principal -->
            <div class="form-section">
              <div class="form-section__header">
                <q-icon name="description" />
                <span>Información del recordatorio</span>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="formularioEdicion.titulo"
                    outlined
                    label="Título"
                    placeholder="Ej. Recordatorio de cita"
                    hide-bottom-space
                  >
                    <template #prepend>
                      <q-icon name="title" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <q-input
                    v-model="formularioEdicion.mensaje"
                    outlined
                    autogrow
                    type="textarea"
                    label="Mensaje"
                    placeholder="Escribe el mensaje que recibirá el cliente..."
                    hide-bottom-space
                  >
                    <template #prepend>
                      <q-icon name="message" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Configuración -->
            <div class="form-section q-mt-lg">
              <div class="form-section__header">
                <q-icon name="tune" />
                <span>Configuración</span>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="formularioEdicion.tipo"
                    outlined
                    emit-value
                    map-options
                    label="Tipo"
                    :options="opcionesTipo"
                    hide-bottom-space
                  >
                    <template #prepend>
                      <q-icon name="category" />
                    </template>
                  </q-select>
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    v-model="formularioEdicion.canal"
                    outlined
                    emit-value
                    map-options
                    label="Canal"
                    :options="opcionesCanal"
                    hide-bottom-space
                  >
                    <template #prepend>
                      <q-icon name="send" />
                    </template>
                  </q-select>
                </div>

                <div class="col-12">
                  <q-input
                    v-model="formularioEdicion.fechaProgramada"
                    outlined
                    type="datetime-local"
                    label="Fecha y hora programada"
                    hide-bottom-space
                  >
                    <template #prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions v-if="recordatorioSeleccionado" align="right" class="modal-footer">
          <q-btn flat color="grey-7" label="Cancelar" @click="cerrarFormulario" />

          <q-btn
            unelevated
            color="primary"
            icon="save"
            label="Guardar cambios"
            @click="guardarEdicion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';

import {
  ReminderDetails,
  ReminderFilters,
  ReminderForm,
  ReminderTable,
  useReminders,
} from '../../modules/reminders';

import type {
  CanalRecordatorio,
  CrearRecordatorio,
  FiltrosRecordatorio,
  Recordatorio,
  TipoRecordatorio,
} from '../../modules/reminders';

const {
  recordatorios,
  cargando,
  totalRecordatorios,
  pendientes,
  enviados,
  cancelados,
  cargarRecordatorios,
  crearRecordatorio,
  actualizarRecordatorio,
  actualizarEstado,
  cancelarRecordatorio,
} = useReminders();

const filtros = ref<FiltrosRecordatorio>({
  busqueda: '',
  estado: null,
  tipo: null,
  canal: null,
});

const recordatorioSeleccionado = ref<Recordatorio | null>(null);

const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);

const opcionesClientes = [
  {
    label: 'María González',
    value: 'cli-001',
  },
  {
    label: 'Carlos Rodríguez',
    value: 'cli-002',
  },
  {
    label: 'Laura Martínez',
    value: 'cli-003',
  },
  {
    label: 'Andrés Pérez',
    value: 'cli-004',
  },
  {
    label: 'Sofía Ramírez',
    value: 'cli-005',
  },
];

const opcionesTipo: Array<{
  label: string;
  value: TipoRecordatorio;
}> = [
  { label: 'Cita', value: 'cita' },
  { label: 'Pago', value: 'pago' },
  { label: 'Seguimiento', value: 'seguimiento' },
  { label: 'Cumpleaños', value: 'cumpleanos' },
  { label: 'General', value: 'general' },
];

const opcionesCanal: Array<{
  label: string;
  value: CanalRecordatorio;
}> = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Llamada', value: 'llamada' },
  { label: 'Email', value: 'email' },
  { label: 'Interno', value: 'interno' },
];

const formularioEdicion = reactive<{
  titulo: string;
  mensaje: string;
  tipo: TipoRecordatorio;
  canal: CanalRecordatorio;
  fechaProgramada: string;
}>({
  titulo: '',
  mensaje: '',
  tipo: 'cita',
  canal: 'whatsapp',
  fechaProgramada: '',
});

const recordatoriosFiltrados = computed(() => {
  const busqueda = filtros.value.busqueda.trim().toLowerCase();

  return recordatorios.value.filter((recordatorio) => {
    const coincideBusqueda =
      !busqueda ||
      recordatorio.id.toLowerCase().includes(busqueda) ||
      recordatorio.clienteNombre.toLowerCase().includes(busqueda) ||
      recordatorio.titulo.toLowerCase().includes(busqueda);

    const coincideEstado = !filtros.value.estado || recordatorio.estado === filtros.value.estado;

    const coincideTipo = !filtros.value.tipo || recordatorio.tipo === filtros.value.tipo;

    const coincideCanal = !filtros.value.canal || recordatorio.canal === filtros.value.canal;

    return coincideBusqueda && coincideEstado && coincideTipo && coincideCanal;
  });
});

const actualizarFiltros = (nuevosFiltros: FiltrosRecordatorio): void => {
  filtros.value = nuevosFiltros;
};

const limpiarFiltros = (): void => {
  filtros.value = {
    busqueda: '',
    estado: null,
    tipo: null,
    canal: null,
  };
};

const abrirNuevo = (): void => {
  recordatorioSeleccionado.value = null;
  mostrarFormulario.value = true;
};

const cerrarFormulario = (): void => {
  mostrarFormulario.value = false;
  recordatorioSeleccionado.value = null;
};

const guardarRecordatorio = (datos: CrearRecordatorio): void => {
  crearRecordatorio(datos);

  cerrarFormulario();

  Notify.create({
    type: 'positive',
    message: 'Recordatorio creado correctamente.',
  });
};

const verDetalles = (recordatorio: Recordatorio): void => {
  recordatorioSeleccionado.value = recordatorio;
  mostrarDetalles.value = true;
};

const editarRecordatorio = (recordatorio: Recordatorio): void => {
  recordatorioSeleccionado.value = recordatorio;

  formularioEdicion.titulo = recordatorio.titulo;
  formularioEdicion.mensaje = recordatorio.mensaje;
  formularioEdicion.tipo = recordatorio.tipo;
  formularioEdicion.canal = recordatorio.canal;
  formularioEdicion.fechaProgramada = recordatorio.fechaProgramada.slice(0, 16);

  mostrarFormulario.value = true;
};

const guardarEdicion = (): void => {
  if (!recordatorioSeleccionado.value) {
    return;
  }

  if (!formularioEdicion.titulo.trim() || !formularioEdicion.mensaje.trim()) {
    return;
  }

  const actualizado = actualizarRecordatorio({
    id: recordatorioSeleccionado.value.id,
    titulo: formularioEdicion.titulo.trim(),
    mensaje: formularioEdicion.mensaje.trim(),
    tipo: formularioEdicion.tipo,
    canal: formularioEdicion.canal,
    fechaProgramada: formularioEdicion.fechaProgramada,
  });

  if (!actualizado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible actualizar el recordatorio.',
    });

    return;
  }

  cerrarFormulario();

  Notify.create({
    type: 'positive',
    message: 'Recordatorio actualizado correctamente.',
  });
};

const marcarEnviado = (recordatorio: Recordatorio): void => {
  const actualizado = actualizarEstado(recordatorio.id, 'enviado');

  if (!actualizado) {
    return;
  }

  Notify.create({
    type: 'positive',
    message: 'Recordatorio marcado como enviado.',
  });
};

const cancelarRecordatorioDesdeTabla = (recordatorio: Recordatorio): void => {
  const cancelado = cancelarRecordatorio(recordatorio.id);

  if (!cancelado) {
    return;
  }

  Notify.create({
    type: 'positive',
    message: 'Recordatorio cancelado.',
  });
};

onMounted(() => {
  cargarRecordatorios();
});
</script>
<style scoped>
.modal-card {
  width: 100%;
  max-width: 95vw;
  border-radius: 16px;
  overflow: hidden;
}

.modal-card--details {
  max-width: 680px;
}

.modal-card--form {
  max-width: 780px;
}

.modal-header {
  min-height: 76px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 14px 22px;
  background: #fafafa;
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon--primary {
  color: var(--q-primary);
  background: rgba(25, 118, 210, 0.1);
}

.form-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  background: #ffffff;
}

.form-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-section__header .q-icon {
  color: var(--q-primary);
}

@media (max-width: 600px) {
  .modal-card {
    border-radius: 14px;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 16px;
    max-height: 75vh;
  }

  .modal-footer {
    padding: 12px 16px;
  }

  .form-section {
    padding: 14px;
  }
}
</style>
