import { defineStore } from 'pinia';
import {
  obtenerInventarios,
  obtenerMovimientos,
  registrarMovimiento,
} from '../services/inventory.service';
import type {
  CrearMovimientoInventario,
  Inventario,
  MovimientoInventario,
} from '../types/inventory.types';

interface InventoryState {
  inventarios: Inventario[];
  movimientos: MovimientoInventario[];
  cargando: boolean;
}

export const useInventoryStore = defineStore('inventory', {
  state: (): InventoryState => ({
    inventarios: [],
    movimientos: [],
    cargando: false,
  }),

  getters: {
    totalProductos: (state) => state.inventarios.length,

    totalUnidades: (state) => state.inventarios.reduce((total, item) => total + item.stock, 0),

    productosStockBajo: (state) =>
      state.inventarios.filter((item) => item.stock > 0 && item.stock <= item.stockMinimo).length,

    productosAgotados: (state) => state.inventarios.filter((item) => item.stock === 0).length,

    valorTotalInventario: () => 0,
  },

  actions: {
    cargarInventario(): void {
      this.cargando = true;

      this.inventarios = obtenerInventarios();
      this.movimientos = obtenerMovimientos();

      this.cargando = false;
    },

    registrarMovimiento(datos: CrearMovimientoInventario): boolean {
      const movimiento = registrarMovimiento(datos);

      if (!movimiento) {
        return false;
      }

      this.inventarios = obtenerInventarios();
      this.movimientos = obtenerMovimientos();

      return true;
    },
  },
});
