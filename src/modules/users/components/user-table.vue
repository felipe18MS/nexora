<template>
  <q-card flat bordered class="user-table">
    <q-card-section class="user-table__header">
      <div>
        <div class="user-table__title">Usuarios</div>

        <div class="user-table__subtitle">
          {{ usuarios.length }}
          {{ usuarios.length === 1 ? 'usuario' : 'usuarios' }}
          encontrados
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-table
      flat
      :rows="usuarios"
      :columns="columnas"
      row-key="id"
      :pagination="paginacion"
      :rows-per-page-options="[5, 10, 20, 50]"
      no-data-label="No hay usuarios para mostrar"
      class="user-table__qtable"
    >
      <template #body-cell-usuario="props">
        <q-td :props="props">
          <div class="user-table__user">
            <q-avatar size="40px" color="blue-1" text-color="primary">
              <span>
                {{ obtenerIniciales(props.row) }}
              </span>
            </q-avatar>

            <div class="user-table__user-info">
              <div class="user-table__user-name">
                {{ props.row.nombre }}
                {{ props.row.apellido }}
              </div>

              <div class="user-table__user-email">
                {{ props.row.email }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-rol="props">
        <q-td :props="props">
          <q-chip dense outline color="primary" text-color="primary">
            {{ obtenerLabelRol(props.row.rol) }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-estado="props">
        <q-td :props="props">
          <div class="user-table__status" :class="`user-table__status--${props.row.estado}`">
            <q-icon :name="obtenerIconoEstado(props.row.estado)" size="16px" />

            <span>
              {{ obtenerLabelEstado(props.row.estado) }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-ultimoAcceso="props">
        <q-td :props="props">
          <span class="user-table__date">
            {{ props.row.ultimoAcceso ? formatearFecha(props.row.ultimoAcceso) : 'Sin acceso' }}
          </span>
        </q-td>
      </template>

      <template #body-cell-acciones="props">
        <q-td :props="props">
          <div class="user-table__actions">
            <q-btn
              flat
              round
              dense
              color="grey-7"
              icon="visibility"
              aria-label="Ver usuario"
              @click="$emit('ver', props.row)"
            >
              <q-tooltip> Ver usuario </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              aria-label="Editar usuario"
              @click="$emit('editar', props.row)"
            >
              <q-tooltip> Editar usuario </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              aria-label="Eliminar usuario"
              @click="$emit('eliminar', props.row)"
            >
              <q-tooltip> Eliminar usuario </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { formatearFecha } from '../../../utils/date.utils';

import type { EstadoUsuario, RolUsuario, Usuario } from '../types/user.types';

const props = defineProps<{
  usuarios: Usuario[];
}>();

defineEmits<{
  ver: [usuario: Usuario];
  editar: [usuario: Usuario];
  eliminar: [usuario: Usuario];
}>();

const paginacion = ref({
  page: 1,
  rowsPerPage: 10,
});

const columnas = [
  {
    name: 'usuario',
    label: 'Usuario',
    field: 'nombre',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    field: 'telefono',
    align: 'left' as const,
  },
  {
    name: 'rol',
    label: 'Rol',
    field: 'rol',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'ultimoAcceso',
    label: 'Último acceso',
    field: 'ultimoAcceso',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'right' as const,
  },
];

const obtenerIniciales = (usuario: Usuario): string => {
  return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
};

const obtenerLabelRol = (rol: RolUsuario): string => {
  const labels: Record<RolUsuario, string> = {
    administrador: 'Administrador',
    gerente: 'Gerente',
    recepcionista: 'Recepcionista',
    profesional: 'Profesional',
  };

  return labels[rol];
};

const obtenerLabelEstado = (estado: EstadoUsuario): string => {
  const labels: Record<EstadoUsuario, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    pendiente: 'Pendiente',
  };

  return labels[estado];
};

const obtenerIconoEstado = (estado: EstadoUsuario): string => {
  const iconos: Record<EstadoUsuario, string> = {
    activo: 'check_circle',
    inactivo: 'link_off',
    pendiente: 'schedule',
  };

  return iconos[estado];
};

void props;
</script>

<style scoped>
.user-table {
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
}

.user-table__header {
  padding: 20px 24px;
}

.user-table__title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.user-table__subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
}

.user-table__qtable {
  width: 100%;
}

.user-table__user {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.user-table__user-info {
  min-width: 0;
}

.user-table__user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.user-table__user-email {
  margin-top: 2px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.user-table__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.user-table__status--activo {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.user-table__status--inactivo {
  background: rgba(117, 117, 117, 0.1);
  color: #616161;
}

.user-table__status--pendiente {
  background: rgba(245, 124, 0, 0.1);
  color: #ef6c00;
}

.user-table__date {
  color: #4b5563;
  font-size: 13px;
}

.user-table__actions {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

@media (max-width: 900px) {
  .user-table__qtable {
    overflow-x: auto;
  }

  .user-table__header {
    padding: 18px;
  }
}
</style>
