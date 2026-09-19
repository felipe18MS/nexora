<template>
  <q-dialog :model-value="abierto" persistent @update:model-value="actualizarAbierto">
    <q-card class="producto-form-dialog" style="width: 760px; max-width: 95vw">
      <!-- Encabezado -->
      <q-card-section class="q-pb-sm">
        <div class="row items-center no-wrap">
          <q-avatar color="primary" text-color="white" icon="inventory_2" size="42px" />

          <div class="q-ml-md">
            <div class="text-h6 text-weight-bold">
              {{ modoEdicion ? 'Editar producto' : 'Nuevo producto' }}
            </div>

            <div class="text-caption text-grey-7">
              {{
                modoEdicion
                  ? 'Actualiza la información del producto'
                  : 'Registra un nuevo producto en el catálogo'
              }}
            </div>
          </div>

          <q-space />

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrar">
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Formulario -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="guardar">
          <!-- Información general -->
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            <q-icon name="info" color="primary" class="q-mr-xs" />

            Información general
          </div>

          <div class="row q-col-gutter-md">
            <!-- Nombre -->
            <div class="col-12 col-md-8">
              <q-input
                v-model="formulario.nombre"
                outlined
                label="Nombre del producto"
                placeholder="Ej. Shampoo Profesional"
                :rules="[(valor) => !!valor || 'El nombre es obligatorio']"
              />
            </div>

            <!-- Código -->
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.codigo"
                outlined
                label="Código"
                placeholder="Ej. PROD-001"
                :rules="[(valor) => !!valor || 'El código es obligatorio']"
              />
            </div>

            <!-- Categoría -->
            <div class="col-12 col-md-7">
              <q-select
                v-model="formulario.categoria"
                outlined
                label="Categoría"
                :options="categorias"
                use-input
                new-value-mode="add"
                clearable
                :rules="[(valor) => !!valor || 'La categoría es obligatoria']"
              >
                <template #prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
            </div>

            <!-- Unidad -->
            <div class="col-12 col-md-5">
              <q-select
                v-model="formulario.unidad"
                outlined
                label="Unidad de medida"
                :options="opcionesUnidad"
                emit-value
                map-options
              >
                <template #prepend>
                  <q-icon name="straighten" />
                </template>
              </q-select>
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="formulario.descripcion"
                outlined
                type="textarea"
                label="Descripción"
                placeholder="Describe brevemente el producto"
                autogrow
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Precio e inventario -->
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            <q-icon name="inventory" color="primary" class="q-mr-xs" />

            Precio e inventario
          </div>

          <div class="row q-col-gutter-md">
            <!-- Precio -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="formulario.precio"
                outlined
                type="number"
                min="0"
                label="Precio de venta"
                prefix="$"
                :rules="[(valor) => valor >= 0 || 'El precio no puede ser negativo']"
              />
            </div>

            <!-- Costo -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="formulario.costo"
                outlined
                type="number"
                min="0"
                label="Costo"
                prefix="$"
                :rules="[(valor) => valor >= 0 || 'El costo no puede ser negativo']"
              />
            </div>

            <!-- Stock -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="formulario.stock"
                outlined
                type="number"
                min="0"
                label="Stock actual"
                :rules="[(valor) => valor >= 0 || 'El stock no puede ser negativo']"
              />
            </div>

            <!-- Stock mínimo -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="formulario.stockMinimo"
                outlined
                type="number"
                min="0"
                label="Stock mínimo"
                :rules="[(valor) => valor >= 0 || 'El stock mínimo no puede ser negativo']"
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Estado -->
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle2">Estado del producto</div>

              <div class="text-caption text-grey-7">
                Define si el producto estará disponible en el sistema
              </div>
            </div>

            <q-toggle v-model="formulario.activo" color="positive" label="Producto activo" />
          </div>

          <!-- Acciones -->
          <q-card-actions align="right" class="q-mt-lg q-pa-none">
            <q-btn flat no-caps label="Cancelar" color="grey-7" @click="cerrar" />

            <q-btn
              color="primary"
              unelevated
              no-caps
              :icon="modoEdicion ? 'edit' : 'save'"
              :label="modoEdicion ? 'Actualizar producto' : 'Guardar producto'"
              type="submit"
              :loading="guardando"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { ActualizarProducto, CrearProducto, Producto } from '../types/product.types';

interface Props {
  abierto: boolean;
  producto: Producto | null;
  categorias: string[];
  guardando: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'actualizar:abierto': [valor: boolean];
  guardar: [datos: CrearProducto | ActualizarProducto];
}>();

const modoEdicion = computed(() => {
  return !!props.producto;
});

const opcionesUnidad = [
  {
    label: 'Unidad',
    value: 'Unidad',
  },
  {
    label: 'Paquete',
    value: 'Paquete',
  },
  {
    label: 'Caja',
    value: 'Caja',
  },
  {
    label: 'Docena',
    value: 'Docena',
  },
];

const formulario = reactive<CrearProducto>({
  nombre: '',
  descripcion: '',
  codigo: '',
  categoria: '',
  precio: 0,
  costo: 0,
  stock: 0,
  stockMinimo: 0,
  unidad: 'Unidad',
  activo: true,
});

watch(
  () => props.producto,
  (producto) => {
    if (producto) {
      formulario.nombre = producto.nombre;
      formulario.descripcion = producto.descripcion;
      formulario.codigo = producto.codigo;
      formulario.categoria = producto.categoria;
      formulario.precio = producto.precio;
      formulario.costo = producto.costo;
      formulario.stock = producto.stock;
      formulario.stockMinimo = producto.stockMinimo;
      formulario.unidad = producto.unidad;
      formulario.activo = producto.activo;

      return;
    }

    limpiarFormulario();
  },
  {
    immediate: true,
  },
);

function limpiarFormulario(): void {
  formulario.nombre = '';
  formulario.descripcion = '';
  formulario.codigo = '';
  formulario.categoria = '';
  formulario.precio = 0;
  formulario.costo = 0;
  formulario.stock = 0;
  formulario.stockMinimo = 0;
  formulario.unidad = 'Unidad';
  formulario.activo = true;
}

function actualizarAbierto(valor: boolean): void {
  emit('actualizar:abierto', valor);
}

function cerrar(): void {
  emit('actualizar:abierto', false);
}

function guardar(): void {
  if (props.producto) {
    const datos: ActualizarProducto = {
      ...formulario,
      id: props.producto.id,
    };

    emit('guardar', datos);

    return;
  }

  emit('guardar', {
    ...formulario,
  });
}
</script>

<style scoped>
.producto-form-dialog {
  border-radius: 12px;
}
</style>
