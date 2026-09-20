<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="report-details">
      <q-card-section class="report-details__header">
        <div class="report-details__identity">
          <div class="report-details__icon">
            <q-icon name="description" size="22px" />
          </div>

          <div class="report-details__titles">
            <div class="report-details__title">
              {{ reporte.nombre }}
            </div>

            <div class="report-details__subtitle">
              {{ reporte.descripcion }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" color="grey-7" aria-label="Cerrar" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <q-card-section class="report-details__body">
        <div class="report-details__meta">
          <div class="report-details__meta-item">
            <span class="report-details__meta-label"> Tipo de reporte </span>

            <span class="report-details__meta-value">
              {{ obtenerNombreTipo(reporte.tipo) }}
            </span>
          </div>

          <div class="report-details__meta-item">
            <span class="report-details__meta-label"> Periodo </span>

            <span class="report-details__meta-value">
              {{ obtenerNombrePeriodo(reporte.periodo) }}
            </span>
          </div>

          <div class="report-details__meta-item">
            <span class="report-details__meta-label"> Desde </span>

            <span class="report-details__meta-value">
              {{ formatearFecha(reporte.rangoFechas.desde) }}
            </span>
          </div>

          <div class="report-details__meta-item">
            <span class="report-details__meta-label"> Hasta </span>

            <span class="report-details__meta-value">
              {{ formatearFecha(reporte.rangoFechas.hasta) }}
            </span>
          </div>
        </div>

        <section class="report-details__section">
          <div class="report-details__section-heading">
            <div class="report-details__section-icon">
              <q-icon name="analytics" size="18px" />
            </div>

            <div class="report-details__section-title">Indicadores</div>
          </div>

          <div class="report-details__indicators">
            <div
              v-for="indicador in reporte.indicadores"
              :key="indicador.id"
              class="report-details__indicator"
            >
              <div class="report-details__indicator-label">
                {{ indicador.nombre }}
              </div>

              <div class="report-details__indicator-value">
                {{ formatearValor(indicador.valor, indicador.unidad) }}
              </div>

              <div
                v-if="indicador.tendencia !== undefined"
                class="report-details__indicator-trend"
                :class="{
                  'report-details__indicator-trend--positive': indicador.tendencia > 0,
                  'report-details__indicator-trend--negative': indicador.tendencia < 0,
                  'report-details__indicator-trend--neutral': indicador.tendencia === 0,
                }"
              >
                <q-icon
                  :name="
                    indicador.tendencia > 0
                      ? 'trending_up'
                      : indicador.tendencia < 0
                        ? 'trending_down'
                        : 'trending_flat'
                  "
                  size="15px"
                />

                {{ formatearTendencia(indicador.tendencia) }}
              </div>
            </div>
          </div>
        </section>

        <section v-if="reporte.series.length" class="report-details__section">
          <div class="report-details__section-heading">
            <div class="report-details__section-icon">
              <q-icon name="bar_chart" size="18px" />
            </div>

            <div class="report-details__section-title">Visualizaciones</div>
          </div>

          <div class="report-details__charts">
            <div v-for="serie in reporte.series" :key="serie.id" class="report-details__chart">
              <div class="report-details__chart-title">
                {{ serie.nombre }}
              </div>

              <div class="report-details__chart-points">
                <div
                  v-for="punto in serie.puntos"
                  :key="`${serie.id}-${punto.etiqueta}`"
                  class="report-details__chart-point"
                >
                  <span>{{ punto.etiqueta }}</span>
                  <strong>{{ formatearNumero(punto.valor) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="report-details__section">
          <div class="report-details__generated">
            <q-icon name="schedule" size="16px" />

            <span>
              Generado el
              {{ formatearFechaHora(reporte.generadoEn) }}
            </span>
          </div>
        </section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="report-details__footer">
        <q-btn
          flat
          no-caps
          label="Cerrar"
          color="grey-7"
          class="report-details__secondary"
          @click="cerrar"
        />

        <q-btn
          unelevated
          no-caps
          label="Editar reporte"
          icon="edit"
          color="primary"
          class="report-details__primary"
          @click="editar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { PeriodoReporte, Reporte, TipoReporte } from '../types/report.types';

defineProps<{
  modelValue: boolean;
  reporte: Reporte;
}>();

const emit = defineEmits<{
  'update:modelValue': [valor: boolean];
  editar: [];
}>();

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const editar = (): void => {
  emit('editar');
};

const obtenerNombreTipo = (tipo: TipoReporte): string => {
  const nombres: Record<TipoReporte, string> = {
    financiero: 'Financiero',
    citas: 'Citas',
    clientes: 'Clientes',
    servicios: 'Servicios',
    ventas: 'Ventas',
  };

  return nombres[tipo];
};

const obtenerNombrePeriodo = (periodo: PeriodoReporte): string => {
  const nombres: Record<PeriodoReporte, string> = {
    hoy: 'Hoy',
    semana: 'Esta semana',
    mes: 'Este mes',
    trimestre: 'Este trimestre',
    anio: 'Este año',
    personalizado: 'Personalizado',
  };

  return nombres[periodo];
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${fecha}T00:00:00`));
};

const formatearFechaHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const formatearNumero = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(valor);
};

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const formatearValor = (valor: number, unidad: 'numero' | 'moneda' | 'porcentaje'): string => {
  if (unidad === 'moneda') {
    return formatearMoneda(valor);
  }

  if (unidad === 'porcentaje') {
    return `${formatearNumero(valor)}%`;
  }

  return formatearNumero(valor);
};

const formatearTendencia = (tendencia: number): string => {
  const signo = tendencia > 0 ? '+' : '';

  return `${signo}${formatearNumero(tendencia)}%`;
};
</script>

<style scoped>
.report-details {
  width: min(760px, 94vw);
  max-width: 760px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
}

.report-details__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.report-details__identity {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.report-details__icon {
  display: flex;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.report-details__titles {
  min-width: 0;
}

.report-details__title {
  overflow: hidden;
  color: #111827;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-details__subtitle {
  max-width: 560px;
  margin-top: 3px;
  overflow: hidden;
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-details__body {
  max-height: calc(90vh - 140px);
  overflow-y: auto;
  padding: 20px;
}

.report-details__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 22px;
}

.report-details__meta-item {
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  background: #fafbfc;
}

.report-details__meta-label {
  display: block;
  margin-bottom: 4px;
  color: #9ca3af;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.report-details__meta-value {
  display: block;
  overflow: hidden;
  color: #4b5563;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-details__section {
  margin-bottom: 22px;
}

.report-details__section:last-child {
  margin-bottom: 0;
}

.report-details__section-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
}

.report-details__section-icon {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f3f6fa;
  color: var(--q-primary);
}

.report-details__section-title {
  color: #374151;
  font-size: 13px;
  font-weight: 700;
}

.report-details__indicators {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.report-details__indicator {
  min-width: 0;
  padding: 13px;
  border: 1px solid #eef0f3;
  border-radius: 11px;
  background: #ffffff;
}

.report-details__indicator-label {
  overflow: hidden;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-details__indicator-value {
  margin-top: 7px;
  overflow-wrap: anywhere;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
}

.report-details__indicator-trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  font-size: 10px;
  font-weight: 600;
}

.report-details__indicator-trend--positive {
  color: #059669;
}

.report-details__indicator-trend--negative {
  color: #dc2626;
}

.report-details__indicator-trend--neutral {
  color: #9ca3af;
}

.report-details__charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.report-details__chart {
  min-width: 0;
  padding: 13px;
  border: 1px solid #eef0f3;
  border-radius: 11px;
  background: #fafbfc;
}

.report-details__chart-title {
  margin-bottom: 10px;
  color: #4b5563;
  font-size: 11px;
  font-weight: 700;
}

.report-details__chart-points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 12px;
}

.report-details__chart-point {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #9ca3af;
  font-size: 9px;
}

.report-details__chart-point strong {
  color: #4b5563;
  font-weight: 600;
}

.report-details__generated {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 10px;
}

.report-details__footer {
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
}

.report-details__secondary,
.report-details__primary {
  min-height: 38px;
  border-radius: 9px;
  font-weight: 600;
}

.report-details__secondary {
  padding: 0 12px;
}

.report-details__primary {
  padding: 0 14px;
}

@media (max-width: 700px) {
  .report-details {
    width: 94vw;
    max-height: 92vh;
    border-radius: 16px;
  }

  .report-details__header {
    padding: 15px 16px;
  }

  .report-details__body {
    max-height: calc(92vh - 132px);
    padding: 16px;
  }

  .report-details__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-details__indicators {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-details__charts {
    grid-template-columns: 1fr;
  }

  .report-details__footer {
    padding: 10px 16px;
  }
}

@media (max-width: 460px) {
  .report-details__identity {
    gap: 9px;
  }

  .report-details__icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .report-details__title {
    font-size: 15px;
  }

  .report-details__subtitle {
    display: none;
  }

  .report-details__meta,
  .report-details__indicators {
    grid-template-columns: 1fr;
  }

  .report-details__footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .report-details__secondary,
  .report-details__primary {
    width: 100%;
  }
}
</style>
