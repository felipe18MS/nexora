<template>
  <section class="report-summary">
    <div class="report-summary__grid">
      <q-card
        v-for="indicador in indicadoresVisibles"
        :key="indicador.id"
        flat
        bordered
        class="report-summary__card"
      >
        <q-card-section class="report-summary__section">
          <div class="report-summary__top">
            <div
              class="report-summary__icon"
              :class="`report-summary__icon--${obtenerClaseIcono(indicador.id)}`"
            >
              <q-icon :name="obtenerIcono(indicador.id)" size="21px" />
            </div>

            <div class="report-summary__label">
              {{ indicador.nombre }}
            </div>
          </div>

          <div class="report-summary__value">
            {{ formatearValor(indicador.valor, indicador.unidad) }}
          </div>

          <div
            v-if="indicador.tendencia !== undefined"
            class="report-summary__trend"
            :class="{
              'report-summary__trend--positive': indicador.tendencia > 0,
              'report-summary__trend--negative': indicador.tendencia < 0,
              'report-summary__trend--neutral': indicador.tendencia === 0,
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
              size="17px"
            />

            <span>
              {{ formatearTendencia(indicador.tendencia) }}
            </span>

            <span class="report-summary__trend-label"> vs. periodo anterior </span>
          </div>

          <div v-else-if="indicador.valorAnterior !== undefined" class="report-summary__previous">
            Anterior:
            {{ formatearValor(indicador.valorAnterior, indicador.unidad) }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IndicadorReporte } from '../types/report.types';

const props = defineProps<{
  indicadores: IndicadorReporte[];
}>();

const indicadoresVisibles = computed(() => {
  return props.indicadores.slice(0, 4);
});

const obtenerIcono = (id: string): string => {
  const iconos: Record<string, string> = {
    ingresos: 'trending_up',
    gastos: 'trending_down',
    balance: 'account_balance',
    margen: 'percent',
    total_citas: 'event',
    citas_completadas: 'event_available',
    citas_canceladas: 'event_busy',
    tasa_asistencia: 'how_to_reg',
    nuevos_clientes: 'person_add',
    clientes_atendidos: 'groups',
    clientes_recurrentes: 'repeat',
    retencion: 'loyalty',
    servicios_realizados: 'miscellaneous_services',
    ingresos_servicios: 'payments',
    ticket_promedio: 'receipt_long',
    servicios_activos: 'design_services',
    ventas: 'shopping_cart',
  };

  return iconos[id] ?? 'analytics';
};

const obtenerClaseIcono = (id: string): string => {
  if (
    id.includes('ingreso') ||
    id.includes('complet') ||
    id.includes('realizado') ||
    id.includes('activo')
  ) {
    return 'positive';
  }

  if (id.includes('gasto') || id.includes('cancel') || id.includes('pendiente')) {
    return 'negative';
  }

  if (id.includes('cliente') || id.includes('cita') || id.includes('servicio')) {
    return 'primary';
  }

  return 'neutral';
};

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const formatearNumero = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(valor);
};

const formatearValor = (valor: number, unidad: IndicadorReporte['unidad']): string => {
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
.report-summary {
  width: 100%;
  margin-bottom: 20px;
}

.report-summary__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.report-summary__card {
  min-width: 0;
  border-radius: 16px;
  border-color: #e5e7eb;
  background: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.report-summary__card:hover {
  transform: translateY(-2px);
  border-color: #dbe1e8;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
}

.report-summary__section {
  min-width: 0;
  padding: 18px;
}

.report-summary__top {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.report-summary__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 11px;
}

.report-summary__icon--positive {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.report-summary__icon--negative {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

.report-summary__icon--primary {
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.report-summary__icon--neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.report-summary__label {
  min-width: 0;
  overflow: hidden;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-summary__value {
  margin-top: 16px;
  color: #111827;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.report-summary__trend,
.report-summary__previous {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  line-height: 1.4;
}

.report-summary__trend--positive {
  color: #059669;
}

.report-summary__trend--negative {
  color: #dc2626;
}

.report-summary__trend--neutral {
  color: #6b7280;
}

.report-summary__trend-label {
  color: #9ca3af;
}

.report-summary__previous {
  color: #9ca3af;
}

@media (max-width: 1100px) {
  .report-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .report-summary {
    margin-bottom: 16px;
  }

  .report-summary__grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .report-summary__section {
    padding: 16px;
  }

  .report-summary__value {
    margin-top: 14px;
    font-size: 21px;
  }
}

@media (max-width: 380px) {
  .report-summary__section {
    padding: 14px;
  }

  .report-summary__icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .report-summary__value {
    font-size: 20px;
  }
}
</style>
