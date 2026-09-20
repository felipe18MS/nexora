import { computed } from 'vue';

import { useAuthStore } from '../stores/auth.store';

import type { CredencialesLogin, CredencialesRegistro } from '../types/auth.types';

export const useAuth = () => {
  const store = useAuthStore();

  const sesion = computed(() => store.sesion);

  const usuario = computed(() => store.usuario);

  const suscripcion = computed(() => store.suscripcion);

  const autenticado = computed(() => store.autenticado);

  const cargando = computed(() => store.cargando);

  const error = computed(() => store.error);

  const esSuperadministrador = computed(() => store.esSuperadministrador);

  const esAdministrador = computed(() => store.esAdministrador);

  const diasRestantes = computed(() => store.diasRestantes);

  const accesoPermitido = computed(() => store.accesoPermitido);

  const iniciarSesion = (credenciales: CredencialesLogin): boolean => {
    return store.iniciarSesion(credenciales);
  };

  const iniciarSesionConGoogle = (): boolean => {
    return store.iniciarSesionConGoogle();
  };

  const registrar = (datos: CredencialesRegistro): boolean => {
    return store.registrar(datos);
  };

  const restaurarSesion = (): void => {
    store.restaurarSesion();
  };

  const cerrarSesion = (): void => {
    store.cerrarSesion();
  };

  const tienePermiso = (permiso: string): boolean => {
    return store.tienePermiso(permiso);
  };

  return {
    iniciarSesionConGoogle,
    registrar,
    sesion,
    usuario,
    suscripcion,
    autenticado,
    cargando,
    error,
    esSuperadministrador,
    esAdministrador,
    diasRestantes,
    accesoPermitido,
    iniciarSesion,
    restaurarSesion,
    cerrarSesion,
    tienePermiso,
  };
};
