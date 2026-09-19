export { useCustomers } from './composables/use-customers';

export { useCustomerStore } from './stores/customer.store';

export type {
  Customer,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedResponse,
} from './types/customer.types';

export type { ServicioClientes } from './services/customer.service';
