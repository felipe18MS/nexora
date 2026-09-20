export type RolUsuario = 'administrador' | 'gerente' | 'recepcionista' | 'profesional';

export type EstadoUsuario = 'activo' | 'inactivo' | 'pendiente';

export type TipoPermiso = 'ver' | 'crear' | 'editar' | 'eliminar';

export type ModuloPermiso =
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

export interface PermisosModulo {
  modulo: ModuloPermiso;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  avatar?: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  cargo: string;
  ultimoAcceso: string | null;
  creadoEn: string;
  permisos: PermisosModulo[];
}

export interface FiltrosUsuarios {
  busqueda: string;
  rol: RolUsuario | null;
  estado: EstadoUsuario | null;
}

export interface CrearUsuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
  cargo: string;
  estado: EstadoUsuario;
}

export interface ActualizarUsuario {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  rol?: RolUsuario;
  cargo?: string;
  estado?: EstadoUsuario;
}

export interface ActualizarPermisosUsuario {
  id: string;
  permisos: PermisosModulo[];
}

export interface ResumenUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  pendientes: number;
}
