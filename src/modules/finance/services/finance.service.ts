import { movimientosFinancierosMock } from '../mocks/finance.mock';

import type {
  ActualizarMovimientoFinanciero,
  CrearMovimientoFinanciero,
  FiltrosFinanzas,
  MovimientoFinanciero,
  ResumenFinanzas,
} from '../types/finance.types';

const obtenerMovimientosActivos = (): MovimientoFinanciero[] => {
  return movimientosFinancierosMock.filter((movimiento) => movimiento.estado === 'registrado');
};

export const obtenerMovimientosFinancieros = (): MovimientoFinanciero[] => {
  return movimientosFinancierosMock.map((movimiento) => ({
    ...movimiento,
  }));
};

export const obtenerMovimientoFinanciero = (id: string): MovimientoFinanciero | null => {
  const movimiento = movimientosFinancierosMock.find((item) => item.id === id);

  return movimiento ? { ...movimiento } : null;
};

export const crearMovimientoFinanciero = (
  datos: CrearMovimientoFinanciero,
): MovimientoFinanciero => {
  const movimiento: MovimientoFinanciero = {
    id: `mov-${Date.now()}`,
    tipo: datos.tipo,
    concepto: datos.concepto.trim(),
    categoria: datos.categoria,
    monto: datos.monto,
    metodoPago: datos.metodoPago,
    estado: 'registrado',
    fecha: datos.fecha,
    ...(datos.referencia?.trim()
      ? {
          referencia: datos.referencia.trim(),
        }
      : {}),
    descripcion: datos.descripcion.trim(),
    creadoEn: new Date().toISOString(),
  };

  movimientosFinancierosMock.unshift(movimiento);

  return {
    ...movimiento,
  };
};

export const actualizarMovimientoFinanciero = (
  datos: ActualizarMovimientoFinanciero,
): MovimientoFinanciero | null => {
  const indice = movimientosFinancierosMock.findIndex((movimiento) => movimiento.id === datos.id);

  if (indice === -1) {
    return null;
  }

  const movimiento = movimientosFinancierosMock[indice];

  if (!movimiento) {
    return null;
  }

  if (datos.tipo !== undefined) {
    movimiento.tipo = datos.tipo;
  }

  if (datos.concepto !== undefined) {
    movimiento.concepto = datos.concepto.trim();
  }

  if (datos.categoria !== undefined) {
    movimiento.categoria = datos.categoria;
  }

  if (datos.monto !== undefined) {
    movimiento.monto = datos.monto;
  }

  if (datos.metodoPago !== undefined) {
    movimiento.metodoPago = datos.metodoPago;
  }

  if (datos.estado !== undefined) {
    movimiento.estado = datos.estado;
  }

  if (datos.fecha !== undefined) {
    movimiento.fecha = datos.fecha;
  }

  if (datos.referencia !== undefined) {
    const referencia = datos.referencia.trim();

    if (referencia) {
      movimiento.referencia = referencia;
    } else {
      delete movimiento.referencia;
    }
  }

  if (datos.descripcion !== undefined) {
    movimiento.descripcion = datos.descripcion.trim();
  }

  return {
    ...movimiento,
  };
};

export const anularMovimientoFinanciero = (id: string): MovimientoFinanciero | null => {
  return actualizarMovimientoFinanciero({
    id,
    estado: 'anulado',
  });
};

export const eliminarMovimientoFinanciero = (id: string): boolean => {
  const indice = movimientosFinancierosMock.findIndex((movimiento) => movimiento.id === id);

  if (indice === -1) {
    return false;
  }

  movimientosFinancierosMock.splice(indice, 1);

  return true;
};

export const filtrarMovimientosFinancieros = (filtros: FiltrosFinanzas): MovimientoFinanciero[] => {
  const busqueda = filtros.busqueda.trim().toLowerCase();

  return obtenerMovimientosFinancieros()
    .filter((movimiento) => {
      if (
        busqueda &&
        !movimiento.concepto.toLowerCase().includes(busqueda) &&
        !movimiento.categoria.toLowerCase().includes(busqueda) &&
        !movimiento.referencia?.toLowerCase().includes(busqueda)
      ) {
        return false;
      }

      if (filtros.tipo !== null && movimiento.tipo !== filtros.tipo) {
        return false;
      }

      if (filtros.categoria !== null && movimiento.categoria !== filtros.categoria) {
        return false;
      }

      if (filtros.metodoPago !== null && movimiento.metodoPago !== filtros.metodoPago) {
        return false;
      }

      if (filtros.estado !== null && movimiento.estado !== filtros.estado) {
        return false;
      }

      if (filtros.fechaDesde !== null && movimiento.fecha < filtros.fechaDesde) {
        return false;
      }

      if (filtros.fechaHasta !== null && movimiento.fecha > filtros.fechaHasta) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
};

export const obtenerResumenFinanzas = (): ResumenFinanzas => {
  const movimientos = obtenerMovimientosActivos();

  const ingresos = movimientos
    .filter((movimiento) => movimiento.tipo === 'ingreso')
    .reduce((total, movimiento) => total + movimiento.monto, 0);

  const gastos = movimientos
    .filter((movimiento) => movimiento.tipo === 'gasto')
    .reduce((total, movimiento) => total + movimiento.monto, 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos,
    movimientos: movimientos.length,
  };
};

export const obtenerResumenFiltrado = (filtros: FiltrosFinanzas): ResumenFinanzas => {
  const movimientos = filtrarMovimientosFinancieros(filtros).filter(
    (movimiento) => movimiento.estado === 'registrado',
  );

  const ingresos = movimientos
    .filter((movimiento) => movimiento.tipo === 'ingreso')
    .reduce((total, movimiento) => total + movimiento.monto, 0);

  const gastos = movimientos
    .filter((movimiento) => movimiento.tipo === 'gasto')
    .reduce((total, movimiento) => total + movimiento.monto, 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos,
    movimientos: movimientos.length,
  };
};
