<template>
  <q-card flat bordered class="user-filters">
    <q-card-section class="user-filters__content">
      <div class="user-filters__title">
        <q-icon name="filter_alt" size="20px" />
        <span>Filtros</span>
      </div>

      <div class="user-filters__grid">
        <q-input
          :model-value="filtros.busqueda"
          outlined
          dense
          clearable
          label="Buscar usuario"
          placeholder="Nombre, correo, teléfono..."
          class="user-filters__search"
          @update:model-value="actualizarBusqueda"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          :model-value="filtros.rol"
          :options="roles"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Rol"
          class="user-filters__select"
          @update:model-value="actualizarRol"
        />

        <q-select
          :model-value="filtros.estado"
          :options="estados"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Estado"
          class="user-filters__select"
          @update:model-value="actualizarEstado"
        />

        <q-btn
          v-if="hayFiltrosActivos"
          flat
          no-caps
          color="grey-7"
          icon="filter_alt_off"
          label="Limpiar"
          class="user-filters__clear"
          @click="$emit('limpiar')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { EstadoUsuario, FiltrosUsuarios, RolUsuario } from '../types/user.types';

interface OpcionRol {
  label: string;
  value: RolUsuario;
}

interface OpcionEstado {
  label: string;
  value: EstadoUsuario;
}

defineProps<{
  filtros: FiltrosUsuarios;
  roles: OpcionRol[];
  estados: OpcionEstado[];
  hayFiltrosActivos: boolean;
}>();

const emit = defineEmits<{
  actualizar: [filtros: Partial<FiltrosUsuarios>];
  limpiar: [];
}>();

const actualizarBusqueda = (valor: string | number | null): void => {
  emit('actualizar', {
    busqueda: String(valor ?? ''),
  });
};

const actualizarRol = (valor: RolUsuario | null): void => {
  emit('actualizar', {
    rol: valor,
  });
};

const actualizarEstado = (valor: EstadoUsuario | null): void => {
  emit('actualizar', {
    estado: valor,
  });
};
</script>

<style scoped>
.user-filters {
  border-radius: 16px;
  background: #ffffff;
}

.user-filters__content {
  padding: 20px;
}

.user-filters__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.user-filters__grid {
  display: grid;
  grid-template-columns: minmax(240px, 2fr) minmax(180px, 1fr) minmax(180px, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.user-filters__search,
.user-filters__select {
  min-width: 0;
}

.user-filters__clear {
  white-space: nowrap;
}

@media (max-width: 900px) {
  .user-filters__grid {
    grid-template-columns: 1fr 1fr;
  }

  .user-filters__search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .user-filters__content {
    padding: 16px;
  }

  .user-filters__grid {
    grid-template-columns: 1fr;
  }

  .user-filters__search {
    grid-column: auto;
  }

  .user-filters__clear {
    justify-self: start;
  }
}
</style>
