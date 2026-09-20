import { defineStore } from 'pinia';

import {
  actualizarLlamada,
  crearLlamada,
  eliminarLlamada,
  obtenerLlamadas,
} from '../services/call.service';

import type {
  ActualizarLlamada,
  CrearLlamada,
  FiltrosLlamadas,
  Llamada,
} from '../types/call.types';

interface CallsState {
  llamadas: Llamada[];
  filtros: FiltrosLlamadas;
  cargando: boolean;
}

export const useCallsStore = defineStore('calls', {
  state: (): CallsState => ({
    llamadas: [],
    filtros: {
      busqueda: '',
      direccion: null,
      estado: null,
      resultado: null,
    },
    cargando: false,
  }),

  getters: {
    llamadasFiltradas: (state): Llamada[] => {
      const busqueda = state.filtros.busqueda.trim().toLowerCase();

      return state.llamadas.filter((llamada) => {
        const coincideBusqueda =
          !busqueda ||
          llamada.clienteNombre.toLowerCase().includes(busqueda) ||
          llamada.telefono.toLowerCase().includes(busqueda);

        const coincideDireccion =
          !state.filtros.direccion || llamada.direccion === state.filtros.direccion;

        const coincideEstado = !state.filtros.estado || llamada.estado === state.filtros.estado;

        const coincideResultado =
          !state.filtros.resultado || llamada.resultado === state.filtros.resultado;

        return coincideBusqueda && coincideDireccion && coincideEstado && coincideResultado;
      });
    },

    totalLlamadas: (state) => state.llamadas.length,

    entrantes: (state) =>
      state.llamadas.filter((llamada) => llamada.direccion === 'entrante').length,

    salientes: (state) =>
      state.llamadas.filter((llamada) => llamada.direccion === 'saliente').length,

    perdidas: (state) => state.llamadas.filter((llamada) => llamada.estado === 'perdida').length,

    duracionTotalSegundos: (state) =>
      state.llamadas.reduce((total, llamada) => total + llamada.duracionSegundos, 0),
  },

  actions: {
    cargarLlamadas(): void {
      this.cargando = true;
      this.llamadas = obtenerLlamadas();
      this.cargando = false;
    },

    actualizarFiltros(filtros: Partial<FiltrosLlamadas>): void {
      this.filtros = {
        ...this.filtros,
        ...filtros,
      };
    },

    limpiarFiltros(): void {
      this.filtros = {
        busqueda: '',
        direccion: null,
        estado: null,
        resultado: null,
      };
    },

    agregarLlamada(datos: CrearLlamada): Llamada {
      const llamada = crearLlamada(datos);

      this.llamadas = obtenerLlamadas();

      return llamada;
    },

    actualizar(datos: ActualizarLlamada): Llamada | null {
      const llamada = actualizarLlamada(datos);

      if (!llamada) {
        return null;
      }

      this.llamadas = obtenerLlamadas();

      return llamada;
    },

    eliminar(id: string): boolean {
      const eliminado = eliminarLlamada(id);

      if (!eliminado) {
        return false;
      }

      this.llamadas = obtenerLlamadas();

      return true;
    },
  },
});
