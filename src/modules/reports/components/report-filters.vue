<template>
  <q-card flat bordered class="report-filters">
    <q-card-section class="report-filters__body">
      <div class="report-filters__heading">
        <div class="report-filters__title">
          <div class="report-filters__icon">
            <q-icon name="filter_alt" size="20px" />
          </div>

          <div>
            <div class="report-filters__title-text">Filtros</div>

            <div class="report-filters__subtitle">
              Personaliza la información que deseas consultar.
            </div>
          </div>
        </div>

        <q-btn
          v-if="hayFiltrosActivos"
          flat
          dense
          no-caps
          color="primary"
          icon="filter_alt_off"
          label="Limpiar filtros"
          class="report-filters__clear"
          @click="emit('limpiar')"
        />
      </div>

      <div class="report-filters__fields">
        <q-select
          :model-value="filtros.tipo"
          :options="opcionesTipo"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          clearable
          label="Tipo de reporte"
          class="report-filter"
          @update:model-value="actualizarTipo"
        />

        <q-select
          :model-value="filtros.periodo"
          :options="opcionesPeriodo"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          label="Periodo"
          class="report-filter"
          @update:model-value="actualizarPeriodo"
        />

        <q-input
          :model-value="filtros.fechaDesde"
          outlined
          dense
          type="date"
          label="Desde"
          class="report-filter"
          @update:model-value="actualizarFechaDesde"
        />

        <q-input
          :model-value="filtros.fechaHasta"
          outlined
          dense
          type="date"
          label="Hasta"
          class="report-filter"
          @update:model-value="actualizarFechaHasta"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { FiltrosReportes, PeriodoReporte, TipoReporte } from '../types/report.types';

interface Opcion<T> {
  label: string;
  value: T;
}

defineProps<{
  filtros: FiltrosReportes;
  hayFiltrosActivos: boolean;
}>();

const emit = defineEmits<{
  actualizar: [filtros: Partial<FiltrosReportes>];
  limpiar: [];
}>();

const opcionesTipo: Opcion<TipoReporte | null>[] = [
  {
    label: 'Todos',
    value: null,
  },
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

const opcionesPeriodo: Opcion<PeriodoReporte>[] = [
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

const actualizarTipo = (tipo: TipoReporte | null): void => {
  emit('actualizar', { tipo });
};

const actualizarPeriodo = (periodo: PeriodoReporte): void => {
  emit('actualizar', { periodo });
};

const actualizarFechaDesde = (fechaDesde: string | number | null): void => {
  emit('actualizar', {
    fechaDesde: typeof fechaDesde === 'string' ? fechaDesde : null,
  });
};

const actualizarFechaHasta = (fechaHasta: string | number | null): void => {
  emit('actualizar', {
    fechaHasta: typeof fechaHasta === 'string' ? fechaHasta : null,
  });
};
</script>

<style scoped>
.report-filters {
  width: 100%;
  margin-bottom: 20px;
  border-color: #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.report-filters__body {
  padding: 18px 20px 20px;
}

.report-filters__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.report-filters__title {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.report-filters__icon {
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

.report-filters__title-text {
  color: #374151;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.report-filters__subtitle {
  margin-top: 2px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.4;
}

.report-filters__clear {
  min-height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  flex-shrink: 0;
}

.report-filters__fields {
  display: grid;
  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(0, 1fr)
    minmax(0, 0.9fr)
    minmax(0, 0.9fr);
  gap: 12px;
}

.report-filter {
  min-width: 0;
}

.report-filter :deep(.q-field__control) {
  border-radius: 10px;
}

.report-filter :deep(.q-field__label) {
  color: #6b7280;
}

.report-filter :deep(.q-field--focused .q-field__label) {
  color: var(--q-primary);
}

@media (max-width: 1000px) {
  .report-filters__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .report-filters__body {
    padding: 16px;
  }

  .report-filters__heading {
    align-items: flex-start;
  }

  .report-filters__fields {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .report-filters__clear {
    padding: 0;
  }

  .report-filters__clear :deep(.q-btn__content) {
    gap: 5px;
  }
}

@media (max-width: 420px) {
  .report-filters {
    margin-bottom: 16px;
  }

  .report-filters__body {
    padding: 14px;
  }

  .report-filters__heading {
    display: block;
  }

  .report-filters__clear {
    margin-top: 10px;
  }

  .report-filters__subtitle {
    font-size: 11px;
  }
}
</style>
