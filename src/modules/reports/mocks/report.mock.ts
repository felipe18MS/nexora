import type { FilaReporte, IndicadorReporte, Reporte, SerieReporte } from '../types/report.types';

export const indicadoresFinancierosMock: IndicadorReporte[] = [
  {
    id: 'ind-fin-001',
    nombre: 'Ingresos',
    valor: 4280000,
    valorAnterior: 3910000,
    unidad: 'moneda',
    tendencia: 9.46,
  },
  {
    id: 'ind-fin-002',
    nombre: 'Gastos',
    valor: 2360000,
    valorAnterior: 2180000,
    unidad: 'moneda',
    tendencia: 8.26,
  },
  {
    id: 'ind-fin-003',
    nombre: 'Balance',
    valor: 1920000,
    valorAnterior: 1730000,
    unidad: 'moneda',
    tendencia: 10.98,
  },
  {
    id: 'ind-fin-004',
    nombre: 'Margen',
    valor: 44.86,
    valorAnterior: 44.24,
    unidad: 'porcentaje',
    tendencia: 1.4,
  },
];

export const indicadoresCitasMock: IndicadorReporte[] = [
  {
    id: 'ind-cit-001',
    nombre: 'Total de citas',
    valor: 186,
    valorAnterior: 171,
    unidad: 'numero',
    tendencia: 8.77,
  },
  {
    id: 'ind-cit-002',
    nombre: 'Completadas',
    valor: 149,
    valorAnterior: 135,
    unidad: 'numero',
    tendencia: 10.37,
  },
  {
    id: 'ind-cit-003',
    nombre: 'Canceladas',
    valor: 18,
    valorAnterior: 21,
    unidad: 'numero',
    tendencia: -14.29,
  },
  {
    id: 'ind-cit-004',
    nombre: 'Tasa de asistencia',
    valor: 80.11,
    valorAnterior: 78.95,
    unidad: 'porcentaje',
    tendencia: 1.47,
  },
];

export const indicadoresClientesMock: IndicadorReporte[] = [
  {
    id: 'ind-cli-001',
    nombre: 'Clientes nuevos',
    valor: 64,
    valorAnterior: 57,
    unidad: 'numero',
    tendencia: 12.28,
  },
  {
    id: 'ind-cli-002',
    nombre: 'Clientes atendidos',
    valor: 238,
    valorAnterior: 219,
    unidad: 'numero',
    tendencia: 8.68,
  },
  {
    id: 'ind-cli-003',
    nombre: 'Clientes recurrentes',
    valor: 143,
    valorAnterior: 129,
    unidad: 'numero',
    tendencia: 10.85,
  },
  {
    id: 'ind-cli-004',
    nombre: 'Retención',
    valor: 60.08,
    valorAnterior: 58.9,
    unidad: 'porcentaje',
    tendencia: 2.0,
  },
];

export const indicadoresServiciosMock: IndicadorReporte[] = [
  {
    id: 'ind-ser-001',
    nombre: 'Servicios realizados',
    valor: 312,
    valorAnterior: 284,
    unidad: 'numero',
    tendencia: 9.86,
  },
  {
    id: 'ind-ser-002',
    nombre: 'Ingresos por servicios',
    valor: 3560000,
    valorAnterior: 3240000,
    unidad: 'moneda',
    tendencia: 9.88,
  },
  {
    id: 'ind-ser-003',
    nombre: 'Ticket promedio',
    valor: 11410,
    valorAnterior: 11408,
    unidad: 'moneda',
    tendencia: 0.02,
  },
  {
    id: 'ind-ser-004',
    nombre: 'Servicios activos',
    valor: 18,
    valorAnterior: 16,
    unidad: 'numero',
    tendencia: 12.5,
  },
];

export const serieIngresosGastosMock: SerieReporte = {
  id: 'serie-fin-001',
  nombre: 'Ingresos y gastos',
  tipo: 'linea',
  puntos: [
    {
      etiqueta: '01 Sep',
      valor: 420000,
    },
    {
      etiqueta: '03 Sep',
      valor: 510000,
    },
    {
      etiqueta: '05 Sep',
      valor: 380000,
    },
    {
      etiqueta: '07 Sep',
      valor: 620000,
    },
    {
      etiqueta: '09 Sep',
      valor: 540000,
    },
    {
      etiqueta: '11 Sep',
      valor: 690000,
    },
    {
      etiqueta: '13 Sep',
      valor: 470000,
    },
    {
      etiqueta: '15 Sep',
      valor: 580000,
    },
    {
      etiqueta: '17 Sep',
      valor: 670000,
    },
  ],
};

export const serieCitasMock: SerieReporte = {
  id: 'serie-cit-001',
  nombre: 'Citas por día',
  tipo: 'barra',
  puntos: [
    {
      etiqueta: '01 Sep',
      valor: 12,
    },
    {
      etiqueta: '03 Sep',
      valor: 18,
    },
    {
      etiqueta: '05 Sep',
      valor: 15,
    },
    {
      etiqueta: '07 Sep',
      valor: 23,
    },
    {
      etiqueta: '09 Sep',
      valor: 19,
    },
    {
      etiqueta: '11 Sep',
      valor: 27,
    },
    {
      etiqueta: '13 Sep',
      valor: 21,
    },
    {
      etiqueta: '15 Sep',
      valor: 24,
    },
    {
      etiqueta: '17 Sep',
      valor: 27,
    },
  ],
};

export const serieServiciosMock: SerieReporte = {
  id: 'serie-ser-001',
  nombre: 'Servicios realizados',
  tipo: 'barra',
  puntos: [
    {
      etiqueta: 'Corte',
      valor: 86,
    },
    {
      etiqueta: 'Manicure',
      valor: 64,
    },
    {
      etiqueta: 'Pedicure',
      valor: 51,
    },
    {
      etiqueta: 'Coloración',
      valor: 42,
    },
    {
      etiqueta: 'Tratamiento',
      valor: 37,
    },
    {
      etiqueta: 'Otros',
      valor: 32,
    },
  ],
};

export const filasReporteMock: FilaReporte[] = [
  {
    id: 'fila-001',
    fecha: '2026-09-17',
    concepto: 'Corte de cabello',
    categoria: 'servicio',
    cantidad: 18,
    monto: 630000,
  },
  {
    id: 'fila-002',
    fecha: '2026-09-17',
    concepto: 'Manicure',
    categoria: 'servicio',
    cantidad: 14,
    monto: 630000,
  },
  {
    id: 'fila-003',
    fecha: '2026-09-16',
    concepto: 'Pedicure',
    categoria: 'servicio',
    cantidad: 11,
    monto: 605000,
  },
  {
    id: 'fila-004',
    fecha: '2026-09-15',
    concepto: 'Coloración',
    categoria: 'servicio',
    cantidad: 8,
    monto: 960000,
  },
  {
    id: 'fila-005',
    fecha: '2026-09-14',
    concepto: 'Tratamiento capilar',
    categoria: 'servicio',
    cantidad: 7,
    monto: 630000,
  },
  {
    id: 'fila-006',
    fecha: '2026-09-13',
    concepto: 'Venta de productos',
    categoria: 'venta',
    cantidad: 12,
    monto: 780000,
  },
  {
    id: 'fila-007',
    fecha: '2026-09-12',
    concepto: 'Reservas de citas',
    categoria: 'cita',
    cantidad: 16,
    monto: 960000,
  },
  {
    id: 'fila-008',
    fecha: '2026-09-11',
    concepto: 'Compra de insumos',
    categoria: 'gasto',
    cantidad: 4,
    monto: 385000,
  },
];

export const reportesMock: Reporte[] = [
  {
    id: 'rep-001',
    tipo: 'financiero',
    nombre: 'Reporte financiero',
    descripcion: 'Resumen de ingresos, gastos y balance del negocio.',
    periodo: 'mes',
    rangoFechas: {
      desde: '2026-09-01',
      hasta: '2026-09-30',
    },
    indicadores: indicadoresFinancierosMock,
    series: [serieIngresosGastosMock],
    filas: filasReporteMock,
    generadoEn: '2026-09-19T08:30:00',
  },
  {
    id: 'rep-002',
    tipo: 'citas',
    nombre: 'Reporte de citas',
    descripcion: 'Análisis del comportamiento y estado de las citas.',
    periodo: 'mes',
    rangoFechas: {
      desde: '2026-09-01',
      hasta: '2026-09-30',
    },
    indicadores: indicadoresCitasMock,
    series: [serieCitasMock],
    filas: filasReporteMock,
    generadoEn: '2026-09-19T08:35:00',
  },
  {
    id: 'rep-003',
    tipo: 'clientes',
    nombre: 'Reporte de clientes',
    descripcion: 'Información sobre crecimiento y recurrencia de clientes.',
    periodo: 'mes',
    rangoFechas: {
      desde: '2026-09-01',
      hasta: '2026-09-30',
    },
    indicadores: indicadoresClientesMock,
    series: [],
    filas: filasReporteMock,
    generadoEn: '2026-09-19T08:40:00',
  },
  {
    id: 'rep-004',
    tipo: 'servicios',
    nombre: 'Reporte de servicios',
    descripcion: 'Rendimiento de los servicios ofrecidos por el negocio.',
    periodo: 'mes',
    rangoFechas: {
      desde: '2026-09-01',
      hasta: '2026-09-30',
    },
    indicadores: indicadoresServiciosMock,
    series: [serieServiciosMock],
    filas: filasReporteMock,
    generadoEn: '2026-09-19T08:45:00',
  },
];

export const resumenReportesMock = {
  totalIngresos: 4280000,
  totalGastos: 2360000,
  balance: 1920000,
  totalCitas: 186,
  citasCompletadas: 149,
  citasCanceladas: 18,
  nuevosClientes: 64,
  serviciosRealizados: 312,
};
