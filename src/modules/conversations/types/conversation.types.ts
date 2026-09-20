export type CanalConversacion = 'whatsapp' | 'llamada' | 'email' | 'interno';

export type EstadoConversacion = 'abierta' | 'pendiente' | 'resuelta' | 'cerrada';

export type TipoMensaje = 'entrante' | 'saliente' | 'interno';

export interface MensajeConversacion {
  id: string;
  conversacionId: string;
  tipo: TipoMensaje;
  contenido: string;
  creadoEn: string;
  creadoPor?: string;
}

export interface Conversacion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  canal: CanalConversacion;
  estado: EstadoConversacion;
  asunto: string;
  ultimoMensaje: string;
  ultimoMensajeEn: string;
  mensajesNoLeidos: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearConversacion {
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  canal: CanalConversacion;
  asunto: string;
  mensajeInicial?: string;
}

export interface EnviarMensaje {
  conversacionId: string;
  contenido: string;
  tipo?: TipoMensaje;
}

export interface FiltrosConversacion {
  busqueda: string;
  estado: EstadoConversacion | null;
  canal: CanalConversacion | null;
}
