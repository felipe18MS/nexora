import { crearSuscripcionPrueba } from '../../subscription';

import type {
  CuentaRegistrada,
  CredencialesLogin,
  CredencialesRegistro,
  ResultadoLogin,
  ResultadoRegistro,
  SesionAuth,
  UsuarioAutenticado,
} from '../types/auth.types';

const permisosSuperadministrador: string[] = ['*'];

const permisosAdministrador: string[] = [
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
  'automatizaciones',
  'recordatorios',
  'ai',
  'integraciones',
  'reportes',
  'usuarios',
  'configuracion',
  'suscripcion',
];

interface UsuarioAuthMock extends UsuarioAutenticado {
  password: string;
}

export const credencialesAuthMock: UsuarioAuthMock[] = [
  {
    id: 'auth-super-001',
    nombre: 'Cristian',
    apellido: 'Martinez',
    email: 'superadmin@nexora.com',
    telefono: '',
    avatar: null,
    rol: 'superadministrador',
    cargo: 'Superadministrador',
    negocioId: null,
    negocioNombre: null,
    permisos: permisosSuperadministrador,
    password: 'Nexora123',
  },
  {
    id: 'auth-admin-001',
    nombre: 'Laura',
    apellido: 'Gómez',
    email: 'admin@demo.nexora.com',
    telefono: '3001234567',
    avatar: null,
    rol: 'administrador',
    cargo: 'Administradora',
    negocioId: 'negocio-demo-001',
    negocioNombre: 'Studio Bella',
    permisos: permisosAdministrador,
    password: 'Demo123',
  },
];

const REGISTERED_ACCOUNTS_KEY = 'nexora_registered_accounts';

const obtenerCuentasRegistradas = (): CuentaRegistrada[] => {
  const cuentasGuardadas = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);

  if (!cuentasGuardadas) {
    return [];
  }

  try {
    return JSON.parse(cuentasGuardadas) as CuentaRegistrada[];
  } catch {
    localStorage.removeItem(REGISTERED_ACCOUNTS_KEY);

    return [];
  }
};

const guardarCuentasRegistradas = (cuentas: CuentaRegistrada[]): void => {
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(cuentas));
};

export const usuariosAuthMock: UsuarioAutenticado[] = credencialesAuthMock.map(
  ({
    id,
    nombre,
    apellido,
    email,
    telefono,
    avatar,
    rol,
    cargo,
    negocioId,
    negocioNombre,
    permisos,
  }) => ({
    id,
    nombre,
    apellido,
    email,
    telefono,
    avatar,
    rol,
    cargo,
    negocioId,
    negocioNombre,
    permisos,
  }),
);

const crearSesionMock = (usuario: UsuarioAuthMock): SesionAuth => {
  const usuarioSinPassword: UsuarioAutenticado = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono,
    avatar: usuario.avatar,
    rol: usuario.rol,
    cargo: usuario.cargo,
    negocioId: usuario.negocioId,
    negocioNombre: usuario.negocioNombre,
    permisos: usuario.permisos,
  };

  return {
    usuario: usuarioSinPassword,
    token: `mock-token-${usuario.id}`,
    iniciadoEn: new Date().toISOString(),
    suscripcion: usuario.rol === 'superadministrador' ? null : crearSuscripcionPrueba(),
  };
};

export const autenticarUsuarioMock = (credenciales: CredencialesLogin): ResultadoLogin => {
  const email = credenciales.email.trim().toLowerCase();

  const usuarioMock = credencialesAuthMock.find(
    (item) => item.email.toLowerCase() === email && item.password === credenciales.password,
  );

  if (usuarioMock) {
    return {
      exitoso: true,
      sesion: crearSesionMock(usuarioMock),
      mensaje: 'Inicio de sesión correcto.',
    };
  }

  const cuentasRegistradas = obtenerCuentasRegistradas();

  const cuentaRegistrada = cuentasRegistradas.find(
    (cuenta) =>
      cuenta.usuario.email.toLowerCase() === email && cuenta.password === credenciales.password,
  );

  if (cuentaRegistrada) {
    const sesion: SesionAuth = {
      usuario: cuentaRegistrada.usuario,
      token: `mock-token-${cuentaRegistrada.usuario.id}`,
      iniciadoEn: new Date().toISOString(),
      suscripcion: cuentaRegistrada.suscripcion,
    };

    return {
      exitoso: true,
      sesion,
      mensaje: 'Inicio de sesión correcto.',
    };
  }

  return {
    exitoso: false,
    sesion: null,
    mensaje: 'El correo o la contraseña no son correctos.',
  };
};

export const registrarUsuarioMock = (datos: CredencialesRegistro): ResultadoRegistro => {
  const email = datos.email.trim().toLowerCase();

  const cuentasExistentes = obtenerCuentasRegistradas();

  const emailDemoExiste = credencialesAuthMock.some(
    (usuario) => usuario.email.toLowerCase() === email,
  );

  const emailRegistrado = cuentasExistentes.some(
    (cuenta) => cuenta.usuario.email.toLowerCase() === email,
  );

  if (emailDemoExiste || emailRegistrado) {
    return {
      exitoso: false,
      sesion: null,
      mensaje: 'Ya existe una cuenta registrada con este correo.',
    };
  }

  const ahora = new Date().toISOString();

  const negocioId = `negocio-${Date.now()}`;
  const usuarioId = `usuario-${Date.now()}`;

  const negocio = {
    id: negocioId,
    nombre: datos.negocioNombre.trim(),
    telefono: datos.telefono.trim(),
    creadoEn: ahora,
  };

  const usuario: UsuarioAutenticado = {
    id: usuarioId,
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    email,
    telefono: datos.telefono.trim(),
    avatar: null,
    rol: 'administrador',
    cargo: 'Administrador',
    negocioId,
    negocioNombre: negocio.nombre,
    permisos: permisosAdministrador,
  };

  const suscripcion = crearSuscripcionPrueba();

  const cuenta: CuentaRegistrada = {
    usuario,
    password: datos.password,
    negocio,
    suscripcion,
  };

  cuentasExistentes.push(cuenta);

  guardarCuentasRegistradas(cuentasExistentes);

  const sesion: SesionAuth = {
    usuario,
    token: `mock-token-${usuarioId}`,
    iniciadoEn: ahora,
    suscripcion,
  };

  return {
    exitoso: true,
    sesion,
    mensaje: 'Cuenta creada correctamente.',
  };
};

export const autenticarConGoogleMock = (): ResultadoLogin => {
  const usuario = credencialesAuthMock.find((item) => item.email === 'admin@demo.nexora.com');

  if (!usuario) {
    return {
      exitoso: false,
      sesion: null,
      mensaje: 'No fue posible completar el acceso con Google.',
    };
  }

  return {
    exitoso: true,
    sesion: crearSesionMock(usuario),
    mensaje: 'Inicio de sesión con Google correcto.',
  };
};
