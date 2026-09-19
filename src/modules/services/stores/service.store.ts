import { defineStore } from 'pinia';

import { servicioServicios } from '../services/service.service';

import type {
  CreateServiceRequest,
  Service,
  ServiceFilters,
  UpdateServiceRequest,
} from '../types/service.types';

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
  filters: ServiceFilters;
}

export const useServiceStore = defineStore('services', {
  state: (): ServiceState => ({
    services: [],
    selectedService: null,
    loading: false,
    error: null,
    filters: {},
  }),

  getters: {
    serviciosActivos: (state): Service[] => state.services.filter((service) => service.isActive),

    serviciosInactivos: (state): Service[] => state.services.filter((service) => !service.isActive),

    cantidadServicios: (state): number => state.services.length,

    cantidadServiciosActivos: (state): number =>
      state.services.filter((service) => service.isActive).length,
  },

  actions: {
    async cargarServicios(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        this.services = await servicioServicios.obtenerServicios(this.filters);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible cargar los servicios.';
      } finally {
        this.loading = false;
      }
    },

    async crearServicio(data: CreateServiceRequest): Promise<Service | null> {
      this.loading = true;
      this.error = null;

      try {
        const service = await servicioServicios.crearServicio(data);

        this.services.unshift(service);
        this.selectedService = service;

        return service;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'No fue posible crear el servicio.';

        return null;
      } finally {
        this.loading = false;
      }
    },

    async actualizarServicio(id: string, data: UpdateServiceRequest): Promise<Service | null> {
      this.loading = true;
      this.error = null;

      try {
        const service = await servicioServicios.actualizarServicio(id, data);

        const index = this.services.findIndex((item) => item.id === id);

        if (index !== -1) {
          this.services[index] = service;
        }

        this.selectedService = service;

        return service;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible actualizar el servicio.';

        return null;
      } finally {
        this.loading = false;
      }
    },

    async eliminarServicio(id: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        await servicioServicios.eliminarServicio(id);

        this.services = this.services.filter((service) => service.id !== id);

        if (this.selectedService?.id === id) {
          this.selectedService = null;
        }

        return true;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible eliminar el servicio.';

        return false;
      } finally {
        this.loading = false;
      }
    },

    seleccionarServicio(service: Service | null): void {
      this.selectedService = service;
    },

    establecerFiltros(filters: ServiceFilters): void {
      this.filters = {
        ...this.filters,
        ...filters,
      };
    },

    limpiarFiltros(): void {
      this.filters = {};
    },

    limpiarError(): void {
      this.error = null;
    },
  },
});
