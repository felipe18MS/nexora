import { defineStore } from 'pinia';

import {
  actualizarIntegracion,
  conectarIntegracion,
  desconectarIntegracion,
  filtrarIntegraciones,
  obtenerIntegracion,
  obtenerIntegraciones,
  obtenerResumenIntegraciones,
} from '../services/integration.service';

import type {
  ActualizarIntegracion,
  FiltrosIntegraciones,
  Integracion,
  ResumenIntegraciones,
} from '../types/integration.types';

interface IntegrationsState {
  integraciones: Integracion[];
  integracionSeleccionada: Integracion | null;
  filtros: FiltrosIntegraciones;
  resumen: ResumenIntegraciones;
  cargando: boolean;
  guardando: boolean;
}

const filtrosIniciales = (): FiltrosIntegraciones => ({
  categoria: null,
  estado: null,
});

const resumenInicial = (): ResumenIntegraciones => ({
  total: 0,
  conectadas: 0,
  pendientes: 0,
  desconectadas: 0,
});

export const useIntegrationsStore = defineStore('integrations', {
  state: (): IntegrationsState => ({
    integraciones: [],
    integracionSeleccionada: null,
    filtros: filtrosIniciales(),
    resumen: resumenInicial(),
    cargando: false,
    guardando: false,
  }),

  getters: {
    integracionesFiltradas: (state): Integracion[] => {
      return filtrarIntegraciones(state.filtros);
    },

    totalIntegraciones: (state): number => {
      return state.integraciones.length;
    },

    hayFiltrosActivos: (state): boolean => {
      return state.filtros.categoria !== null || state.filtros.estado !== null;
    },
  },

  actions: {
    cargarIntegraciones(): void {
      this.cargando = true;

      this.integraciones = obtenerIntegraciones();
      this.resumen = obtenerResumenIntegraciones();

      this.cargando = false;
    },

    actualizarResumen(): void {
      this.resumen = obtenerResumenIntegraciones();
    },

    establecerFiltros(filtros: Partial<FiltrosIntegraciones>): void {
      this.filtros = {
        ...this.filtros,
        ...filtros,
      };
    },

    limpiarFiltros(): void {
      this.filtros = filtrosIniciales();
    },

    seleccionarIntegracion(id: string): Integracion | null {
      const integracion = obtenerIntegracion(id);

      this.integracionSeleccionada = integracion;

      return integracion;
    },

    limpiarSeleccion(): void {
      this.integracionSeleccionada = null;
    },

    actualizar(datos: ActualizarIntegracion): Integracion | null {
      this.guardando = true;

      const integracion = actualizarIntegracion(datos);

      if (integracion) {
        this.integraciones = obtenerIntegraciones();
        this.actualizarResumen();

        if (this.integracionSeleccionada?.id === integracion.id) {
          this.integracionSeleccionada = integracion;
        }
      }

      this.guardando = false;

      return integracion;
    },

    conectar(id: string): Integracion | null {
      this.guardando = true;

      const integracion = conectarIntegracion(id);

      if (integracion) {
        this.integraciones = obtenerIntegraciones();
        this.actualizarResumen();
      }

      this.guardando = false;

      return integracion;
    },

    desconectar(id: string): Integracion | null {
      this.guardando = true;

      const integracion = desconectarIntegracion(id);

      if (integracion) {
        this.integraciones = obtenerIntegraciones();
        this.actualizarResumen();
      }

      this.guardando = false;

      return integracion;
    },
  },
});
