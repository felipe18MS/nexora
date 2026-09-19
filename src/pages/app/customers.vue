<template>
  <q-page class="customers-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Clientes</div>

        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Gestiona tus clientes y su información.
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Nuevo cliente"
        no-caps
        @click="manejarCrear"
      />
    </div>

    <!-- Estadísticas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="stat-card__title">Total clientes</div>

                <div class="stat-card__value">
                  {{ cantidadClientes }}
                </div>

                <div class="stat-card__description">Clientes registrados</div>
              </div>

              <div class="stat-card__icon stat-card__icon--blue">
                <q-icon name="people" size="22px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="stat-card__title">Clientes activos</div>

                <div class="stat-card__value">
                  {{ clientesActivos.length }}
                </div>

                <div class="stat-card__description">Clientes con estado activo</div>
              </div>

              <div class="stat-card__icon stat-card__icon--green">
                <q-icon name="person_check" size="22px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="stat-card__title">Inactivos</div>

                <div class="stat-card__value">
                  {{ cantidadClientes - clientesActivos.length }}
                </div>

                <div class="stat-card__description">Clientes actualmente inactivos</div>
              </div>

              <div class="stat-card__icon stat-card__icon--orange">
                <q-icon name="person_off" size="22px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Clientes -->
    <q-card flat bordered class="customers-card">
      <q-card-section class="toolbar-section">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="busqueda"
              outlined
              dense
              clearable
              placeholder="Buscar por nombre, teléfono o correo..."
              aria-label="Buscar clientes"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="estadoSeleccionado"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Estado"
              :options="opcionesEstado"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3 flex justify-end">
            <q-btn
              flat
              color="primary"
              icon="filter_alt_off"
              label="Limpiar"
              no-caps
              :disable="!hayFiltros"
              @click="limpiarFiltros"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <CustomerTable
        :customers="clientesFiltrados"
        :loading="loading"
        @ver="manejarVer"
        @editar="manejarEditar"
        @eliminar="manejarEliminar"
      />

      <div v-if="!loading && clientesFiltrados.length === 0" class="empty-state">
        <q-icon name="people_outline" size="56px" color="grey-5" />

        <div class="empty-state__title">No encontramos clientes</div>

        <div class="empty-state__description">
          {{
            hayFiltros
              ? 'Prueba modificando los filtros de búsqueda.'
              : 'Todavía no tienes clientes registrados.'
          }}
        </div>

        <q-btn
          v-if="!hayFiltros"
          unelevated
          color="primary"
          icon="add"
          label="Crear primer cliente"
          no-caps
          class="q-mt-md"
          @click="manejarCrear"
        />
      </div>
    </q-card>

    <!-- Formulario -->
    <CustomerForm
      v-model="mostrarFormulario"
      :customer="selectedCustomer"
      @saved="manejarFormularioGuardado"
    />

    <!-- Confirmación eliminar -->
    <AppConfirmDialog
      v-model="mostrarConfirmacionEliminar"
      titulo="Eliminar cliente"
      :mensaje="
        clientePendienteEliminar
          ? `¿Deseas eliminar a ${clientePendienteEliminar.firstName} ${clientePendienteEliminar.lastName}? Esta acción no se puede deshacer.`
          : ''
      "
      texto-confirmar="Eliminar"
      tipo="danger"
      @confirm="confirmarEliminacion"
    />

    <!-- Detalles -->
    <q-dialog v-model="mostrarDetalles">
      <q-card v-if="clienteSeleccionado" class="customer-details">
        <q-card-section class="customer-details__header">
          <div class="customer-details__identity">
            <q-avatar
              size="64px"
              color="primary"
              text-color="white"
              class="customer-details__avatar"
            >
              {{ obtenerIniciales(clienteSeleccionado.firstName, clienteSeleccionado.lastName) }}
            </q-avatar>

            <div class="customer-details__identity-info">
              <div class="customer-details__name">
                {{ clienteSeleccionado.firstName }}
                {{ clienteSeleccionado.lastName }}
              </div>

              <div class="customer-details__meta">Cliente registrado</div>

              <q-badge
                class="q-mt-sm"
                :color="clienteSeleccionado.isActive ? 'positive' : 'grey-6'"
                :label="clienteSeleccionado.isActive ? 'Activo' : 'Inactivo'"
              />
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            aria-label="Cerrar"
            class="customer-details__close"
            @click="mostrarDetalles = false"
          >
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-card-section class="customer-details__body">
          <!-- Contacto -->
          <div class="details-section">
            <div class="details-section__title">
              <q-icon name="contact_page" />
              Información de contacto
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-item__icon">
                  <q-icon name="phone" />
                </div>

                <div class="detail-item__content">
                  <div class="detail-item__label">Teléfono</div>

                  <div class="detail-item__value">
                    {{ clienteSeleccionado.phone }}
                  </div>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-item__icon">
                  <q-icon name="email" />
                </div>

                <div class="detail-item__content">
                  <div class="detail-item__label">Correo electrónico</div>

                  <div class="detail-item__value">
                    {{ clienteSeleccionado.email || 'No registrado' }}
                  </div>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-item__icon">
                  <q-icon name="badge" />
                </div>

                <div class="detail-item__content">
                  <div class="detail-item__label">Documento</div>

                  <div class="detail-item__value">
                    {{ clienteSeleccionado.documentNumber || 'No registrado' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Ubicación -->
          <div class="details-section">
            <div class="details-section__title">
              <q-icon name="location_on" />
              Ubicación
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-item__icon">
                  <q-icon name="location_city" />
                </div>

                <div class="detail-item__content">
                  <div class="detail-item__label">Ciudad</div>

                  <div class="detail-item__value">
                    {{ clienteSeleccionado.city || 'No registrada' }}
                  </div>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-item__icon">
                  <q-icon name="home" />
                </div>

                <div class="detail-item__content">
                  <div class="detail-item__label">Dirección</div>

                  <div class="detail-item__value">
                    {{ clienteSeleccionado.address || 'No registrada' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Notas -->
          <div class="details-section">
            <div class="details-section__title">
              <q-icon name="notes" />
              Notas
            </div>

            <div class="customer-details__notes">
              {{ clienteSeleccionado.notes || 'No hay notas registradas para este cliente.' }}
            </div>
          </div>

          <div class="customer-details__registered">
            <q-icon name="schedule" size="16px" />

            Cliente registrado el
            {{ formatearFecha(clienteSeleccionado.createdAt) }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="customer-details__footer">
          <q-btn flat no-caps color="grey-7" label="Cerrar" @click="mostrarDetalles = false" />

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Editar cliente"
            @click="manejarEditarDesdeDetalles"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import AppConfirmDialog from '@/components/common/app-confirm-dialog.vue';
import { useNotifications } from '@/composables/use-notifications';
import CustomerForm from '@/modules/customers/components/customer-form.vue';
import CustomerTable from '@/modules/customers/components/customer-table.vue';
import { useCustomers } from '@/modules/customers/composables/use-customers';
import type { Customer } from '@/modules/customers/types/customer.types';
import { formatearFecha, obtenerIniciales } from '@/utils';

const {
  customers,
  selectedCustomer,
  loading,
  clientesActivos,
  cantidadClientes,
  cargarClientes,
  seleccionarCliente,
  eliminarCliente,
} = useCustomers();

const { mostrarExito } = useNotifications();

const busqueda = ref('');
const estadoSeleccionado = ref<boolean | null>(null);

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarConfirmacionEliminar = ref(false);

const clientePendienteEliminar = ref<Customer | null>(null);

const clienteSeleccionado = computed(() => selectedCustomer.value);

const opcionesEstado = [
  {
    label: 'Activos',
    value: true,
  },
  {
    label: 'Inactivos',
    value: false,
  },
];

const clientesFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();

  return customers.value.filter((cliente) => {
    const nombreCompleto = `${cliente.firstName} ${cliente.lastName}`.toLowerCase();

    const coincideBusqueda =
      !texto ||
      nombreCompleto.includes(texto) ||
      cliente.phone.toLowerCase().includes(texto) ||
      (cliente.email?.toLowerCase().includes(texto) ?? false);

    const coincideEstado =
      estadoSeleccionado.value === null || cliente.isActive === estadoSeleccionado.value;

    return coincideBusqueda && coincideEstado;
  });
});

const hayFiltros = computed(() => {
  return Boolean(busqueda.value.trim() || estadoSeleccionado.value !== null);
});

onMounted(() => {
  cargarClientes();
});

const manejarCrear = (): void => {
  seleccionarCliente(null);
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarVer = (cliente: Customer): void => {
  seleccionarCliente(cliente);
  mostrarDetalles.value = true;
};

const manejarEditar = (cliente: Customer): void => {
  seleccionarCliente(cliente);
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarEditarDesdeDetalles = (): void => {
  mostrarDetalles.value = false;
  mostrarFormulario.value = true;
};

const manejarEliminar = (cliente: Customer): void => {
  clientePendienteEliminar.value = cliente;
  mostrarConfirmacionEliminar.value = true;
};

const confirmarEliminacion = (): void => {
  const cliente = clientePendienteEliminar.value;

  if (!cliente) {
    return;
  }

  eliminarCliente(cliente.id);

  mostrarConfirmacionEliminar.value = false;
  clientePendienteEliminar.value = null;

  mostrarExito('Cliente eliminado correctamente.');
};

const manejarFormularioGuardado = (): void => {
  mostrarFormulario.value = false;
};

const limpiarFiltros = (): void => {
  busqueda.value = '';
  estadoSeleccionado.value = null;
};
</script>

<style scoped lang="scss">
.customers-page {
  max-width: 1600px;
  margin: 0 auto;
}

.stat-card,
.customers-card {
  border-color: #e8ebf0;
  border-radius: 14px;
  background: #ffffff;
}

.stat-card {
  min-height: 142px;
}

.stat-card__title {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.stat-card__value {
  margin-top: 8px;
  color: #172033;
  font-size: 28px;
  font-weight: 750;
  line-height: 1.2;
}

.stat-card__description {
  margin-top: 7px;
  color: #94a3b8;
  font-size: 11px;
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 11px;
}

.stat-card__icon--blue {
  background: #eff6ff;
  color: #2563eb;
}

.stat-card__icon--green {
  background: #f0fdf4;
  color: #16a34a;
}

.stat-card__icon--orange {
  background: #fff7ed;
  color: #ea580c;
}

.toolbar-section {
  padding: 18px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
  text-align: center;
}

.empty-state__title {
  margin-top: 14px;
  color: #334155;
  font-size: 16px;
  font-weight: 700;
}

.empty-state__description {
  max-width: 400px;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.customer-details {
  width: 650px;
  max-width: calc(100vw - 32px);
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.customer-details__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 26px;
}

.customer-details__identity {
  display: flex;
  align-items: center;
  gap: 16px;
}

.customer-details__avatar {
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 700;
}

.customer-details__identity-info {
  min-width: 0;
}

.customer-details__name {
  color: #172033;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.3;
}

.customer-details__meta {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
}

.customer-details__close {
  color: #94a3b8;
}

.customer-details__body {
  max-height: calc(90vh - 190px);
  overflow-y: auto;
  padding: 26px;
}

.details-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.details-section__title .q-icon {
  color: var(--q-primary);
  font-size: 19px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 13px;
  border: 1px solid #e8ebf0;
  border-radius: 11px;
  background: #fafbfc;
}

.detail-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #eef2ff;
  color: var(--q-primary);
}

.detail-item__content {
  min-width: 0;
}

.detail-item__label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-item__value {
  margin-top: 3px;
  overflow: hidden;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.customer-details__notes {
  padding: 14px 16px;
  border: 1px solid #e8ebf0;
  border-radius: 11px;
  background: #fafbfc;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.customer-details__registered {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  color: #94a3b8;
  font-size: 11px;
}

.customer-details__footer {
  gap: 8px;
  padding: 16px 26px;
  background: #fafbfc;
}

.customer-details__footer :deep(.q-btn) {
  min-width: 110px;
  border-radius: 9px;
}

@media (max-width: 700px) {
  .customers-page {
    padding: 16px !important;
  }

  .text-h4 {
    font-size: 25px;
  }
}

@media (max-width: 600px) {
  .customer-details {
    max-width: calc(100vw - 20px);
    border-radius: 14px;
  }

  .customer-details__header,
  .customer-details__body {
    padding: 20px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .customer-details__footer {
    padding: 14px 20px;
  }

  .customer-details__footer :deep(.q-btn) {
    min-width: 0;
  }
}
</style>
