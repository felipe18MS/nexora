export type TipoRecordatorio = 'cita' | 'pago' | 'seguimiento' | 'cumpleanos' | 'general';

export type EstadoRecordatorio = 'pendiente' | 'enviado' | 'cancelado';

export type CanalRecordatorio = 'whatsapp' | 'llamada' | 'email' | 'interno';

export interface Recordatorio {
  id: string;
  clienteId: string;
  clienteNombre: string;
  titulo: string;
  mensaje: string;
  tipo: TipoRecordatorio;
  canal: CanalRecordatorio;
  fechaProgramada: string;
  estado: EstadoRecordatorio;
  referenciaId?: string;
  creadoEn: string;
}

export interface CrearRecordatorio {
  clienteId: string;
  clienteNombre: string;
  titulo: string;
  mensaje: string;
  tipo: TipoRecordatorio;
  canal: CanalRecordatorio;
  fechaProgramada: string;
  referenciaId?: string;
}

export interface ActualizarRecordatorio {
  id: string;
  titulo?: string;
  mensaje?: string;
  tipo?: TipoRecordatorio;
  canal?: CanalRecordatorio;
  fechaProgramada?: string;
}

export interface FiltrosRecordatorio {
  busqueda: string;
  estado: EstadoRecordatorio | null;
  tipo: TipoRecordatorio | null;
  canal: CanalRecordatorio | null;
}
