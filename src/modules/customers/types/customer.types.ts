export interface Customer {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  documentNumber: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  documentNumber?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
}

export interface UpdateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  documentNumber?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
}

export interface CustomerFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
