import { defineStore } from 'pinia';

import {
  actualizarMovimientoFinanciero,
  anularMovimientoFinanciero,
  crearMovimientoFinanciero,
  eliminarMovimientoFinanciero,
  filtrarMovimientosFinancieros,
  obtenerMovimientoFinanciero,
  obtenerMovimientosFinancieros,
  obtenerResumenFinanzas,
  obtenerResumenFiltrado,
} from '../services/finance.service';

import type {
  ActualizarMovimientoFinanciero,
  CrearMovimientoFinanciero,
  FiltrosFinanzas,
  MovimientoFinanciero,
  ResumenFinanzas,
} from '../types/finance.types';

interface FinanceState {
  movimientos: MovimientoFinanciero[];
  movimientoSeleccionado: MovimientoFinanciero | null;
  filtros: FiltrosFinanzas;
  resumen: ResumenFinanzas;
  cargando: boolean;
  guardando: boolean;
}

const filtrosIniciales = (): FiltrosFinanzas => ({
  busqueda: '',
  tipo: null,
  categoria: null,
  metodoPago: null,
  estado: null,
  fechaDesde: null,
  fechaHasta: null,
});

const resumenInicial = (): ResumenFinanzas => ({
  ingresos: 0,
  gastos: 0,
  balance: 0,
  movimientos: 0,
});

export const useFinanceStore = defineStore('finance', {
  state: (): FinanceState => ({
    movimientos: [],
    movimientoSeleccionado: null,
    filtros: filtrosIniciales(),
    resumen: resumenInicial(),
    cargando: false,
    guardando: false,
  }),

  getters: {
    movimientosFiltrados: (state): MovimientoFinanciero[] => {
      return filtrarMovimientosFinancieros(state.filtros);
    },

    hayFiltrosActivos: (state): boolean => {
      return (
        state.filtros.busqueda !== '' ||
        state.filtros.tipo !== null ||
        state.filtros.categoria !== null ||
        state.filtros.metodoPago !== null ||
        state.filtros.estado !== null ||
        state.filtros.fechaDesde !== null ||
        state.filtros.fechaHasta !== null
      );
    },

    totalMovimientos: (state): number => {
      return state.movimientos.length;
    },
  },

  actions: {
    cargarMovimientos(): void {
      this.cargando = true;

      this.movimientos = obtenerMovimientosFinancieros();

      this.resumen = obtenerResumenFinanzas();

      this.cargando = false;
    },

    actualizarResumen(): void {
      if (this.hayFiltrosActivos) {
        this.resumen = obtenerResumenFiltrado(this.filtros);

        return;
      }

      this.resumen = obtenerResumenFinanzas();
    },

    establecerFiltros(filtros: Partial<FiltrosFinanzas>): void {
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

    seleccionarMovimiento(id: string): MovimientoFinanciero | null {
      const movimiento = obtenerMovimientoFinanciero(id);

      this.movimientoSeleccionado = movimiento;

      return movimiento;
    },

    limpiarSeleccion(): void {
      this.movimientoSeleccionado = null;
    },

    crear(datos: CrearMovimientoFinanciero): MovimientoFinanciero {
      this.guardando = true;

      const movimiento = crearMovimientoFinanciero(datos);

      this.movimientos = obtenerMovimientosFinancieros();

      this.actualizarResumen();

      this.guardando = false;

      return movimiento;
    },

    actualizar(datos: ActualizarMovimientoFinanciero): MovimientoFinanciero | null {
      this.guardando = true;

      const movimiento = actualizarMovimientoFinanciero(datos);

      if (movimiento) {
        this.movimientos = obtenerMovimientosFinancieros();

        if (this.movimientoSeleccionado?.id === movimiento.id) {
          this.movimientoSeleccionado = movimiento;
        }

        this.actualizarResumen();
      }

      this.guardando = false;

      return movimiento;
    },

    anular(id: string): MovimientoFinanciero | null {
      this.guardando = true;

      const movimiento = anularMovimientoFinanciero(id);

      if (movimiento) {
        this.movimientos = obtenerMovimientosFinancieros();

        if (this.movimientoSeleccionado?.id === movimiento.id) {
          this.movimientoSeleccionado = movimiento;
        }

        this.actualizarResumen();
      }

      this.guardando = false;

      return movimiento;
    },

    eliminar(id: string): boolean {
      this.guardando = true;

      const eliminado = eliminarMovimientoFinanciero(id);

      if (eliminado) {
        this.movimientos = obtenerMovimientosFinancieros();

        if (this.movimientoSeleccionado?.id === id) {
          this.movimientoSeleccionado = null;
        }

        this.actualizarResumen();
      }

      this.guardando = false;

      return eliminado;
    },
  },
});
