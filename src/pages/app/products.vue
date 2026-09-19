<template>
  <q-page class="q-pa-md">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="row items-center q-gutter-sm">
          <q-icon name="inventory_2" size="30px" color="primary" />

          <div class="text-h5 text-weight-bold">Productos</div>
        </div>

        <div class="text-grey-7 q-mt-xs">
          Administra el catálogo, precios y existencias del negocio
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Nuevo producto"
        unelevated
        no-caps
        @click="abrirCrear"
      />
    </div>

    <!-- Indicadores -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="indicador-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Total productos</div>

                <div class="text-h5 text-weight-bold q-mt-xs">
                  {{ totalProductos }}
                </div>
              </div>

              <q-avatar color="primary" text-color="white" icon="inventory_2" size="42px" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="indicador-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Productos activos</div>

                <div class="text-h5 text-weight-bold text-positive q-mt-xs">
                  {{ productosActivos }}
                </div>
              </div>

              <q-avatar color="positive" text-color="white" icon="check_circle" size="42px" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="indicador-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Stock bajo</div>

                <div class="text-h5 text-weight-bold text-warning q-mt-xs">
                  {{ productosStockBajo }}
                </div>
              </div>

              <q-avatar color="warning" text-color="white" icon="warning" size="42px" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="indicador-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Agotados</div>

                <div class="text-h5 text-weight-bold text-negative q-mt-xs">
                  {{ productosAgotados }}
                </div>
              </div>

              <q-avatar
                color="negative"
                text-color="white"
                icon="remove_shopping_cart"
                size="42px"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Catálogo -->
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center q-mb-md">
          <div>
            <div class="text-subtitle1 text-weight-medium">Catálogo de productos</div>

            <div class="text-caption text-grey-7">
              Consulta y administra los productos registrados
            </div>
          </div>
        </div>

        <product-filters
          :filtros="filtros"
          :categorias="categorias"
          @actualizar="actualizarFiltros"
          @limpiar="limpiarFiltros"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <product-table
          :productos="productosFiltrados"
          :cargando="cargando"
          @editar="abrirEditar"
          @eliminar="confirmarEliminar"
          @cambiar-estado="cambiarEstado"
        />
      </q-card-section>
    </q-card>

    <!-- Formulario de producto -->
    <product-form
      :abierto="mostrarFormulario"
      :producto="productoSeleccionado"
      :categorias="categorias"
      :guardando="guardando"
      @actualizar:abierto="actualizarFormularioAbierto"
      @guardar="solicitarGuardarProducto"
    />

    <!-- Confirmación para guardar / actualizar -->
    <AppConfirmDialog
      v-model="mostrarConfirmacionGuardar"
      :titulo="modoEdicionPendiente ? 'Confirmar actualización' : 'Confirmar registro'"
      :mensaje="
        modoEdicionPendiente
          ? '¿Deseas guardar los cambios realizados en este producto?'
          : '¿Deseas guardar este nuevo producto?'
      "
      :texto-confirmar="modoEdicionPendiente ? 'Actualizar' : 'Guardar'"
      :loading="guardando"
      @confirm="confirmarGuardarProducto"
    />

    <!-- Confirmación para eliminar -->
    <AppConfirmDialog
      v-model="mostrarConfirmacionEliminar"
      titulo="Eliminar producto"
      mensaje="¿Estás seguro de que deseas eliminar este producto?"
      texto-confirmar="Eliminar"
      tipo="danger"
      :loading="guardando"
      @confirm="eliminarProducto"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import { useNotifications } from '../../composables/use-notifications';

import ProductFilters from '../../modules/products/components/product-filters.vue';
import ProductForm from '../../modules/products/components/product-form.vue';
import ProductTable from '../../modules/products/components/product-table.vue';

import { useProductos } from '../../modules/products/composables/use-products';

import type {
  ActualizarProducto,
  CrearProducto,
  FiltrosProducto,
  Producto,
} from '../../modules/products/types/product.types';

const {
  productosFiltrados,
  categorias,
  totalProductos,
  productosActivos,
  productosStockBajo,
  productosAgotados,
  cargando,
  guardando,
  filtros,
  cargarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto: eliminarProductoStore,
  cambiarEstadoProducto,
  actualizarFiltros: actualizarFiltrosStore,
  limpiarFiltros: limpiarFiltrosStore,
} = useProductos();

const { mostrarExito, mostrarError, mostrarInformacion } = useNotifications();

const mostrarFormulario = ref(false);

const mostrarConfirmacionGuardar = ref(false);
const mostrarConfirmacionEliminar = ref(false);

const productoSeleccionado = ref<Producto | null>(null);
const productoAEliminar = ref<string | null>(null);

const datosPendientes = ref<CrearProducto | ActualizarProducto | null>(null);

const modoEdicionPendiente = computed(() => {
  return datosPendientes.value !== null && 'id' in datosPendientes.value;
});

function abrirCrear(): void {
  productoSeleccionado.value = null;
  mostrarFormulario.value = true;
}

function abrirEditar(producto: Producto): void {
  productoSeleccionado.value = producto;
  mostrarFormulario.value = true;
}

function actualizarFormularioAbierto(valor: boolean): void {
  mostrarFormulario.value = valor;

  if (!valor) {
    productoSeleccionado.value = null;
  }
}

function actualizarFiltros(nuevosFiltros: Partial<FiltrosProducto>): void {
  actualizarFiltrosStore(nuevosFiltros);
}

function limpiarFiltros(): void {
  limpiarFiltrosStore();
}

/**
 * Recibe los datos desde el formulario
 * y solicita confirmación antes de guardar.
 */
function solicitarGuardarProducto(datos: CrearProducto | ActualizarProducto): void {
  datosPendientes.value = datos;
  mostrarConfirmacionGuardar.value = true;
}

/**
 * Ejecuta finalmente la creación o actualización
 * después de que el usuario confirme.
 */
function confirmarGuardarProducto(): void {
  if (!datosPendientes.value) {
    return;
  }

  const datos = datosPendientes.value;

  if ('id' in datos) {
    const resultado = actualizarProducto(datos);

    if (resultado) {
      mostrarConfirmacionGuardar.value = false;
      datosPendientes.value = null;

      actualizarFormularioAbierto(false);

      mostrarExito('El producto se actualizó correctamente.');
    } else {
      mostrarError('No fue posible actualizar el producto.');
    }

    return;
  }

  const resultado = crearProducto(datos);

  if (resultado) {
    mostrarConfirmacionGuardar.value = false;
    datosPendientes.value = null;

    actualizarFormularioAbierto(false);

    mostrarExito('El producto se creó correctamente.');
  } else {
    mostrarError('No fue posible crear el producto.');
  }
}

/**
 * Abre la confirmación de eliminación.
 */
function confirmarEliminar(producto: Producto): void {
  productoAEliminar.value = producto.id;
  mostrarConfirmacionEliminar.value = true;
}

/**
 * Elimina el producto después de confirmar.
 */
function eliminarProducto(): void {
  if (!productoAEliminar.value) {
    return;
  }

  const resultado = eliminarProductoStore(productoAEliminar.value);

  if (resultado) {
    mostrarConfirmacionEliminar.value = false;
    productoAEliminar.value = null;

    mostrarExito('El producto se eliminó correctamente.');
  } else {
    mostrarError('No fue posible eliminar el producto.');
  }
}

/**
 * Cambia el estado activo/inactivo del producto.
 */
function cambiarEstado(producto: Producto): void {
  const nuevoEstado = !producto.activo;

  const resultado = cambiarEstadoProducto(producto.id, nuevoEstado);

  if (resultado) {
    mostrarInformacion(nuevoEstado ? 'El producto fue activado.' : 'El producto fue desactivado.');
  } else {
    mostrarError('No fue posible cambiar el estado del producto.');
  }
}

onMounted(() => {
  cargarProductos();
});
</script>

<style scoped>
.indicador-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.indicador-card:hover {
  transform: translateY(-2px);
}
</style>
