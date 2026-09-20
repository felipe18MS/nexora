<template>
  <q-card flat bordered class="report-table">
    <q-card-section class="report-table__header">
      <div class="report-table__heading">
        <div class="report-table__icon">
          <q-icon name="table_chart" size="20px" />
        </div>

        <div class="report-table__titles">
          <div class="report-table__title">Detalle del reporte</div>

          <div class="report-table__subtitle">Consulta y administra los registros del periodo.</div>
        </div>
      </div>

      <div class="report-table__count">{{ props.filas.length }} registros</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="report-table__body">
      <q-table
        flat
        :rows="props.filas"
        :columns="columnas"
        row-key="id"
        :pagination="paginacion"
        :rows-per-page-options="[8, 16, 24]"
        class="report-table__qtable"
        no-data-label="No hay registros para mostrar."
        @update:pagination="actualizarPaginacion"
      >
        <template #body-cell-fecha="slotProps">
          <q-td :props="slotProps">
            <div class="report-table__date">
              <q-icon name="calendar_month" size="16px" />
              <span>{{ formatearFecha(slotProps.row.fecha) }}</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-concepto="slotProps">
          <q-td :props="slotProps">
            <div class="report-table__concept">
              <span class="report-table__concept-name">
                {{ slotProps.row.concepto }}
              </span>
            </div>
          </q-td>
        </template>

        <template #body-cell-categoria="slotProps">
          <q-td :props="slotProps">
            <span class="report-table__category">
              {{ slotProps.row.categoria }}
            </span>
          </q-td>
        </template>

        <template #body-cell-cantidad="slotProps">
          <q-td :props="slotProps">
            <span class="report-table__quantity">
              {{ formatearNumero(slotProps.row.cantidad) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-monto="slotProps">
          <q-td :props="slotProps">
            <span class="report-table__amount">
              {{ formatearMoneda(slotProps.row.monto) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-acciones="slotProps">
          <q-td :props="slotProps">
            <div class="report-table__actions">
              <q-btn
                flat
                round
                dense
                size="sm"
                icon="visibility"
                color="primary"
                aria-label="Ver reporte"
                @click="emit('ver', slotProps.row)"
              >
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="sm"
                icon="edit"
                color="grey-7"
                aria-label="Editar reporte"
                @click="emit('editar', slotProps.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="sm"
                icon="delete"
                color="negative"
                aria-label="Eliminar reporte"
                @click="emit('eliminar', slotProps.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template #no-data>
          <div class="report-table__empty">
            <div class="report-table__empty-icon">
              <q-icon name="description" size="28px" />
            </div>

            <div class="report-table__empty-title">Sin registros</div>

            <div class="report-table__empty-text">
              No hay información disponible para los filtros seleccionados.
            </div>
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { QTableColumn } from 'quasar';

import type { FilaReporte } from '../types/report.types';

const props = defineProps<{
  filas: FilaReporte[];
}>();

const emit = defineEmits<{
  ver: [fila: FilaReporte];
  editar: [fila: FilaReporte];
  eliminar: [fila: FilaReporte];
}>();

const paginacion = ref({
  page: 1,
  rowsPerPage: 8,
});

const columnas: QTableColumn<FilaReporte>[] = [
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
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
    name: 'cantidad',
    label: 'Cantidad',
    field: 'cantidad',
    align: 'right',
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
    name: 'acciones',
    label: 'Acciones',
    field: 'id',
    align: 'right',
  },
];

const actualizarPaginacion = (nuevaPaginacion: { page: number; rowsPerPage: number }): void => {
  paginacion.value = {
    ...paginacion.value,
    ...nuevaPaginacion,
  };
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${fecha}T00:00:00`));
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
</script>

<style scoped>
.report-table {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border-color: #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.report-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
}

.report-table__heading {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.report-table__icon {
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

.report-table__titles {
  min-width: 0;
}

.report-table__title {
  color: #374151;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.report-table__subtitle {
  margin-top: 2px;
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.4;
}

.report-table__count {
  flex-shrink: 0;
  padding: 5px 9px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  color: #6b7280;
  font-size: 10px;
  font-weight: 600;
}

.report-table__body {
  padding: 0;
}

.report-table__qtable {
  width: 100%;
}

.report-table__qtable :deep(.q-table__top),
.report-table__qtable :deep(.q-table__bottom) {
  padding: 12px 18px;
}

.report-table__qtable :deep(thead tr) {
  background: #f8fafc;
}

.report-table__qtable :deep(thead th) {
  height: 44px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.report-table__qtable :deep(tbody td) {
  height: 56px;
  border-color: #f1f5f9;
  color: #4b5563;
  font-size: 12px;
}

.report-table__qtable :deep(tbody tr) {
  transition: background-color 0.15s ease;
}

.report-table__qtable :deep(tbody tr:hover) {
  background: #f8fafc;
}

.report-table__date {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #6b7280;
  white-space: nowrap;
}

.report-table__date .q-icon {
  color: #9ca3af;
}

.report-table__concept {
  min-width: 150px;
  max-width: 260px;
}

.report-table__concept-name {
  display: block;
  overflow: hidden;
  color: #374151;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-table__category {
  display: inline-block;
  max-width: 150px;
  padding: 4px 8px;
  overflow: hidden;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 10px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-table__quantity {
  color: #4b5563;
  font-variant-numeric: tabular-nums;
}

.report-table__amount {
  color: #111827;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.report-table__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.report-table__actions :deep(.q-btn) {
  width: 30px;
  height: 30px;
}

.report-table__empty {
  display: flex;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;
  text-align: center;
}

.report-table__empty-icon {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #9ca3af;
}

.report-table__empty-title {
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
}

.report-table__empty-text {
  max-width: 320px;
  margin-top: 4px;
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.5;
}

@media (max-width: 700px) {
  .report-table__header {
    padding: 14px 16px;
  }

  .report-table__count {
    display: none;
  }

  .report-table__qtable {
    min-width: 700px;
  }

  .report-table__body {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .report-table__heading {
    gap: 9px;
  }

  .report-table__icon {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }

  .report-table__title {
    font-size: 13px;
  }

  .report-table__subtitle {
    font-size: 10px;
  }
}
</style>
