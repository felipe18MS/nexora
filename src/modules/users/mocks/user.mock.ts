import { MODULOS_SISTEMA } from '@/modules/authorization/constants/authorization.constants';

import type { PermisosModulo, Usuario } from '../types/user.types';

const crearPermisosCompletos = (): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => ({
    modulo: modulo.codigo,
    ver: true,
    crear: true,
    editar: true,
    eliminar: true,
  }));
};

const crearPermisosLimitados = (): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => ({
    modulo: modulo.codigo,

    ver: [
      'dashboard',
      'clientes',
      'citas',
      'horario',
      'disponibilidad',
      'servicios',
      'empleados',
      'pedidos',
      'productos',
      'inventario',
      'finanzas',
      'conversaciones',
      'llamadas',
      'whatsapp',
      'recordatorios',
      'reportes',
    ].includes(modulo.codigo),

    crear: ['clientes', 'citas', 'pedidos', 'conversaciones'].includes(modulo.codigo),

    editar: ['clientes', 'citas', 'pedidos', 'conversaciones'].includes(modulo.codigo),

    eliminar: ['clientes', 'citas', 'pedidos'].includes(modulo.codigo),
  }));
};

const crearPermisosProfesional = (): PermisosModulo[] => {
  return MODULOS_SISTEMA.map((modulo) => ({
    modulo: modulo.codigo,

    ver: [
      'dashboard',
      'clientes',
      'citas',
      'horario',
      'disponibilidad',
      'servicios',
      'conversaciones',
    ].includes(modulo.codigo),

    crear: ['citas', 'conversaciones'].includes(modulo.codigo),

    editar: ['citas', 'conversaciones'].includes(modulo.codigo),

    eliminar: false,
  }));
};

export { crearPermisosCompletos, crearPermisosLimitados, crearPermisosProfesional };

export const usuariosMock: Usuario[] = [
  {
    id: 'usr-001',
    nombre: 'Laura',
    apellido: 'Gómez',
    email: 'laura.gomez@nexora.demo',
    telefono: '+57 300 123 4567',
    rol: 'administrador',
    estado: 'activo',
    cargo: 'Administradora',
    ultimoAcceso: '2026-09-18T14:35:00',
    creadoEn: '2026-01-10T09:00:00',
    permisos: crearPermisosCompletos(),
  },

  {
    id: 'usr-002',
    nombre: 'Andrés',
    apellido: 'Martínez',
    email: 'andres.martinez@nexora.demo',
    telefono: '+57 301 234 5678',
    rol: 'gerente',
    estado: 'activo',
    cargo: 'Gerente',
    ultimoAcceso: '2026-09-18T11:20:00',
    creadoEn: '2026-02-15T10:30:00',
    permisos: crearPermisosCompletos(),
  },

  {
    id: 'usr-003',
    nombre: 'Camila',
    apellido: 'Rodríguez',
    email: 'camila.rodriguez@nexora.demo',
    telefono: '+57 302 345 6789',
    rol: 'recepcionista',
    estado: 'activo',
    cargo: 'Recepcionista',
    ultimoAcceso: '2026-09-17T16:45:00',
    creadoEn: '2026-03-05T08:15:00',
    permisos: crearPermisosLimitados(),
  },

  {
    id: 'usr-004',
    nombre: 'Daniel',
    apellido: 'Torres',
    email: 'daniel.torres@nexora.demo',
    telefono: '+57 303 456 7890',
    rol: 'profesional',
    estado: 'activo',
    cargo: 'Profesional',
    ultimoAcceso: '2026-09-18T09:10:00',
    creadoEn: '2026-04-12T14:00:00',
    permisos: crearPermisosProfesional(),
  },

  {
    id: 'usr-005',
    nombre: 'Sofía',
    apellido: 'Ramírez',
    email: 'sofia.ramirez@nexora.demo',
    telefono: '+57 304 567 8901',
    rol: 'recepcionista',
    estado: 'pendiente',
    cargo: 'Asistente administrativa',
    ultimoAcceso: null,
    creadoEn: '2026-09-15T13:20:00',
    permisos: crearPermisosLimitados(),
  },

  {
    id: 'usr-006',
    nombre: 'Carlos',
    apellido: 'Hernández',
    email: 'carlos.hernandez@nexora.demo',
    telefono: '+57 305 678 9012',
    rol: 'profesional',
    estado: 'inactivo',
    cargo: 'Profesional',
    ultimoAcceso: '2026-08-28T17:30:00',
    creadoEn: '2026-05-20T11:45:00',
    permisos: crearPermisosProfesional(),
  },
];
