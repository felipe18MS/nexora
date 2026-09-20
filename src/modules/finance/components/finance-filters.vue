<template>
  <div class="finance-filters">
    <div class="finance-filters__grid">
      <q-input
        v-model="formulario.busqueda"
        outlined
        dense
        clearable
        label="Buscar"
        placeholder="Concepto o referencia"
        class="finance-filters__search"
        @update:model-value="emitirFiltros"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        v-model="formulario.tipo"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Tipo"
        :options="opcionesTipo"
        @update:model-value="emitirFiltros"
      />

      <q-select
        v-model="formulario.categoria"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Categoría"
        :options="opcionesCategoria"
        @update:model-value="emitirFiltros"
      />

      <q-select
        v-model="formulario.metodoPago"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Método de pago"
        :options="opcionesMetodoPago"
        @update:model-value="emitirFiltros"
      />

      <q-select
        v-model="formulario.estado"
        outlined
        dense
        clearable
        emit-value
        map-options
        label="Estado"
        :options="opcionesEstado"
        @update:model-value="emitirFiltros"
      />

      <q-input
        v-model="formulario.fechaDesde"
        outlined
        dense
        clearable
        type="date"
        label="Desde"
        @update:model-value="emitirFiltros"
      />

      <q-input
        v-model="formulario.fechaHasta"
        outlined
        dense
        clearable
        type="date"
        label="Hasta"
        @update:model-value="emitirFiltros"
      />

      <div class="finance-filters__actions">
        <q-btn
          flat
          no-caps
          icon="filter_alt_off"
          label="Limpiar filtros"
          :disable="!hayFiltrosActivos"
          @click="limpiarFiltros"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

import type {
  EstadoMovimientoFinanciero,
  FiltrosFinanzas,
  MetodoPagoFinanciero,
  TipoMovimientoFinanciero,
} from '../types/finance.types';

interface Props {
  filtros: FiltrosFinanzas;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  actualizar: [filtros: Partial<FiltrosFinanzas>];
  limpiar: [];
}>();

interface Opcion<T extends string> {
  label: string;
  value: T;
}

interface FormularioFiltros {
  busqueda: string;
  tipo: TipoMovimientoFinanciero | null;
  categoria: string | null;
  metodoPago: MetodoPagoFinanciero | null;
  estado: EstadoMovimientoFinanciero | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

const formulario = reactive<FormularioFiltros>({
  busqueda: props.filtros.busqueda,
  tipo: props.filtros.tipo,
  categoria: props.filtros.categoria,
  metodoPago: props.filtros.metodoPago,
  estado: props.filtros.estado,
  fechaDesde: props.filtros.fechaDesde,
  fechaHasta: props.filtros.fechaHasta,
});

const opcionesTipo: Opcion<TipoMovimientoFinanciero>[] = [
  {
    label: 'Ingresos',
    value: 'ingreso',
  },
  {
    label: 'Gastos',
    value: 'gasto',
  },
];

const opcionesCategoria = computed(() => {
  if (formulario.tipo === 'ingreso') {
    return [
      {
        label: 'Venta',
        value: 'venta',
      },
      {
        label: 'Servicio',
        value: 'servicio',
      },
      {
        label: 'Cita',
        value: 'cita',
      },
      {
        label: 'Otro',
        value: 'otro',
      },
    ];
  }

  if (formulario.tipo === 'gasto') {
    return [
      {
        label: 'Insumos',
        value: 'insumos',
      },
      {
        label: 'Nómina',
        value: 'nomina',
      },
      {
        label: 'Servicios',
        value: 'servicios',
      },
      {
        label: 'Alquiler',
        value: 'alquiler',
      },
      {
        label: 'Marketing',
        value: 'marketing',
      },
      {
        label: 'Impuestos',
        value: 'impuestos',
      },
      {
        label: 'Otro',
        value: 'otro',
      },
    ];
  }

  return [
    {
      label: 'Venta',
      value: 'venta',
    },
    {
      label: 'Servicio',
      value: 'servicio',
    },
    {
      label: 'Cita',
      value: 'cita',
    },
    {
      label: 'Insumos',
      value: 'insumos',
    },
    {
      label: 'Nómina',
      value: 'nomina',
    },
    {
      label: 'Servicios',
      value: 'servicios',
    },
    {
      label: 'Alquiler',
      value: 'alquiler',
    },
    {
      label: 'Marketing',
      value: 'marketing',
    },
    {
      label: 'Impuestos',
      value: 'impuestos',
    },
    {
      label: 'Otro',
      value: 'otro',
    },
  ];
});

const opcionesMetodoPago: Opcion<MetodoPagoFinanciero>[] = [
  {
    label: 'Efectivo',
    value: 'efectivo',
  },
  {
    label: 'Tarjeta',
    value: 'tarjeta',
  },
  {
    label: 'Transferencia',
    value: 'transferencia',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const opcionesEstado: Opcion<EstadoMovimientoFinanciero>[] = [
  {
    label: 'Registrado',
    value: 'registrado',
  },
  {
    label: 'Anulado',
    value: 'anulado',
  },
];

const hayFiltrosActivos = computed(() => {
  return (
    formulario.busqueda !== '' ||
    formulario.tipo !== null ||
    formulario.categoria !== null ||
    formulario.metodoPago !== null ||
    formulario.estado !== null ||
    formulario.fechaDesde !== null ||
    formulario.fechaHasta !== null
  );
});

const emitirFiltros = (): void => {
  emit('actualizar', {
    busqueda: formulario.busqueda,
    tipo: formulario.tipo,
    categoria: formulario.categoria,
    metodoPago: formulario.metodoPago,
    estado: formulario.estado,
    fechaDesde: formulario.fechaDesde,
    fechaHasta: formulario.fechaHasta,
  });
};

const limpiarFiltros = (): void => {
  formulario.busqueda = '';
  formulario.tipo = null;
  formulario.categoria = null;
  formulario.metodoPago = null;
  formulario.estado = null;
  formulario.fechaDesde = null;
  formulario.fechaHasta = null;

  emit('limpiar');
};
</script>

<style scoped>
.finance-filters {
  width: 100%;
}

.finance-filters__grid {
  display: grid;
  grid-template-columns:
    minmax(220px, 1.6fr)
    repeat(4, minmax(140px, 1fr))
    repeat(2, minmax(130px, 0.9fr))
    auto;
  gap: 12px;
  align-items: center;
}

.finance-filters__search {
  min-width: 0;
}

.finance-filters__actions {
  display: flex;
  justify-content: flex-end;
  min-width: max-content;
}

@media (max-width: 1400px) {
  .finance-filters__grid {
    grid-template-columns:
      minmax(220px, 1.5fr)
      repeat(3, minmax(140px, 1fr));

    row-gap: 12px;
  }

  .finance-filters__search {
    grid-column: span 2;
  }

  .finance-filters__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .finance-filters__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .finance-filters__search {
    grid-column: span 2;
  }

  .finance-filters__actions {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .finance-filters__grid {
    grid-template-columns: 1fr;
  }

  .finance-filters__search,
  .finance-filters__actions {
    grid-column: auto;
  }
}
</style>
