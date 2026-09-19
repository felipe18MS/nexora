export type AppointmentStatus =
  'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type AppointmentSource = 'manual' | 'whatsapp' | 'phone' | 'web';

export interface Appointment {
  id: string;
  tenantId: string;

  customerId: string;
  customerName: string;

  serviceId: string;
  serviceName: string;

  employeeId: string;
  employeeName: string;

  date: string;
  startTime: string;
  endTime: string;

  status: AppointmentStatus;
  source: AppointmentSource;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  customerId: string;
  serviceId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: AppointmentStatus;
  source?: AppointmentSource;
  notes?: string | null;
}

export interface UpdateAppointmentRequest {
  customerId: string;
  serviceId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes?: string | null;
}

export interface AppointmentFilters {
  search?: string;
  date?: string;
  status?: AppointmentStatus;
  employeeId?: string;
  customerId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedAppointmentResponse {
  items: Appointment[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
