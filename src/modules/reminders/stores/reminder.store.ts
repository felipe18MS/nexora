import { defineStore } from 'pinia';

import {
  actualizarEstadoRecordatorio,
  actualizarRecordatorio,
  cancelarRecordatorio,
  crearRecordatorio,
  obtenerRecordatorios,
} from '../services/reminder.service';

import type {
  ActualizarRecordatorio,
  CrearRecordatorio,
  Recordatorio,
} from '../types/reminder.types';

interface ReminderState {
  recordatorios: Recordatorio[];
  cargando: boolean;
}

export const useReminderStore = defineStore('reminders', {
  state: (): ReminderState => ({
    recordatorios: [],
    cargando: false,
  }),

  getters: {
    totalRecordatorios: (state) => state.recordatorios.length,

    pendientes: (state) =>
      state.recordatorios.filter((recordatorio) => recordatorio.estado === 'pendiente').length,

    enviados: (state) =>
      state.recordatorios.filter((recordatorio) => recordatorio.estado === 'enviado').length,

    cancelados: (state) =>
      state.recordatorios.filter((recordatorio) => recordatorio.estado === 'cancelado').length,
  },

  actions: {
    cargarRecordatorios(): void {
      this.cargando = true;
      this.recordatorios = obtenerRecordatorios();
      this.cargando = false;
    },

    crearRecordatorio(datos: CrearRecordatorio): Recordatorio {
      const recordatorio = crearRecordatorio(datos);

      this.recordatorios = obtenerRecordatorios();

      return recordatorio;
    },

    actualizarRecordatorio(datos: ActualizarRecordatorio): boolean {
      const recordatorio = actualizarRecordatorio(datos);

      if (!recordatorio) {
        return false;
      }

      this.recordatorios = obtenerRecordatorios();

      return true;
    },

    actualizarEstado(id: string, estado: Recordatorio['estado']): boolean {
      const recordatorio = actualizarEstadoRecordatorio(id, estado);

      if (!recordatorio) {
        return false;
      }

      this.recordatorios = obtenerRecordatorios();

      return true;
    },

    cancelar(id: string): boolean {
      const recordatorio = cancelarRecordatorio(id);

      if (!recordatorio) {
        return false;
      }

      this.recordatorios = obtenerRecordatorios();

      return true;
    },
  },
});
