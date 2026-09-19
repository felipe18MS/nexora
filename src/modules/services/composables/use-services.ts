import { storeToRefs } from 'pinia';

import { useServiceStore } from '../stores/service.store';

import type {
  CreateServiceRequest,
  Service,
  ServiceFilters,
  UpdateServiceRequest,
} from '../types/service.types';

export function useServices() {
  const serviceStore = useServiceStore();

  const {
    services,
    selectedService,
    loading,
    error,
    filters,
    serviciosActivos,
    serviciosInactivos,
    cantidadServicios,
    cantidadServiciosActivos,
  } = storeToRefs(serviceStore);

  const cargarServicios = (): Promise<void> => serviceStore.cargarServicios();

  const crearServicio = (data: CreateServiceRequest): Promise<Service | null> =>
    serviceStore.crearServicio(data);

  const actualizarServicio = (id: string, data: UpdateServiceRequest): Promise<Service | null> =>
    serviceStore.actualizarServicio(id, data);

  const eliminarServicio = (id: string): Promise<boolean> => serviceStore.eliminarServicio(id);

  const seleccionarServicio = (service: Service | null): void => {
    serviceStore.seleccionarServicio(service);
  };

  const establecerFiltros = (newFilters: ServiceFilters): void => {
    serviceStore.establecerFiltros(newFilters);
  };

  const limpiarFiltros = (): void => {
    serviceStore.limpiarFiltros();
  };

  const limpiarError = (): void => {
    serviceStore.limpiarError();
  };

  return {
    services,
    selectedService,
    loading,
    error,
    filters,
    serviciosActivos,
    serviciosInactivos,
    cantidadServicios,
    cantidadServiciosActivos,

    cargarServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    seleccionarServicio,
    establecerFiltros,
    limpiarFiltros,
    limpiarError,
  };
}
