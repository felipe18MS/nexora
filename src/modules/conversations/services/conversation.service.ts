import { conversacionesMock, mensajesConversacionMock } from '../mocks/conversation.mock';

import type {
  Conversacion,
  CrearConversacion,
  EnviarMensaje,
  MensajeConversacion,
} from '../types/conversation.types';

export const obtenerConversaciones = (): Conversacion[] => [...conversacionesMock];

export const obtenerConversacionPorId = (id: string): Conversacion | undefined => {
  return conversacionesMock.find((conversacion) => conversacion.id === id);
};

export const obtenerMensajesPorConversacion = (conversacionId: string): MensajeConversacion[] => {
  return mensajesConversacionMock
    .filter((mensaje) => mensaje.conversacionId === conversacionId)
    .sort((a, b) => new Date(a.creadoEn).getTime() - new Date(b.creadoEn).getTime());
};

export const crearConversacion = (datos: CrearConversacion): Conversacion => {
  const ahora = new Date().toISOString();

  const conversacion: Conversacion = {
    id: `conv-${Date.now()}`,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    clienteTelefono: datos.clienteTelefono,
    canal: datos.canal,
    estado: 'abierta',
    asunto: datos.asunto,
    ultimoMensaje: datos.mensajeInicial ?? '',
    ultimoMensajeEn: ahora,
    mensajesNoLeidos: 0,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  conversacionesMock.unshift(conversacion);

  if (datos.mensajeInicial?.trim()) {
    mensajesConversacionMock.push({
      id: `msg-${Date.now()}`,
      conversacionId: conversacion.id,
      tipo: 'saliente',
      contenido: datos.mensajeInicial.trim(),
      creadoEn: ahora,
      creadoPor: 'Usuario',
    });
  }

  return { ...conversacion };
};

export const enviarMensaje = (datos: EnviarMensaje): MensajeConversacion | null => {
  const conversacion = conversacionesMock.find((item) => item.id === datos.conversacionId);

  if (!conversacion || !datos.contenido.trim()) {
    return null;
  }

  const ahora = new Date().toISOString();

  const mensaje: MensajeConversacion = {
    id: `msg-${Date.now()}`,
    conversacionId: datos.conversacionId,
    tipo: datos.tipo ?? 'saliente',
    contenido: datos.contenido.trim(),
    creadoEn: ahora,
    creadoPor: 'Usuario',
  };

  mensajesConversacionMock.push(mensaje);

  conversacion.ultimoMensaje = mensaje.contenido;
  conversacion.ultimoMensajeEn = ahora;
  conversacion.actualizadoEn = ahora;

  return { ...mensaje };
};

export const marcarConversacionLeida = (id: string): Conversacion | null => {
  const conversacion = conversacionesMock.find((item) => item.id === id);

  if (!conversacion) {
    return null;
  }

  conversacion.mensajesNoLeidos = 0;

  return { ...conversacion };
};
