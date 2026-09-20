import type { PermisosModulo } from '@/modules/authorization/types/authorization.types';
import type { RolUsuario } from '@/modules/users/types/user.types';

export type { RolUsuario as RolSistema } from '@/modules/users/types/user.types';

export type EstadoSuscripcion = 'prueba' | 'activa' | 'vencida' | 'cancelada' | 'suspendida';
export type PlanSuscripcion = 'basico' | 'profesional' | 'empresarial';

export interface Suscripcion {
  estado: EstadoSuscripcion;
  plan: PlanSuscripcion | null;
  fechaInicio: string;
  fechaVencimiento: string;
  diasPrueba: number;
}

export interface NegocioAuth {
  id: string;
  nombre: string;
  telefono: string;
  creadoEn: string;
}

export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  avatar: string | null;
  rol: RolUsuario;
  cargo: string;
  negocioId: string | null;
  negocioNombre: string | null;

  /**
   * Compatibilidad con el modelo actual.
   *
   * Se mantendrá durante la transición al modelo
   * centralizado de autorización.
   */
  permisos: string[];

  /**
   * Modelo centralizado de permisos.
   *
   * Será el modelo principal cuando conectemos
   * NEXORA con el backend.
   */
  permisosDetallados?: PermisosModulo[];
}

export interface CuentaRegistrada {
  usuario: UsuarioAutenticado;
  password: string;
  negocio: NegocioAuth;
  suscripcion: Suscripcion;
}

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface CredencialesRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  negocioNombre: string;
  telefono: string;
}

export interface SesionAuth {
  usuario: UsuarioAutenticado;
  token: string;
  iniciadoEn: string;
  suscripcion: Suscripcion | null;
}

export interface ResultadoLogin {
  exitoso: boolean;
  sesion: SesionAuth | null;
  mensaje: string;
}

export interface ResultadoRegistro {
  exitoso: boolean;
  sesion: SesionAuth | null;
  mensaje: string;
}
