<template>
  <section class="integration-filters">
    <div class="integration-filters__heading">
      <q-icon name="filter_alt" size="20px" />

      <div>
        <div class="integration-filters__title">Filtros</div>

        <div class="integration-filters__subtitle">
          Filtra las integraciones por categoría o estado.
        </div>
      </div>
    </div>

    <div class="integration-filters__fields">
      <q-select
        :model-value="filtros.categoria"
        :options="categorias"
        clearable
        outlined
        dense
        emit-value
        map-options
        label="Categoría"
        @update:model-value="actualizarCategoria"
      />

      <q-select
        :model-value="filtros.estado"
        :options="opcionesEstado"
        clearable
        outlined
        dense
        emit-value
        map-options
        label="Estado"
        @update:model-value="actualizarEstado"
      />

      <q-btn
        v-if="hayFiltrosActivos"
        flat
        no-caps
        icon="filter_alt_off"
        label="Limpiar"
        color="grey-8"
        class="integration-filters__clear"
        @click="$emit('limpiar')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EstadoIntegracion, FiltrosIntegraciones } from '../types/integration.types';

defineProps<{
  filtros: FiltrosIntegraciones;
  categorias: Array<{
    label: string;
    value: string;
  }>;
  opcionesEstado: Array<{
    label: string;
    value: EstadoIntegracion;
  }>;
  hayFiltrosActivos: boolean;
}>();

const emit = defineEmits<{
  actualizar: [filtros: Partial<FiltrosIntegraciones>];
  limpiar: [];
}>();

const actualizarCategoria = (categoria: string | null): void => {
  emit('actualizar', { categoria });
};

const actualizarEstado = (estado: EstadoIntegracion | null): void => {
  emit('actualizar', { estado });
};
</script>

<style scoped>
.integration-filters {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.integration-filters__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 230px;
  color: #6b7280;
}

.integration-filters__title {
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.integration-filters__subtitle {
  margin-top: 2px;
  color: #9ca3af;
  font-size: 11px;
}

.integration-filters__fields {
  display: grid;
  grid-template-columns: minmax(180px, 220px) minmax(180px, 220px) auto;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.integration-filters__clear {
  min-height: 40px;
  border-radius: 9px;
}

@media (max-width: 900px) {
  .integration-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .integration-filters__heading {
    min-width: 0;
  }

  .integration-filters__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .integration-filters__clear {
    justify-self: start;
  }
}

@media (max-width: 600px) {
  .integration-filters {
    padding: 14px;
  }

  .integration-filters__fields {
    grid-template-columns: 1fr;
  }

  .integration-filters__clear {
    width: 100%;
  }
}
</style>
