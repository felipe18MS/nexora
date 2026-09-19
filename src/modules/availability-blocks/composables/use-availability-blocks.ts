import { storeToRefs } from 'pinia';

import { useAvailabilityBlockStore } from '../stores/availability-block.store';

import type {
  AvailabilityBlock,
  AvailabilityBlockFilters,
  CreateAvailabilityBlockRequest,
  UpdateAvailabilityBlockRequest,
} from '../types/availability-block.types';

export function useAvailabilityBlocks() {
  const availabilityBlockStore = useAvailabilityBlockStore();

  const {
    blocks,
    selectedBlock,
    loading,
    error,
    filters,
    cantidadBloqueos,
    bloqueosDiaCompleto,
    bloqueosParciales,
  } = storeToRefs(availabilityBlockStore);

  const cargarBloqueos = (): void => {
    availabilityBlockStore.cargarBloqueos();
  };

  const crearBloqueo = (data: CreateAvailabilityBlockRequest): void => {
    availabilityBlockStore.crearBloqueo(data);
  };

  const actualizarBloqueo = (id: string, data: UpdateAvailabilityBlockRequest): void => {
    availabilityBlockStore.actualizarBloqueo(id, data);
  };

  const eliminarBloqueo = (id: string): void => {
    availabilityBlockStore.eliminarBloqueo(id);
  };

  const seleccionarBloqueo = (block: AvailabilityBlock | null): void => {
    availabilityBlockStore.seleccionarBloqueo(block);
  };

  const establecerFiltros = (nuevosFiltros: AvailabilityBlockFilters): void => {
    availabilityBlockStore.establecerFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    availabilityBlockStore.limpiarFiltros();
  };

  const limpiarError = (): void => {
    availabilityBlockStore.limpiarError();
  };

  return {
    blocks,
    selectedBlock,
    loading,
    error,
    filters,
    cantidadBloqueos,
    bloqueosDiaCompleto,
    bloqueosParciales,

    cargarBloqueos,
    crearBloqueo,
    actualizarBloqueo,
    eliminarBloqueo,
    seleccionarBloqueo,
    establecerFiltros,
    limpiarFiltros,
    limpiarError,
  };
}
