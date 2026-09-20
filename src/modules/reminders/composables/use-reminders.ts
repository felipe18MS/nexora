import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useReminderStore } from '../stores/reminder.store';

import type {
  ActualizarRecordatorio,
  CrearRecordatorio,
  EstadoRecordatorio,
} from '../types/reminder.types';

export const useReminders = () => {
  const reminderStore = useReminderStore();

  const { recordatorios, cargando } = storeToRefs(reminderStore);

  const totalRecordatorios = computed(() => reminderStore.totalRecordatorios);

  const pendientes = computed(() => reminderStore.pendientes);

  const enviados = computed(() => reminderStore.enviados);

  const cancelados = computed(() => reminderStore.cancelados);

  const cargarRecordatorios = (): void => {
    reminderStore.cargarRecordatorios();
  };

  const crearRecordatorio = (datos: CrearRecordatorio): void => {
    reminderStore.crearRecordatorio(datos);
  };

  const actualizarRecordatorio = (datos: ActualizarRecordatorio): boolean => {
    return reminderStore.actualizarRecordatorio(datos);
  };

  const actualizarEstado = (id: string, estado: EstadoRecordatorio): boolean => {
    return reminderStore.actualizarEstado(id, estado);
  };

  const cancelarRecordatorio = (id: string): boolean => {
    return reminderStore.cancelar(id);
  };

  return {
    recordatorios,
    cargando,
    totalRecordatorios,
    pendientes,
    enviados,
    cancelados,
    cargarRecordatorios,
    crearRecordatorio,
    actualizarRecordatorio,
    actualizarEstado,
    cancelarRecordatorio,
  };
};
