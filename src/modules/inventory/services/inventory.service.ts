import { inventariosMock, movimientosInventarioMock } from '../mocks/inventory.mock';
import type {
  CrearMovimientoInventario,
  Inventario,
  MovimientoInventario,
} from '../types/inventory.types';

export const obtenerInventarios = (): Inventario[] => {
  return [...inventariosMock];
};

export const obtenerMovimientos = (): MovimientoInventario[] => {
  return [...movimientosInventarioMock];
};

export const obtenerInventarioPorId = (id: string): Inventario | undefined => {
  return inventariosMock.find((inventario) => inventario.id === id);
};

export const obtenerMovimientosPorInventario = (inventarioId: string): MovimientoInventario[] => {
  return movimientosInventarioMock.filter((movimiento) => movimiento.inventarioId === inventarioId);
};

export const registrarMovimiento = (
  datos: CrearMovimientoInventario,
): MovimientoInventario | null => {
  const inventario = inventariosMock.find((item) => item.id === datos.inventarioId);

  if (!inventario || datos.cantidad <= 0) {
    return null;
  }

  if (datos.tipo === 'entrada') {
    inventario.stock += datos.cantidad;
  }

  if (datos.tipo === 'salida') {
    if (datos.cantidad > inventario.stock) {
      return null;
    }

    inventario.stock -= datos.cantidad;
  }

  if (datos.tipo === 'ajuste') {
    inventario.stock = datos.cantidad;
  }

  inventario.ultimaActualizacion = new Date().toISOString();

  const movimiento: MovimientoInventario = {
    id: `mov-${Date.now()}`,
    inventarioId: datos.inventarioId,
    productoId: inventario.productoId,
    tipo: datos.tipo,
    cantidad: datos.cantidad,
    motivo: datos.motivo,
    creadoPor: datos.creadoPor,
    creadoEn: inventario.ultimaActualizacion,
  };

  movimientosInventarioMock.unshift(movimiento);

  return { ...movimiento };
};
