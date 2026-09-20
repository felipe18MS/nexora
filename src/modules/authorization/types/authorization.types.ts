export type ModuloSistema =
  | 'dashboard'
  | 'clientes'
  | 'citas'
  | 'horario'
  | 'disponibilidad'
  | 'servicios'
  | 'empleados'
  | 'pedidos'
  | 'productos'
  | 'inventario'
  | 'finanzas'
  | 'conversaciones'
  | 'llamadas'
  | 'whatsapp'
  | 'automatizaciones'
  | 'recordatorios'
  | 'ai'
  | 'integraciones'
  | 'reportes'
  | 'usuarios'
  | 'configuracion'
  | 'suscripcion';

export type AccionPermiso = 'ver' | 'crear' | 'editar' | 'eliminar';

export interface PermisosModulo {
  modulo: ModuloSistema;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface ModuloSistemaConfig {
  codigo: ModuloSistema;
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  activo: boolean;
}

export interface PermisosUsuario {
  modulos: PermisosModulo[];
}

export interface AccesoModulo {
  modulo: ModuloSistema;
  permisos: PermisosModulo;
}
