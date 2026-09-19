import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  PaginatedAppointmentResponse,
  UpdateAppointmentRequest,
} from '../types/appointment.types';

export interface ServicioCitas {
  obtenerCitas(filtros?: AppointmentFilters): Promise<PaginatedAppointmentResponse>;

  obtenerCitaPorId(id: string): Promise<Appointment>;

  crearCita(data: CreateAppointmentRequest): Promise<Appointment>;

  actualizarCita(id: string, data: UpdateAppointmentRequest): Promise<Appointment>;

  eliminarCita(id: string): Promise<void>;
}
