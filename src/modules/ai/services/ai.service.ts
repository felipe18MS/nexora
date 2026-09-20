import { agenteIAMock, sesionPruebaIAMock } from '../mocks/ai.mock';

import type {
  AgenteIA,
  ActualizarAgenteIA,
  ConfiguracionAgenteIA,
  MensajePruebaIA,
  SesionPruebaIA,
} from '../types/ai.types';

export const obtenerAgenteIA = (): AgenteIA => {
  return {
    ...agenteIAMock,
    configuracion: {
      ...agenteIAMock.configuracion,
      canales: [...agenteIAMock.configuracion.canales],
      capacidades: [...agenteIAMock.configuracion.capacidades],
      horarios: {
        ...agenteIAMock.configuracion.horarios,
      },
    },
  };
};

export const actualizarAgenteIA = (datos: ActualizarAgenteIA): AgenteIA => {
  if (datos.nombre !== undefined) {
    agenteIAMock.nombre = datos.nombre;
    agenteIAMock.configuracion.nombre = datos.nombre;
  }

  if (datos.descripcion !== undefined) {
    agenteIAMock.descripcion = datos.descripcion;
  }

  if (datos.estado !== undefined) {
    agenteIAMock.estado = datos.estado;
  }

  if (datos.configuracion !== undefined) {
    agenteIAMock.configuracion = {
      ...datos.configuracion,
      canales: [...datos.configuracion.canales],
      capacidades: [...datos.configuracion.capacidades],
      horarios: {
        ...datos.configuracion.horarios,
      },
    };

    agenteIAMock.nombre = datos.configuracion.nombre;
  }

  agenteIAMock.actualizadoEn = new Date().toISOString();

  return obtenerAgenteIA();
};

export const actualizarConfiguracionIA = (configuracion: ConfiguracionAgenteIA): AgenteIA => {
  return actualizarAgenteIA({
    configuracion,
  });
};

export const cambiarEstadoAgenteIA = (estado: AgenteIA['estado']): AgenteIA => {
  return actualizarAgenteIA({
    estado,
  });
};

export const obtenerSesionPruebaIA = (): SesionPruebaIA => {
  return {
    ...sesionPruebaIAMock,
    mensajes: [...sesionPruebaIAMock.mensajes],
  };
};

export const enviarMensajePruebaIA = (contenido: string): MensajePruebaIA => {
  const mensaje: MensajePruebaIA = {
    id: `msg-ai-${Date.now()}`,
    rol: 'usuario',
    contenido,
    creadoEn: new Date().toISOString(),
  };

  sesionPruebaIAMock.mensajes.push(mensaje);

  const respuesta: MensajePruebaIA = {
    id: `msg-ai-${Date.now()}-response`,
    rol: 'agente',
    contenido:
      'Entiendo. Puedo ayudarte con información sobre nuestros servicios, horarios y gestión de citas.',
    creadoEn: new Date().toISOString(),
  };

  sesionPruebaIAMock.mensajes.push(respuesta);

  return respuesta;
};

export const reiniciarSesionPruebaIA = (): SesionPruebaIA => {
  sesionPruebaIAMock.mensajes = [
    {
      id: 'msg-ai-001',
      rol: 'agente',
      contenido: '¡Hola! Soy el asistente virtual de nuestro negocio. ¿En qué puedo ayudarte?',
      creadoEn: new Date().toISOString(),
    },
  ];

  return obtenerSesionPruebaIA();
};
