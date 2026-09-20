import {
  configuracionWhatsAppMock,
  conexionWhatsAppMock,
  mensajesWhatsAppMock,
} from '../mocks/whatsapp.mock';

import type {
  ConfiguracionWhatsApp,
  CrearMensajeWhatsApp,
  ConexionWhatsApp,
  MensajeWhatsApp,
} from '../types/whatsapp.types';

export const obtenerConexionWhatsApp = (): ConexionWhatsApp => {
  return { ...conexionWhatsAppMock };
};

export const obtenerMensajesWhatsApp = (): MensajeWhatsApp[] => {
  return [...mensajesWhatsAppMock];
};

export const obtenerConfiguracionWhatsApp = (): ConfiguracionWhatsApp => {
  return { ...configuracionWhatsAppMock };
};

export const enviarMensajeWhatsApp = (datos: CrearMensajeWhatsApp): MensajeWhatsApp | null => {
  if (!datos.contenido.trim()) {
    return null;
  }

  const ahora = new Date().toISOString();

  const mensaje: MensajeWhatsApp = {
    id: `wam-${Date.now()}`,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    telefono: datos.telefono,
    contenido: datos.contenido.trim(),
    direccion: 'saliente',
    estado: 'enviado',
    creadoEn: ahora,
  };

  mensajesWhatsAppMock.push(mensaje);

  conexionWhatsAppMock.mensajesEnviados += 1;

  return { ...mensaje };
};

export const actualizarConfiguracionWhatsApp = (
  datos: ConfiguracionWhatsApp,
): ConfiguracionWhatsApp => {
  configuracionWhatsAppMock.nombreCuenta = datos.nombreCuenta;
  configuracionWhatsAppMock.numero = datos.numero;
  configuracionWhatsAppMock.webhookActivo = datos.webhookActivo;
  configuracionWhatsAppMock.respuestasAutomaticas = datos.respuestasAutomaticas;

  conexionWhatsAppMock.nombreCuenta = datos.nombreCuenta;
  conexionWhatsAppMock.numero = datos.numero;

  return { ...configuracionWhatsAppMock };
};

export const cambiarEstadoConexionWhatsApp = (
  estado: ConexionWhatsApp['estado'],
): ConexionWhatsApp => {
  conexionWhatsAppMock.estado = estado;

  if (estado === 'conectado') {
    conexionWhatsAppMock.ultimaConexion = new Date().toISOString();
  }

  return { ...conexionWhatsAppMock };
};
