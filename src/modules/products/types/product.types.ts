export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  categoria: string;
  precio: number;
  costo: number;
  stock: number;
  stockMinimo: number;
  unidad: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn?: string;
}

export interface CrearProducto {
  nombre: string;
  descripcion: string;
  codigo: string;
  categoria: string;
  precio: number;
  costo: number;
  stock: number;
  stockMinimo: number;
  unidad: string;
  activo: boolean;
}

export interface ActualizarProducto extends CrearProducto {
  id: string;
}

export interface FiltrosProducto {
  busqueda: string;
  categoria: string | null;
  estado: boolean | null;
}
