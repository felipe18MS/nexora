import {
  crearPermisosCompletos,
  crearPermisosLimitados,
  crearPermisosProfesional,
  usuariosMock,
} from '../mocks/user.mock';

import type {
  ActualizarPermisosUsuario,
  ActualizarUsuario,
  CrearUsuario,
  EstadoUsuario,
  FiltrosUsuarios,
  ModuloPermiso,
  PermisosModulo,
  ResumenUsuarios,
  RolUsuario,
  Usuario,
} from '../types/user.types';

const clonarPermisos = (permisos: PermisosModulo[]): PermisosModulo[] => {
  return permisos.map((permiso) => ({
    ...permiso,
  }));
};

const clonarUsuario = (usuario: Usuario): Usuario => {
  return {
    ...usuario,
    permisos: clonarPermisos(usuario.permisos),
  };
};

const clonarUsuarios = (): Usuario[] => {
  return usuariosMock.map(clonarUsuario);
};

const obtenerPermisosPorRol = (rol: RolUsuario): PermisosModulo[] => {
  if (rol === 'administrador' || rol === 'gerente') {
    return crearPermisosCompletos();
  }

  if (rol === 'profesional') {
    return crearPermisosProfesional();
  }

  return crearPermisosLimitados();
};

export const obtenerUsuarios = (): Usuario[] => {
  return clonarUsuarios();
};

export const obtenerUsuario = (id: string): Usuario | null => {
  const usuario = usuariosMock.find((item) => item.id === id);

  if (!usuario) {
    return null;
  }

  return clonarUsuario(usuario);
};

export const filtrarUsuarios = (filtros: FiltrosUsuarios): Usuario[] => {
  const busqueda = filtros.busqueda.trim().toLowerCase();

  return clonarUsuarios().filter((usuario) => {
    const textoBusqueda = [
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      usuario.telefono,
      usuario.cargo,
    ]
      .join(' ')
      .toLowerCase();

    const coincideBusqueda = !busqueda || textoBusqueda.includes(busqueda);

    const coincideRol = !filtros.rol || usuario.rol === filtros.rol;

    const coincideEstado = !filtros.estado || usuario.estado === filtros.estado;

    return coincideBusqueda && coincideRol && coincideEstado;
  });
};

export const crearUsuario = (datos: CrearUsuario): Usuario => {
  const nuevoUsuario: Usuario = {
    id: `usr-${Date.now()}`,
    nombre: datos.nombre,
    apellido: datos.apellido,
    email: datos.email,
    telefono: datos.telefono,
    rol: datos.rol,
    estado: datos.estado,
    cargo: datos.cargo,
    ultimoAcceso: null,
    creadoEn: new Date().toISOString(),
    permisos: obtenerPermisosPorRol(datos.rol),
  };

  usuariosMock.push(nuevoUsuario);

  return clonarUsuario(nuevoUsuario);
};

export const actualizarUsuario = (datos: ActualizarUsuario): Usuario | null => {
  const usuario = usuariosMock.find((item) => item.id === datos.id);

  if (!usuario) {
    return null;
  }

  if (datos.nombre !== undefined) {
    usuario.nombre = datos.nombre;
  }

  if (datos.apellido !== undefined) {
    usuario.apellido = datos.apellido;
  }

  if (datos.email !== undefined) {
    usuario.email = datos.email;
  }

  if (datos.telefono !== undefined) {
    usuario.telefono = datos.telefono;
  }

  if (datos.rol !== undefined) {
    usuario.rol = datos.rol;
  }

  if (datos.cargo !== undefined) {
    usuario.cargo = datos.cargo;
  }

  if (datos.estado !== undefined) {
    usuario.estado = datos.estado;
  }

  return clonarUsuario(usuario);
};

export const eliminarUsuario = (id: string): boolean => {
  const indice = usuariosMock.findIndex((item) => item.id === id);

  if (indice === -1) {
    return false;
  }

  usuariosMock.splice(indice, 1);

  return true;
};

export const actualizarPermisosUsuario = (datos: ActualizarPermisosUsuario): Usuario | null => {
  const usuario = usuariosMock.find((item) => item.id === datos.id);

  if (!usuario) {
    return null;
  }

  usuario.permisos = clonarPermisos(datos.permisos);

  return clonarUsuario(usuario);
};

export const obtenerResumenUsuarios = (): ResumenUsuarios => {
  return {
    total: usuariosMock.length,
    activos: usuariosMock.filter((usuario) => usuario.estado === 'activo').length,
    inactivos: usuariosMock.filter((usuario) => usuario.estado === 'inactivo').length,
    pendientes: usuariosMock.filter((usuario) => usuario.estado === 'pendiente').length,
  };
};

export const obtenerRolesUsuario = (): Array<{
  label: string;
  value: RolUsuario;
}> => {
  return [
    {
      label: 'Administrador',
      value: 'administrador',
    },
    {
      label: 'Gerente',
      value: 'gerente',
    },
    {
      label: 'Recepcionista',
      value: 'recepcionista',
    },
    {
      label: 'Profesional',
      value: 'profesional',
    },
  ];
};

export const obtenerEstadosUsuario = (): Array<{
  label: string;
  value: EstadoUsuario;
}> => {
  return [
    {
      label: 'Activos',
      value: 'activo',
    },
    {
      label: 'Inactivos',
      value: 'inactivo',
    },
    {
      label: 'Pendientes',
      value: 'pendiente',
    },
  ];
};

export const obtenerModulosPermisos = (): Array<{
  label: string;
  value: ModuloPermiso;
}> => {
  return [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Clientes', value: 'clientes' },
    { label: 'Citas', value: 'citas' },
    { label: 'Horario', value: 'horario' },
    {
      label: 'Disponibilidad',
      value: 'disponibilidad',
    },
    { label: 'Servicios', value: 'servicios' },
    {
      label: 'Profesionales',
      value: 'empleados',
    },
    { label: 'Pedidos', value: 'pedidos' },
    { label: 'Productos', value: 'productos' },
    { label: 'Inventario', value: 'inventario' },
    { label: 'Finanzas', value: 'finanzas' },
    {
      label: 'Conversaciones',
      value: 'conversaciones',
    },
    { label: 'Llamadas', value: 'llamadas' },
    { label: 'WhatsApp', value: 'whatsapp' },
    {
      label: 'Automatizaciones',
      value: 'automatizaciones',
    },
    {
      label: 'Recordatorios',
      value: 'recordatorios',
    },
    { label: 'Agente IA', value: 'ai' },
    {
      label: 'Integraciones',
      value: 'integraciones',
    },
    { label: 'Reportes', value: 'reportes' },
    { label: 'Usuarios', value: 'usuarios' },
    {
      label: 'Configuración',
      value: 'configuracion',
    },
    {
      label: 'Suscripción',
      value: 'suscripcion',
    },
  ];
};
