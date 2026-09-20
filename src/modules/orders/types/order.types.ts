export type EstadoPedido =
  'pendiente' | 'confirmado' | 'en-preparacion' | 'listo' | 'entregado' | 'cancelado';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';

export interface ItemPedido {
  id: string;
  productoId?: string;
  servicioId?: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  items: ItemPedido[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  notas: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearPedido {
  clienteId: string;
  clienteNombre: string;
  items: ItemPedido[];
  descuento: number;
  metodoPago: MetodoPago;
  notas: string;
}

export interface ActualizarEstadoPedido {
  id: string;
  estado: EstadoPedido;
}

export interface FiltrosPedido {
  busqueda: string;
  estado: EstadoPedido | null;
  metodoPago: MetodoPago | null;
}

export interface ResumenPedidos {
  totalPedidos: number;
  pendientes: number;
  enProceso: number;
  entregados: number;
  cancelados: number;
  ingresos: number;
}
