import { defineStore } from 'pinia';

import type {
  CreateCustomerRequest,
  Customer,
  CustomerFilters,
  UpdateCustomerRequest,
} from '../types/customer.types';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  filters: CustomerFilters;
}

const clientesIniciales: Customer[] = [
  {
    id: '1',
    tenantId: 'demo',
    firstName: 'María',
    lastName: 'Rodríguez',
    email: 'maria.rodriguez@email.com',
    phone: '3001234567',
    documentNumber: '1001234567',
    address: 'Carrera 12 # 10-25',
    city: 'Florencia',
    notes: 'Cliente frecuente.',
    isActive: true,
    createdAt: '2026-09-01T09:00:00',
    updatedAt: '2026-09-01T09:00:00',
  },
  {
    id: '2',
    tenantId: 'demo',
    firstName: 'Carlos',
    lastName: 'Gómez',
    email: 'carlos.gomez@email.com',
    phone: '3102345678',
    documentNumber: '1002345678',
    address: 'Calle 8 # 15-40',
    city: 'Florencia',
    notes: null,
    isActive: true,
    createdAt: '2026-09-03T10:30:00',
    updatedAt: '2026-09-03T10:30:00',
  },
  {
    id: '3',
    tenantId: 'demo',
    firstName: 'Laura',
    lastName: 'Martínez',
    email: 'laura.martinez@email.com',
    phone: '3153456789',
    documentNumber: '1003456789',
    address: 'Carrera 5 # 20-18',
    city: 'Florencia',
    notes: 'Prefiere contacto por WhatsApp.',
    isActive: false,
    createdAt: '2026-09-05T14:00:00',
    updatedAt: '2026-09-05T14:00:00',
  },
  {
    id: '4',
    tenantId: 'demo',
    firstName: 'Andrés',
    lastName: 'López',
    email: 'andres.lopez@email.com',
    phone: '3204567890',
    documentNumber: '1004567890',
    address: 'Calle 12 # 7-32',
    city: 'Florencia',
    notes: null,
    isActive: true,
    createdAt: '2026-09-08T08:45:00',
    updatedAt: '2026-09-08T08:45:00',
  },
  {
    id: '5',
    tenantId: 'demo',
    firstName: 'Sofía',
    lastName: 'Torres',
    email: 'sofia.torres@email.com',
    phone: '3015678901',
    documentNumber: '1005678901',
    address: 'Carrera 10 # 18-12',
    city: 'Florencia',
    notes: null,
    isActive: true,
    createdAt: '2026-09-10T11:15:00',
    updatedAt: '2026-09-10T11:15:00',
  },
];

export const useCustomerStore = defineStore('customers', {
  state: (): CustomerState => ({
    customers: [...clientesIniciales],
    selectedCustomer: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      pageSize: 10,
    },
  }),

  getters: {
    clientesActivos: (state): Customer[] => {
      return state.customers.filter((cliente) => cliente.isActive);
    },

    cantidadClientes: (state): number => {
      return state.customers.length;
    },
  },

  actions: {
    cargarClientes(): void {
      this.loading = true;
      this.error = null;

      try {
        // Mock temporal.
        // Posteriormente será reemplazado por la llamada a la API.
        this.customers = [...clientesIniciales];
      } catch {
        this.error = 'No fue posible cargar los clientes.';
      } finally {
        this.loading = false;
      }
    },

    crearCliente(data: CreateCustomerRequest): void {
      this.loading = true;
      this.error = null;

      try {
        const ahora = new Date().toISOString();

        const nuevoCliente: Customer = {
          id: crypto.randomUUID(),
          tenantId: 'demo',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email ?? null,
          phone: data.phone,
          documentNumber: data.documentNumber ?? null,
          address: data.address ?? null,
          city: data.city ?? null,
          notes: data.notes ?? null,
          isActive: true,
          createdAt: ahora,
          updatedAt: ahora,
        };

        this.customers.unshift(nuevoCliente);
        this.selectedCustomer = nuevoCliente;
      } catch {
        this.error = 'No fue posible crear el cliente.';
      } finally {
        this.loading = false;
      }
    },

    actualizarCliente(id: string, data: UpdateCustomerRequest): void {
      this.loading = true;
      this.error = null;

      try {
        const indice = this.customers.findIndex((cliente) => cliente.id === id);

        if (indice === -1) {
          this.error = 'Cliente no encontrado.';
          return;
        }

        const clienteActual = this.customers[indice];

        if (!clienteActual) {
          this.error = 'Cliente no encontrado.';
          return;
        }

        const clienteActualizado: Customer = {
          ...clienteActual,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email ?? null,
          phone: data.phone,
          documentNumber: data.documentNumber ?? null,
          address: data.address ?? null,
          city: data.city ?? null,
          notes: data.notes ?? null,
          updatedAt: new Date().toISOString(),
        };

        this.customers[indice] = clienteActualizado;
        this.selectedCustomer = clienteActualizado;
      } catch {
        this.error = 'No fue posible actualizar el cliente.';
      } finally {
        this.loading = false;
      }
    },

    eliminarCliente(id: string): void {
      this.loading = true;
      this.error = null;

      try {
        const indice = this.customers.findIndex((cliente) => cliente.id === id);

        if (indice === -1) {
          this.error = 'Cliente no encontrado.';
          return;
        }

        this.customers.splice(indice, 1);

        if (this.selectedCustomer?.id === id) {
          this.selectedCustomer = null;
        }
      } catch {
        this.error = 'No fue posible eliminar el cliente.';
      } finally {
        this.loading = false;
      }
    },

    seleccionarCliente(cliente: Customer | null): void {
      this.selectedCustomer = cliente;
    },

    establecerFiltros(filtrosNuevos: CustomerFilters): void {
      this.filters = {
        ...this.filters,
        ...filtrosNuevos,
      };
    },

    limpiarError(): void {
      this.error = null;
    },
  },
});
