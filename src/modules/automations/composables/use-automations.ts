import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAutomationsStore } from '../stores/automation.store';

import type {
  ActualizarAutomatizacion,
  CrearAutomatizacion,
  EstadoAutomatizacion,
  FiltrosAutomatizacion,
} from '../types/automation.types';

export const useAutomations = () => {
  const automationsStore = useAutomationsStore();

  const { automatizaciones, filtros, cargando } = storeToRefs(automationsStore);

  const automatizacionesFiltradas = computed(() => automationsStore.automatizacionesFiltradas);

  const totalAutomatizaciones = computed(() => automationsStore.totalAutomatizaciones);

  const activas = computed(() => automationsStore.activas);

  const inactivas = computed(() => automationsStore.inactivas);

  const borradores = computed(() => automationsStore.borradores);

  const totalEjecuciones = computed(() => automationsStore.totalEjecuciones);

  const cargarAutomatizaciones = (): void => {
    automationsStore.cargarAutomatizaciones();
  };

  const actualizarFiltros = (nuevosFiltros: Partial<FiltrosAutomatizacion>): void => {
    automationsStore.actualizarFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    automationsStore.limpiarFiltros();
  };

  const agregarAutomatizacion = (datos: CrearAutomatizacion) => {
    return automationsStore.agregarAutomatizacion(datos);
  };

  const actualizar = (datos: ActualizarAutomatizacion) => {
    return automationsStore.actualizar(datos);
  };

  const cambiarEstado = (id: string, estado: EstadoAutomatizacion) => {
    return automationsStore.cambiarEstado(id, estado);
  };

  const eliminar = (id: string): boolean => {
    return automationsStore.eliminar(id);
  };

  return {
    automatizaciones,
    filtros,
    cargando,
    automatizacionesFiltradas,
    totalAutomatizaciones,
    activas,
    inactivas,
    borradores,
    totalEjecuciones,
    cargarAutomatizaciones,
    actualizarFiltros,
    limpiarFiltros,
    agregarAutomatizacion,
    actualizar,
    cambiarEstado,
    eliminar,
  };
};
