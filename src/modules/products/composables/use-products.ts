import { storeToRefs } from 'pinia';

import { useProductoStore } from '../stores/product.store';

export function useProductos() {
  const tienda = useProductoStore();

  const {
    productos,
    cargando,
    guardando,
    error,
    filtros,
    productosFiltrados,
    categorias,
    totalProductos,
    productosActivos,
    productosStockBajo,
    productosAgotados,
  } = storeToRefs(tienda);

  return {
    productos,
    cargando,
    guardando,
    error,
    filtros,
    productosFiltrados,
    categorias,
    totalProductos,
    productosActivos,
    productosStockBajo,
    productosAgotados,

    cargarProductos: tienda.cargarProductos,
    crearProducto: tienda.crearProducto,
    actualizarProducto: tienda.actualizarProducto,
    eliminarProducto: tienda.eliminarProducto,
    cambiarEstadoProducto: tienda.cambiarEstadoProducto,
    actualizarFiltros: tienda.actualizarFiltros,
    limpiarFiltros: tienda.limpiarFiltros,
  };
}
