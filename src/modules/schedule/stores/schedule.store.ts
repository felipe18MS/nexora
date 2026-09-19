import { defineStore } from 'pinia';

import type {
  BusinessScheduleDay,
  DayOfWeek,
  ScheduleInterval,
  UpdateScheduleDayRequest,
} from '../types/schedule.types';

interface ScheduleState {
  schedule: BusinessScheduleDay[];
  loading: boolean;
  error: string | null;
}

const horarioInicial: BusinessScheduleDay[] = [
  {
    day: 'monday',
    label: 'Lunes',
    shortLabel: 'Lun',
    isOpen: true,
    intervals: [
      {
        id: 'monday-1',
        startTime: '08:00',
        endTime: '12:00',
      },
      {
        id: 'monday-2',
        startTime: '14:00',
        endTime: '18:00',
      },
    ],
  },
  {
    day: 'tuesday',
    label: 'Martes',
    shortLabel: 'Mar',
    isOpen: true,
    intervals: [
      {
        id: 'tuesday-1',
        startTime: '08:00',
        endTime: '12:00',
      },
      {
        id: 'tuesday-2',
        startTime: '14:00',
        endTime: '18:00',
      },
    ],
  },
  {
    day: 'wednesday',
    label: 'Miércoles',
    shortLabel: 'Mié',
    isOpen: true,
    intervals: [
      {
        id: 'wednesday-1',
        startTime: '08:00',
        endTime: '18:00',
      },
    ],
  },
  {
    day: 'thursday',
    label: 'Jueves',
    shortLabel: 'Jue',
    isOpen: true,
    intervals: [
      {
        id: 'thursday-1',
        startTime: '08:00',
        endTime: '18:00',
      },
    ],
  },
  {
    day: 'friday',
    label: 'Viernes',
    shortLabel: 'Vie',
    isOpen: true,
    intervals: [
      {
        id: 'friday-1',
        startTime: '08:00',
        endTime: '18:00',
      },
    ],
  },
  {
    day: 'saturday',
    label: 'Sábado',
    shortLabel: 'Sáb',
    isOpen: true,
    intervals: [
      {
        id: 'saturday-1',
        startTime: '09:00',
        endTime: '14:00',
      },
    ],
  },
  {
    day: 'sunday',
    label: 'Domingo',
    shortLabel: 'Dom',
    isOpen: false,
    intervals: [],
  },
];

export const useScheduleStore = defineStore('schedule', {
  state: (): ScheduleState => ({
    schedule: structuredClone(horarioInicial),
    loading: false,
    error: null,
  }),

  getters: {
    diasAbiertos: (state): BusinessScheduleDay[] => {
      return state.schedule.filter((dia) => dia.isOpen);
    },

    cantidadDiasAbiertos: (state): number => {
      return state.schedule.filter((dia) => dia.isOpen).length;
    },

    cantidadDiasCerrados: (state): number => {
      return state.schedule.filter((dia) => !dia.isOpen).length;
    },
  },

  actions: {
    cargarHorario(): void {
      this.loading = true;
      this.error = null;

      try {
        // Datos temporales mientras se conecta la API.
        this.schedule = structuredClone(horarioInicial);
      } catch {
        this.error = 'No fue posible cargar el horario.';
      } finally {
        this.loading = false;
      }
    },

    actualizarDia(day: DayOfWeek, data: UpdateScheduleDayRequest): void {
      const indice = this.schedule.findIndex((dia) => dia.day === day);

      if (indice === -1) {
        this.error = 'No fue posible encontrar el día seleccionado.';
        return;
      }

      const diaActual = this.schedule[indice];

      if (!diaActual) {
        this.error = 'No fue posible encontrar el día seleccionado.';
        return;
      }

      diaActual.isOpen = data.isOpen;
      diaActual.intervals = data.intervals;
    },

    agregarIntervalo(day: DayOfWeek): void {
      const dia = this.schedule.find((item) => item.day === day);

      if (!dia) {
        this.error = 'No fue posible encontrar el día seleccionado.';
        return;
      }

      const nuevoIntervalo: ScheduleInterval = {
        id: crypto.randomUUID(),
        startTime: '08:00',
        endTime: '18:00',
      };

      dia.intervals.push(nuevoIntervalo);
    },

    eliminarIntervalo(day: DayOfWeek, intervalId: string): void {
      const dia = this.schedule.find((item) => item.day === day);

      if (!dia) {
        this.error = 'No fue posible encontrar el día seleccionado.';
        return;
      }

      dia.intervals = dia.intervals.filter((intervalo) => intervalo.id !== intervalId);
    },

    establecerEstadoDia(day: DayOfWeek, isOpen: boolean): void {
      const dia = this.schedule.find((item) => item.day === day);

      if (!dia) {
        this.error = 'No fue posible encontrar el día seleccionado.';
        return;
      }

      dia.isOpen = isOpen;

      if (!isOpen) {
        dia.intervals = [];
      }

      if (isOpen && dia.intervals.length === 0) {
        dia.intervals.push({
          id: crypto.randomUUID(),
          startTime: '08:00',
          endTime: '18:00',
        });
      }
    },

    limpiarError(): void {
      this.error = null;
    },
  },
});
