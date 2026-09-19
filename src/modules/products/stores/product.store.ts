import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { productoService } from '../services/product.service';

import type {
  ActualizarProducto,
  CrearProducto,
  FiltrosProducto,
  Producto,
} from '../types/product.types';

export const useProductoStore = defineStore('productos', () => {
  const productos = ref<Producto[]>([]);

  const cargando = ref(false);
  const guardando = ref(false);

  const error = ref<string | null>(null);

  const filtros = ref<FiltrosProducto>({
    busqueda: '',
    categoria: null,
    estado: null,
  });

  const productosFiltrados = computed(() => {
    const busqueda = filtros.value.busqueda.trim().toLowerCase();

    return productos.value.filter((producto) => {
      const coincideBusqueda =
        !busqueda ||
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.codigo.toLowerCase().includes(busqueda) ||
        producto.categoria.toLowerCase().includes(busqueda);

      const coincideCategoria =
        !filtros.value.categoria || producto.categoria === filtros.value.categoria;

      const coincideEstado =
        filtros.value.estado === null || producto.activo === filtros.value.estado;

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  });

  const categorias = computed(() => {
    return [...new Set(productos.value.map((producto) => producto.categoria))].sort();
  });

  const totalProductos = computed(() => {
    return productos.value.length;
  });

  const productosActivos = computed(() => {
    return productos.value.filter((producto) => producto.activo).length;
  });

  const productosStockBajo = computed(() => {
    return productos.value.filter(
      (producto) => producto.stock > 0 && producto.stock <= producto.stockMinimo,
    ).length;
  });

  const productosAgotados = computed(() => {
    return productos.value.filter((producto) => producto.stock === 0).length;
  });

  function cargarProductos(): void {
    cargando.value = true;
    error.value = null;

    try {
      productos.value = productoService.obtenerTodos();
    } catch {
      error.value = 'No fue posible cargar los productos';
    } finally {
      cargando.value = false;
    }
  }

  function crearProducto(datos: CrearProducto): boolean {
    guardando.value = true;
    error.value = null;

    try {
      const producto = productoService.crear(datos);

      productos.value.push(producto);

      return true;
    } catch {
      error.value = 'No fue posible crear el producto';

      return false;
    } finally {
      guardando.value = false;
    }
  }

  function actualizarProducto(datos: ActualizarProducto): boolean {
    guardando.value = true;
    error.value = null;

    try {
      const productoActualizado = productoService.actualizar(datos);

      const indice = productos.value.findIndex((producto) => producto.id === datos.id);

      if (indice !== -1) {
        productos.value[indice] = productoActualizado;
      }

      return true;
    } catch {
      error.value = 'No fue posible actualizar el producto';

      return false;
    } finally {
      guardando.value = false;
    }
  }

  function eliminarProducto(id: string): boolean {
    guardando.value = true;
    error.value = null;

    try {
      productoService.eliminar(id);

      productos.value = productos.value.filter((producto) => producto.id !== id);

      return true;
    } catch {
      error.value = 'No fue posible eliminar el producto';

      return false;
    } finally {
      guardando.value = false;
    }
  }

  function cambiarEstadoProducto(id: string, activo: boolean): boolean {
    guardando.value = true;
    error.value = null;

    try {
      productoService.cambiarEstado(id, activo);

      const producto = productos.value.find((item) => item.id === id);

      if (producto) {
        producto.activo = activo;
      }

      return true;
    } catch {
      error.value = 'No fue posible cambiar el estado del producto';

      return false;
    } finally {
      guardando.value = false;
    }
  }

  function actualizarFiltros(nuevosFiltros: Partial<FiltrosProducto>): void {
    filtros.value = {
      ...filtros.value,
      ...nuevosFiltros,
    };
  }

  function limpiarFiltros(): void {
    filtros.value = {
      busqueda: '',
      categoria: null,
      estado: null,
    };
  }

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
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto,
    actualizarFiltros,
    limpiarFiltros,
  };
});
