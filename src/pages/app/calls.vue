<template>
  <q-page class="calls-page q-pa-md q-pa-lg-lg">
    <div class="page-container">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold">Llamadas</div>

          <div class="text-body2 text-grey-6 q-mt-xs">
            Gestiona y consulta las llamadas de tus clientes.
          </div>
        </div>

        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Registrar llamada"
          @click="abrirFormularioNuevo"
        />
      </div>

      <!-- Resumen -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <div class="summary-card">
            <div class="summary-card__icon">
              <q-icon name="phone" size="22px" />
            </div>

            <div class="summary-card__content">
              <div class="summary-card__label">Total llamadas</div>

              <div class="summary-card__value">
                {{ totalLlamadas }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="summary-card">
            <div class="summary-card__icon">
              <q-icon name="call_received" size="22px" />
            </div>

            <div class="summary-card__content">
              <div class="summary-card__label">Entrantes</div>

              <div class="summary-card__value">
                {{ entrantes }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="summary-card">
            <div class="summary-card__icon">
              <q-icon name="call_made" size="22px" />
            </div>

            <div class="summary-card__content">
              <div class="summary-card__label">Salientes</div>

              <div class="summary-card__value">
                {{ salientes }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="summary-card">
            <div class="summary-card__icon">
              <q-icon name="phone_missed" size="22px" />
            </div>

            <div class="summary-card__content">
              <div class="summary-card__label">Perdidas</div>

              <div class="summary-card__value">
                {{ perdidas }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div class="content-card">
        <div class="content-card__header">
          <div>
            <div class="text-subtitle1 text-weight-bold">Historial de llamadas</div>

            <div class="text-caption text-grey-6">Consulta, filtra y administra las llamadas.</div>
          </div>
        </div>

        <q-separator />

        <div class="q-pa-md">
          <CallFilters />
        </div>

        <q-separator />

        <CallTable
          :llamadas="llamadasFiltradas"
          :cargando="cargando"
          @details="abrirDetalles"
          @edit="abrirFormularioEdicion"
          @delete="confirmarEliminacion"
        />
      </div>
    </div>

    <!-- Detalles -->
    <CallDetails
      v-model="mostrarDetalles"
      :llamada="llamadaSeleccionada"
      @edit="abrirFormularioEdicionDesdeDetalles"
    />

    <!-- Formulario -->
    <CallForm
      v-model="mostrarFormulario"
      :llamada="llamadaEditando"
      @save="guardarLlamada"
      @update="actualizarLlamada"
    />

    <!-- Confirmación -->
    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      titulo="Eliminar llamada"
      mensaje="¿Estás seguro de que deseas eliminar esta llamada? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      confirm-color="negative"
      @confirm="eliminarLlamada"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import { CallDetails, CallFilters, CallForm, CallTable, useCalls } from '../../modules/calls';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import type { CrearLlamada, Llamada } from '../../modules/calls';

const {
  llamadasFiltradas,
  cargando,
  totalLlamadas,
  entrantes,
  salientes,
  perdidas,
  cargarLlamadas,
  agregarLlamada,
  actualizar,
  eliminar,
} = useCalls();

const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const mostrarConfirmacion = ref(false);

const llamadaSeleccionada = ref<Llamada | null>(null);

const llamadaEditando = ref<Llamada | null>(null);

const llamadaAEliminar = ref<Llamada | null>(null);

const abrirDetalles = (llamada: Llamada): void => {
  llamadaSeleccionada.value = llamada;
  mostrarDetalles.value = true;
};

const abrirFormularioNuevo = (): void => {
  llamadaEditando.value = null;
  mostrarFormulario.value = true;
};

const abrirFormularioEdicion = (llamada: Llamada): void => {
  llamadaEditando.value = llamada;
  mostrarFormulario.value = true;
};

const abrirFormularioEdicionDesdeDetalles = (llamada: Llamada): void => {
  mostrarDetalles.value = false;
  llamadaEditando.value = llamada;
  mostrarFormulario.value = true;
};

const guardarLlamada = (datos: CrearLlamada): void => {
  agregarLlamada(datos);

  mostrarFormulario.value = false;

  Notify.create({
    type: 'positive',
    message: 'Llamada registrada correctamente.',
  });
};

const actualizarLlamada = (datos: {
  id: string;
  estado: Llamada['estado'];
  resultado?: NonNullable<Llamada['resultado']>;
  notas: string;
}): void => {
  const actualizada = actualizar(datos);

  if (!actualizada) {
    return;
  }

  mostrarFormulario.value = false;

  Notify.create({
    type: 'positive',
    message: 'Llamada actualizada correctamente.',
  });
};

const confirmarEliminacion = (llamada: Llamada): void => {
  llamadaAEliminar.value = llamada;
  mostrarConfirmacion.value = true;
};

const eliminarLlamada = (): void => {
  if (!llamadaAEliminar.value) {
    return;
  }

  const eliminado = eliminar(llamadaAEliminar.value.id);

  if (!eliminado) {
    return;
  }

  mostrarConfirmacion.value = false;
  llamadaAEliminar.value = null;

  Notify.create({
    type: 'positive',
    message: 'Llamada eliminada correctamente.',
  });
};

onMounted(() => {
  cargarLlamadas();
});
</script>

<style scoped>
.calls-page {
  background: #f7f8fa;
  min-height: 100%;
}

.page-container {
  max-width: 1600px;
  margin: 0 auto;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.summary-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #f3f4f6;
  color: #4b5563;
}

.summary-card__label {
  color: #6b7280;
  font-size: 13px;
}

.summary-card__value {
  margin-top: 2px;
  color: #111827;
  font-size: 22px;
  font-weight: 700;
}

.content-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.content-card__header {
  padding: 20px 24px;
}

@media (max-width: 600px) {
  .calls-page {
    padding: 12px;
  }

  .content-card__header {
    padding: 16px;
  }

  .summary-card {
    padding: 15px;
  }
}
</style>
