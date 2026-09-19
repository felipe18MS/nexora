import type {
  CreateCustomerRequest,
  Customer,
  CustomerFilters,
  PaginatedResponse,
  UpdateCustomerRequest,
} from '../types/customer.types';

export interface ServicioClientes {
  obtenerClientes(filtros?: CustomerFilters): Promise<PaginatedResponse<Customer>>;

  obtenerClientePorId(id: string): Promise<Customer>;

  crearCliente(data: CreateCustomerRequest): Promise<Customer>;

  actualizarCliente(id: string, data: UpdateCustomerRequest): Promise<Customer>;

  eliminarCliente(id: string): Promise<void>;
}
