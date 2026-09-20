import { defineStore } from 'pinia';

import {
  actualizarReporte,
  crearReporte,
  eliminarReporte,
  filtrarReportes,
  obtenerReporte,
  obtenerReportes,
  obtenerResumenReportes,
} from '../services/report.service';

import type {
  ActualizarReporte,
  CrearReporte,
  FiltrosReportes,
  Reporte,
  ResumenReportes,
} from '../types/report.types';

interface ReportsState {
  reportes: Reporte[];
  reporteSeleccionado: Reporte | null;
  filtros: FiltrosReportes;
  resumen: ResumenReportes;
  cargando: boolean;
  guardando: boolean;
}

const filtrosIniciales = (): FiltrosReportes => ({
  tipo: null,
  periodo: 'mes',
  fechaDesde: null,
  fechaHasta: null,
});

const resumenInicial = (): ResumenReportes => ({
  totalIngresos: 0,
  totalGastos: 0,
  balance: 0,
  totalCitas: 0,
  citasCompletadas: 0,
  citasCanceladas: 0,
  nuevosClientes: 0,
  serviciosRealizados: 0,
});

export const useReportsStore = defineStore('reports', {
  state: (): ReportsState => ({
    reportes: [],
    reporteSeleccionado: null,
    filtros: filtrosIniciales(),
    resumen: resumenInicial(),
    cargando: false,
    guardando: false,
  }),

  getters: {
    reportesFiltrados: (state): Reporte[] => {
      return filtrarReportes(state.filtros);
    },

    hayFiltrosActivos: (state): boolean => {
      return (
        state.filtros.tipo !== null ||
        state.filtros.periodo !== 'mes' ||
        state.filtros.fechaDesde !== null ||
        state.filtros.fechaHasta !== null
      );
    },

    totalReportes: (state): number => {
      return state.reportes.length;
    },
  },

  actions: {
    cargarReportes(): void {
      this.cargando = true;

      this.reportes = obtenerReportes();
      this.resumen = obtenerResumenReportes();

      this.cargando = false;
    },

    actualizarResumen(): void {
      this.resumen = obtenerResumenReportes();
    },

    establecerFiltros(filtros: Partial<FiltrosReportes>): void {
      this.filtros = {
        ...this.filtros,
        ...filtros,
      };

      this.actualizarResumen();
    },

    limpiarFiltros(): void {
      this.filtros = filtrosIniciales();
      this.actualizarResumen();
    },

    seleccionarReporte(id: string): Reporte | null {
      const reporte = obtenerReporte(id);

      this.reporteSeleccionado = reporte;

      return reporte;
    },

    limpiarSeleccion(): void {
      this.reporteSeleccionado = null;
    },

    crear(datos: CrearReporte): Reporte {
      this.guardando = true;

      const reporte = crearReporte(datos);

      this.reportes = obtenerReportes();

      this.guardando = false;

      return reporte;
    },

    actualizar(datos: ActualizarReporte): Reporte | null {
      this.guardando = true;

      const reporte = actualizarReporte(datos);

      if (reporte) {
        this.reportes = obtenerReportes();

        if (this.reporteSeleccionado?.id === reporte.id) {
          this.reporteSeleccionado = reporte;
        }
      }

      this.guardando = false;

      return reporte;
    },

    eliminar(id: string): boolean {
      this.guardando = true;

      const eliminado = eliminarReporte(id);

      if (eliminado) {
        this.reportes = obtenerReportes();

        if (this.reporteSeleccionado?.id === id) {
          this.reporteSeleccionado = null;
        }
      }

      this.guardando = false;

      return eliminado;
    },
  },
});
