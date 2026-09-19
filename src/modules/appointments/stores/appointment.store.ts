import { defineStore } from 'pinia';
import { useAvailabilityBlockStore } from '../../availability-blocks/stores/availability-block.store';
import { encontrarBloqueoConflicto } from '../../availability-blocks/utils/availability-block.utils';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../types/appointment.types';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  filters: AppointmentFilters;
}

const citasIniciales: Appointment[] = [
  {
    id: '1',
    tenantId: 'demo',
    customerId: '1',
    customerName: 'María Rodríguez',
    serviceId: '1',
    serviceName: 'Consulta general',
    employeeId: '1',
    employeeName: 'Laura Gómez',
    date: '2026-09-18',
    startTime: '08:00',
    endTime: '09:00',
    status: 'confirmed',
    source: 'whatsapp',
    notes: 'Cliente solicita atención puntual.',
    createdAt: '2026-09-15T09:00:00',
    updatedAt: '2026-09-15T09:00:00',
  },
  {
    id: '2',
    tenantId: 'demo',
    customerId: '2',
    customerName: 'Carlos Gómez',
    serviceId: '2',
    serviceName: 'Limpieza',
    employeeId: '2',
    employeeName: 'Andrés Martínez',
    date: '2026-09-18',
    startTime: '10:00',
    endTime: '11:00',
    status: 'pending',
    source: 'phone',
    notes: null,
    createdAt: '2026-09-16T10:30:00',
    updatedAt: '2026-09-16T10:30:00',
  },
  {
    id: '3',
    tenantId: 'demo',
    customerId: '3',
    customerName: 'Laura Martínez',
    serviceId: '3',
    serviceName: 'Valoración',
    employeeId: '1',
    employeeName: 'Laura Gómez',
    date: '2026-09-18',
    startTime: '14:00',
    endTime: '15:00',
    status: 'completed',
    source: 'web',
    notes: 'Valoración inicial.',
    createdAt: '2026-09-17T11:00:00',
    updatedAt: '2026-09-18T15:00:00',
  },
  {
    id: '4',
    tenantId: 'demo',
    customerId: '4',
    customerName: 'Andrés López',
    serviceId: '1',
    serviceName: 'Consulta general',
    employeeId: '3',
    employeeName: 'Sofía Torres',
    date: '2026-09-19',
    startTime: '09:00',
    endTime: '10:00',
    status: 'confirmed',
    source: 'manual',
    notes: null,
    createdAt: '2026-09-17T14:00:00',
    updatedAt: '2026-09-17T14:00:00',
  },
  {
    id: '5',
    tenantId: 'demo',
    customerId: '5',
    customerName: 'Sofía Torres',
    serviceId: '4',
    serviceName: 'Seguimiento',
    employeeId: '2',
    employeeName: 'Andrés Martínez',
    date: '2026-09-20',
    startTime: '15:00',
    endTime: '16:00',
    status: 'pending',
    source: 'whatsapp',
    notes: 'Seguimiento de servicio.',
    createdAt: '2026-09-18T08:00:00',
    updatedAt: '2026-09-18T08:00:00',
  },
];

export const useAppointmentStore = defineStore('appointments', {
  state: (): AppointmentState => ({
    appointments: [...citasIniciales],
    selectedAppointment: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      pageSize: 10,
    },
  }),

  getters: {
    citasPendientes: (state): Appointment[] => {
      return state.appointments.filter((cita) => cita.status === 'pending');
    },

    citasConfirmadas: (state): Appointment[] => {
      return state.appointments.filter((cita) => cita.status === 'confirmed');
    },

    citasHoy: (state): Appointment[] => {
      const hoy = new Date().toISOString().split('T')[0];

      return state.appointments.filter((cita) => cita.date === hoy);
    },

    cantidadCitas: (state): number => {
      return state.appointments.length;
    },
  },

  actions: {
    cargarCitas(): void {
      this.loading = true;
      this.error = null;

      try {
        this.appointments = [...this.appointments];
      } catch {
        this.error = 'No fue posible cargar las citas.';
      } finally {
        this.loading = false;
      }
    },

    crearCita(data: CreateAppointmentRequest): boolean {
      this.loading = true;
      this.error = null;

      try {
        const availabilityBlockStore = useAvailabilityBlockStore();

        const bloqueoConflicto = encontrarBloqueoConflicto(availabilityBlockStore.blocks, {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          employeeId: data.employeeId,
        });

        if (bloqueoConflicto) {
          this.error = bloqueoConflicto.isAllDay
            ? `No se puede crear la cita. El día está bloqueado: ${bloqueoConflicto.reason}.`
            : `No se puede crear la cita. El horario está bloqueado: ${bloqueoConflicto.reason}.`;

          return false;
        }

        const ahora = new Date().toISOString();

        const nuevaCita: Appointment = {
          id: crypto.randomUUID(),
          tenantId: 'demo',
          customerId: data.customerId,
          customerName: this.obtenerNombreCliente(data.customerId),
          serviceId: data.serviceId,
          serviceName: this.obtenerNombreServicio(data.serviceId),
          employeeId: data.employeeId,
          employeeName: this.obtenerNombreEmpleado(data.employeeId),
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status ?? 'pending',
          source: data.source ?? 'manual',
          notes: data.notes ?? null,
          createdAt: ahora,
          updatedAt: ahora,
        };

        this.appointments.unshift(nuevaCita);
        this.selectedAppointment = nuevaCita;

        return true;
      } catch {
        this.error = 'No fue posible crear la cita.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    actualizarCita(id: string, data: UpdateAppointmentRequest): boolean {
      this.loading = true;
      this.error = null;

      try {
        const indice = this.appointments.findIndex((cita) => cita.id === id);

        if (indice === -1) {
          this.error = 'Cita no encontrada.';
          return false;
        }

        const citaActual = this.appointments[indice];

        if (!citaActual) {
          this.error = 'Cita no encontrada.';
          return false;
        }

        const availabilityBlockStore = useAvailabilityBlockStore();

        const bloqueoConflicto = encontrarBloqueoConflicto(availabilityBlockStore.blocks, {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          employeeId: data.employeeId,
        });

        if (bloqueoConflicto) {
          this.error = bloqueoConflicto.isAllDay
            ? `No se puede actualizar la cita. El día está bloqueado: ${bloqueoConflicto.reason}.`
            : `No se puede actualizar la cita. El horario está bloqueado: ${bloqueoConflicto.reason}.`;

          return false;
        }

        const citaActualizada: Appointment = {
          ...citaActual,
          customerId: data.customerId,
          customerName: this.obtenerNombreCliente(data.customerId),
          serviceId: data.serviceId,
          serviceName: this.obtenerNombreServicio(data.serviceId),
          employeeId: data.employeeId,
          employeeName: this.obtenerNombreEmpleado(data.employeeId),
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status,
          source: data.source,
          notes: data.notes ?? null,
          updatedAt: new Date().toISOString(),
        };

        this.appointments[indice] = citaActualizada;
        this.selectedAppointment = citaActualizada;

        return true;
      } catch {
        this.error = 'No fue posible actualizar la cita.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    eliminarCita(id: string): void {
      this.loading = true;
      this.error = null;

      try {
        const indice = this.appointments.findIndex((cita) => cita.id === id);

        if (indice === -1) {
          this.error = 'Cita no encontrada.';
          return;
        }

        this.appointments.splice(indice, 1);

        if (this.selectedAppointment?.id === id) {
          this.selectedAppointment = null;
        }
      } catch {
        this.error = 'No fue posible eliminar la cita.';
      } finally {
        this.loading = false;
      }
    },

    cambiarEstado(id: string, estado: Appointment['status']): void {
      const cita = this.appointments.find((item) => item.id === id);

      if (!cita) {
        this.error = 'Cita no encontrada.';
        return;
      }

      cita.status = estado;
      cita.updatedAt = new Date().toISOString();

      if (this.selectedAppointment?.id === id) {
        this.selectedAppointment = {
          ...cita,
        };
      }
    },

    seleccionarCita(cita: Appointment | null): void {
      this.selectedAppointment = cita;
    },

    establecerFiltros(filtrosNuevos: AppointmentFilters): void {
      this.filters = {
        ...this.filters,
        ...filtrosNuevos,
      };
    },

    limpiarError(): void {
      this.error = null;
    },

    obtenerNombreCliente(id: string): string {
      const clientes: Record<string, string> = {
        '1': 'María Rodríguez',
        '2': 'Carlos Gómez',
        '3': 'Laura Martínez',
        '4': 'Andrés López',
        '5': 'Sofía Torres',
      };

      return clientes[id] ?? 'Cliente';
    },

    obtenerNombreServicio(id: string): string {
      const servicios: Record<string, string> = {
        '1': 'Consulta general',
        '2': 'Limpieza',
        '3': 'Valoración',
        '4': 'Seguimiento',
      };

      return servicios[id] ?? 'Servicio';
    },

    obtenerNombreEmpleado(id: string): string {
      const empleados: Record<string, string> = {
        '1': 'Laura Gómez',
        '2': 'Andrés Martínez',
        '3': 'Sofía Torres',
      };

      return empleados[id] ?? 'Profesional';
    },
  },
});
