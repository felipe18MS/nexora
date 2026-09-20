import { defineStore } from 'pinia';

import {
  actualizarEstadoPedido,
  cancelarPedido,
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
} from '../services/order.service';

import type { ActualizarEstadoPedido, CrearPedido, Pedido } from '../types/order.types';

interface OrderState {
  pedidos: Pedido[];
  cargando: boolean;
}

export const useOrderStore = defineStore('orders', {
  state: (): OrderState => ({
    pedidos: [],
    cargando: false,
  }),

  getters: {
    totalPedidos: (state) => state.pedidos.length,

    pendientes: (state) => state.pedidos.filter((pedido) => pedido.estado === 'pendiente').length,

    enProceso: (state) =>
      state.pedidos.filter(
        (pedido) =>
          pedido.estado === 'confirmado' ||
          pedido.estado === 'en-preparacion' ||
          pedido.estado === 'listo',
      ).length,

    entregados: (state) => state.pedidos.filter((pedido) => pedido.estado === 'entregado').length,

    cancelados: (state) => state.pedidos.filter((pedido) => pedido.estado === 'cancelado').length,

    ingresos: (state) =>
      state.pedidos
        .filter((pedido) => pedido.estado !== 'cancelado')
        .reduce((total, pedido) => total + pedido.total, 0),
  },

  actions: {
    cargarPedidos(): void {
      this.cargando = true;

      this.pedidos = obtenerPedidos();

      this.cargando = false;
    },

    obtenerPedido(id: string): Pedido | undefined {
      return obtenerPedidoPorId(id);
    },

    crearPedido(datos: CrearPedido): Pedido {
      const pedido = crearPedido(datos);

      this.pedidos = obtenerPedidos();

      return pedido;
    },

    actualizarEstado(datos: ActualizarEstadoPedido): boolean {
      const pedido = actualizarEstadoPedido(datos);

      if (!pedido) {
        return false;
      }

      this.pedidos = obtenerPedidos();

      return true;
    },

    cancelar(id: string): boolean {
      const pedido = cancelarPedido(id);

      if (!pedido) {
        return false;
      }

      this.pedidos = obtenerPedidos();

      return true;
    },
  },
});
