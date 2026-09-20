<template>
  <q-dialog v-model="mostrar">
    <q-card class="finance-details">
      <q-card-section v-if="movimiento" class="finance-details__header">
        <div class="finance-details__header-content">
          <div
            class="finance-details__icon"
            :class="
              movimiento.tipo === 'ingreso'
                ? 'finance-details__icon--ingreso'
                : 'finance-details__icon--gasto'
            "
          >
            <q-icon
              :name="movimiento.tipo === 'ingreso' ? 'trending_up' : 'trending_down'"
              size="22px"
            />
          </div>

          <div class="finance-details__header-text">
            <div class="finance-details__title">Detalle del movimiento</div>

            <div class="finance-details__subtitle">
              {{ movimiento.concepto }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="movimiento" class="finance-details__body">
        <div class="finance-details__amount">
          <span class="finance-details__amount-label">
            {{ movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
          </span>

          <span
            class="finance-details__amount-value"
            :class="
              movimiento.tipo === 'ingreso'
                ? 'finance-details__amount-value--ingreso'
                : 'finance-details__amount-value--gasto'
            "
          >
            {{ movimiento.tipo === 'ingreso' ? '+' : '-' }}
            {{ formatearMoneda(movimiento.monto) }}
          </span>
        </div>

        <div class="finance-details__status">
          <span
            class="finance-details__status-pill"
            :class="
              movimiento.estado === 'registrado'
                ? 'finance-details__status-pill--registrado'
                : 'finance-details__status-pill--anulado'
            "
          >
            <q-icon
              :name="movimiento.estado === 'registrado' ? 'check_circle' : 'cancel'"
              size="16px"
            />

            {{
              movimiento.estado === 'registrado' ? 'Movimiento registrado' : 'Movimiento anulado'
            }}
          </span>
        </div>

        <div class="finance-details__grid">
          <div class="finance-details__item">
            <span class="finance-details__label"> Tipo </span>

            <span class="finance-details__value">
              {{ movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
            </span>
          </div>

          <div class="finance-details__item">
            <span class="finance-details__label"> Categoría </span>

            <span class="finance-details__value">
              {{ obtenerEtiquetaCategoria(movimiento.categoria) }}
            </span>
          </div>

          <div class="finance-details__item">
            <span class="finance-details__label"> Método de pago </span>

            <span class="finance-details__value">
              {{ obtenerEtiquetaMetodoPago(movimiento.metodoPago) }}
            </span>
          </div>

          <div class="finance-details__item">
            <span class="finance-details__label"> Fecha </span>

            <span class="finance-details__value">
              {{ formatearFecha(movimiento.fecha) }}
            </span>
          </div>

          <div v-if="movimiento.referencia" class="finance-details__item">
            <span class="finance-details__label"> Referencia </span>

            <span class="finance-details__value">
              {{ movimiento.referencia }}
            </span>
          </div>

          <div class="finance-details__item">
            <span class="finance-details__label"> Registrado </span>

            <span class="finance-details__value">
              {{ formatearFechaHora(movimiento.creadoEn) }}
            </span>
          </div>
        </div>

        <div class="finance-details__description">
          <span class="finance-details__label"> Descripción </span>

          <div class="finance-details__description-content">
            {{ movimiento.descripcion || 'Sin descripción registrada.' }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="finance-details__footer">
        <q-btn flat no-caps label="Cerrar" @click="cerrar" />

        <q-btn
          v-if="movimiento && movimiento.estado === 'registrado'"
          unelevated
          no-caps
          color="primary"
          icon="edit"
          label="Editar"
          @click="editar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { MovimientoFinanciero } from '../types/finance.types';

interface Props {
  modelValue: boolean;
  movimiento: MovimientoFinanciero | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [valor: boolean];
  editar: [movimiento: MovimientoFinanciero];
}>();

const mostrar = computed({
  get: () => props.modelValue,
  set: (valor: boolean) => {
    emit('update:modelValue', valor);
  },
});

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const editar = (): void => {
  if (!props.movimiento) {
    return;
  }

  emit('editar', props.movimiento);
  emit('update:modelValue', false);
};

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(`${fecha}T00:00:00`));
};

const formatearFechaHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerEtiquetaCategoria = (categoria: string): string => {
  const etiquetas: Record<string, string> = {
    venta: 'Venta',
    servicio: 'Servicio',
    cita: 'Cita',
    otro: 'Otro',
    insumos: 'Insumos',
    nomina: 'Nómina',
    servicios: 'Servicios',
    alquiler: 'Alquiler',
    marketing: 'Marketing',
    impuestos: 'Impuestos',
  };

  return etiquetas[categoria] ?? categoria;
};

const obtenerEtiquetaMetodoPago = (metodo: string): string => {
  const etiquetas: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    otro: 'Otro',
  };

  return etiquetas[metodo] ?? metodo;
};
</script>

<style scoped>
.finance-details {
  width: min(620px, calc(100vw - 32px));
  max-width: 620px;
  border-radius: 18px;
}

.finance-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.finance-details__header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.finance-details__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
}

.finance-details__icon--ingreso {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.finance-details__icon--gasto {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

.finance-details__header-text {
  min-width: 0;
}

.finance-details__title {
  color: var(--q-dark);
  font-size: 18px;
  font-weight: 700;
}

.finance-details__subtitle {
  margin-top: 3px;
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finance-details__body {
  max-height: 70vh;
  overflow-y: auto;
}

.finance-details__amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  background: #f8fafc;
}

.finance-details__amount-label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.finance-details__amount-value {
  font-size: 24px;
  font-weight: 700;
  white-space: nowrap;
}

.finance-details__amount-value--ingreso {
  color: #059669;
}

.finance-details__amount-value--gasto {
  color: #dc2626;
}

.finance-details__status {
  margin-top: 14px;
}

.finance-details__status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.finance-details__status-pill--registrado {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
}

.finance-details__status-pill--anulado {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.finance-details__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
  margin-top: 24px;
}

.finance-details__item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.finance-details__label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
}

.finance-details__value {
  color: var(--q-dark);
  font-size: 14px;
  font-weight: 500;
}

.finance-details__description {
  margin-top: 24px;
}

.finance-details__description-content {
  margin-top: 7px;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.finance-details__footer {
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
}

@media (max-width: 600px) {
  .finance-details {
    width: calc(100vw - 20px);
  }

  .finance-details__grid {
    grid-template-columns: 1fr;
  }

  .finance-details__amount {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .finance-details__amount-value {
    font-size: 22px;
  }
}
</style>
