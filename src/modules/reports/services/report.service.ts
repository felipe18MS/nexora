import {
  filasReporteMock,
  indicadoresCitasMock,
  indicadoresClientesMock,
  indicadoresFinancierosMock,
  indicadoresServiciosMock,
  reportesMock,
  serieCitasMock,
  serieIngresosGastosMock,
  serieServiciosMock,
  resumenReportesMock,
} from '../mocks/report.mock';

import type {
  ActualizarReporte,
  CrearReporte,
  FilaReporte,
  FiltrosReportes,
  IndicadorReporte,
  Reporte,
  ResumenReportes,
  SerieReporte,
} from '../types/report.types';

const obtenerReportesBase = (): Reporte[] => {
  return reportesMock.map((reporte) => ({
    ...reporte,
    rangoFechas: {
      ...reporte.rangoFechas,
    },
    indicadores: reporte.indicadores.map((indicador) => ({
      ...indicador,
    })),
    series: reporte.series.map((serie) => ({
      ...serie,
      puntos: serie.puntos.map((punto) => ({
        ...punto,
      })),
    })),
    filas: reporte.filas.map((fila) => ({
      ...fila,
    })),
  }));
};

export const obtenerReportes = (): Reporte[] => {
  return obtenerReportesBase();
};

export const obtenerReporte = (id: string): Reporte | null => {
  const reporte = reportesMock.find((item) => item.id === id);

  return reporte
    ? {
        ...reporte,
        rangoFechas: {
          ...reporte.rangoFechas,
        },
        indicadores: reporte.indicadores.map((indicador) => ({
          ...indicador,
        })),
        series: reporte.series.map((serie) => ({
          ...serie,
          puntos: serie.puntos.map((punto) => ({
            ...punto,
          })),
        })),
        filas: reporte.filas.map((fila) => ({
          ...fila,
        })),
      }
    : null;
};

export const crearReporte = (datos: CrearReporte): Reporte => {
  const indicadores = obtenerIndicadoresPorTipo(datos.tipo);

  const series = obtenerSeriesPorTipo(datos.tipo);

  const reporte: Reporte = {
    id: `rep-${Date.now()}`,
    tipo: datos.tipo,
    nombre: obtenerNombrePorTipo(datos.tipo),
    descripcion: obtenerDescripcionPorTipo(datos.tipo),
    periodo: datos.periodo,
    rangoFechas: {
      ...datos.rangoFechas,
    },
    indicadores,
    series,
    filas: obtenerFilasReporte(),
    generadoEn: new Date().toISOString(),
  };

  reportesMock.unshift(reporte);

  return obtenerReporte(reporte.id) as Reporte;
};

export const actualizarReporte = (datos: ActualizarReporte): Reporte | null => {
  const indice = reportesMock.findIndex((reporte) => reporte.id === datos.id);

  if (indice === -1) {
    return null;
  }

  const reporte = reportesMock[indice];

  if (!reporte) {
    return null;
  }

  if (datos.tipo !== undefined) {
    reporte.tipo = datos.tipo;
    reporte.nombre = obtenerNombrePorTipo(datos.tipo);
    reporte.descripcion = obtenerDescripcionPorTipo(datos.tipo);
    reporte.indicadores = obtenerIndicadoresPorTipo(datos.tipo);
    reporte.series = obtenerSeriesPorTipo(datos.tipo);
  }

  if (datos.periodo !== undefined) {
    reporte.periodo = datos.periodo;
  }

  if (datos.rangoFechas !== undefined) {
    reporte.rangoFechas = {
      ...datos.rangoFechas,
    };
  }

  reporte.generadoEn = new Date().toISOString();

  return obtenerReporte(reporte.id);
};

export const eliminarReporte = (id: string): boolean => {
  const indice = reportesMock.findIndex((reporte) => reporte.id === id);

  if (indice === -1) {
    return false;
  }

  reportesMock.splice(indice, 1);

  return true;
};

export const filtrarReportes = (filtros: FiltrosReportes): Reporte[] => {
  return obtenerReportesBase().filter((reporte) => {
    if (filtros.tipo !== null && reporte.tipo !== filtros.tipo) {
      return false;
    }

    if (filtros.periodo && reporte.periodo !== filtros.periodo) {
      return false;
    }

    if (filtros.fechaDesde !== null && reporte.rangoFechas.hasta < filtros.fechaDesde) {
      return false;
    }

    if (filtros.fechaHasta !== null && reporte.rangoFechas.desde > filtros.fechaHasta) {
      return false;
    }

    return true;
  });
};

export const obtenerResumenReportes = (): ResumenReportes => {
  return {
    ...resumenReportesMock,
  };
};

export const obtenerIndicadoresReporte = (tipo: Reporte['tipo']): IndicadorReporte[] => {
  return obtenerIndicadoresPorTipo(tipo);
};

export const obtenerSeriesReporte = (tipo: Reporte['tipo']): SerieReporte[] => {
  return obtenerSeriesPorTipo(tipo);
};

export const obtenerFilasReporte = (): FilaReporte[] => {
  return filasReporteMock.map((fila) => ({
    ...fila,
  }));
};

const obtenerIndicadoresPorTipo = (tipo: Reporte['tipo']): IndicadorReporte[] => {
  switch (tipo) {
    case 'financiero':
      return indicadoresFinancierosMock.map((indicador) => ({
        ...indicador,
      }));

    case 'citas':
      return indicadoresCitasMock.map((indicador) => ({
        ...indicador,
      }));

    case 'clientes':
      return indicadoresClientesMock.map((indicador) => ({
        ...indicador,
      }));

    case 'servicios':
      return indicadoresServiciosMock.map((indicador) => ({
        ...indicador,
      }));

    case 'ventas':
      return indicadoresFinancierosMock.map((indicador) => ({
        ...indicador,
      }));

    default:
      return [];
  }
};

const obtenerSeriesPorTipo = (tipo: Reporte['tipo']): SerieReporte[] => {
  switch (tipo) {
    case 'financiero':
      return [
        {
          ...serieIngresosGastosMock,
          puntos: serieIngresosGastosMock.puntos.map((punto) => ({
            ...punto,
          })),
        },
      ];

    case 'citas':
      return [
        {
          ...serieCitasMock,
          puntos: serieCitasMock.puntos.map((punto) => ({
            ...punto,
          })),
        },
      ];

    case 'servicios':
      return [
        {
          ...serieServiciosMock,
          puntos: serieServiciosMock.puntos.map((punto) => ({
            ...punto,
          })),
        },
      ];

    case 'clientes':
    case 'ventas':
      return [];

    default:
      return [];
  }
};

const obtenerNombrePorTipo = (tipo: Reporte['tipo']): string => {
  switch (tipo) {
    case 'financiero':
      return 'Reporte financiero';

    case 'citas':
      return 'Reporte de citas';

    case 'clientes':
      return 'Reporte de clientes';

    case 'servicios':
      return 'Reporte de servicios';

    case 'ventas':
      return 'Reporte de ventas';

    default:
      return 'Reporte';
  }
};

const obtenerDescripcionPorTipo = (tipo: Reporte['tipo']): string => {
  switch (tipo) {
    case 'financiero':
      return 'Resumen de ingresos, gastos y balance del negocio.';

    case 'citas':
      return 'Análisis del comportamiento y estado de las citas.';

    case 'clientes':
      return 'Información sobre crecimiento y recurrencia de clientes.';

    case 'servicios':
      return 'Rendimiento de los servicios ofrecidos por el negocio.';

    case 'ventas':
      return 'Resumen de ventas y comportamiento de los ingresos.';

    default:
      return 'Información general del negocio.';
  }
};
