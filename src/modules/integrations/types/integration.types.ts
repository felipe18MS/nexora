export type TipoIntegracion =
  'whatsapp' | 'google-calendar' | 'mercado-pago' | 'dian' | 'email' | 'google-maps' | 'webhooks';

export type EstadoIntegracion = 'conectada' | 'desconectada' | 'pendiente';

export interface Integracion {
  id: string;
  tipo: TipoIntegracion;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: string;
  estado: EstadoIntegracion;
  activa: boolean;
  configurada: boolean;
  ultimaConexion: string | null;
  detalles: string[];
}

export interface FiltrosIntegraciones {
  categoria: string | null;
  estado: EstadoIntegracion | null;
}

export interface ActualizarIntegracion {
  id: string;
  estado?: EstadoIntegracion;
  activa?: boolean;
  configurada?: boolean;
}

export interface ConfigurarIntegracion {
  id: string;
  valores: Record<string, string>;
}

export interface ResumenIntegraciones {
  total: number;
  conectadas: number;
  pendientes: number;
  desconectadas: number;
}
