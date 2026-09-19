export interface AvailabilityBlock {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isAllDay: boolean;
  reason: string;
  notes: string | null;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityBlockRequest {
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  isAllDay: boolean;
  reason: string;
  notes?: string | null;
  employeeId?: string | null;
}

export interface UpdateAvailabilityBlockRequest {
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  isAllDay: boolean;
  reason: string;
  notes?: string | null;
  employeeId?: string | null;
}

export interface AvailabilityBlockFilters {
  dateFrom?: string;
  dateTo?: string;
  employeeId?: string | null;
  reason?: string;
}
