<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Servicios</div>

        <div class="text-grey-6">Administra los servicios que ofrece tu negocio.</div>
      </div>

      <q-space />

      <q-btn color="primary" icon="add" label="Nuevo servicio" @click="abrirCrear" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Total servicios</div>

            <div class="text-h5 text-weight-bold">
              {{ cantidadServicios }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Servicios activos</div>

            <div class="text-h5 text-weight-bold text-positive">
              {{ cantidadServiciosActivos }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Servicios inactivos</div>

            <div class="text-h5 text-weight-bold text-grey-7">
              {{ cantidadServicios - cantidadServiciosActivos }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <ServiceFilters :filters="filters" @update:filters="actualizarFiltros" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <ServiceTable
          :services="services"
          :loading="loading"
          @ver="verServicio"
          @editar="editarServicio"
          @eliminar="solicitarEliminar"
        />
      </q-card-section>
    </q-card>

    <ServiceForm
      v-model="mostrarFormulario"
      :service="selectedService"
      :loading="loading"
      @guardar="guardarServicio"
    />

    <q-dialog v-model="mostrarDetalles">
      <q-card style="width: 500px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Detalle del servicio</div>

          <q-space />

          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedService">
          <div class="text-h6 q-mb-sm">
            {{ selectedService.name }}
          </div>

          <div class="text-body2 text-grey-7 q-mb-md">
            {{ selectedService.description || 'Sin descripción.' }}
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption text-grey-6">Duración</div>

              <div class="text-body1">{{ selectedService.durationMinutes }} minutos</div>
            </div>

            <div class="col-6">
              <div class="text-caption text-grey-6">Precio</div>

              <div class="text-body1">
                {{ formatearPrecio(selectedService.price) }}
              </div>
            </div>

            <div class="col-6">
              <div class="text-caption text-grey-6">Categoría</div>

              <div class="text-body1">
                {{ selectedService.category || 'Sin categoría' }}
              </div>
            </div>

            <div class="col-6">
              <div class="text-caption text-grey-6">Estado</div>

              <ServiceStatusBadge :is-active="selectedService.isActive" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      title="Eliminar servicio"
      message="¿Estás seguro de que deseas eliminar este servicio?"
      confirm-label="Eliminar"
      @confirm="confirmarEliminacion"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import ServiceFilters from '../../modules/services/components/service-filters.vue';
import ServiceForm from '../../modules/services/components/service-form.vue';
import ServiceStatusBadge from '../../modules/services/components/service-status-badge.vue';
import ServiceTable from '../../modules/services/components/service-table.vue';
import { useServices } from '../../modules/services/composables/use-services';

import type {
  CreateServiceRequest,
  Service,
  UpdateServiceRequest,
} from '../../modules/services/types/service.types';

const {
  services,
  selectedService,
  loading,
  filters,
  cantidadServicios,
  cantidadServiciosActivos,
  cargarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  seleccionarServicio,
  establecerFiltros,
} = useServices();

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarConfirmacion = ref(false);

const servicioPendienteEliminar = ref<Service | null>(null);

const actualizarFiltros = (nuevosFiltros: typeof filters.value): void => {
  establecerFiltros(nuevosFiltros);
  void cargarServicios();
};

const abrirCrear = (): void => {
  seleccionarServicio(null);
  mostrarFormulario.value = true;
};

const verServicio = (service: Service): void => {
  seleccionarServicio(service);
  mostrarDetalles.value = true;
};

const editarServicio = (service: Service): void => {
  seleccionarServicio(service);
  mostrarFormulario.value = true;
};

const guardarServicio = async (
  data: CreateServiceRequest | UpdateServiceRequest,
): Promise<void> => {
  if (selectedService.value) {
    await actualizarServicio(selectedService.value.id, data);
  } else {
    await crearServicio(data);
  }

  mostrarFormulario.value = false;
};

const solicitarEliminar = (service: Service): void => {
  servicioPendienteEliminar.value = service;
  mostrarConfirmacion.value = true;
};

const confirmarEliminacion = async (): Promise<void> => {
  if (!servicioPendienteEliminar.value) return;

  await eliminarServicio(servicioPendienteEliminar.value.id);

  servicioPendienteEliminar.value = null;
  mostrarConfirmacion.value = false;
};

const formatearPrecio = (precio: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);

onMounted(() => {
  void cargarServicios();
});
</script>
