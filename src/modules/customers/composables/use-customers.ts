import { storeToRefs } from 'pinia';

import { useCustomerStore } from '../stores/customer.store';

import type {
  CreateCustomerRequest,
  Customer,
  CustomerFilters,
  UpdateCustomerRequest,
} from '../types/customer.types';

export function useCustomers() {
  const customerStore = useCustomerStore();

  const {
    customers,
    selectedCustomer,
    loading,
    error,
    filters,
    clientesActivos,
    cantidadClientes,
  } = storeToRefs(customerStore);

  const cargarClientes = (): void => {
    customerStore.cargarClientes();
  };

  const crearCliente = (data: CreateCustomerRequest): void => {
    customerStore.crearCliente(data);
  };

  const actualizarCliente = (id: string, data: UpdateCustomerRequest): void => {
    customerStore.actualizarCliente(id, data);
  };

  const eliminarCliente = (id: string): void => {
    customerStore.eliminarCliente(id);
  };

  const seleccionarCliente = (cliente: Customer | null): void => {
    customerStore.seleccionarCliente(cliente);
  };

  const establecerFiltros = (filtrosNuevos: CustomerFilters): void => {
    customerStore.establecerFiltros(filtrosNuevos);
  };

  const limpiarError = (): void => {
    customerStore.limpiarError();
  };

  return {
    customers,
    selectedCustomer,
    loading,
    error,
    filters,
    clientesActivos,
    cantidadClientes,

    cargarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    seleccionarCliente,
    establecerFiltros,
    limpiarError,
  };
}
