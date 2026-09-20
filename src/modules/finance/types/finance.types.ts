export type TipoMovimientoFinanciero = 'ingreso' | 'gasto';

export type EstadoMovimientoFinanciero = 'registrado' | 'anulado';

export type MetodoPagoFinanciero = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';

export type CategoriaIngresoFinanciero = 'venta' | 'servicio' | 'cita' | 'otro';

export type CategoriaGastoFinanciero =
  'insumos' | 'nomina' | 'servicios' | 'alquiler' | 'marketing' | 'impuestos' | 'otro';

export interface MovimientoFinanciero {
  id: string;
  tipo: TipoMovimientoFinanciero;
  concepto: string;
  categoria: string;
  monto: number;
  metodoPago: MetodoPagoFinanciero;
  estado: EstadoMovimientoFinanciero;
  fecha: string;
  referencia?: string;
  descripcion: string;
  creadoEn: string;
}

export interface CrearMovimientoFinanciero {
  tipo: TipoMovimientoFinanciero;
  concepto: string;
  categoria: string;
  monto: number;
  metodoPago: MetodoPagoFinanciero;
  fecha: string;
  referencia?: string;
  descripcion: string;
}

export interface ActualizarMovimientoFinanciero {
  id: string;
  tipo?: TipoMovimientoFinanciero;
  concepto?: string;
  categoria?: string;
  monto?: number;
  metodoPago?: MetodoPagoFinanciero;
  estado?: EstadoMovimientoFinanciero;
  fecha?: string;
  referencia?: string;
  descripcion?: string;
}

export interface FiltrosFinanzas {
  busqueda: string;
  tipo: TipoMovimientoFinanciero | null;
  categoria: string | null;
  metodoPago: MetodoPagoFinanciero | null;
  estado: EstadoMovimientoFinanciero | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface ResumenFinanzas {
  ingresos: number;
  gastos: number;
  balance: number;
  movimientos: number;
}
