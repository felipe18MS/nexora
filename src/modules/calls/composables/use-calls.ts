import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useCallsStore } from '../stores/call.store';

import type { ActualizarLlamada, CrearLlamada, FiltrosLlamadas } from '../types/call.types';

export const useCalls = () => {
  const callsStore = useCallsStore();

  const { llamadas, filtros, cargando } = storeToRefs(callsStore);

  const llamadasFiltradas = computed(() => callsStore.llamadasFiltradas);

  const totalLlamadas = computed(() => callsStore.totalLlamadas);

  const entrantes = computed(() => callsStore.entrantes);

  const salientes = computed(() => callsStore.salientes);

  const perdidas = computed(() => callsStore.perdidas);

  const duracionTotalSegundos = computed(() => callsStore.duracionTotalSegundos);

  const cargarLlamadas = (): void => {
    callsStore.cargarLlamadas();
  };

  const actualizarFiltros = (nuevosFiltros: Partial<FiltrosLlamadas>): void => {
    callsStore.actualizarFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    callsStore.limpiarFiltros();
  };

  const agregarLlamada = (datos: CrearLlamada) => {
    return callsStore.agregarLlamada(datos);
  };

  const actualizar = (datos: ActualizarLlamada) => {
    return callsStore.actualizar(datos);
  };

  const eliminar = (id: string): boolean => {
    return callsStore.eliminar(id);
  };

  return {
    llamadas,
    filtros,
    cargando,
    llamadasFiltradas,
    totalLlamadas,
    entrantes,
    salientes,
    perdidas,
    duracionTotalSegundos,
    cargarLlamadas,
    actualizarFiltros,
    limpiarFiltros,
    agregarLlamada,
    actualizar,
    eliminar,
  };
};
