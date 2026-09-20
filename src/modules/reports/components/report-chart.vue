<template>
  <q-card flat bordered class="report-chart">
    <q-card-section class="report-chart__header">
      <div class="report-chart__heading">
        <div class="report-chart__icon">
          <q-icon :name="serie.tipo === 'linea' ? 'show_chart' : 'bar_chart'" size="20px" />
        </div>

        <div class="report-chart__titles">
          <div class="report-chart__title">
            {{ serie.nombre }}
          </div>

          <div class="report-chart__subtitle">Comportamiento del periodo seleccionado</div>
        </div>
      </div>

      <div class="report-chart__type">
        {{ serie.tipo === 'linea' ? 'Tendencia' : 'Comparativo' }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="report-chart__body">
      <div v-if="!serie.puntos.length" class="report-chart__empty">
        <q-icon name="bar_chart" size="32px" />
        <span>No hay información disponible para este periodo.</span>
      </div>

      <div v-else class="report-chart__visual">
        <div class="report-chart__axis">
          <span>{{ formatearValor(maximo) }}</span>
          <span>{{ formatearValor(maximo / 2) }}</span>
          <span>0</span>
        </div>

        <div class="report-chart__area">
          <div class="report-chart__grid-lines">
            <span />
            <span />
            <span />
          </div>

          <svg
            v-if="serie.tipo === 'linea'"
            class="report-chart__line-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient :id="`gradient-${serie.id}`" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-opacity="0.16" />
                <stop offset="100%" stop-opacity="0" />
              </linearGradient>
            </defs>

            <polygon :points="areaLinea" :fill="`url(#gradient-${serie.id})`" />

            <polyline
              :points="puntosLinea"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
            />

            <circle
              v-for="(punto, index) in puntosCalculados"
              :key="`${serie.id}-punto-${index}`"
              :cx="punto.x"
              :cy="punto.y"
              r="1.7"
              fill="currentColor"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <div v-else class="report-chart__bars">
            <div
              v-for="(punto, index) in serie.puntos"
              :key="`${serie.id}-barra-${index}`"
              class="report-chart__bar-group"
            >
              <div class="report-chart__bar-value">
                {{ formatearValor(punto.valor) }}
              </div>

              <div class="report-chart__bar-wrapper">
                <div
                  class="report-chart__bar"
                  :style="{
                    height: `${obtenerAlturaBarra(punto.valor)}%`,
                  }"
                />
              </div>

              <div class="report-chart__bar-label">
                {{ punto.etiqueta }}
              </div>
            </div>
          </div>

          <div v-if="serie.tipo === 'linea'" class="report-chart__labels">
            <span v-for="(punto, index) in serie.puntos" :key="`${serie.id}-label-${index}`">
              {{ punto.etiqueta }}
            </span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { SerieReporte } from '../types/report.types';

const props = defineProps<{
  serie: SerieReporte;
}>();

const maximo = computed(() => {
  const mayor = Math.max(...props.serie.puntos.map((punto) => punto.valor), 0);

  return mayor > 0 ? mayor : 1;
});

const puntosCalculados = computed(() => {
  const cantidad = props.serie.puntos.length;

  if (cantidad === 0) {
    return [];
  }

  return props.serie.puntos.map((punto, index) => {
    const x = cantidad === 1 ? 50 : (index / (cantidad - 1)) * 100;

    const porcentaje = (punto.valor / maximo.value) * 100;

    const y = 100 - porcentaje;

    return {
      x,
      y,
    };
  });
});

const puntosLinea = computed(() => {
  return puntosCalculados.value.map((punto) => `${punto.x},${punto.y}`).join(' ');
});

const areaLinea = computed(() => {
  if (!puntosCalculados.value.length) {
    return '';
  }

  const puntos = puntosCalculados.value.map((punto) => `${punto.x},${punto.y}`).join(' ');

  return `0,100 ${puntos} 100,100`;
});

const obtenerAlturaBarra = (valor: number): number => {
  if (valor <= 0) {
    return 0;
  }

  return Math.max((valor / maximo.value) * 100, 3);
};

const formatearValor = (valor: number): string => {
  if (Math.abs(valor) >= 1000000) {
    return `${(valor / 1000000).toFixed(1)} M`;
  }

  if (Math.abs(valor) >= 1000) {
    return `${(valor / 1000).toFixed(1)} K`;
  }

  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(valor);
};
</script>

<style scoped>
.report-chart {
  min-width: 0;
  overflow: hidden;
  border-color: #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.report-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
}

.report-chart__heading {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.report-chart__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 10px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.report-chart__titles {
  min-width: 0;
}

.report-chart__title {
  overflow: hidden;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-chart__subtitle {
  margin-top: 2px;
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.4;
}

.report-chart__type {
  flex-shrink: 0;
  padding: 5px 9px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  color: #6b7280;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.report-chart__body {
  padding: 18px;
}

.report-chart__visual {
  display: flex;
  min-height: 250px;
  gap: 10px;
}

.report-chart__axis {
  display: flex;
  width: 42px;
  flex: 0 0 42px;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px 0 28px;
  color: #9ca3af;
  font-size: 10px;
  text-align: right;
}

.report-chart__area {
  position: relative;
  min-width: 0;
  flex: 1;
}

.report-chart__grid-lines {
  position: absolute;
  inset: 2px 0 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.report-chart__grid-lines span {
  width: 100%;
  border-top: 1px dashed #e5e7eb;
}

.report-chart__line-svg {
  position: absolute;
  inset: 4px 0 30px;
  width: 100%;
  height: calc(100% - 34px);
  overflow: visible;
  color: var(--q-primary);
}

.report-chart__bars {
  position: absolute;
  inset: 2px 0 30px;
  display: flex;
  align-items: flex-end;
  gap: clamp(6px, 1.2vw, 14px);
  padding: 0 6px;
}

.report-chart__bar-group {
  display: flex;
  min-width: 0;
  height: 100%;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.report-chart__bar-value {
  min-height: 16px;
  margin-bottom: 4px;
  color: #6b7280;
  font-size: 9px;
  line-height: 1;
  white-space: nowrap;
}

.report-chart__bar-wrapper {
  display: flex;
  width: min(34px, 100%);
  height: calc(100% - 20px);
  align-items: flex-end;
}

.report-chart__bar {
  width: 100%;
  min-height: 3px;
  border-radius: 6px 6px 3px 3px;
  background: var(--q-primary);
  opacity: 0.82;
  transition:
    height 0.3s ease,
    opacity 0.2s ease;
}

.report-chart__bar-group:hover .report-chart__bar {
  opacity: 1;
}

.report-chart__bar-label {
  width: 100%;
  margin-top: 8px;
  overflow: hidden;
  color: #9ca3af;
  font-size: 9px;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-chart__labels {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  color: #9ca3af;
  font-size: 9px;
  line-height: 1.2;
}

.report-chart__labels span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-chart__empty {
  display: flex;
  min-height: 210px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
}

.report-chart__empty .q-icon {
  color: #cbd5e1;
}

@media (max-width: 700px) {
  .report-chart__header {
    padding: 14px 16px;
  }

  .report-chart__body {
    padding: 14px;
  }

  .report-chart__visual {
    min-height: 220px;
  }

  .report-chart__type {
    display: none;
  }

  .report-chart__subtitle {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .report-chart__heading {
    gap: 9px;
  }

  .report-chart__icon {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }

  .report-chart__title {
    font-size: 13px;
  }

  .report-chart__visual {
    min-height: 200px;
    gap: 6px;
  }

  .report-chart__axis {
    width: 34px;
    flex-basis: 34px;
    font-size: 9px;
  }

  .report-chart__bars {
    gap: 4px;
    padding: 0 2px;
  }

  .report-chart__bar-wrapper {
    width: min(25px, 100%);
  }

  .report-chart__bar-label {
    font-size: 8px;
  }

  .report-chart__bar-value {
    font-size: 8px;
  }
}
</style>
