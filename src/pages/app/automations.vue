<template>
  <q-page class="automations-page q-pa-md q-pa-lg-xl">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-col-gutter-md q-mb-lg">
      <div class="col">
        <div class="text-h5 text-weight-bold">Automatizaciones</div>

        <div class="text-body2 text-grey-6 q-mt-xs">
          Configura procesos automáticos para reducir tareas repetitivas.
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nueva automatización"
          @click="abrirNuevaAutomatizacion"
        />
      </div>
    </div>

    <!-- Resumen -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <div class="summary-card">
          <div class="summary-card__icon">
            <q-icon name="auto_awesome" size="22px" />
          </div>

          <div class="summary-card__content">
            <div class="summary-card__label">Total</div>

            <div class="summary-card__value">
              {{ totalAutomatizaciones }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <div class="summary-card">
          <div class="summary-card__icon">
            <q-icon name="check_circle" size="22px" />
          </div>

          <div class="summary-card__content">
            <div class="summary-card__label">Activas</div>

            <div class="summary-card__value">
              {{ activas }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <div class="summary-card">
          <div class="summary-card__icon">
            <q-icon name="edit_note" size="22px" />
          </div>

          <div class="summary-card__content">
            <div class="summary-card__label">Borradores</div>

            <div class="summary-card__value">
              {{ borradores }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <div class="summary-card">
          <div class="summary-card__icon">
            <q-icon name="bolt" size="22px" />
          </div>

          <div class="summary-card__content">
            <div class="summary-card__label">Ejecuciones</div>

            <div class="summary-card__value">
              {{ totalEjecuciones }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <q-card flat bordered class="content-card">
      <q-card-section class="content-card__header">
        <div>
          <div class="text-subtitle1 text-weight-bold">Automatizaciones configuradas</div>

          <div class="text-caption text-grey-6 q-mt-xs">
            Administra tus flujos automáticos desde este panel.
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <AutomationFilters />

        <div class="q-mt-md">
          <AutomationTable
            :automatizaciones="automatizacionesFiltradas"
            :cargando="cargando"
            @details="abrirDetalles"
            @edit="abrirEdicion"
            @toggle="abrirCambioEstado"
            @delete="abrirConfirmacionEliminar"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Detalles -->
    <AutomationDetails
      v-model="mostrarDetalles"
      :automatizacion="automatizacionSeleccionada"
      @edit="abrirEdicionDesdeDetalles"
    />

    <!-- Formulario -->
    <AutomationForm
      v-model="mostrarFormulario"
      :automatizacion="automatizacionSeleccionada"
      @save="guardarNuevaAutomatizacion"
      @update="guardarCambiosAutomatizacion"
    />

    <!-- Confirmación -->
    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      titulo="Eliminar automatización"
      mensaje="¿Estás seguro de que deseas eliminar esta automatización? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      confirm-color="negative"
      @confirm="confirmarEliminacion"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import {
  AutomationDetails,
  AutomationFilters,
  AutomationForm,
  AutomationTable,
  useAutomations,
} from '../../modules/automations';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import type {
  ActualizarAutomatizacion,
  Automatizacion,
  CrearAutomatizacion,
  EstadoAutomatizacion,
} from '../../modules/automations';

const {
  automatizacionesFiltradas,
  cargando,
  totalAutomatizaciones,
  activas,
  borradores,
  totalEjecuciones,
  cargarAutomatizaciones,
  agregarAutomatizacion,
  actualizar,
  cambiarEstado,
  eliminar,
} = useAutomations();

const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const mostrarConfirmacion = ref(false);

const automatizacionSeleccionada = ref<Automatizacion | null>(null);

const automatizacionPendienteEliminar = ref<Automatizacion | null>(null);

onMounted(() => {
  cargarAutomatizaciones();
});

const abrirNuevaAutomatizacion = (): void => {
  automatizacionSeleccionada.value = null;
  mostrarFormulario.value = true;
};

const abrirDetalles = (automatizacion: Automatizacion): void => {
  automatizacionSeleccionada.value = automatizacion;
  mostrarDetalles.value = true;
};

const abrirEdicion = (automatizacion: Automatizacion): void => {
  automatizacionSeleccionada.value = automatizacion;
  mostrarFormulario.value = true;
};

const abrirEdicionDesdeDetalles = (automatizacion: Automatizacion): void => {
  mostrarDetalles.value = false;
  automatizacionSeleccionada.value = automatizacion;
  mostrarFormulario.value = true;
};

const guardarNuevaAutomatizacion = (datos: CrearAutomatizacion): void => {
  const automatizacion = agregarAutomatizacion(datos);

  if (!automatizacion) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible crear la automatización.',
    });

    return;
  }

  mostrarFormulario.value = false;

  Notify.create({
    type: 'positive',
    message: 'Automatización creada correctamente.',
  });
};

const guardarCambiosAutomatizacion = (datos: ActualizarAutomatizacion): void => {
  const automatizacion = actualizar(datos);

  if (!automatizacion) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible actualizar la automatización.',
    });

    return;
  }

  mostrarFormulario.value = false;

  Notify.create({
    type: 'positive',
    message: 'Automatización actualizada correctamente.',
  });
};

const abrirCambioEstado = (automatizacion: Automatizacion): void => {
  const nuevoEstado: EstadoAutomatizacion =
    automatizacion.estado === 'activa' ? 'inactiva' : 'activa';

  const actualizada = cambiarEstado(automatizacion.id, nuevoEstado);

  if (!actualizada) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible cambiar el estado.',
    });

    return;
  }

  Notify.create({
    type: 'positive',
    message: nuevoEstado === 'activa' ? 'Automatización activada.' : 'Automatización desactivada.',
  });
};

const abrirConfirmacionEliminar = (automatizacion: Automatizacion): void => {
  automatizacionPendienteEliminar.value = automatizacion;
  mostrarConfirmacion.value = true;
};

const confirmarEliminacion = (): void => {
  if (!automatizacionPendienteEliminar.value) {
    return;
  }

  const idEliminado = automatizacionPendienteEliminar.value.id;

  const eliminado = eliminar(idEliminado);

  if (!eliminado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible eliminar la automatización.',
    });

    return;
  }

  mostrarConfirmacion.value = false;
  automatizacionPendienteEliminar.value = null;

  if (automatizacionSeleccionada.value?.id === idEliminado) {
    automatizacionSeleccionada.value = null;
  }

  Notify.create({
    type: 'positive',
    message: 'Automatización eliminada correctamente.',
  });
};
</script>

<style scoped>
.automations-page {
  min-height: 100%;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
}

.summary-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #f3f4f6;
  color: #4b5563;
}

.summary-card__content {
  min-width: 0;
}

.summary-card__label {
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-card__value {
  margin-top: 2px;
  color: #1f2937;
  font-size: 22px;
  font-weight: 700;
}

.content-card {
  border-radius: 14px;
}

.content-card__header {
  padding: 20px 24px;
}

@media (max-width: 600px) {
  .content-card__header {
    padding: 16px;
  }
}
</style>
