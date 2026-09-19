export type EmployeeRole = 'owner' | 'manager' | 'professional' | 'assistant';

export interface Employee {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  documentNumber: string | null;
  role: EmployeeRole;
  specialty: string | null;
  color: string | null;
  isActive: boolean;
  serviceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  documentNumber?: string | null;
  role: EmployeeRole;
  specialty?: string | null;
  color?: string | null;
  serviceIds?: string[];
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  documentNumber?: string | null;
  role: EmployeeRole;
  specialty?: string | null;
  color?: string | null;
  serviceIds?: string[];
}

export interface EmployeeFilters {
  search?: string;
  role?: EmployeeRole | null;
  isActive?: boolean | null;
}
