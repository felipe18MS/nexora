export type DireccionLlamada = 'entrante' | 'saliente';

export type EstadoLlamada = 'completada' | 'perdida' | 'rechazada' | 'en-curso' | 'programada';

export type ResultadoLlamada =
  'cita-agendada' | 'consulta' | 'seguimiento' | 'sin-respuesta' | 'otro';

export interface Llamada {
  id: string;
  clienteId: string;
  clienteNombre: string;
  telefono: string;
  direccion: DireccionLlamada;
  estado: EstadoLlamada;
  duracionSegundos: number;
  fechaHora: string;
  resultado?: ResultadoLlamada;
  notas: string;
  creadoEn: string;
}

export interface CrearLlamada {
  clienteId: string;
  clienteNombre: string;
  telefono: string;
  direccion: DireccionLlamada;
  estado: EstadoLlamada;
  duracionSegundos: number;
  fechaHora: string;
  resultado?: ResultadoLlamada;
  notas: string;
}

export interface ActualizarLlamada {
  id: string;
  estado?: EstadoLlamada;
  resultado?: ResultadoLlamada;
  notas?: string;
}

export interface FiltrosLlamadas {
  busqueda: string;
  direccion: DireccionLlamada | null;
  estado: EstadoLlamada | null;
  resultado: ResultadoLlamada | null;
}

export interface ResumenLlamadas {
  totalLlamadas: number;
  entrantes: number;
  salientes: number;
  perdidas: number;
  duracionTotalSegundos: number;
}
