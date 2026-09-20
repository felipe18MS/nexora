<template>
  <div class="finance-table">
    <q-table
      flat
      :rows="movimientos"
      :columns="columnas"
      row-key="id"
      :loading="cargando"
      :pagination="paginacion"
      class="finance-table__table"
      no-data-label="No hay movimientos financieros"
      loading-label="Cargando movimientos..."
    >
      <template #body-cell-tipo="props">
        <q-td :props="props">
          <div class="finance-table__tipo">
            <q-icon
              :name="props.row.tipo === 'ingreso' ? 'arrow_upward' : 'arrow_downward'"
              size="18px"
              :class="props.row.tipo === 'ingreso' ? 'text-positive' : 'text-negative'"
            />

            <span>
              {{ props.row.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-concepto="props">
        <q-td :props="props">
          <div class="finance-table__concepto">
            <span class="finance-table__concepto-title">
              {{ props.row.concepto }}
            </span>

            <span v-if="props.row.referencia" class="finance-table__referencia">
              {{ props.row.referencia }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-categoria="props">
        <q-td :props="props">
          <span class="finance-table__categoria">
            {{ obtenerEtiquetaCategoria(props.row.categoria) }}
          </span>
        </q-td>
      </template>

      <template #body-cell-monto="props">
        <q-td :props="props">
          <span
            class="finance-table__monto"
            :class="
              props.row.tipo === 'ingreso'
                ? 'finance-table__monto--ingreso'
                : 'finance-table__monto--gasto'
            "
          >
            {{ props.row.tipo === 'ingreso' ? '+' : '-' }}
            {{ formatearMoneda(props.row.monto) }}
          </span>
        </q-td>
      </template>

      <template #body-cell-metodoPago="props">
        <q-td :props="props">
          {{ obtenerEtiquetaMetodoPago(props.row.metodoPago) }}
        </q-td>
      </template>

      <template #body-cell-fecha="props">
        <q-td :props="props">
          {{ formatearFecha(props.row.fecha) }}
        </q-td>
      </template>

      <template #body-cell-estado="props">
        <q-td :props="props">
          <span
            class="finance-table__estado"
            :class="
              props.row.estado === 'registrado'
                ? 'finance-table__estado--registrado'
                : 'finance-table__estado--anulado'
            "
          >
            <q-icon
              :name="props.row.estado === 'registrado' ? 'check_circle' : 'cancel'"
              size="15px"
            />

            {{ props.row.estado === 'registrado' ? 'Registrado' : 'Anulado' }}
          </span>
        </q-td>
      </template>

      <template #body-cell-acciones="props">
        <q-td :props="props" class="text-right">
          <div class="finance-table__actions">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="primary"
              aria-label="Ver movimiento"
              @click="emit('ver', props.row)"
            >
              <q-tooltip> Ver detalle </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              aria-label="Editar movimiento"
              :disable="props.row.estado === 'anulado'"
              @click="emit('editar', props.row)"
            >
              <q-tooltip> Editar </q-tooltip>
            </q-btn>

            <q-btn
              v-if="props.row.estado === 'registrado'"
              flat
              round
              dense
              icon="block"
              color="warning"
              aria-label="Anular movimiento"
              @click="emit('anular', props.row)"
            >
              <q-tooltip> Anular </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="negative"
              aria-label="Eliminar movimiento"
              @click="emit('eliminar', props.row)"
            >
              <q-tooltip> Eliminar </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #no-data>
        <div class="finance-table__empty">
          <q-icon name="account_balance_wallet" size="42px" />

          <div class="finance-table__empty-title">No hay movimientos</div>

          <div class="finance-table__empty-text">
            No existen movimientos que coincidan con los filtros seleccionados.
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { MovimientoFinanciero } from '../types/finance.types';

interface Props {
  movimientos: MovimientoFinanciero[];
  cargando?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  ver: [movimiento: MovimientoFinanciero];
  editar: [movimiento: MovimientoFinanciero];
  anular: [movimiento: MovimientoFinanciero];
  eliminar: [movimiento: MovimientoFinanciero];
}>();

const columnas: QTableColumn<MovimientoFinanciero>[] = [
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: 'concepto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    label: 'Categoría',
    field: 'categoria',
    align: 'left',
    sortable: true,
  },
  {
    name: 'monto',
    label: 'Monto',
    field: 'monto',
    align: 'right',
    sortable: true,
  },
  {
    name: 'metodoPago',
    label: 'Método de pago',
    field: 'metodoPago',
    align: 'left',
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'left',
  },
  {
    name: 'acciones',
    label: '',
    field: 'id',
    align: 'right',
  },
];

const paginacion = {
  rowsPerPage: 10,
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
.finance-table {
  width: 100%;
  overflow: hidden;
}

.finance-table__table {
  border-radius: 14px;
}

.finance-table__tipo {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}

.finance-table__concepto {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 180px;
}

.finance-table__concepto-title {
  color: var(--q-dark);
  font-weight: 600;
}

.finance-table__referencia {
  color: #9ca3af;
  font-size: 11px;
}

.finance-table__categoria {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 7px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 12px;
  font-weight: 500;
}

.finance-table__monto {
  font-weight: 700;
  white-space: nowrap;
}

.finance-table__monto--ingreso {
  color: #059669;
}

.finance-table__monto--gasto {
  color: #dc2626;
}

.finance-table__estado {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.finance-table__estado--registrado {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
}

.finance-table__estado--anulado {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.finance-table__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.finance-table__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #9ca3af;
  text-align: center;
}

.finance-table__empty-title {
  margin-top: 12px;
  color: #4b5563;
  font-size: 15px;
  font-weight: 600;
}

.finance-table__empty-text {
  max-width: 360px;
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .finance-table {
    overflow-x: auto;
  }

  .finance-table__table {
    min-width: 900px;
  }
}
</style>
