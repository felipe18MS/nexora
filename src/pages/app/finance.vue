<template>
  <q-page class="finance-page">
    <div class="finance-page__container">
      <div class="finance-page__header">
        <div>
          <div class="finance-page__title">Finanzas</div>

          <div class="finance-page__subtitle">
            Controla los ingresos, gastos y movimientos financieros de tu negocio.
          </div>
        </div>

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="add"
          label="Nuevo movimiento"
          @click="abrirCrear"
        />
      </div>

      <FinanceSummary :resumen="resumen" />

      <q-card flat bordered class="finance-page__content">
        <q-card-section class="finance-page__filters">
          <FinanceFilters
            :filtros="filtros"
            @actualizar="establecerFiltros"
            @limpiar="limpiarFiltros"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="finance-page__table-section">
          <div class="finance-page__table-header">
            <div>
              <div class="finance-page__table-title">Movimientos financieros</div>

              <div class="finance-page__table-subtitle">
                {{ movimientosFiltrados.length }}
                {{
                  movimientosFiltrados.length === 1
                    ? 'movimiento encontrado'
                    : 'movimientos encontrados'
                }}
              </div>
            </div>

            <q-btn
              v-if="hayFiltrosActivos"
              flat
              dense
              no-caps
              icon="filter_alt"
              label="Filtros activos"
              color="primary"
              @click="limpiarFiltros"
            />
          </div>

          <FinanceTable
            :movimientos="movimientosFiltrados"
            :cargando="cargando"
            @ver="abrirDetalle"
            @editar="abrirEditar"
            @anular="solicitarAnulacion"
            @eliminar="solicitarEliminacion"
          />
        </q-card-section>
      </q-card>
    </div>

    <FinanceForm
      v-model="mostrarFormulario"
      :movimiento="movimientoEditando"
      :guardando="guardando"
      @guardar="guardarMovimiento"
    />

    <FinanceDetails
      v-model="mostrarDetalle"
      :movimiento="movimientoSeleccionado"
      @editar="abrirEditarDesdeDetalle"
    />

    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      :titulo="tipoConfirmacion === 'anular' ? 'Anular movimiento' : 'Eliminar movimiento'"
      :mensaje="mensajeConfirmacion"
      :confirm-label="tipoConfirmacion === 'anular' ? 'Anular movimiento' : 'Eliminar'"
      :confirm-color="tipoConfirmacion === 'anular' ? 'warning' : 'negative'"
      :loading="guardando"
      @confirmar="confirmarAccion"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import FinanceDetails from '../../modules/finance/components/finance-details.vue';
import FinanceFilters from '../../modules/finance/components/finance-filters.vue';
import FinanceForm from '../../modules/finance/components/finance-form.vue';
import FinanceSummary from '../../modules/finance/components/finance-summary.vue';
import FinanceTable from '../../modules/finance/components/finance-table.vue';

import { useFinance } from '../../modules/finance/composables/use-finance';

import type {
  CrearMovimientoFinanciero,
  MovimientoFinanciero,
} from '../../modules/finance/types/finance.types';

const {
  movimientosFiltrados,
  movimientoSeleccionado,
  filtros,
  resumen,
  cargando,
  guardando,
  hayFiltrosActivos,
  cargarMovimientos,
  establecerFiltros,
  limpiarFiltros,
  seleccionarMovimiento,
  limpiarSeleccion,
  crear,
  actualizar,
  anular,
  eliminar,
} = useFinance();

const mostrarFormulario = ref(false);
const mostrarDetalle = ref(false);
const mostrarConfirmacion = ref(false);

const movimientoEditando = ref<MovimientoFinanciero | null>(null);

const movimientoPendiente = ref<MovimientoFinanciero | null>(null);

const tipoConfirmacion = ref<'anular' | 'eliminar'>('anular');

const mensajeConfirmacion = ref('');

const abrirCrear = (): void => {
  movimientoEditando.value = null;
  mostrarFormulario.value = true;
};

const abrirDetalle = (movimiento: MovimientoFinanciero): void => {
  seleccionarMovimiento(movimiento.id);
  mostrarDetalle.value = true;
};

const abrirEditar = (movimiento: MovimientoFinanciero): void => {
  movimientoEditando.value = movimiento;
  mostrarFormulario.value = true;
};

const abrirEditarDesdeDetalle = (movimiento: MovimientoFinanciero): void => {
  mostrarDetalle.value = false;
  movimientoEditando.value = movimiento;
  mostrarFormulario.value = true;
};

const guardarMovimiento = (datos: CrearMovimientoFinanciero): void => {
  if (movimientoEditando.value) {
    const actualizado = actualizar({
      id: movimientoEditando.value.id,
      ...datos,
    });

    if (!actualizado) {
      Notify.create({
        type: 'negative',
        message: 'No fue posible actualizar el movimiento.',
      });

      return;
    }

    Notify.create({
      type: 'positive',
      message: 'Movimiento actualizado correctamente.',
    });
  } else {
    crear(datos);

    Notify.create({
      type: 'positive',
      message: 'Movimiento registrado correctamente.',
    });
  }

  mostrarFormulario.value = false;
  movimientoEditando.value = null;
};

const solicitarAnulacion = (movimiento: MovimientoFinanciero): void => {
  movimientoPendiente.value = movimiento;
  tipoConfirmacion.value = 'anular';

  mensajeConfirmacion.value = `¿Estás seguro de que deseas anular el movimiento "${movimiento.concepto}"? Esta acción conservará el movimiento en el historial, pero dejará de contabilizarse en los totales financieros.`;

  mostrarConfirmacion.value = true;
};

const solicitarEliminacion = (movimiento: MovimientoFinanciero): void => {
  movimientoPendiente.value = movimiento;
  tipoConfirmacion.value = 'eliminar';

  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el movimiento "${movimiento.concepto}"? Esta acción eliminará el registro de forma permanente.`;

  mostrarConfirmacion.value = true;
};

const confirmarAccion = (): void => {
  if (!movimientoPendiente.value) {
    return;
  }

  const idMovimiento = movimientoPendiente.value.id;

  if (tipoConfirmacion.value === 'anular') {
    const movimientoAnulado = anular(idMovimiento);

    if (!movimientoAnulado) {
      Notify.create({
        type: 'negative',
        message: 'No fue posible anular el movimiento.',
      });

      return;
    }

    Notify.create({
      type: 'positive',
      message: 'Movimiento anulado correctamente.',
    });
  } else {
    const eliminado = eliminar(idMovimiento);

    if (!eliminado) {
      Notify.create({
        type: 'negative',
        message: 'No fue posible eliminar el movimiento.',
      });

      return;
    }

    Notify.create({
      type: 'positive',
      message: 'Movimiento eliminado correctamente.',
    });
  }

  mostrarConfirmacion.value = false;
  movimientoPendiente.value = null;

  if (movimientoSeleccionado.value?.id === idMovimiento) {
    mostrarDetalle.value = false;
    limpiarSeleccion();
  }
};

onMounted(() => {
  cargarMovimientos();
});
</script>

<style scoped>
.finance-page {
  padding: 24px;
  background: #f8fafc;
}

.finance-page__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.finance-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.finance-page__title {
  color: var(--q-dark);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

.finance-page__subtitle {
  margin-top: 5px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.finance-page__content {
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
}

.finance-page__filters {
  padding: 18px;
}

.finance-page__table-section {
  padding: 18px;
}

.finance-page__table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.finance-page__table-title {
  color: var(--q-dark);
  font-size: 16px;
  font-weight: 700;
}

.finance-page__table-subtitle {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 700px) {
  .finance-page {
    padding: 16px;
  }

  .finance-page__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .finance-page__header .q-btn {
    width: 100%;
  }

  .finance-page__table-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
