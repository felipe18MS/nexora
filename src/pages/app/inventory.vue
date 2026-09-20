<template>
  <q-page class="q-pa-md">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Inventario</div>

        <div class="text-body2 text-grey-7">
          Controla existencias, movimientos y niveles de stock.
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Registrar movimiento"
        @click="abrirMovimiento()"
      />
    </div>

    <!-- Indicadores -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Productos</div>

                <div class="text-h5 text-weight-bold">
                  {{ totalProductos }}
                </div>
              </div>

              <q-icon name="inventory_2" size="32px" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Unidades</div>

                <div class="text-h5 text-weight-bold">
                  {{ totalUnidades }}
                </div>
              </div>

              <q-icon name="all_inbox" size="32px" color="positive" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Stock bajo</div>

                <div class="text-h5 text-weight-bold">
                  {{ productosStockBajo }}
                </div>
              </div>

              <q-icon name="warning" size="32px" color="warning" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">Agotados</div>

                <div class="text-h5 text-weight-bold">
                  {{ productosAgotados }}
                </div>
              </div>

              <q-icon name="remove_shopping_cart" size="32px" color="negative" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Inventario -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-md">Existencias</div>

        <inventory-filters v-model="filtros" :ubicaciones="ubicaciones" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <inventory-table
          :inventarios="inventariosFiltrados"
          :cargando="cargando"
          :nombres-productos="nombresProductos"
          @registrar-movimiento="abrirMovimiento"
        />
      </q-card-section>
    </q-card>

    <!-- Movimientos -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">Historial de movimientos</div>

        <div class="text-caption text-grey-7">
          Registro de entradas, salidas y ajustes de inventario.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <inventory-movement-table
          :movimientos="movimientos"
          :cargando="cargando"
          :nombres-productos="nombresProductos"
        />
      </q-card-section>
    </q-card>

    <!-- Diálogo de movimiento -->
    <q-dialog v-model="mostrarDialogoMovimiento">
      <q-card style="width: 500px; max-width: 95vw">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Movimiento de inventario</div>

          <q-btn flat round dense icon="close" @click="cerrarMovimiento" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-select
            v-if="!inventarioSeleccionado"
            v-model="inventarioIdSeleccionado"
            outlined
            dense
            emit-value
            map-options
            label="Producto"
            class="q-mb-md"
            :options="
              inventarios.map((inventario) => ({
                label: obtenerNombreProducto(inventario.productoId),
                value: inventario.id,
              }))
            "
            @update:model-value="seleccionarInventario"
          />

          <inventory-movement-form
            v-if="inventarioSeleccionado"
            :inventario="inventarioSeleccionado"
            :nombre-producto="obtenerNombreProducto(inventarioSeleccionado.productoId)"
            @guardar="guardarMovimiento"
            @cancelar="cerrarMovimiento"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import InventoryFilters from '../../modules/inventory/components/inventory-filters.vue';
import InventoryMovementForm from '../../modules/inventory/components/inventory-movement-form.vue';
import InventoryMovementTable from '../../modules/inventory/components/inventory-movement-table.vue';
import InventoryTable from '../../modules/inventory/components/inventory-table.vue';
import { useInventory } from '../../modules/inventory/composables/use-inventory';
import type {
  CrearMovimientoInventario,
  EstadoInventario,
  FiltrosInventario,
  Inventario,
} from '../../modules/inventory/types/inventory.types';

const {
  inventarios,
  movimientos,
  cargando,
  totalProductos,
  totalUnidades,
  productosStockBajo,
  productosAgotados,
  cargarInventario,
  registrarMovimiento,
} = useInventory();

const filtros = reactive<FiltrosInventario>({
  busqueda: '',
  estado: null,
  ubicacion: null,
});

const mostrarDialogoMovimiento = ref(false);

const inventarioSeleccionado = ref<Inventario | null>(null);

const inventarioIdSeleccionado = ref<string | null>(null);
/*
 * Mientras trabajamos con mocks, mantenemos aquí
 * la relación entre los IDs de inventario y los productos.
 *
 * Posteriormente esta información vendrá directamente
 * del módulo/API de productos.
 */
const nombresProductos = computed<Record<string, string>>(() => ({
  'prod-001': 'Producto 1',
  'prod-002': 'Producto 2',
  'prod-003': 'Producto 3',
  'prod-004': 'Producto 4',
}));

const ubicaciones = computed(() => {
  return [...new Set(inventarios.value.map((inventario) => inventario.ubicacion))];
});

const obtenerEstado = (inventario: Inventario): EstadoInventario => {
  if (inventario.stock === 0) {
    return 'agotado';
  }

  if (inventario.stock <= inventario.stockMinimo) {
    return 'stock-bajo';
  }

  return 'disponible';
};

const inventariosFiltrados = computed(() => {
  const busqueda = filtros.busqueda.trim().toLowerCase();

  return inventarios.value.filter((inventario) => {
    const nombreProducto = obtenerNombreProducto(inventario.productoId).toLowerCase();

    const coincideBusqueda =
      !busqueda ||
      nombreProducto.includes(busqueda) ||
      inventario.productoId.toLowerCase().includes(busqueda);

    const coincideEstado = !filtros.estado || obtenerEstado(inventario) === filtros.estado;

    const coincideUbicacion = !filtros.ubicacion || inventario.ubicacion === filtros.ubicacion;

    return coincideBusqueda && coincideEstado && coincideUbicacion;
  });
});

const obtenerNombreProducto = (productoId: string): string => {
  return nombresProductos.value[productoId] ?? productoId;
};

const abrirMovimiento = (inventario?: Inventario): void => {
  inventarioSeleccionado.value = inventario ?? null;
  inventarioIdSeleccionado.value = inventario?.id ?? null;

  mostrarDialogoMovimiento.value = true;
};

const seleccionarInventario = (inventarioId: string | null): void => {
  inventarioIdSeleccionado.value = inventarioId;

  inventarioSeleccionado.value =
    inventarios.value.find((inventario) => inventario.id === inventarioId) ?? null;
};

const cerrarMovimiento = (): void => {
  mostrarDialogoMovimiento.value = false;
  inventarioSeleccionado.value = null;
  inventarioIdSeleccionado.value = null;
};

const guardarMovimiento = (datos: CrearMovimientoInventario): void => {
  const registrado = registrarMovimiento(datos);

  if (!registrado) {
    return;
  }

  cerrarMovimiento();
};

onMounted(() => {
  cargarInventario();
});
</script>
