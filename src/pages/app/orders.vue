<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Pedidos</div>
        <div class="text-grey-7">Gestiona pedidos, estados, pagos y productos vendidos.</div>
      </div>

      <q-btn unelevated color="primary" icon="add" label="Nuevo pedido" @click="abrirNuevoPedido" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Total pedidos</div>
            <div class="text-h5 text-weight-bold">
              {{ totalPedidos }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Pendientes</div>
            <div class="text-h5 text-weight-bold text-orange">
              {{ pendientes }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">En proceso</div>
            <div class="text-h5 text-weight-bold text-blue">
              {{ enProceso }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Entregados</div>
            <div class="text-h5 text-weight-bold text-positive">
              {{ entregados }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Cancelados</div>
            <div class="text-h5 text-weight-bold text-negative">
              {{ cancelados }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Ingresos</div>
            <div class="text-subtitle1 text-weight-bold">
              {{ formatearMoneda(ingresos) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <OrderFilters
          :model-value="filtros"
          @update:model-value="actualizarFiltros"
          @limpiar="limpiarFiltros"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <OrderTable
          :pedidos="pedidosFiltrados"
          :cargando="cargando"
          @ver="verPedido"
          @cambiar-estado="abrirCambioEstado"
        />
      </q-card-section>
    </q-card>

    <!-- Detalles -->
    <!-- Detalles -->
    <q-dialog v-model="mostrarDetalles">
      <q-card class="modal-card modal-card--details">
        <q-card-section class="modal-header">
          <div class="row items-center no-wrap">
            <div class="modal-icon">
              <q-icon name="shopping_bag" size="22px" />
            </div>

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Detalle del pedido</div>

              <div class="text-caption text-grey-6">Información completa de la compra</div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="mostrarDetalles = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <OrderDetails v-if="pedidoSeleccionado" :pedido="pedidoSeleccionado" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat color="grey-7" label="Cerrar" @click="mostrarDetalles = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Cambiar estado -->
    <!-- Cambiar estado -->
    <q-dialog v-model="mostrarEstado">
      <q-card class="modal-card modal-card--status">
        <q-card-section class="modal-header">
          <div class="row items-center no-wrap">
            <div class="modal-icon">
              <q-icon name="sync" size="22px" />
            </div>

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Actualizar estado</div>

              <div class="text-caption text-grey-6">Cambia el estado actual del pedido</div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="mostrarEstado = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <OrderStatusDialog
            v-if="pedidoSeleccionado"
            :pedido="pedidoSeleccionado"
            @guardar="guardarEstado"
            @cancelar="mostrarEstado = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Nuevo pedido -->
    <!-- Nuevo pedido -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card class="modal-card modal-card--order-form">
        <q-card-section class="modal-header">
          <div class="row items-center no-wrap">
            <div class="modal-icon">
              <q-icon name="add_shopping_cart" size="22px" />
            </div>

            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Nuevo pedido</div>

              <div class="text-caption text-grey-6">
                Registra los productos o servicios solicitados
              </div>
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrarFormulario" />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <OrderForm
            :clientes="opcionesClientes"
            :opciones-items="opcionesItems"
            @guardar="guardarPedido"
            @cancelar="cerrarFormulario"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import {
  OrderDetails,
  OrderFilters,
  OrderForm,
  OrderStatusDialog,
  OrderTable,
  useOrders,
} from '../../modules/orders';

import type { CrearPedido, FiltrosPedido, Pedido } from '../../modules/orders';

const {
  pedidos,
  cargando,
  totalPedidos,
  pendientes,
  enProceso,
  entregados,
  cancelados,
  ingresos,
  cargarPedidos,
  crearPedido,
  actualizarEstado,
} = useOrders();

const filtros = ref<FiltrosPedido>({
  busqueda: '',
  estado: null,
  metodoPago: null,
});

const pedidoSeleccionado = ref<Pedido | null>(null);

const mostrarDetalles = ref(false);
const mostrarEstado = ref(false);
const mostrarFormulario = ref(false);

const opcionesClientes = [
  {
    label: 'María González',
    value: 'cli-001',
  },
  {
    label: 'Carlos Rodríguez',
    value: 'cli-002',
  },
  {
    label: 'Laura Martínez',
    value: 'cli-003',
  },
  {
    label: 'Andrés Pérez',
    value: 'cli-004',
  },
  {
    label: 'Sofía Ramírez',
    value: 'cli-005',
  },
];

const opcionesItems = [
  {
    label: 'Producto 1',
    value: 'prod-001',
    precio: 25000,
  },
  {
    label: 'Producto 2',
    value: 'prod-002',
    precio: 35000,
  },
  {
    label: 'Producto 3',
    value: 'prod-003',
    precio: 18000,
  },
  {
    label: 'Producto 4',
    value: 'prod-004',
    precio: 65000,
  },
  {
    label: 'Servicio 1',
    value: 'serv-001',
    precio: 45000,
  },
];

const pedidosFiltrados = computed(() => {
  const busqueda = filtros.value.busqueda.trim().toLowerCase();

  return pedidos.value.filter((pedido) => {
    const coincideBusqueda =
      !busqueda ||
      pedido.id.toLowerCase().includes(busqueda) ||
      pedido.clienteNombre.toLowerCase().includes(busqueda);

    const coincideEstado = !filtros.value.estado || pedido.estado === filtros.value.estado;

    const coincideMetodoPago =
      !filtros.value.metodoPago || pedido.metodoPago === filtros.value.metodoPago;

    return coincideBusqueda && coincideEstado && coincideMetodoPago;
  });
});

const actualizarFiltros = (nuevosFiltros: FiltrosPedido): void => {
  filtros.value = nuevosFiltros;
};

const limpiarFiltros = (): void => {
  filtros.value = {
    busqueda: '',
    estado: null,
    metodoPago: null,
  };
};

const verPedido = (pedido: Pedido): void => {
  pedidoSeleccionado.value = pedido;
  mostrarDetalles.value = true;
};

const abrirCambioEstado = (pedido: Pedido): void => {
  pedidoSeleccionado.value = pedido;
  mostrarEstado.value = true;
};

const guardarEstado = (estado: Pedido['estado']): void => {
  if (!pedidoSeleccionado.value) {
    return;
  }

  const actualizado = actualizarEstado({
    id: pedidoSeleccionado.value.id,
    estado,
  });

  if (!actualizado) {
    Notify.create({
      type: 'negative',
      message: 'No fue posible actualizar el estado del pedido.',
    });

    return;
  }

  pedidoSeleccionado.value =
    pedidos.value.find((pedido) => pedido.id === pedidoSeleccionado.value?.id) ?? null;

  mostrarEstado.value = false;

  Notify.create({
    type: 'positive',
    message: 'Estado del pedido actualizado.',
  });
};

const abrirNuevoPedido = (): void => {
  mostrarFormulario.value = true;
};

const cerrarFormulario = (): void => {
  mostrarFormulario.value = false;
};

const guardarPedido = (datos: CrearPedido): void => {
  crearPedido(datos);

  mostrarFormulario.value = false;

  Notify.create({
    type: 'positive',
    message: 'Pedido creado correctamente.',
  });
};

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
};

onMounted(() => {
  cargarPedidos();
});
</script>
<style scoped>
.modal-card {
  width: 100%;
  max-width: 95vw;
  border-radius: 16px;
  overflow: hidden;
}

.modal-card--details {
  max-width: 760px;
}

.modal-card--status {
  max-width: 560px;
}

.modal-card--order-form {
  max-width: 900px;
}

.modal-header {
  min-height: 76px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--q-primary);
  background: rgba(25, 118, 210, 0.1);
}

.modal-body {
  padding: 24px;
  max-height: 72vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 14px 22px;
  background: #fafafa;
}

@media (max-width: 600px) {
  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 16px;
    max-height: 76vh;
  }

  .modal-footer {
    padding: 12px 16px;
  }
}
</style>
