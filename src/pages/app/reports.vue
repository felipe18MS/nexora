<template>
  <q-page class="reports-page q-pa-lg">
    <div class="reports-page__content">
      <ReportHeader @nuevo="abrirNuevoReporte" />

      <ReportFilters
        :filtros="filtros"
        :hay-filtros-activos="hayFiltrosActivos"
        @actualizar="establecerFiltros"
        @limpiar="limpiarFiltros"
      />

      <ReportSummary :indicadores="indicadoresResumen" />

      <div class="reports-page__charts">
        <ReportChart v-for="serie in seriesVisibles" :key="serie.id" :serie="serie" />
      </div>

      <ReportTable
        :filas="filasVisibles"
        @ver="verReporte"
        @editar="editarReporte"
        @eliminar="confirmarEliminarReporte"
      />

      <!-- Formulario -->
      <q-dialog v-model="mostrarFormulario">
        <q-card class="report-form-dialog">
          <div class="report-form-dialog__header">
            <div class="report-form-dialog__heading">
              <div class="report-form-dialog__icon">
                <q-icon name="insert_chart" size="22px" />
              </div>

              <div class="report-form-dialog__titles">
                <div class="report-form-dialog__title">
                  {{ reporteEditando ? 'Editar reporte' : 'Nuevo reporte' }}
                </div>

                <div class="report-form-dialog__subtitle">
                  Configura el tipo y periodo del reporte.
                </div>
              </div>
            </div>

            <q-btn
              flat
              round
              dense
              icon="close"
              color="grey-7"
              aria-label="Cerrar"
              @click="cerrarFormulario"
            />
          </div>

          <q-separator />

          <q-card-section class="report-form-dialog__body">
            <q-select
              v-model="formulario.tipo"
              :options="opcionesTipo"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
              label="Tipo de reporte"
              :rules="[(valor) => !!valor || 'Selecciona un tipo de reporte']"
            >
              <template #prepend>
                <q-icon name="category" color="grey-6" />
              </template>
            </q-select>

            <q-select
              v-model="formulario.periodo"
              :options="opcionesPeriodo"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
              label="Periodo"
              :rules="[(valor) => !!valor || 'Selecciona un periodo']"
            >
              <template #prepend>
                <q-icon name="date_range" color="grey-6" />
              </template>
            </q-select>

            <div class="report-form-dialog__dates">
              <q-input
                v-model="formulario.rangoFechas.desde"
                outlined
                dense
                type="date"
                label="Fecha desde"
              >
                <template #prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
              </q-input>

              <q-input
                v-model="formulario.rangoFechas.hasta"
                outlined
                dense
                type="date"
                label="Fecha hasta"
              >
                <template #prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-separator />

          <div class="report-form-dialog__footer">
            <q-btn
              flat
              no-caps
              label="Cancelar"
              color="grey-8"
              class="report-form-dialog__cancel"
              @click="cerrarFormulario"
            />

            <q-btn
              unelevated
              :loading="guardando"
              :label="reporteEditando ? 'Guardar cambios' : 'Generar reporte'"
              no-caps
              color="primary"
              class="report-form-dialog__save"
              @click="guardarReporte"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- Detalle -->
      <ReportDetails
        v-if="reporteSeleccionado"
        v-model="mostrarDetalles"
        :reporte="reporteSeleccionado"
        @editar="editarReporteDesdeDetalle"
      />

      <!-- Confirmación -->
      <AppConfirmDialog
        v-model="mostrarConfirmacion"
        titulo="Eliminar reporte"
        mensaje="¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer."
        texto-confirmar="Eliminar reporte"
        tipo="danger"
        :loading="guardando"
        @confirm="eliminarReporteConfirmado"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';

definePage({
  meta: {
    module: 'reportes',
    requiresSubscription: true,
  },
});

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import ReportChart from '../../modules/reports/components/report-chart.vue';
import ReportDetails from '../../modules/reports/components/report-details.vue';
import ReportFilters from '../../modules/reports/components/report-filters.vue';
import ReportHeader from '../../modules/reports/components/report-header.vue';
import ReportSummary from '../../modules/reports/components/report-summary.vue';
import ReportTable from '../../modules/reports/components/report-table.vue';

import { useReports } from '../../modules/reports/composables/use-reports';

import type {
  CrearReporte,
  PeriodoReporte,
  TipoReporte,
} from '../../modules/reports/types/report.types';

const {
  reportesFiltrados,
  reporteSeleccionado,
  filtros,
  resumen,
  guardando,
  hayFiltrosActivos,
  cargarReportes,
  establecerFiltros,
  limpiarFiltros,
  seleccionarReporte,
  limpiarSeleccion,
  crearReporte,
  actualizarReporte,
  eliminarReporte,
} = useReports();

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarConfirmacion = ref(false);

const reporteEditando = ref<string | null>(null);
const reportePendienteEliminar = ref<string | null>(null);

interface FormularioReporte {
  tipo: TipoReporte;
  periodo: PeriodoReporte;
  rangoFechas: {
    desde: string;
    hasta: string;
  };
}

const obtenerFechaActual = (): string => {
  const fecha = new Date();

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
};

const crearFormulario = (): FormularioReporte => {
  const fechaActual = obtenerFechaActual();

  return {
    tipo: 'financiero',
    periodo: 'mes',
    rangoFechas: {
      desde: `${fechaActual.slice(0, 8)}01`,
      hasta: fechaActual,
    },
  };
};

const formulario = reactive<FormularioReporte>(crearFormulario());

const opcionesTipo: Array<{
  label: string;
  value: TipoReporte;
}> = [
  {
    label: 'Financiero',
    value: 'financiero',
  },
  {
    label: 'Citas',
    value: 'citas',
  },
  {
    label: 'Clientes',
    value: 'clientes',
  },
  {
    label: 'Servicios',
    value: 'servicios',
  },
  {
    label: 'Ventas',
    value: 'ventas',
  },
];

const opcionesPeriodo: Array<{
  label: string;
  value: PeriodoReporte;
}> = [
  {
    label: 'Hoy',
    value: 'hoy',
  },
  {
    label: 'Esta semana',
    value: 'semana',
  },
  {
    label: 'Este mes',
    value: 'mes',
  },
  {
    label: 'Este trimestre',
    value: 'trimestre',
  },
  {
    label: 'Este año',
    value: 'anio',
  },
  {
    label: 'Personalizado',
    value: 'personalizado',
  },
];

const reporteVisible = computed(() => {
  return reportesFiltrados.value[0] ?? null;
});

const indicadoresResumen = computed(() => {
  const reporte = reporteVisible.value;

  if (reporte) {
    return reporte.indicadores;
  }

  return [
    {
      id: 'ingresos',
      nombre: 'Ingresos',
      valor: resumen.value.totalIngresos,
      unidad: 'moneda' as const,
    },
    {
      id: 'gastos',
      nombre: 'Gastos',
      valor: resumen.value.totalGastos,
      unidad: 'moneda' as const,
    },
    {
      id: 'balance',
      nombre: 'Balance',
      valor: resumen.value.balance,
      unidad: 'moneda' as const,
    },
    {
      id: 'total_citas',
      nombre: 'Citas',
      valor: resumen.value.totalCitas,
      unidad: 'numero' as const,
    },
  ];
});

const seriesVisibles = computed(() => {
  return reporteVisible.value?.series ?? [];
});

const filasVisibles = computed(() => {
  return reporteVisible.value?.filas ?? [];
});

const abrirNuevoReporte = (): void => {
  reporteEditando.value = null;

  Object.assign(formulario, crearFormulario());

  mostrarFormulario.value = true;
};

const cerrarFormulario = (): void => {
  mostrarFormulario.value = false;
  reporteEditando.value = null;
};

const guardarReporte = (): void => {
  if (
    !formulario.tipo ||
    !formulario.periodo ||
    !formulario.rangoFechas.desde ||
    !formulario.rangoFechas.hasta
  ) {
    Notify.create({
      type: 'warning',
      message: 'Completa todos los campos del reporte.',
    });

    return;
  }

  if (formulario.rangoFechas.desde > formulario.rangoFechas.hasta) {
    Notify.create({
      type: 'warning',
      message: 'La fecha inicial no puede ser posterior a la fecha final.',
    });

    return;
  }

  if (reporteEditando.value) {
    const actualizado = actualizarReporte({
      id: reporteEditando.value,
      tipo: formulario.tipo,
      periodo: formulario.periodo,
      rangoFechas: {
        ...formulario.rangoFechas,
      },
    });

    if (!actualizado) {
      Notify.create({
        type: 'negative',
        message: 'No fue posible actualizar el reporte.',
      });

      return;
    }

    Notify.create({
      type: 'positive',
      message: 'Reporte actualizado correctamente.',
    });
  } else {
    const datos: CrearReporte = {
      tipo: formulario.tipo,
      periodo: formulario.periodo,
      rangoFechas: {
        ...formulario.rangoFechas,
      },
    };

    const creado = crearReporte(datos);

    if (!creado) {
      Notify.create({
        type: 'negative',
        message: 'No fue posible generar el reporte.',
      });

      return;
    }

    Notify.create({
      type: 'positive',
      message: 'Reporte generado correctamente.',
    });
  }

  cerrarFormulario();
};

const seleccionarReporteVisible = (): boolean => {
  const reporte = reporteVisible.value;

  if (!reporte) {
    Notify.create({
      type: 'negative',
      message: 'No hay un reporte disponible para esta acción.',
    });

    return false;
  }

  const seleccionado = seleccionarReporte(reporte.id);

  if (!seleccionado) {
    Notify.create({
      type: 'negative',
      message: 'No se encontró el reporte seleccionado.',
    });

    return false;
  }

  return true;
};

const verReporte = (): void => {
  if (!seleccionarReporteVisible()) {
    return;
  }

  mostrarDetalles.value = true;
};

const editarReporte = (): void => {
  if (!seleccionarReporteVisible()) {
    return;
  }

  const reporte = reporteSeleccionado.value;

  if (!reporte) {
    Notify.create({
      type: 'negative',
      message: 'No se encontró el reporte seleccionado.',
    });

    return;
  }

  reporteEditando.value = reporte.id;

  Object.assign(formulario, {
    tipo: reporte.tipo,
    periodo: reporte.periodo,
    rangoFechas: {
      ...reporte.rangoFechas,
    },
  });

  mostrarFormulario.value = true;
};

const confirmarEliminarReporte = (): void => {
  const reporte = reporteVisible.value;

  if (!reporte) {
    Notify.create({
      type: 'negative',
      message: 'No hay un reporte disponible para eliminar.',
    });

    return;
  }

  reportePendienteEliminar.value = reporte.id;
  mostrarConfirmacion.value = true;
};

const editarReporteDesdeDetalle = (): void => {
  const reporte = reporteSeleccionado.value;

  if (!reporte) {
    return;
  }

  mostrarDetalles.value = false;

  reporteEditando.value = reporte.id;

  Object.assign(formulario, {
    tipo: reporte.tipo,
    periodo: reporte.periodo,
    rangoFechas: {
      ...reporte.rangoFechas,
    },
  });

  mostrarFormulario.value = true;
};

const eliminarReporteConfirmado = (): void => {
  const id = reportePendienteEliminar.value;

  if (!id) {
    return;
  }

  const eliminado = eliminarReporte(id);

  if (!eliminado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible eliminar el reporte.',
    });

    return;
  }

  mostrarConfirmacion.value = false;
  reportePendienteEliminar.value = null;

  limpiarSeleccion();

  Notify.create({
    type: 'positive',
    message: 'Reporte eliminado correctamente.',
  });
};

onMounted(() => {
  cargarReportes();
});
</script>

<style scoped>
.reports-page {
  width: 100%;
  min-width: 0;
}

.reports-page__charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.report-form-dialog {
  width: min(560px, 94vw);
  max-width: 560px;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
}

.report-form-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.report-form-dialog__heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.report-form-dialog__icon {
  display: flex;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.report-form-dialog__titles {
  min-width: 0;
}

.report-form-dialog__title {
  color: #111827;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
}

.report-form-dialog__subtitle {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.4;
}

.report-form-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}

.report-form-dialog__body :deep(.q-field) {
  border-radius: 10px;
}

.report-form-dialog__body :deep(.q-field__control) {
  border-radius: 10px;
}

.report-form-dialog__dates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.report-form-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
}

.report-form-dialog__cancel,
.report-form-dialog__save {
  min-height: 38px;
  border-radius: 9px;
  font-weight: 600;
}

.report-form-dialog__cancel {
  padding: 0 12px;
}

.report-form-dialog__save {
  padding: 0 14px;
}

@media (max-width: 900px) {
  .reports-page__charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .report-form-dialog {
    width: 94vw;
    border-radius: 16px;
  }

  .report-form-dialog__header {
    padding: 16px;
  }

  .report-form-dialog__body {
    padding: 16px;
  }

  .report-form-dialog__dates {
    grid-template-columns: 1fr;
  }

  .report-form-dialog__footer {
    padding: 12px 16px;
  }
}

@media (max-width: 420px) {
  .report-form-dialog__heading {
    gap: 9px;
  }

  .report-form-dialog__icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .report-form-dialog__title {
    font-size: 15px;
  }

  .report-form-dialog__subtitle {
    display: none;
  }

  .report-form-dialog__footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .report-form-dialog__cancel,
  .report-form-dialog__save {
    width: 100%;
  }
}
</style>
