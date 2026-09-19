<template>
  <q-table
    flat
    :rows="productos"
    :columns="columnas"
    row-key="id"
    :loading="cargando"
    no-data-label="No hay productos disponibles"
    loading-label="Cargando productos..."
    rows-per-page-label="Productos por página"
    :rows-per-page-options="[10, 20, 50]"
  >
    <!-- Producto -->
    <template #body-cell-nombre="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar color="primary" text-color="white" icon="inventory_2" size="36px" />

          <div class="q-ml-sm">
            <div class="text-weight-medium">
              {{ props.row.nombre }}
            </div>

            <div
              v-if="props.row.descripcion"
              class="text-caption text-grey-6 ellipsis"
              style="max-width: 260px"
            >
              {{ props.row.descripcion }}
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <!-- Código -->
    <template #body-cell-codigo="props">
      <q-td :props="props">
        <q-badge outline color="grey-7" :label="props.row.codigo" />
      </q-td>
    </template>

    <!-- Categoría -->
    <template #body-cell-categoria="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-icon name="category" size="18px" color="grey-6" class="q-mr-xs" />

          {{ props.row.categoria }}
        </div>
      </q-td>
    </template>

    <!-- Precio -->
    <template #body-cell-precio="props">
      <q-td :props="props" class="text-weight-medium">
        {{ formatearMoneda(props.row.precio) }}
      </q-td>
    </template>

    <!-- Stock -->
    <template #body-cell-stock="props">
      <q-td :props="props">
        <q-badge
          :color="obtenerColorStock(props.row)"
          :label="`${props.row.stock} ${props.row.unidad}`"
        />
      </q-td>
    </template>

    <!-- Estado -->
    <template #body-cell-activo="props">
      <q-td :props="props">
        <q-chip
          dense
          :color="props.row.activo ? 'positive' : 'grey-5'"
          :text-color="props.row.activo ? 'white' : 'grey-9'"
          :icon="props.row.activo ? 'check_circle' : 'block'"
        >
          {{ props.row.activo ? 'Activo' : 'Inactivo' }}
        </q-chip>
      </q-td>
    </template>

    <!-- Acciones -->
    <template #body-cell-acciones="props">
      <q-td :props="props" class="text-center">
        <q-btn flat round dense icon="more_vert" color="grey-7">
          <q-menu>
            <q-list dense style="min-width: 170px">
              <q-item v-close-popup clickable @click="emitirEditar(props.row)">
                <q-item-section avatar>
                  <q-icon name="edit" color="primary" />
                </q-item-section>

                <q-item-section> Editar </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="emitirCambioEstado(props.row)">
                <q-item-section avatar>
                  <q-icon
                    :name="props.row.activo ? 'toggle_off' : 'toggle_on'"
                    :color="props.row.activo ? 'warning' : 'positive'"
                  />
                </q-item-section>

                <q-item-section>
                  {{ props.row.activo ? 'Desactivar' : 'Activar' }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item v-close-popup clickable @click="emitirEliminar(props.row)">
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>

                <q-item-section class="text-negative"> Eliminar </q-item-section>
              </q-item>
            </q-list>
          </q-menu>

          <q-tooltip> Acciones </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { Producto } from '../types/product.types';

interface Props {
  productos: Producto[];
  cargando: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  editar: [producto: Producto];
  eliminar: [producto: Producto];
  'cambiar-estado': [producto: Producto];
}>();

const columnas: QTableColumn<Producto>[] = [
  {
    name: 'nombre',
    label: 'Producto',
    field: 'nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo',
    label: 'Código',
    field: 'codigo',
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
    name: 'precio',
    label: 'Precio',
    field: 'precio',
    align: 'right',
    sortable: true,
  },
  {
    name: 'stock',
    label: 'Stock',
    field: 'stock',
    align: 'center',
    sortable: true,
  },
  {
    name: 'activo',
    label: 'Estado',
    field: 'activo',
    align: 'center',
  },
  {
    name: 'acciones',
    label: '',
    field: 'id',
    align: 'center',
  },
];

function emitirEditar(producto: Producto): void {
  emit('editar', producto);
}

function emitirEliminar(producto: Producto): void {
  emit('eliminar', producto);
}

function emitirCambioEstado(producto: Producto): void {
  emit('cambiar-estado', producto);
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function obtenerColorStock(producto: Producto): string {
  if (producto.stock === 0) {
    return 'negative';
  }

  if (producto.stock <= producto.stockMinimo) {
    return 'warning';
  }

  return 'positive';
}
</script>
