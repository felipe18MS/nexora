import { pedidosMock } from '../mocks/order.mock';

import type {
  ActualizarEstadoPedido,
  CrearPedido,
  EstadoPedido,
  Pedido,
} from '../types/order.types';

export const obtenerPedidos = (): Pedido[] => {
  return [...pedidosMock];
};

export const obtenerPedidoPorId = (id: string): Pedido | undefined => {
  return pedidosMock.find((pedido) => pedido.id === id);
};

export const crearPedido = (datos: CrearPedido): Pedido => {
  const ahora = new Date().toISOString();

  const subtotal = datos.items.reduce((total, item) => total + item.subtotal, 0);

  const descuento = Math.max(0, Math.min(datos.descuento, subtotal));

  const pedido: Pedido = {
    id: `ped-${Date.now()}`,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    items: datos.items,
    subtotal,
    descuento,
    total: subtotal - descuento,
    estado: 'pendiente',
    metodoPago: datos.metodoPago,
    notas: datos.notas,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  pedidosMock.unshift(pedido);

  return { ...pedido };
};

export const actualizarEstadoPedido = (datos: ActualizarEstadoPedido): Pedido | null => {
  const pedido = pedidosMock.find((item) => item.id === datos.id);

  if (!pedido) {
    return null;
  }

  pedido.estado = datos.estado;
  pedido.actualizadoEn = new Date().toISOString();

  return { ...pedido };
};

export const cancelarPedido = (id: string): Pedido | null => {
  return actualizarEstadoPedido({
    id,
    estado: 'cancelado',
  });
};

export const obtenerPedidosPorEstado = (estado: EstadoPedido): Pedido[] => {
  return pedidosMock.filter((pedido) => pedido.estado === estado);
};
