import { computed } from 'vue';

import { useIntegrationsStore } from '../stores/integration.store';

import type { FiltrosIntegraciones } from '../types/integration.types';

export const useIntegrations = () => {
  const store = useIntegrationsStore();

  const integraciones = computed(() => store.integraciones);

  const integracionesFiltradas = computed(() => store.integracionesFiltradas);

  const integracionSeleccionada = computed(() => store.integracionSeleccionada);

  const filtros = computed(() => store.filtros);

  const resumen = computed(() => store.resumen);

  const cargando = computed(() => store.cargando);

  const guardando = computed(() => store.guardando);

  const hayFiltrosActivos = computed(() => store.hayFiltrosActivos);

  const cargarIntegraciones = (): void => {
    store.cargarIntegraciones();
  };

  const establecerFiltros = (nuevosFiltros: Partial<FiltrosIntegraciones>): void => {
    store.establecerFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    store.limpiarFiltros();
  };

  const seleccionarIntegracion = (id: string) => {
    return store.seleccionarIntegracion(id);
  };

  const limpiarSeleccion = (): void => {
    store.limpiarSeleccion();
  };

  const conectarIntegracion = (id: string) => {
    return store.conectar(id);
  };

  const desconectarIntegracion = (id: string) => {
    return store.desconectar(id);
  };

  return {
    integraciones,
    integracionesFiltradas,
    integracionSeleccionada,
    filtros,
    resumen,
    cargando,
    guardando,
    hayFiltrosActivos,
    cargarIntegraciones,
    establecerFiltros,
    limpiarFiltros,
    seleccionarIntegracion,
    limpiarSeleccion,
    conectarIntegracion,
    desconectarIntegracion,
  };
};
