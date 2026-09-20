import { llamadasMock } from '../mocks/call.mock';

import type { ActualizarLlamada, CrearLlamada, EstadoLlamada, Llamada } from '../types/call.types';

export const obtenerLlamadas = (): Llamada[] => {
  return [...llamadasMock];
};

export const obtenerLlamadaPorId = (id: string): Llamada | undefined => {
  return llamadasMock.find((llamada) => llamada.id === id);
};

export const crearLlamada = (datos: CrearLlamada): Llamada => {
  const ahora = new Date().toISOString();

  const llamada: Llamada = {
    id: `call-${Date.now()}`,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    telefono: datos.telefono,
    direccion: datos.direccion,
    estado: datos.estado,
    duracionSegundos: datos.duracionSegundos,
    fechaHora: datos.fechaHora,
    ...(datos.resultado ? { resultado: datos.resultado } : {}),
    notas: datos.notas,
    creadoEn: ahora,
  };

  llamadasMock.unshift(llamada);

  return { ...llamada };
};

export const actualizarLlamada = (datos: ActualizarLlamada): Llamada | null => {
  const llamada = llamadasMock.find((item) => item.id === datos.id);

  if (!llamada) {
    return null;
  }

  if (datos.estado !== undefined) {
    llamada.estado = datos.estado;
  }

  if (datos.resultado !== undefined) {
    llamada.resultado = datos.resultado;
  }

  if (datos.notas !== undefined) {
    llamada.notas = datos.notas;
  }

  return { ...llamada };
};

export const eliminarLlamada = (id: string): boolean => {
  const indice = llamadasMock.findIndex((llamada) => llamada.id === id);

  if (indice === -1) {
    return false;
  }

  llamadasMock.splice(indice, 1);

  return true;
};

export const obtenerLlamadasPorEstado = (estado: EstadoLlamada): Llamada[] => {
  return llamadasMock.filter((llamada) => llamada.estado === estado);
};
