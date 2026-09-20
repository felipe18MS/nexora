import { defineStore } from 'pinia';

import {
  actualizarPermisosUsuario,
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  filtrarUsuarios,
  obtenerResumenUsuarios,
  obtenerUsuario,
  obtenerUsuarios,
} from '../services/user.service';

import type {
  ActualizarPermisosUsuario,
  ActualizarUsuario,
  CrearUsuario,
  FiltrosUsuarios,
  ResumenUsuarios,
  Usuario,
} from '../types/user.types';

interface UsersState {
  usuarios: Usuario[];
  usuarioSeleccionado: Usuario | null;
  filtros: FiltrosUsuarios;
  resumen: ResumenUsuarios;
  cargando: boolean;
  guardando: boolean;
}

const filtrosIniciales = (): FiltrosUsuarios => ({
  busqueda: '',
  rol: null,
  estado: null,
});

const resumenInicial = (): ResumenUsuarios => ({
  total: 0,
  activos: 0,
  inactivos: 0,
  pendientes: 0,
});

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    usuarios: [],
    usuarioSeleccionado: null,
    filtros: filtrosIniciales(),
    resumen: resumenInicial(),
    cargando: false,
    guardando: false,
  }),

  getters: {
    usuariosFiltrados: (state): Usuario[] => {
      return filtrarUsuarios(state.filtros);
    },

    totalUsuarios: (state): number => {
      return state.usuarios.length;
    },

    hayFiltrosActivos: (state): boolean => {
      return (
        state.filtros.busqueda.trim() !== '' ||
        state.filtros.rol !== null ||
        state.filtros.estado !== null
      );
    },
  },

  actions: {
    cargarUsuarios(): void {
      this.cargando = true;

      this.usuarios = obtenerUsuarios();
      this.resumen = obtenerResumenUsuarios();

      this.cargando = false;
    },

    actualizarResumen(): void {
      this.resumen = obtenerResumenUsuarios();
    },

    establecerFiltros(filtros: Partial<FiltrosUsuarios>): void {
      this.filtros = {
        ...this.filtros,
        ...filtros,
      };
    },

    limpiarFiltros(): void {
      this.filtros = filtrosIniciales();
    },

    seleccionarUsuario(id: string): Usuario | null {
      const usuario = obtenerUsuario(id);

      this.usuarioSeleccionado = usuario;

      return usuario;
    },

    limpiarSeleccion(): void {
      this.usuarioSeleccionado = null;
    },

    crear(datos: CrearUsuario): Usuario {
      this.guardando = true;

      const usuario = crearUsuario(datos);

      this.usuarios = obtenerUsuarios();
      this.actualizarResumen();

      this.guardando = false;

      return usuario;
    },

    actualizar(datos: ActualizarUsuario): Usuario | null {
      this.guardando = true;

      const usuario = actualizarUsuario(datos);

      if (usuario) {
        this.usuarios = obtenerUsuarios();
        this.actualizarResumen();

        if (this.usuarioSeleccionado?.id === usuario.id) {
          this.usuarioSeleccionado = usuario;
        }
      }

      this.guardando = false;

      return usuario;
    },

    eliminar(id: string): boolean {
      this.guardando = true;

      const eliminado = eliminarUsuario(id);

      if (eliminado) {
        this.usuarios = obtenerUsuarios();
        this.actualizarResumen();

        if (this.usuarioSeleccionado?.id === id) {
          this.usuarioSeleccionado = null;
        }
      }

      this.guardando = false;

      return eliminado;
    },

    actualizarPermisos(datos: ActualizarPermisosUsuario): Usuario | null {
      this.guardando = true;

      const usuario = actualizarPermisosUsuario(datos);

      if (usuario) {
        this.usuarios = obtenerUsuarios();
        this.actualizarResumen();

        if (this.usuarioSeleccionado?.id === usuario.id) {
          this.usuarioSeleccionado = usuario;
        }
      }

      this.guardando = false;

      return usuario;
    },
  },
});
