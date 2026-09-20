import { storeToRefs } from 'pinia';

import { useAuthorizationStore } from '../stores/authorization.store';

import type { AccionPermiso, ModuloSistema } from '../types/authorization.types';

export const useAuthorization = () => {
  const authorizationStore = useAuthorizationStore();

  const { permisos, modulos, modulosVisibles, cargado } = storeToRefs(authorizationStore);

  const tienePermiso = (modulo: ModuloSistema, accion: AccionPermiso = 'ver'): boolean => {
    return authorizationStore.tienePermiso(modulo, accion);
  };

  const puedeVer = (modulo: ModuloSistema): boolean => {
    return authorizationStore.puedeVer(modulo);
  };

  const puedeCrear = (modulo: ModuloSistema): boolean => {
    return authorizationStore.puedeCrear(modulo);
  };

  const puedeEditar = (modulo: ModuloSistema): boolean => {
    return authorizationStore.puedeEditar(modulo);
  };

  const puedeEliminar = (modulo: ModuloSistema): boolean => {
    return authorizationStore.puedeEliminar(modulo);
  };

  return {
    permisos,
    modulos,
    modulosVisibles,
    cargado,
    tienePermiso,
    puedeVer,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
  };
};
