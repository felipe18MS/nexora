export type RolSistema =
  'superadministrador' | 'administrador' | 'gerente' | 'recepcionista' | 'profesional';

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
  avatar?: string;
  rol: RolSistema;
  cargo: string;
  negocioId: string | null;
  negocioNombre: string | null;
  permisos: string[];
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
