import type { EstadoSuscripcion, Suscripcion } from '../../auth/types/auth.types';

export const DIAS_PRUEBA_NEXORA = 7;

export const crearFechaVencimiento = (fechaInicio: string, dias: number): string => {
  const fecha = new Date(fechaInicio);

  fecha.setDate(fecha.getDate() + dias);

  return fecha.toISOString();
};

export const crearSuscripcionPrueba = (dias: number = DIAS_PRUEBA_NEXORA): Suscripcion => {
  const fechaInicio = new Date().toISOString();

  return {
    estado: 'prueba',
    plan: null,
    fechaInicio,
    fechaVencimiento: crearFechaVencimiento(fechaInicio, dias),
    diasPrueba: dias,
  };
};

export const obtenerDiasRestantes = (suscripcion: Suscripcion): number => {
  const ahora = new Date();
  const vencimiento = new Date(suscripcion.fechaVencimiento);

  const diferencia = vencimiento.getTime() - ahora.getTime();

  if (diferencia <= 0) {
    return 0;
  }

  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

export const estaVencida = (suscripcion: Suscripcion): boolean => {
  return obtenerDiasRestantes(suscripcion) === 0;
};

export const actualizarEstadoSuscripcion = (suscripcion: Suscripcion): Suscripcion => {
  if (suscripcion.estado === 'prueba' && estaVencida(suscripcion)) {
    return {
      ...suscripcion,
      estado: 'vencida',
    };
  }

  if (suscripcion.estado === 'activa' && estaVencida(suscripcion)) {
    return {
      ...suscripcion,
      estado: 'vencida',
    };
  }

  return suscripcion;
};

export const tieneAccesoAlSistema = (suscripcion: Suscripcion | null, rol: string): boolean => {
  // El superadministrador de NEXORA
  // no depende de una suscripción de negocio.
  if (rol === 'superadministrador') {
    return true;
  }

  if (!suscripcion) {
    return false;
  }

  const suscripcionActualizada = actualizarEstadoSuscripcion(suscripcion);

  return suscripcionActualizada.estado === 'prueba' || suscripcionActualizada.estado === 'activa';
};

export const obtenerEstadoSuscripcion = (
  suscripcion: Suscripcion | null,
): EstadoSuscripcion | null => {
  if (!suscripcion) {
    return null;
  }

  return actualizarEstadoSuscripcion(suscripcion).estado;
};
