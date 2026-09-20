<template>
  <q-form @submit.prevent="guardar">
    <div v-if="pedido" class="status-dialog">
      <div class="current-status">
        <div>
          <div class="text-caption text-grey-6">Estado actual</div>

          <div class="text-body2 text-weight-medium q-mt-xs">
            {{ obtenerTextoEstado(pedido.estado) }}
          </div>
        </div>

        <q-icon :name="obtenerIconoEstado(pedido.estado)" size="22px" color="primary" />
      </div>

      <div class="section-title">
        <span>Selecciona el nuevo estado</span>
      </div>

      <div class="status-grid">
        <button
          v-for="opcion in opcionesEstado"
          :key="opcion.value"
          type="button"
          class="status-option"
          :class="{ 'status-option--active': estado === opcion.value }"
          @click="estado = opcion.value"
        >
          <div class="status-option__icon" :class="`status-option__icon--${opcion.value}`">
            <q-icon :name="opcion.icon" size="19px" />
          </div>

          <span>{{ opcion.label }}</span>

          <q-icon
            v-if="estado === opcion.value"
            name="check"
            size="18px"
            class="status-option__check"
          />
        </button>
      </div>
    </div>

    <div class="dialog-actions">
      <q-btn flat label="Cancelar" color="grey-7" @click="cancelar" />

      <q-btn
        unelevated
        color="primary"
        icon="save"
        label="Actualizar estado"
        type="submit"
        :disable="!estado"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type { EstadoPedido, Pedido } from '../types/order.types';

interface Props {
  pedido: Pedido | null;
}

interface Emits {
  (event: 'guardar', estado: EstadoPedido): void;
  (event: 'cancelar'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const estado = ref<EstadoPedido | null>(props.pedido?.estado ?? null);

const opcionesEstado: Array<{
  label: string;
  value: EstadoPedido;
  icon: string;
}> = [
  {
    label: 'Pendiente',
    value: 'pendiente',
    icon: 'schedule',
  },
  {
    label: 'Confirmado',
    value: 'confirmado',
    icon: 'check_circle_outline',
  },
  {
    label: 'En preparación',
    value: 'en-preparacion',
    icon: 'inventory_2',
  },
  {
    label: 'Listo',
    value: 'listo',
    icon: 'task_alt',
  },
  {
    label: 'Entregado',
    value: 'entregado',
    icon: 'done_all',
  },
  {
    label: 'Cancelado',
    value: 'cancelado',
    icon: 'cancel',
  },
];

watch(
  () => props.pedido,
  (pedido) => {
    estado.value = pedido?.estado ?? null;
  },
);

const obtenerTextoEstado = (estadoPedido: EstadoPedido): string => {
  const textos: Record<EstadoPedido, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    'en-preparacion': 'En preparación',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  return textos[estadoPedido];
};

const obtenerIconoEstado = (estadoPedido: EstadoPedido): string => {
  const iconos: Record<EstadoPedido, string> = {
    pendiente: 'schedule',
    confirmado: 'check_circle_outline',
    'en-preparacion': 'inventory_2',
    listo: 'task_alt',
    entregado: 'done_all',
    cancelado: 'cancel',
  };

  return iconos[estadoPedido];
};

const guardar = (): void => {
  if (!estado.value) {
    return;
  }

  emit('guardar', estado.value);
};

const cancelar = (): void => {
  emit('cancelar');
};
</script>

<style scoped>
.status-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.status-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #374151;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
}

.status-option:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.status-option--active {
  border-color: var(--q-primary);
  background: #f5f9ff;
  box-shadow: 0 0 0 1px var(--q-primary);
}

.status-option__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  flex-shrink: 0;
}

.status-option__icon--pendiente {
  background: #fff7e6;
  color: #9a6700;
}

.status-option__icon--confirmado {
  background: #eef5ff;
  color: #2563eb;
}

.status-option__icon--en-preparacion {
  background: #f3f4f6;
  color: #4b5563;
}

.status-option__icon--listo,
.status-option__icon--entregado {
  background: #edf8f2;
  color: #16805c;
}

.status-option__icon--cancelado {
  background: #fff1f2;
  color: #c2414d;
}

.status-option__check {
  margin-left: auto;
  color: var(--q-primary);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

@media (max-width: 500px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
