export type TipoReporte = 'financiero' | 'citas' | 'clientes' | 'servicios' | 'ventas';

export type PeriodoReporte = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio' | 'personalizado';

export interface RangoFechasReporte {
  desde: string;
  hasta: string;
}

export interface IndicadorReporte {
  id: string;
  nombre: string;
  valor: number;
  valorAnterior?: number;
  unidad: 'numero' | 'moneda' | 'porcentaje';
  tendencia?: number;
}

export interface PuntoSerieReporte {
  etiqueta: string;
  valor: number;
}

export interface SerieReporte {
  id: string;
  nombre: string;
  tipo: 'linea' | 'barra';
  puntos: PuntoSerieReporte[];
}

export interface FilaReporte {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  cantidad: number;
  monto: number;
}

export interface Reporte {
  id: string;
  tipo: TipoReporte;
  nombre: string;
  descripcion: string;
  periodo: PeriodoReporte;
  rangoFechas: RangoFechasReporte;
  indicadores: IndicadorReporte[];
  series: SerieReporte[];
  filas: FilaReporte[];
  generadoEn: string;
}

export interface FiltrosReportes {
  tipo: TipoReporte | null;
  periodo: PeriodoReporte;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface ResumenReportes {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  totalCitas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  nuevosClientes: number;
  serviciosRealizados: number;
}

export interface CrearReporte {
  tipo: TipoReporte;
  periodo: PeriodoReporte;
  rangoFechas: RangoFechasReporte;
}

export interface ActualizarReporte {
  id: string;
  tipo?: TipoReporte;
  periodo?: PeriodoReporte;
  rangoFechas?: RangoFechasReporte;
}
