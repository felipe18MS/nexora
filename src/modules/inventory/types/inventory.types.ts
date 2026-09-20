export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste';

export type EstadoInventario = 'disponible' | 'stock-bajo' | 'agotado';

export interface Inventario {
  id: string;
  productoId: string;
  stock: number;
  stockMinimo: number;
  ubicacion: string;
  ultimaActualizacion: string;
}

export interface MovimientoInventario {
  id: string;
  inventarioId: string;
  productoId: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
  creadoPor: string;
  creadoEn: string;
}

export interface CrearMovimientoInventario {
  inventarioId: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
  creadoPor: string;
}

export interface FiltrosInventario {
  busqueda: string;
  estado: EstadoInventario | null;
  ubicacion: string | null;
}
