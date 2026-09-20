import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useInventoryStore } from '../stores/inventory.store';
import type { CrearMovimientoInventario } from '../types/inventory.types';

export const useInventory = () => {
  const inventoryStore = useInventoryStore();

  const { inventarios, movimientos, cargando } = storeToRefs(inventoryStore);

  const totalProductos = computed(() => inventoryStore.totalProductos);

  const totalUnidades = computed(() => inventoryStore.totalUnidades);

  const productosStockBajo = computed(() => inventoryStore.productosStockBajo);

  const productosAgotados = computed(() => inventoryStore.productosAgotados);

  const cargarInventario = (): void => {
    inventoryStore.cargarInventario();
  };

  const registrarMovimiento = (datos: CrearMovimientoInventario): boolean => {
    return inventoryStore.registrarMovimiento(datos);
  };

  return {
    inventarios,
    movimientos,
    cargando,
    totalProductos,
    totalUnidades,
    productosStockBajo,
    productosAgotados,
    cargarInventario,
    registrarMovimiento,
  };
};
