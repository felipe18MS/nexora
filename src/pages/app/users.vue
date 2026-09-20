<template>
  <q-page class="users-page q-pa-lg">
    <div class="users-page__content">
      <UserHeader @crear="abrirCrear" />

      <div class="users-page__summary">
        <q-card
          v-for="tarjeta in tarjetasResumen"
          :key="tarjeta.id"
          flat
          bordered
          class="users-page__summary-card"
        >
          <q-card-section class="users-page__summary-content">
            <div
              class="users-page__summary-icon"
              :class="`users-page__summary-icon--${tarjeta.tipo}`"
            >
              <q-icon :name="tarjeta.icono" size="21px" />
            </div>

            <div class="users-page__summary-info">
              <div class="users-page__summary-value">
                {{ tarjeta.valor }}
              </div>

              <div class="users-page__summary-label">
                {{ tarjeta.label }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <UserFilters
        :filtros="filtros"
        :roles="roles"
        :estados="estados"
        :hay-filtros-activos="hayFiltrosActivos"
        @actualizar="establecerFiltros"
        @limpiar="limpiarFiltros"
      />

      <div v-if="cargando" class="users-page__loading">
        <q-spinner color="primary" size="36px" />
        <span>Cargando usuarios...</span>
      </div>

      <div v-else-if="usuariosFiltrados.length === 0" class="users-page__empty">
        <q-icon name="group_off" size="48px" color="grey-5" />

        <div class="users-page__empty-title">No hay usuarios</div>

        <div class="users-page__empty-text">
          {{
            hayFiltrosActivos
              ? 'No encontramos usuarios que coincidan con los filtros.'
              : 'Todavía no hay usuarios registrados en NEXORA.'
          }}
        </div>

        <q-btn
          v-if="hayFiltrosActivos"
          flat
          no-caps
          color="primary"
          label="Limpiar filtros"
          icon="filter_alt_off"
          @click="limpiarFiltros"
        />

        <q-btn
          v-else
          unelevated
          no-caps
          color="primary"
          label="Crear usuario"
          icon="person_add"
          @click="abrirCrear"
        />
      </div>

      <UserTable
        v-else
        :usuarios="usuariosFiltrados"
        @ver="verDetalles"
        @editar="abrirEditar"
        @eliminar="confirmarEliminar"
      />
    </div>

    <!-- Formulario -->
    <UserForm
      v-model="mostrarFormulario"
      :usuario="usuarioParaFormulario"
      :roles="roles"
      :estados="estados"
      :guardando="guardando"
      @crear="solicitarCrearUsuario"
      @actualizar="solicitarActualizarUsuario"
    />

    <!-- Detalles -->
    <UserDetails
      v-model="mostrarDetalles"
      :usuario="usuarioSeleccionado"
      @editar="editarDesdeDetalles"
      @permisos="abrirPermisos"
    />

    <!-- Permisos -->
    <UserPermissions
      v-model="mostrarPermisos"
      :usuario="usuarioSeleccionado"
      :guardando="guardando"
      @guardar="solicitarGuardarPermisos"
    />

    <!-- Confirmación -->
    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      :titulo="confirmacion.titulo"
      :mensaje="confirmacion.mensaje"
      :texto-confirmar="confirmacion.textoConfirmar"
      :tipo="confirmacion.tipo"
      :loading="guardando"
      @confirm="ejecutarConfirmacion"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';

import UserDetails from '../../modules/users/components/user-details.vue';
import UserFilters from '../../modules/users/components/user-filters.vue';
import UserForm from '../../modules/users/components/user-form.vue';
import UserHeader from '../../modules/users/components/user-header.vue';
import UserPermissions from '../../modules/users/components/user-permissions.vue';
import UserTable from '../../modules/users/components/user-table.vue';

import {
  obtenerEstadosUsuario,
  obtenerRolesUsuario,
} from '../../modules/users/services/user.service';

import { useUsers } from '../../modules/users/composables/use-users';

import type {
  ActualizarUsuario,
  CrearUsuario,
  PermisosModulo,
  Usuario,
} from '../../modules/users/types/user.types';

type TipoConfirmacion = 'danger' | 'warning' | 'primary';

type AccionConfirmacion = 'crear' | 'actualizar' | 'eliminar' | 'permisos' | null;

interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  tipo: TipoConfirmacion;
}

const {
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
  crear,
  actualizar,
  eliminar,
  actualizarPermisos,
} = useUsers();

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarPermisos = ref(false);
const mostrarConfirmacion = ref(false);

const usuarioParaFormulario = ref<Usuario | null>(null);
const usuarioParaEliminar = ref<Usuario | null>(null);

const datosCrearPendientes = ref<CrearUsuario | null>(null);
const datosActualizarPendientes = ref<ActualizarUsuario | null>(null);
const permisosPendientes = ref<PermisosModulo[] | null>(null);

const accionConfirmacion = ref<AccionConfirmacion>(null);

const roles = obtenerRolesUsuario();
const estados = obtenerEstadosUsuario();

const confirmacion = computed<DatosConfirmacion>(() => {
  switch (accionConfirmacion.value) {
    case 'crear':
      return {
        titulo: 'Crear usuario',
        mensaje: '¿Deseas crear este usuario? Se agregará a la lista de usuarios de NEXORA.',
        textoConfirmar: 'Crear usuario',
        tipo: 'primary',
      };

    case 'actualizar':
      return {
        titulo: 'Guardar cambios',
        mensaje: '¿Deseas guardar los cambios realizados en la información de este usuario?',
        textoConfirmar: 'Guardar cambios',
        tipo: 'primary',
      };

    case 'permisos':
      return {
        titulo: 'Guardar permisos',
        mensaje: '¿Deseas guardar la configuración de permisos de este usuario?',
        textoConfirmar: 'Guardar permisos',
        tipo: 'primary',
      };

    case 'eliminar':
      return {
        titulo: 'Eliminar usuario',
        mensaje:
          '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
        textoConfirmar: 'Eliminar usuario',
        tipo: 'danger',
      };

    default:
      return {
        titulo: 'Confirmar acción',
        mensaje: '¿Deseas continuar con esta acción?',
        textoConfirmar: 'Confirmar',
        tipo: 'primary',
      };
  }
});

const tarjetasResumen = computed(() => [
  {
    id: 'total',
    label: 'Total usuarios',
    valor: resumen.value.total,
    icono: 'group',
    tipo: 'total',
  },
  {
    id: 'activos',
    label: 'Activos',
    valor: resumen.value.activos,
    icono: 'check_circle',
    tipo: 'activo',
  },
  {
    id: 'pendientes',
    label: 'Pendientes',
    valor: resumen.value.pendientes,
    icono: 'schedule',
    tipo: 'pendiente',
  },
  {
    id: 'inactivos',
    label: 'Inactivos',
    valor: resumen.value.inactivos,
    icono: 'link_off',
    tipo: 'inactivo',
  },
]);

const abrirCrear = (): void => {
  usuarioParaFormulario.value = null;
  mostrarFormulario.value = true;
};

const abrirEditar = (usuario: Usuario): void => {
  usuarioParaFormulario.value = usuario;
  mostrarFormulario.value = true;
};

const verDetalles = (usuario: Usuario): void => {
  seleccionarUsuario(usuario.id);
  mostrarDetalles.value = true;
};

const editarDesdeDetalles = (usuario: Usuario): void => {
  mostrarDetalles.value = false;
  usuarioParaFormulario.value = usuario;
  mostrarFormulario.value = true;
};

const abrirPermisos = (usuario: Usuario): void => {
  seleccionarUsuario(usuario.id);
  mostrarDetalles.value = false;
  mostrarPermisos.value = true;
};

/* =========================
   CREAR
========================= */

const solicitarCrearUsuario = (datos: CrearUsuario): void => {
  datosCrearPendientes.value = datos;
  datosActualizarPendientes.value = null;
  permisosPendientes.value = null;
  usuarioParaEliminar.value = null;

  accionConfirmacion.value = 'crear';
  mostrarConfirmacion.value = true;
};

const ejecutarCrearUsuario = (): void => {
  const datos = datosCrearPendientes.value;

  if (!datos) {
    return;
  }

  const usuario = crear(datos);

  mostrarConfirmacion.value = false;
  mostrarFormulario.value = false;

  datosCrearPendientes.value = null;
  accionConfirmacion.value = null;

  Notify.create({
    type: 'positive',
    icon: 'check_circle',
    message: `Usuario ${usuario.nombre} creado correctamente.`,
  });
};

/* =========================
   ACTUALIZAR
========================= */

const solicitarActualizarUsuario = (datos: ActualizarUsuario): void => {
  datosActualizarPendientes.value = datos;
  datosCrearPendientes.value = null;
  permisosPendientes.value = null;
  usuarioParaEliminar.value = null;

  accionConfirmacion.value = 'actualizar';
  mostrarConfirmacion.value = true;
};

const ejecutarActualizarUsuario = (): void => {
  const datos = datosActualizarPendientes.value;

  if (!datos) {
    return;
  }

  const usuario = actualizar(datos);

  if (!usuario) {
    mostrarConfirmacion.value = false;

    Notify.create({
      type: 'negative',
      icon: 'error',
      message: 'No se pudo actualizar el usuario.',
    });

    return;
  }

  mostrarConfirmacion.value = false;
  mostrarFormulario.value = false;

  datosActualizarPendientes.value = null;
  accionConfirmacion.value = null;

  Notify.create({
    type: 'positive',
    icon: 'check_circle',
    message: 'Usuario actualizado correctamente.',
  });
};

/* =========================
   ELIMINAR
========================= */

const confirmarEliminar = (usuario: Usuario): void => {
  usuarioParaEliminar.value = usuario;

  datosCrearPendientes.value = null;
  datosActualizarPendientes.value = null;
  permisosPendientes.value = null;

  accionConfirmacion.value = 'eliminar';
  mostrarConfirmacion.value = true;
};

const eliminarUsuarioConfirmado = (): void => {
  const usuario = usuarioParaEliminar.value;

  if (!usuario) {
    return;
  }

  const eliminado = eliminar(usuario.id);

  if (!eliminado) {
    mostrarConfirmacion.value = false;

    Notify.create({
      type: 'negative',
      icon: 'error',
      message: 'No se pudo eliminar el usuario.',
    });

    return;
  }

  mostrarConfirmacion.value = false;
  usuarioParaEliminar.value = null;
  accionConfirmacion.value = null;

  Notify.create({
    type: 'positive',
    icon: 'check_circle',
    message: 'Usuario eliminado correctamente.',
  });
};

/* =========================
   PERMISOS
========================= */

const solicitarGuardarPermisos = (permisos: PermisosModulo[]): void => {
  permisosPendientes.value = permisos.map((permiso) => ({
    ...permiso,
  }));

  datosCrearPendientes.value = null;
  datosActualizarPendientes.value = null;
  usuarioParaEliminar.value = null;

  accionConfirmacion.value = 'permisos';
  mostrarConfirmacion.value = true;
};

const guardarPermisosConfirmado = (): void => {
  const usuario = usuarioSeleccionado.value;
  const permisos = permisosPendientes.value;

  if (!usuario || !permisos) {
    return;
  }

  const actualizado = actualizarPermisos({
    id: usuario.id,
    permisos,
  });

  if (!actualizado) {
    mostrarConfirmacion.value = false;

    Notify.create({
      type: 'negative',
      icon: 'error',
      message: 'No se pudieron actualizar los permisos.',
    });

    return;
  }

  mostrarConfirmacion.value = false;
  mostrarPermisos.value = false;

  permisosPendientes.value = null;
  accionConfirmacion.value = null;

  Notify.create({
    type: 'positive',
    icon: 'check_circle',
    message: 'Permisos actualizados correctamente.',
  });
};

/* =========================
   CONFIRMACIÓN GENERAL
========================= */

const ejecutarConfirmacion = (): void => {
  switch (accionConfirmacion.value) {
    case 'crear':
      ejecutarCrearUsuario();
      break;

    case 'actualizar':
      ejecutarActualizarUsuario();
      break;

    case 'eliminar':
      eliminarUsuarioConfirmado();
      break;

    case 'permisos':
      guardarPermisosConfirmado();
      break;
  }
};

onMounted(() => {
  cargarUsuarios();
});
</script>

<style scoped>
.users-page {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.users-page__content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.users-page__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.users-page__summary-card {
  border-radius: 16px;
  background: #ffffff;
}

.users-page__summary-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.users-page__summary-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.users-page__summary-icon--total {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.users-page__summary-icon--activo {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.users-page__summary-icon--pendiente {
  background: rgba(245, 124, 0, 0.1);
  color: #ef6c00;
}

.users-page__summary-icon--inactivo {
  background: rgba(117, 117, 117, 0.1);
  color: #616161;
}

.users-page__summary-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.users-page__summary-label {
  margin-top: 3px;
  font-size: 12px;
  color: #6b7280;
}

.users-page__summary + .user-filters {
  margin-top: 16px;
}

.user-filters + .users-page__loading,
.user-filters + .users-page__empty,
.user-filters + .user-table {
  margin-top: 16px;
}

.users-page__loading,
.users-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
}

.users-page__loading {
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
}

.users-page__empty-title {
  margin-top: 12px;
  font-size: 17px;
  font-weight: 700;
  color: #374151;
}

.users-page__empty-text {
  max-width: 420px;
  margin-top: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.5;
  color: #6b7280;
}

@media (max-width: 1000px) {
  .users-page__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .users-page {
    padding: 16px !important;
  }

  .users-page__summary {
    grid-template-columns: 1fr;
  }
}
</style>
