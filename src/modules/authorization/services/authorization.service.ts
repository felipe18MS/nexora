import { MODULOS_SISTEMA, MODULOS_SISTEMA_POR_CODIGO } from '../constants/authorization.constants';

import type {
  AccionPermiso,
  ModuloSistema,
  ModuloSistemaConfig,
  PermisosModulo,
} from '../types/authorization.types';

const crearPermisoVacio = (modulo: ModuloSistema): PermisosModulo => ({
  modulo,
  ver: false,
  crear: false,
  editar: false,
  eliminar: false,
});

export const obtenerModulosSistema = (): ModuloSistemaConfig[] => {
  return [...MODULOS_SISTEMA];
};

export const obtenerModulo = (modulo: ModuloSistema): ModuloSistemaConfig | undefined => {
  return MODULOS_SISTEMA_POR_CODIGO[modulo];
};

export const crearPermisosVacios = (): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => crearPermisoVacio(modulo.codigo));
};

export const normalizarPermisos = (permisos: PermisosModulo[]): PermisosModulo[] => {
  const permisosMap = new Map(permisos.map((permiso) => [permiso.modulo, permiso]));

  return MODULOS_SISTEMA.map((modulo) => {
    return permisosMap.get(modulo.codigo) ?? crearPermisoVacio(modulo.codigo);
  });
};

/**
 * Convierte el modelo antiguo:
 *
 * ['clientes', 'citas', 'reportes']
 *
 * al nuevo modelo detallado:
 *
 * {
 *   modulo: 'clientes',
 *   ver: true,
 *   crear: true,
 *   editar: true,
 *   eliminar: true
 * }
 *
 * Esta conversión es temporal mientras NEXORA
 * trabaja con los mocks actuales.
 */
export const convertirPermisosSimplesAPermisosModulo = (permisos: string[]): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => {
    const tieneAcceso = permisos.includes(modulo.codigo);

    return {
      modulo: modulo.codigo,
      ver: tieneAcceso,
      crear: tieneAcceso,
      editar: tieneAcceso,
      eliminar: tieneAcceso,
    };
  });
};

export const crearPermisosSuperadministrador = (): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => ({
    modulo: modulo.codigo,
    ver: true,
    crear: true,
    editar: true,
    eliminar: true,
  }));
};

export const tienePermisoModulo = (
  permisos: PermisosModulo[],
  modulo: ModuloSistema,
  accion: AccionPermiso = 'ver',
): boolean => {
  const permiso = permisos.find((item) => item.modulo === modulo);

  return permiso?.[accion] ?? false;
};

export const obtenerModulosVisibles = (permisos: PermisosModulo[]): ModuloSistemaConfig[] => {
  return MODULOS_SISTEMA.filter((modulo) => tienePermisoModulo(permisos, modulo.codigo, 'ver'));
};
