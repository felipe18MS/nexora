<template>
  <q-page class="integrations-page q-pa-lg">
    <div class="integrations-page__content">
      <IntegrationHeader />

      <section class="integrations-summary">
        <div class="integrations-summary__item">
          <div class="integrations-summary__icon">
            <q-icon name="extension" size="20px" />
          </div>

          <div>
            <div class="integrations-summary__value">
              {{ resumen.total }}
            </div>

            <div class="integrations-summary__label">Total</div>
          </div>
        </div>

        <div class="integrations-summary__item">
          <div class="integrations-summary__icon integrations-summary__icon--connected">
            <q-icon name="check_circle" size="20px" />
          </div>

          <div>
            <div class="integrations-summary__value">
              {{ resumen.conectadas }}
            </div>

            <div class="integrations-summary__label">Conectadas</div>
          </div>
        </div>

        <div class="integrations-summary__item">
          <div class="integrations-summary__icon integrations-summary__icon--pending">
            <q-icon name="schedule" size="20px" />
          </div>

          <div>
            <div class="integrations-summary__value">
              {{ resumen.pendientes }}
            </div>

            <div class="integrations-summary__label">Pendientes</div>
          </div>
        </div>

        <div class="integrations-summary__item">
          <div class="integrations-summary__icon integrations-summary__icon--disconnected">
            <q-icon name="link_off" size="20px" />
          </div>

          <div>
            <div class="integrations-summary__value">
              {{ resumen.desconectadas }}
            </div>

            <div class="integrations-summary__label">Desconectadas</div>
          </div>
        </div>
      </section>

      <IntegrationFilters
        :filtros="filtros"
        :categorias="opcionesCategorias"
        :opciones-estado="opcionesEstado"
        :hay-filtros-activos="hayFiltrosActivos"
        @actualizar="establecerFiltros"
        @limpiar="limpiarFiltros"
      />

      <div v-if="cargando" class="integrations-page__loading">
        <q-spinner-dots color="primary" size="34px" />

        <span>Cargando integraciones...</span>
      </div>

      <div v-else-if="integracionesFiltradas.length" class="integrations-grid">
        <IntegrationCard
          v-for="integracion in integracionesFiltradas"
          :key="integracion.id"
          :integracion="integracion"
          @ver="verDetalles"
        />
      </div>

      <div v-else class="integrations-page__empty">
        <q-icon name="extension_off" size="42px" />

        <div class="integrations-page__empty-title">No hay integraciones</div>

        <div class="integrations-page__empty-text">
          No encontramos integraciones con los filtros seleccionados.
        </div>

        <q-btn
          v-if="hayFiltrosActivos"
          flat
          no-caps
          label="Limpiar filtros"
          icon="filter_alt_off"
          color="primary"
          @click="limpiarFiltros"
        />
      </div>
    </div>

    <IntegrationDetails
      v-if="integracionSeleccionada"
      v-model="mostrarDetalles"
      :integracion="integracionSeleccionada"
      @conectar="conectar"
      @desconectar="desconectar"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import IntegrationCard from '../../modules/integrations/components/integration-card.vue';
import IntegrationDetails from '../../modules/integrations/components/integration-details.vue';
import IntegrationFilters from '../../modules/integrations/components/integration-filters.vue';
import IntegrationHeader from '../../modules/integrations/components/integration-header.vue';

import {
  obtenerCategoriasIntegracion,
  obtenerEstadosIntegracion,
} from '../../modules/integrations/services/integration.service';

import { useIntegrations } from '../../modules/integrations/composables/use-integrations';

import type {
  EstadoIntegracion,
  Integracion,
} from '../../modules/integrations/types/integration.types';

const {
  integracionesFiltradas,
  integracionSeleccionada,
  filtros,
  resumen,
  cargando,
  guardando,
  hayFiltrosActivos,
  cargarIntegraciones,
  establecerFiltros,
  limpiarFiltros,
  seleccionarIntegracion,
  limpiarSeleccion,
  conectarIntegracion,
  desconectarIntegracion,
} = useIntegrations();

const mostrarDetalles = ref(false);

const opcionesCategorias = obtenerCategoriasIntegracion().map((categoria) => ({
  label: categoria,
  value: categoria,
}));

const opcionesEstado: Array<{
  label: string;
  value: EstadoIntegracion;
}> = obtenerEstadosIntegracion();

const verDetalles = (integracion: Integracion): void => {
  const seleccionada = seleccionarIntegracion(integracion.id);

  if (!seleccionada) {
    Notify.create({
      type: 'negative',
      message: 'No se encontró la integración seleccionada.',
    });

    return;
  }

  mostrarDetalles.value = true;
};

const conectar = (integracion: Integracion): void => {
  if (guardando.value) {
    return;
  }

  const resultado = conectarIntegracion(integracion.id);

  if (!resultado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible conectar la integración.',
    });

    return;
  }

  Notify.create({
    type: 'positive',
    message: `${resultado.nombre} conectada correctamente.`,
  });
};

const desconectar = (integracion: Integracion): void => {
  if (guardando.value) {
    return;
  }

  const resultado = desconectarIntegracion(integracion.id);

  if (!resultado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible desconectar la integración.',
    });

    return;
  }

  Notify.create({
    type: 'positive',
    message: `${resultado.nombre} desconectada correctamente.`,
  });
};

void limpiarSeleccion;

onMounted(() => {
  cargarIntegraciones();
});
</script>

<style scoped>
.integrations-page {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.integrations-page__content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.integrations-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.integrations-summary__item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.integrations-summary__icon {
  display: flex;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f3f4f6;
  color: #4b5563;
}

.integrations-summary__icon--connected {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
}

.integrations-summary__icon--pending {
  background: rgba(245, 158, 11, 0.09);
  color: #b45309;
}

.integrations-summary__icon--disconnected {
  background: #f3f4f6;
  color: #6b7280;
}

.integrations-summary__value {
  color: #111827;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
}

.integrations-summary__label {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.integrations-page__loading {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9ca3af;
  font-size: 12px;
}

.integrations-page__empty {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  background: #ffffff;
  color: #9ca3af;
  text-align: center;
}

.integrations-page__empty-title {
  margin-top: 4px;
  color: #374151;
  font-size: 15px;
  font-weight: 700;
}

.integrations-page__empty-text {
  max-width: 400px;
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .integrations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .integrations-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .integrations-page {
    padding: 16px !important;
  }

  .integrations-summary,
  .integrations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
