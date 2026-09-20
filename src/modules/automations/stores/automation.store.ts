import { defineStore } from 'pinia';

import {
  actualizarAutomatizacion,
  cambiarEstadoAutomatizacion,
  crearAutomatizacion,
  eliminarAutomatizacion,
  obtenerAutomatizaciones,
} from '../services/automation.service';

import type {
  ActualizarAutomatizacion,
  Automatizacion,
  CrearAutomatizacion,
  EstadoAutomatizacion,
  FiltrosAutomatizacion,
} from '../types/automation.types';

interface AutomationsState {
  automatizaciones: Automatizacion[];
  filtros: FiltrosAutomatizacion;
  cargando: boolean;
}

export const useAutomationsStore = defineStore('automations', {
  state: (): AutomationsState => ({
    automatizaciones: [],
    filtros: {
      busqueda: '',
      estado: null,
      disparador: null,
    },
    cargando: false,
  }),

  getters: {
    automatizacionesFiltradas: (state): Automatizacion[] => {
      const busqueda = state.filtros.busqueda.trim().toLowerCase();

      return state.automatizaciones.filter((automatizacion) => {
        const coincideBusqueda =
          !busqueda ||
          automatizacion.nombre.toLowerCase().includes(busqueda) ||
          automatizacion.descripcion.toLowerCase().includes(busqueda);

        const coincideEstado =
          !state.filtros.estado || automatizacion.estado === state.filtros.estado;

        const coincideDisparador =
          !state.filtros.disparador || automatizacion.disparador === state.filtros.disparador;

        return coincideBusqueda && coincideEstado && coincideDisparador;
      });
    },

    totalAutomatizaciones: (state) => state.automatizaciones.length,

    activas: (state) =>
      state.automatizaciones.filter((automatizacion) => automatizacion.estado === 'activa').length,

    inactivas: (state) =>
      state.automatizaciones.filter((automatizacion) => automatizacion.estado === 'inactiva')
        .length,

    borradores: (state) =>
      state.automatizaciones.filter((automatizacion) => automatizacion.estado === 'borrador')
        .length,

    totalEjecuciones: (state) =>
      state.automatizaciones.reduce(
        (total, automatizacion) => total + automatizacion.ejecuciones,
        0,
      ),
  },

  actions: {
    cargarAutomatizaciones(): void {
      this.cargando = true;

      this.automatizaciones = obtenerAutomatizaciones();

      this.cargando = false;
    },

    actualizarFiltros(filtros: Partial<FiltrosAutomatizacion>): void {
      this.filtros = {
        ...this.filtros,
        ...filtros,
      };
    },

    limpiarFiltros(): void {
      this.filtros = {
        busqueda: '',
        estado: null,
        disparador: null,
      };
    },

    agregarAutomatizacion(datos: CrearAutomatizacion): Automatizacion {
      const automatizacion = crearAutomatizacion(datos);

      this.automatizaciones = obtenerAutomatizaciones();

      return automatizacion;
    },

    actualizar(datos: ActualizarAutomatizacion): Automatizacion | null {
      const automatizacion = actualizarAutomatizacion(datos);

      if (!automatizacion) {
        return null;
      }

      this.automatizaciones = obtenerAutomatizaciones();

      return automatizacion;
    },

    cambiarEstado(id: string, estado: EstadoAutomatizacion): Automatizacion | null {
      const automatizacion = cambiarEstadoAutomatizacion(id, estado);

      if (!automatizacion) {
        return null;
      }

      this.automatizaciones = obtenerAutomatizaciones();

      return automatizacion;
    },

    eliminar(id: string): boolean {
      const eliminado = eliminarAutomatizacion(id);

      if (!eliminado) {
        return false;
      }

      this.automatizaciones = obtenerAutomatizaciones();

      return true;
    },
  },
});
