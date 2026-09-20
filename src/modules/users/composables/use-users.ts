import { computed } from 'vue';

import { useUsersStore } from '../stores/user.store';

import type {
  ActualizarPermisosUsuario,
  ActualizarUsuario,
  CrearUsuario,
  FiltrosUsuarios,
} from '../types/user.types';

export const useUsers = () => {
  const store = useUsersStore();

  const usuarios = computed(() => store.usuarios);

  const usuariosFiltrados = computed(() => store.usuariosFiltrados);

  const usuarioSeleccionado = computed(() => store.usuarioSeleccionado);

  const filtros = computed(() => store.filtros);

  const resumen = computed(() => store.resumen);

  const cargando = computed(() => store.cargando);

  const guardando = computed(() => store.guardando);

  const hayFiltrosActivos = computed(() => store.hayFiltrosActivos);

  const cargarUsuarios = (): void => {
    store.cargarUsuarios();
  };

  const establecerFiltros = (nuevosFiltros: Partial<FiltrosUsuarios>): void => {
    store.establecerFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    store.limpiarFiltros();
  };

  const seleccionarUsuario = (id: string) => {
    return store.seleccionarUsuario(id);
  };

  const limpiarSeleccion = (): void => {
    store.limpiarSeleccion();
  };

  const crear = (datos: CrearUsuario) => {
    return store.crear(datos);
  };

  const actualizar = (datos: ActualizarUsuario) => {
    return store.actualizar(datos);
  };

  const eliminar = (id: string): boolean => {
    return store.eliminar(id);
  };

  const actualizarPermisos = (datos: ActualizarPermisosUsuario) => {
    return store.actualizarPermisos(datos);
  };

  return {
    usuarios,
    usuariosFiltrados,
    usuarioSeleccionado,
    filtros,
    resumen,
    cargando,
    guardando,
    hayFiltrosActivos,
    cargarUsuarios,
    establecerFiltros,
    limpiarFiltros,
    seleccionarUsuario,
    limpiarSeleccion,
    crear,
    actualizar,
    eliminar,
    actualizarPermisos,
  };
};
