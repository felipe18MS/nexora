import { productosMock } from '../mocks/product.mock';

import type { ActualizarProducto, CrearProducto, Producto } from '../types/product.types';

let productos: Producto[] = [...productosMock];

export const productoService = {
  obtenerTodos(): Producto[] {
    return [...productos];
  },

  obtenerPorId(id: string): Producto | undefined {
    return productos.find((producto) => producto.id === id);
  },

  crear(datos: CrearProducto): Producto {
    const nuevoProducto: Producto = {
      ...datos,
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
    };

    productos.push(nuevoProducto);

    return nuevoProducto;
  },

  actualizar(datos: ActualizarProducto): Producto {
    const indice = productos.findIndex((producto) => producto.id === datos.id);

    if (indice === -1) {
      throw new Error('Producto no encontrado');
    }

    const productoActual = productos[indice];

    if (!productoActual) {
      throw new Error('Producto no encontrado');
    }

    const productoActualizado: Producto = {
      id: productoActual.id,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      codigo: datos.codigo,
      categoria: datos.categoria,
      precio: datos.precio,
      costo: datos.costo,
      stock: datos.stock,
      stockMinimo: datos.stockMinimo,
      unidad: datos.unidad,
      activo: datos.activo,
      creadoEn: productoActual.creadoEn,
      actualizadoEn: new Date().toISOString(),
    };

    productos[indice] = productoActualizado;

    return productoActualizado;
  },

  eliminar(id: string): void {
    productos = productos.filter((producto) => producto.id !== id);
  },

  cambiarEstado(id: string, activo: boolean): void {
    const producto = productos.find((item) => item.id === id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    producto.activo = activo;
    producto.actualizadoEn = new Date().toISOString();
  },
};
