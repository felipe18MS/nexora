import type { Inventario, MovimientoInventario } from '../types/inventory.types';

export const inventariosMock: Inventario[] = [
  {
    id: 'inv-001',
    productoId: 'prod-001',
    stock: 24,
    stockMinimo: 10,
    ubicacion: 'Estante A1',
    ultimaActualizacion: '2026-09-18T10:30:00',
  },
  {
    id: 'inv-002',
    productoId: 'prod-002',
    stock: 8,
    stockMinimo: 10,
    ubicacion: 'Estante A2',
    ultimaActualizacion: '2026-09-18T11:15:00',
  },
  {
    id: 'inv-003',
    productoId: 'prod-003',
    stock: 0,
    stockMinimo: 5,
    ubicacion: 'Estante B1',
    ultimaActualizacion: '2026-09-17T15:20:00',
  },
  {
    id: 'inv-004',
    productoId: 'prod-004',
    stock: 32,
    stockMinimo: 8,
    ubicacion: 'Estante B2',
    ultimaActualizacion: '2026-09-18T09:45:00',
  },
];

export const movimientosInventarioMock: MovimientoInventario[] = [
  {
    id: 'mov-001',
    inventarioId: 'inv-001',
    productoId: 'prod-001',
    tipo: 'entrada',
    cantidad: 10,
    motivo: 'Compra a proveedor',
    creadoPor: 'Administrador',
    creadoEn: '2026-09-18T10:30:00',
  },
  {
    id: 'mov-002',
    inventarioId: 'inv-002',
    productoId: 'prod-002',
    tipo: 'salida',
    cantidad: 4,
    motivo: 'Venta',
    creadoPor: 'Administrador',
    creadoEn: '2026-09-18T11:15:00',
  },
  {
    id: 'mov-003',
    inventarioId: 'inv-003',
    productoId: 'prod-003',
    tipo: 'salida',
    cantidad: 5,
    motivo: 'Venta',
    creadoPor: 'Administrador',
    creadoEn: '2026-09-17T15:20:00',
  },
];
