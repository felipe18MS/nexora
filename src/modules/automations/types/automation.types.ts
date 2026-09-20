export type EstadoAutomatizacion = 'activa' | 'inactiva' | 'borrador';

export type TipoDisparadorAutomatizacion =
  | 'cita-creada'
  | 'cita-confirmada'
  | 'cita-cancelada'
  | 'recordatorio'
  | 'cliente-creado'
  | 'pago-pendiente'
  | 'mensaje-recibido'
  | 'llamada-perdida'
  | 'manual';

export type TipoAccionAutomatizacion =
  | 'enviar-whatsapp'
  | 'enviar-email'
  | 'crear-recordatorio'
  | 'crear-tarea'
  | 'actualizar-cita'
  | 'notificar-equipo';

export interface CondicionAutomatizacion {
  id: string;
  campo: string;
  operador: 'igual' | 'diferente' | 'contiene' | 'mayor' | 'menor';
  valor: string;
}

export interface AccionAutomatizacion {
  id: string;
  tipo: TipoAccionAutomatizacion;
  nombre: string;
  configuracion: Record<string, string>;
}

export interface Automatizacion {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoAutomatizacion;
  disparador: TipoDisparadorAutomatizacion;
  condiciones: CondicionAutomatizacion[];
  acciones: AccionAutomatizacion[];
  ejecuciones: number;
  ultimaEjecucion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearAutomatizacion {
  nombre: string;
  descripcion: string;
  estado: EstadoAutomatizacion;
  disparador: TipoDisparadorAutomatizacion;
  condiciones: CondicionAutomatizacion[];
  acciones: AccionAutomatizacion[];
}

export interface ActualizarAutomatizacion {
  id: string;
  nombre?: string;
  descripcion?: string;
  estado?: EstadoAutomatizacion;
  disparador?: TipoDisparadorAutomatizacion;
  condiciones?: CondicionAutomatizacion[];
  acciones?: AccionAutomatizacion[];
}

export interface FiltrosAutomatizacion {
  busqueda: string;
  estado: EstadoAutomatizacion | null;
  disparador: TipoDisparadorAutomatizacion | null;
}

export interface ResumenAutomatizaciones {
  total: number;
  activas: number;
  inactivas: number;
  borradores: number;
  ejecuciones: number;
}
