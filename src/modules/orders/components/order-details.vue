<template>
  <div v-if="pedido" class="order-details">
    <!-- Encabezado -->
    <div class="order-summary">
      <div>
        <div class="text-subtitle1 text-weight-bold">
          {{ pedido.clienteNombre }}
        </div>

        <div class="text-caption text-grey-6">
          Pedido {{ pedido.id }} · {{ formatearFecha(pedido.creadoEn) }}
        </div>
      </div>

      <div class="status-badge" :class="`status-badge--${pedido.estado}`">
        <q-icon :name="obtenerIconoEstado(pedido.estado)" size="16px" />

        <span>
          {{ obtenerTextoEstado(pedido.estado) }}
        </span>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Items -->
    <div class="section-title">
      <q-icon name="shopping_bag" size="19px" />
      <span>Productos y servicios</span>
    </div>

    <div class="items-list">
      <div v-for="item in pedido.items" :key="item.id" class="order-item">
        <div class="order-item__info">
          <div class="order-item__name">
            {{ item.nombre }}
          </div>

          <div class="order-item__meta">
            {{ item.cantidad }} ×
            {{ formatearMoneda(item.precioUnitario) }}
          </div>
        </div>

        <div class="order-item__total">
          {{ formatearMoneda(item.subtotal) }}
        </div>
      </div>
    </div>

    <!-- Totales -->
    <div class="totals">
      <div class="totals__row">
        <span>Subtotal</span>
        <span>{{ formatearMoneda(pedido.subtotal) }}</span>
      </div>

      <div class="totals__row totals__row--discount">
        <span>Descuento</span>
        <span>-{{ formatearMoneda(pedido.descuento) }}</span>
      </div>

      <q-separator class="q-my-sm" />

      <div class="totals__row totals__row--total">
        <span>Total</span>
        <span>{{ formatearMoneda(pedido.total) }}</span>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="additional-info">
      <div class="info-card">
        <div class="info-card__icon">
          <q-icon name="payments" size="19px" />
        </div>

        <div>
          <div class="text-caption text-grey-6">Método de pago</div>

          <div class="text-body2 text-weight-medium">
            {{ obtenerTextoMetodoPago(pedido.metodoPago) }}
          </div>
        </div>
      </div>

      <div v-if="pedido.notas" class="info-card info-card--notes">
        <div class="info-card__icon">
          <q-icon name="notes" size="19px" />
        </div>

        <div>
          <div class="text-caption text-grey-6">Notas</div>

          <div class="text-body2">
            {{ pedido.notas }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EstadoPedido, MetodoPago, Pedido } from '../types/order.types';

interface Props {
  pedido: Pedido | null;
}

defineProps<Props>();

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
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerTextoEstado = (estado: EstadoPedido): string => {
  const textos: Record<EstadoPedido, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    'en-preparacion': 'En preparación',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  return textos[estado];
};

const obtenerIconoEstado = (estado: EstadoPedido): string => {
  const iconos: Record<EstadoPedido, string> = {
    pendiente: 'schedule',
    confirmado: 'check_circle_outline',
    'en-preparacion': 'inventory_2',
    listo: 'task_alt',
    entregado: 'done_all',
    cancelado: 'cancel',
  };

  return iconos[estado];
};

const obtenerTextoMetodoPago = (metodo: MetodoPago): string => {
  const textos: Record<MetodoPago, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    otro: 'Otro',
  };

  return textos[metodo];
};
</script>

<style scoped>
.order-details {
  width: 100%;
}

.order-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge--pendiente {
  background: #fff7e6;
  color: #9a6700;
}

.status-badge--confirmado {
  background: #eef5ff;
  color: #2563eb;
}

.status-badge--en-preparacion {
  background: #f3f4f6;
  color: #4b5563;
}

.status-badge--listo {
  background: #eefbf5;
  color: #16805c;
}

.status-badge--entregado {
  background: #edf8f2;
  color: #16704d;
}

.status-badge--cancelado {
  background: #fff1f2;
  color: #c2414d;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.section-title .q-icon {
  color: var(--q-primary);
}

.items-list {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
}

.order-item + .order-item {
  border-top: 1px solid #eef0f2;
}

.order-item__name {
  font-size: 14px;
  font-weight: 500;
}

.order-item__meta {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
}

.order-item__total {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.totals {
  max-width: 360px;
  margin: 20px 0 0 auto;
}

.totals__row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 7px;
  font-size: 14px;
  color: #4b5563;
}

.totals__row--discount {
  color: #9ca3af;
}

.totals__row--total {
  margin-top: 8px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.info-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f3f6fb;
  color: var(--q-primary);
}

@media (max-width: 600px) {
  .order-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .additional-info {
    grid-template-columns: 1fr;
  }

  .totals {
    max-width: none;
  }
}
</style>
