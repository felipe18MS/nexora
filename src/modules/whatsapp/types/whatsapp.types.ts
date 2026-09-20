export type EstadoConexionWhatsApp = 'conectado' | 'desconectado' | 'pendiente';

export type EstadoMensajeWhatsApp = 'pendiente' | 'enviado' | 'entregado' | 'leido' | 'fallido';

export interface ConexionWhatsApp {
  id: string;
  nombreCuenta: string;
  numero: string;
  estado: EstadoConexionWhatsApp;
  ultimaConexion: string;
  mensajesEnviados: number;
  mensajesRecibidos: number;
}

export interface MensajeWhatsApp {
  id: string;
  clienteId: string;
  clienteNombre: string;
  telefono: string;
  contenido: string;
  direccion: 'entrante' | 'saliente';
  estado: EstadoMensajeWhatsApp;
  creadoEn: string;
}

export interface CrearMensajeWhatsApp {
  clienteId: string;
  clienteNombre: string;
  telefono: string;
  contenido: string;
}

export interface ConfiguracionWhatsApp {
  nombreCuenta: string;
  numero: string;
  webhookActivo: boolean;
  respuestasAutomaticas: boolean;
}
