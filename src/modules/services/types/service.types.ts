export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  category: string | null;
  color: string | null;
  isActive: boolean;
  employeeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  category?: string | null;
  color?: string | null;
  employeeIds?: string[];
}

export interface UpdateServiceRequest {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  category?: string | null;
  color?: string | null;
  employeeIds?: string[];
}

export interface ServiceFilters {
  search?: string;
  category?: string | null;
  isActive?: boolean | null;
}

export interface PaginatedServicesResponse {
  items: Service[];
  total: number;
  page: number;
  pageSize: number;
}
