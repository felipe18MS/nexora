import { storeToRefs } from 'pinia';

import { useScheduleStore } from '../stores/schedule.store';

import type { DayOfWeek, UpdateScheduleDayRequest } from '../types/schedule.types';

export function useSchedule() {
  const scheduleStore = useScheduleStore();

  const { schedule, loading, error, diasAbiertos, cantidadDiasAbiertos, cantidadDiasCerrados } =
    storeToRefs(scheduleStore);

  const cargarHorario = (): void => {
    scheduleStore.cargarHorario();
  };

  const actualizarDia = (day: DayOfWeek, data: UpdateScheduleDayRequest): void => {
    scheduleStore.actualizarDia(day, data);
  };

  const agregarIntervalo = (day: DayOfWeek): void => {
    scheduleStore.agregarIntervalo(day);
  };

  const eliminarIntervalo = (day: DayOfWeek, intervalId: string): void => {
    scheduleStore.eliminarIntervalo(day, intervalId);
  };

  const establecerEstadoDia = (day: DayOfWeek, isOpen: boolean): void => {
    scheduleStore.establecerEstadoDia(day, isOpen);
  };

  const limpiarError = (): void => {
    scheduleStore.limpiarError();
  };

  return {
    schedule,
    loading,
    error,
    diasAbiertos,
    cantidadDiasAbiertos,
    cantidadDiasCerrados,

    cargarHorario,
    actualizarDia,
    agregarIntervalo,
    eliminarIntervalo,
    establecerEstadoDia,
    limpiarError,
  };
}
