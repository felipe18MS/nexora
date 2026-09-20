import { computed } from 'vue';

import { useReportsStore } from '../stores/report.store';

import type { ActualizarReporte, CrearReporte, FiltrosReportes } from '../types/report.types';

export const useReports = () => {
  const store = useReportsStore();

  const reportes = computed(() => {
    return store.reportes;
  });

  const reportesFiltrados = computed(() => {
    return store.reportesFiltrados;
  });

  const reporteSeleccionado = computed(() => {
    return store.reporteSeleccionado;
  });

  const filtros = computed(() => {
    return store.filtros;
  });

  const resumen = computed(() => {
    return store.resumen;
  });

  const cargando = computed(() => {
    return store.cargando;
  });

  const guardando = computed(() => {
    return store.guardando;
  });

  const totalReportes = computed(() => {
    return store.totalReportes;
  });

  const hayFiltrosActivos = computed(() => {
    return store.hayFiltrosActivos;
  });

  const cargarReportes = (): void => {
    store.cargarReportes();
  };

  const establecerFiltros = (nuevosFiltros: Partial<FiltrosReportes>): void => {
    store.establecerFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    store.limpiarFiltros();
  };

  const seleccionarReporte = (id: string) => {
    return store.seleccionarReporte(id);
  };

  const limpiarSeleccion = (): void => {
    store.limpiarSeleccion();
  };

  const crearReporte = (datos: CrearReporte) => {
    return store.crear(datos);
  };

  const actualizarReporte = (datos: ActualizarReporte) => {
    return store.actualizar(datos);
  };

  const eliminarReporte = (id: string): boolean => {
    return store.eliminar(id);
  };

  return {
    reportes,
    reportesFiltrados,
    reporteSeleccionado,
    filtros,
    resumen,
    cargando,
    guardando,
    totalReportes,
    hayFiltrosActivos,
    cargarReportes,
    establecerFiltros,
    limpiarFiltros,
    seleccionarReporte,
    limpiarSeleccion,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
  };
};
