import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import {
  actualizarEstadoSuscripcion,
  obtenerDiasRestantes,
  tieneAccesoAlSistema,
} from '../../subscription';

import {
  convertirPermisosSimplesAPermisosModulo,
  normalizarPermisos,
} from '@/modules/authorization/services/authorization.service';

import { useAuthorizationStore } from '@/modules/authorization/stores/authorization.store';

import type { CredencialesLogin, CredencialesRegistro, SesionAuth } from '../types/auth.types';

import { authService } from '../services/auth.service';

const STORAGE_KEY = 'nexora_session';

export const useAuthStore = defineStore('auth', () => {
  const sesion = ref<SesionAuth | null>(null);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  const autenticado = computed(() => {
    return sesion.value !== null;
  });

  const usuario = computed(() => {
    return sesion.value?.usuario ?? null;
  });

  const suscripcion = computed(() => {
    if (!sesion.value?.suscripcion) {
      return null;
    }

    return actualizarEstadoSuscripcion(sesion.value.suscripcion);
  });

  const esSuperadministrador = computed(() => {
    return usuario.value?.rol === 'superadministrador';
  });

  const esAdministrador = computed(() => {
    return usuario.value?.rol === 'administrador';
  });

  const diasRestantes = computed(() => {
    if (!suscripcion.value) {
      return 0;
    }

    return obtenerDiasRestantes(suscripcion.value);
  });

  const accesoPermitido = computed(() => {
    return tieneAccesoAlSistema(suscripcion.value, usuario.value?.rol ?? '');
  });

  /**
   * Sincroniza el usuario autenticado con
   * el sistema central de autorización.
   *
   * Durante la etapa mock soportamos ambos modelos:
   *
   * 1. permisosDetallados
   * 2. permisos: string[]
   */
  const sincronizarAutorizacion = (): void => {
    const authorizationStore = useAuthorizationStore();

    if (!usuario.value) {
      authorizationStore.limpiar();
      return;
    }

    if (esSuperadministrador.value) {
      authorizationStore.cargarPermisosSuperadministrador();
      return;
    }

    if (usuario.value.permisosDetallados?.length) {
      authorizationStore.cargarPermisos(normalizarPermisos(usuario.value.permisosDetallados));

      return;
    }

    authorizationStore.cargarPermisos(
      convertirPermisosSimplesAPermisosModulo(usuario.value.permisos),
    );
  };

  const iniciarSesion = (credenciales: CredencialesLogin): boolean => {
    cargando.value = true;
    error.value = null;

    const resultado = authService.iniciarSesion(credenciales);

    cargando.value = false;

    if (!resultado.exitoso || !resultado.sesion) {
      error.value = resultado.mensaje;
      return false;
    }

    sesion.value = resultado.sesion;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.sesion));

    sincronizarAutorizacion();

    return true;
  };

  const iniciarSesionConGoogle = (): boolean => {
    cargando.value = true;
    error.value = null;

    const resultado = authService.iniciarSesionConGoogle();

    cargando.value = false;

    if (!resultado.exitoso || !resultado.sesion) {
      error.value = resultado.mensaje;
      return false;
    }

    sesion.value = resultado.sesion;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.sesion));

    sincronizarAutorizacion();

    return true;
  };

  const registrar = (datos: CredencialesRegistro): boolean => {
    cargando.value = true;
    error.value = null;

    const resultado = authService.registrar(datos);

    cargando.value = false;

    if (!resultado.exitoso || !resultado.sesion) {
      error.value = resultado.mensaje;
      return false;
    }

    sesion.value = resultado.sesion;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.sesion));

    sincronizarAutorizacion();

    return true;
  };

  const restaurarSesion = (): void => {
    const sesionGuardada = localStorage.getItem(STORAGE_KEY);

    if (!sesionGuardada) {
      return;
    }

    try {
      const sesionParseada = JSON.parse(sesionGuardada) as SesionAuth;

      sesionParseada.suscripcion = sesionParseada.suscripcion
        ? actualizarEstadoSuscripcion(sesionParseada.suscripcion)
        : null;

      sesion.value = sesionParseada;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sesionParseada));

      sincronizarAutorizacion();
    } catch {
      localStorage.removeItem(STORAGE_KEY);

      sesion.value = null;

      const authorizationStore = useAuthorizationStore();

      authorizationStore.limpiar();
    }
  };

  const cerrarSesion = (): void => {
    sesion.value = null;
    error.value = null;

    localStorage.removeItem(STORAGE_KEY);

    const authorizationStore = useAuthorizationStore();

    authorizationStore.limpiar();
  };

  /**
   * Compatibilidad con el sistema actual.
   *
   * Más adelante esta función podrá delegar
   * completamente en authorizationStore.
   */
  const tienePermiso = (permiso: string): boolean => {
    if (esSuperadministrador.value) {
      return true;
    }

    return usuario.value?.permisos.includes(permiso) ?? false;
  };

  return {
    iniciarSesionConGoogle,
    registrar,
    sesion,
    cargando,
    error,
    autenticado,
    usuario,
    suscripcion,
    esSuperadministrador,
    esAdministrador,
    diasRestantes,
    accesoPermitido,
    iniciarSesion,
    restaurarSesion,
    cerrarSesion,
    tienePermiso,
    sincronizarAutorizacion,
  };
});
