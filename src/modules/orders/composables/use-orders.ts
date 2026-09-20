import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useOrderStore } from '../stores/order.store';

import type { ActualizarEstadoPedido, CrearPedido } from '../types/order.types';

export const useOrders = () => {
  const orderStore = useOrderStore();

  const { pedidos, cargando } = storeToRefs(orderStore);

  const totalPedidos = computed(() => orderStore.totalPedidos);

  const pendientes = computed(() => orderStore.pendientes);

  const enProceso = computed(() => orderStore.enProceso);

  const entregados = computed(() => orderStore.entregados);

  const cancelados = computed(() => orderStore.cancelados);

  const ingresos = computed(() => orderStore.ingresos);

  const cargarPedidos = (): void => {
    orderStore.cargarPedidos();
  };

  const crearPedido = (datos: CrearPedido) => {
    return orderStore.crearPedido(datos);
  };

  const actualizarEstado = (datos: ActualizarEstadoPedido): boolean => {
    return orderStore.actualizarEstado(datos);
  };

  const cancelarPedido = (id: string): boolean => {
    return orderStore.cancelar(id);
  };

  return {
    pedidos,
    cargando,
    totalPedidos,
    pendientes,
    enProceso,
    entregados,
    cancelados,
    ingresos,
    cargarPedidos,
    crearPedido,
    actualizarEstado,
    cancelarPedido,
  };
};
