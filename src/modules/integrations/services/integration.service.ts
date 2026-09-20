import { integracionesMock } from '../mocks/integration.mock';

import type {
  ActualizarIntegracion,
  ConfigurarIntegracion,
  EstadoIntegracion,
  FiltrosIntegraciones,
  Integracion,
  ResumenIntegraciones,
} from '../types/integration.types';

const clonarIntegraciones = (): Integracion[] => {
  return integracionesMock.map((integracion) => ({
    ...integracion,
    detalles: [...integracion.detalles],
  }));
};

export const obtenerIntegraciones = (): Integracion[] => {
  return clonarIntegraciones();
};

export const obtenerIntegracion = (id: string): Integracion | null => {
  const integracion = integracionesMock.find((item) => item.id === id);

  if (!integracion) {
    return null;
  }

  return {
    ...integracion,
    detalles: [...integracion.detalles],
  };
};

export const filtrarIntegraciones = (filtros: FiltrosIntegraciones): Integracion[] => {
  return clonarIntegraciones().filter((integracion) => {
    const coincideCategoria = !filtros.categoria || integracion.categoria === filtros.categoria;

    const coincideEstado = !filtros.estado || integracion.estado === filtros.estado;

    return coincideCategoria && coincideEstado;
  });
};

export const actualizarIntegracion = (datos: ActualizarIntegracion): Integracion | null => {
  const integracion = integracionesMock.find((item) => item.id === datos.id);

  if (!integracion) {
    return null;
  }

  if (datos.estado !== undefined) {
    integracion.estado = datos.estado;
  }

  if (datos.activa !== undefined) {
    integracion.activa = datos.activa;
  }

  if (datos.configurada !== undefined) {
    integracion.configurada = datos.configurada;
  }

  if (datos.estado === 'conectada') {
    integracion.ultimaConexion = new Date().toISOString();
  }

  return {
    ...integracion,
    detalles: [...integracion.detalles],
  };
};

export const conectarIntegracion = (id: string): Integracion | null => {
  return actualizarIntegracion({
    id,
    estado: 'conectada',
    activa: true,
    configurada: true,
  });
};

export const desconectarIntegracion = (id: string): Integracion | null => {
  return actualizarIntegracion({
    id,
    estado: 'desconectada',
    activa: false,
  });
};

export const configurarIntegracion = (datos: ConfigurarIntegracion): Integracion | null => {
  return actualizarIntegracion({
    id: datos.id,
    estado: 'conectada',
    activa: true,
    configurada: true,
  });
};

export const obtenerResumenIntegraciones = (): ResumenIntegraciones => {
  const integraciones = integracionesMock;

  return {
    total: integraciones.length,

    conectadas: integraciones.filter((item) => item.estado === 'conectada').length,

    pendientes: integraciones.filter((item) => item.estado === 'pendiente').length,

    desconectadas: integraciones.filter((item) => item.estado === 'desconectada').length,
  };
};

export const obtenerEstadosIntegracion = (): Array<{
  label: string;
  value: EstadoIntegracion;
}> => {
  return [
    {
      label: 'Conectadas',
      value: 'conectada',
    },
    {
      label: 'Pendientes',
      value: 'pendiente',
    },
    {
      label: 'Desconectadas',
      value: 'desconectada',
    },
  ];
};

export const obtenerCategoriasIntegracion = (): string[] => {
  return [...new Set(integracionesMock.map((integracion) => integracion.categoria))];
};
