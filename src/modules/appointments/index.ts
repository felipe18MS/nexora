export { useAppointments } from './composables/use-appointments';

export { useAppointmentStore } from './stores/appointment.store';

export type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentSource,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  PaginatedAppointmentResponse,
} from './types/appointment.types';

export type { ServicioCitas } from './services/appointment.service';
