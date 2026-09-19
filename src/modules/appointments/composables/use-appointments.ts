import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppointmentStore } from '../stores/appointment.store';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../types/appointment.types';

export const useAppointments = () => {
  const appointmentStore = useAppointmentStore();

  const { appointments, selectedAppointment, loading, error, filters } =
    storeToRefs(appointmentStore);

  const citasPendientes = computed(() => appointmentStore.citasPendientes);

  const citasConfirmadas = computed(() => appointmentStore.citasConfirmadas);

  const citasHoy = computed(() => appointmentStore.citasHoy);

  const cantidadCitas = computed(() => appointmentStore.cantidadCitas);

  const cargarCitas = (): void => {
    appointmentStore.cargarCitas();
  };

  const crearCita = (data: CreateAppointmentRequest): boolean => {
    return appointmentStore.crearCita(data);
  };

  const actualizarCita = (id: string, data: UpdateAppointmentRequest): boolean => {
    return appointmentStore.actualizarCita(id, data);
  };

  const eliminarCita = (id: string): void => {
    appointmentStore.eliminarCita(id);
  };

  const cambiarEstado = (id: string, estado: Appointment['status']): void => {
    appointmentStore.cambiarEstado(id, estado);
  };

  const seleccionarCita = (cita: Appointment | null): void => {
    appointmentStore.seleccionarCita(cita);
  };

  const establecerFiltros = (filtrosNuevos: AppointmentFilters): void => {
    appointmentStore.establecerFiltros(filtrosNuevos);
  };

  const limpiarError = (): void => {
    appointmentStore.limpiarError();
  };

  return {
    appointments,
    selectedAppointment,
    loading,
    error,
    filters,

    citasPendientes,
    citasConfirmadas,
    citasHoy,
    cantidadCitas,

    cargarCitas,
    crearCita,
    actualizarCita,
    eliminarCita,
    cambiarEstado,
    seleccionarCita,
    establecerFiltros,
    limpiarError,
  };
};
