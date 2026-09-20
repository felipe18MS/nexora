import { defineStore } from 'pinia';

import {
  crearPermisosSuperadministrador,
  crearPermisosVacios,
  convertirPermisosSimplesAPermisosModulo,
  normalizarPermisos,
  obtenerModulosSistema,
  obtenerModulosVisibles,
  tienePermisoModulo,
} from '../services/authorization.service';

import type {
  AccionPermiso,
  ModuloSistema,
  ModuloSistemaConfig,
  PermisosModulo,
} from '../types/authorization.types';

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    permisos: [] as PermisosModulo[],
    cargado: false,
  }),

  getters: {
    modulos: (): ModuloSistemaConfig[] => {
      return obtenerModulosSistema();
    },

    modulosVisibles(): ModuloSistemaConfig[] {
      return obtenerModulosVisibles(this.permisos);
    },

    puedeVer() {
      return (modulo: ModuloSistema): boolean => {
        return tienePermisoModulo(this.permisos, modulo, 'ver');
      };
    },

    puedeCrear() {
      return (modulo: ModuloSistema): boolean => {
        return tienePermisoModulo(this.permisos, modulo, 'crear');
      };
    },

    puedeEditar() {
      return (modulo: ModuloSistema): boolean => {
        return tienePermisoModulo(this.permisos, modulo, 'editar');
      };
    },

    puedeEliminar() {
      return (modulo: ModuloSistema): boolean => {
        return tienePermisoModulo(this.permisos, modulo, 'eliminar');
      };
    },
  },

  actions: {
    cargarPermisos(permisos: PermisosModulo[]) {
      this.permisos = normalizarPermisos(permisos);

      this.cargado = true;
    },

    cargarPermisosSimples(permisos: string[]) {
      this.permisos = convertirPermisosSimplesAPermisosModulo(permisos);

      this.cargado = true;
    },

    cargarPermisosSuperadministrador() {
      this.permisos = crearPermisosSuperadministrador();

      this.cargado = true;
    },

    inicializarPermisosVacios() {
      this.permisos = crearPermisosVacios();

      this.cargado = true;
    },

    tienePermiso(modulo: ModuloSistema, accion: AccionPermiso = 'ver'): boolean {
      return tienePermisoModulo(this.permisos, modulo, accion);
    },

    limpiar() {
      this.permisos = [];
      this.cargado = false;
    },
  },
});
