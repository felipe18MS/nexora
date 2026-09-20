import { automatizacionesMock } from '../mocks/automation.mock';

import type {
  ActualizarAutomatizacion,
  Automatizacion,
  CrearAutomatizacion,
  EstadoAutomatizacion,
  TipoDisparadorAutomatizacion,
} from '../types/automation.types';

export const obtenerAutomatizaciones = (): Automatizacion[] => {
  return [...automatizacionesMock];
};

export const obtenerAutomatizacionPorId = (id: string): Automatizacion | undefined => {
  return automatizacionesMock.find((automatizacion) => automatizacion.id === id);
};

export const crearAutomatizacion = (datos: CrearAutomatizacion): Automatizacion => {
  const ahora = new Date().toISOString();

  const automatizacion: Automatizacion = {
    id: `auto-${Date.now()}`,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    estado: datos.estado,
    disparador: datos.disparador,
    condiciones: datos.condiciones,
    acciones: datos.acciones,
    ejecuciones: 0,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  automatizacionesMock.unshift(automatizacion);

  return { ...automatizacion };
};

export const actualizarAutomatizacion = (
  datos: ActualizarAutomatizacion,
): Automatizacion | null => {
  const automatizacion = automatizacionesMock.find((item) => item.id === datos.id);

  if (!automatizacion) {
    return null;
  }

  if (datos.nombre !== undefined) {
    automatizacion.nombre = datos.nombre;
  }

  if (datos.descripcion !== undefined) {
    automatizacion.descripcion = datos.descripcion;
  }

  if (datos.estado !== undefined) {
    automatizacion.estado = datos.estado;
  }

  if (datos.disparador !== undefined) {
    automatizacion.disparador = datos.disparador;
  }

  if (datos.condiciones !== undefined) {
    automatizacion.condiciones = datos.condiciones;
  }

  if (datos.acciones !== undefined) {
    automatizacion.acciones = datos.acciones;
  }

  automatizacion.actualizadoEn = new Date().toISOString();

  return { ...automatizacion };
};

export const cambiarEstadoAutomatizacion = (
  id: string,
  estado: EstadoAutomatizacion,
): Automatizacion | null => {
  return actualizarAutomatizacion({
    id,
    estado,
  });
};

export const eliminarAutomatizacion = (id: string): boolean => {
  const indice = automatizacionesMock.findIndex((automatizacion) => automatizacion.id === id);

  if (indice === -1) {
    return false;
  }

  automatizacionesMock.splice(indice, 1);

  return true;
};

export const obtenerAutomatizacionesPorEstado = (
  estado: EstadoAutomatizacion,
): Automatizacion[] => {
  return automatizacionesMock.filter((automatizacion) => automatizacion.estado === estado);
};

export const obtenerAutomatizacionesPorDisparador = (
  disparador: TipoDisparadorAutomatizacion,
): Automatizacion[] => {
  return automatizacionesMock.filter((automatizacion) => automatizacion.disparador === disparador);
};
