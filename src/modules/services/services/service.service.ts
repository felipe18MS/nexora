import { serviciosIniciales } from '../mocks/service.mock';

import type {
  CreateServiceRequest,
  Service,
  ServiceFilters,
  UpdateServiceRequest,
} from '../types/service.types';

export interface ServicioServicios {
  obtenerServicios(filtros?: ServiceFilters): Promise<Service[]>;
  obtenerServicioPorId(id: string): Promise<Service>;
  crearServicio(data: CreateServiceRequest): Promise<Service>;
  actualizarServicio(id: string, data: UpdateServiceRequest): Promise<Service>;
  eliminarServicio(id: string): Promise<void>;
}

const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let serviciosMock: Service[] = structuredClone(serviciosIniciales);

export const servicioServicios: ServicioServicios = {
  async obtenerServicios(filtros = {}): Promise<Service[]> {
    await delay();

    const search = filtros.search?.trim().toLowerCase();

    return serviciosMock.filter((service) => {
      const coincideBusqueda =
        !search ||
        service.name.toLowerCase().includes(search) ||
        service.description?.toLowerCase().includes(search) ||
        service.category?.toLowerCase().includes(search);

      const coincideCategoria = !filtros.category || service.category === filtros.category;

      const coincideEstado =
        filtros.isActive === null ||
        filtros.isActive === undefined ||
        service.isActive === filtros.isActive;

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  },

  async obtenerServicioPorId(id: string): Promise<Service> {
    await delay();

    const service = serviciosMock.find((item) => item.id === id);

    if (!service) {
      throw new Error('Servicio no encontrado.');
    }

    return structuredClone(service);
  },

  async crearServicio(data: CreateServiceRequest): Promise<Service> {
    await delay();

    const ahora = new Date().toISOString();

    const nuevoServicio: Service = {
      id: crypto.randomUUID(),
      tenantId: 'demo',
      name: data.name,
      description: data.description ?? null,
      durationMinutes: data.durationMinutes,
      price: data.price,
      category: data.category ?? null,
      color: data.color ?? null,
      isActive: true,
      employeeIds: data.employeeIds ?? [],
      createdAt: ahora,
      updatedAt: ahora,
    };

    serviciosMock.unshift(nuevoServicio);

    return structuredClone(nuevoServicio);
  },

  async actualizarServicio(id: string, data: UpdateServiceRequest): Promise<Service> {
    await delay();

    const index = serviciosMock.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Servicio no encontrado.');
    }

    const actual = serviciosMock[index];

    if (!actual) {
      throw new Error('Servicio no encontrado.');
    }

    const actualizado: Service = {
      ...actual,
      name: data.name,
      description: data.description ?? null,
      durationMinutes: data.durationMinutes,
      price: data.price,
      category: data.category ?? null,
      color: data.color ?? null,
      employeeIds: data.employeeIds ?? [],
      updatedAt: new Date().toISOString(),
    };

    serviciosMock[index] = actualizado;

    return structuredClone(actualizado);
  },

  async eliminarServicio(id: string): Promise<void> {
    await delay();

    const existe = serviciosMock.some((item) => item.id === id);

    if (!existe) {
      throw new Error('Servicio no encontrado.');
    }

    serviciosMock = serviciosMock.filter((item) => item.id !== id);
  },
};
