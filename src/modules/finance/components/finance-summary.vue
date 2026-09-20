<template>
  <div class="finance-summary">
    <div class="finance-summary__grid">
      <q-card
        v-for="item in tarjetas"
        :key="item.clave"
        flat
        bordered
        class="finance-summary__card"
      >
        <q-card-section>
          <div class="finance-summary__top">
            <div class="finance-summary__icon" :class="`finance-summary__icon--${item.clase}`">
              <q-icon :name="item.icono" size="22px" />
            </div>

            <span class="finance-summary__label">
              {{ item.etiqueta }}
            </span>
          </div>

          <div v-if="item.tipo === 'moneda'" class="finance-summary__value">
            {{ formatearMoneda(item.valor) }}
          </div>

          <div v-else class="finance-summary__value">
            {{ item.valor }}
          </div>

          <div class="finance-summary__description">
            {{ item.descripcion }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { ResumenFinanzas } from '../types/finance.types';

interface Props {
  resumen: ResumenFinanzas;
}

const props = defineProps<Props>();

type TipoTarjeta = 'moneda' | 'numero';

interface TarjetaResumen {
  clave: string;
  etiqueta: string;
  valor: number;
  icono: string;
  clase: string;
  descripcion: string;
  tipo: TipoTarjeta;
}

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const tarjetas = computed<TarjetaResumen[]>(() => [
  {
    clave: 'ingresos',
    etiqueta: 'Ingresos',
    valor: props.resumen.ingresos,
    icono: 'trending_up',
    clase: 'ingresos',
    descripcion: 'Total de ingresos registrados',
    tipo: 'moneda',
  },
  {
    clave: 'gastos',
    etiqueta: 'Gastos',
    valor: props.resumen.gastos,
    icono: 'trending_down',
    clase: 'gastos',
    descripcion: 'Total de gastos registrados',
    tipo: 'moneda',
  },
  {
    clave: 'balance',
    etiqueta: 'Balance',
    valor: props.resumen.balance,
    icono: 'account_balance',
    clase: 'balance',
    descripcion: 'Resultado de ingresos menos gastos',
    tipo: 'moneda',
  },
  {
    clave: 'movimientos',
    etiqueta: 'Movimientos',
    valor: props.resumen.movimientos,
    icono: 'receipt_long',
    clase: 'movimientos',
    descripcion: 'Movimientos registrados',
    tipo: 'numero',
  },
]);
</script>

<style scoped>
.finance-summary {
  width: 100%;
}

.finance-summary__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.finance-summary__card {
  border-radius: 16px;
  background: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.finance-summary__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
}

.finance-summary__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.finance-summary__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 12px;
}

.finance-summary__icon--ingresos {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.finance-summary__icon--gastos {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

.finance-summary__icon--balance {
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.finance-summary__icon--movimientos {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.finance-summary__label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.finance-summary__value {
  margin-top: 16px;
  color: var(--q-dark);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.finance-summary__description {
  margin-top: 7px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.4;
}

@media (max-width: 1100px) {
  .finance-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .finance-summary__grid {
    grid-template-columns: 1fr;
  }

  .finance-summary__value {
    font-size: 22px;
  }
}
</style>
