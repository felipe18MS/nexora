<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card v-if="usuario" class="user-permissions">
      <q-card-section class="user-permissions__header">
        <div class="user-permissions__identity">
          <div class="user-permissions__icon">
            <q-icon name="security" size="22px" />
          </div>

          <div class="user-permissions__identity-content">
            <div class="user-permissions__title">Permisos de usuario</div>

            <div class="user-permissions__subtitle">
              {{ usuario.nombre }}
              {{ usuario.apellido }}
              <span class="user-permissions__separator">•</span>
              {{ obtenerLabelRol(usuario.rol) }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" color="grey-7" aria-label="Cerrar" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <q-card-section class="user-permissions__body">
        <div class="user-permissions__intro">
          <div class="user-permissions__intro-content">
            <div class="user-permissions__intro-icon">
              <q-icon name="admin_panel_settings" size="20px" />
            </div>

            <div>
              <div class="user-permissions__intro-title">Control de acceso</div>

              <div class="user-permissions__intro-text">
                Define qué acciones puede realizar este usuario en cada módulo.
              </div>
            </div>
          </div>

          <q-btn
            flat
            no-caps
            color="primary"
            icon="done_all"
            label="Seleccionar todos"
            class="user-permissions__select-all"
            @click="seleccionarTodos"
          />
        </div>

        <div class="user-permissions__summary">
          <div class="user-permissions__summary-item">
            <q-icon name="apps" size="17px" />
            <div>
              <strong>{{ permisos.length }}</strong>
              <span>módulos</span>
            </div>
          </div>

          <div class="user-permissions__summary-item">
            <q-icon name="visibility" size="17px" />
            <div>
              <strong>{{ modulosConAcceso }}</strong>
              <span>con acceso</span>
            </div>
          </div>

          <div class="user-permissions__summary-item">
            <q-icon name="checklist" size="17px" />
            <div>
              <strong>{{ totalAcciones }}</strong>
              <span>permisos activos</span>
            </div>
          </div>
        </div>

        <div class="user-permissions__table-container">
          <div class="user-permissions__table-scroll">
            <table class="user-permissions__table">
              <thead>
                <tr>
                  <th class="user-permissions__module-column">Módulo</th>

                  <th>
                    <div class="user-permissions__permission-heading">
                      <q-icon name="visibility" size="16px" />
                      <span>Ver</span>
                    </div>
                  </th>

                  <th>
                    <div class="user-permissions__permission-heading">
                      <q-icon name="add_circle_outline" size="16px" />
                      <span>Crear</span>
                    </div>
                  </th>

                  <th>
                    <div class="user-permissions__permission-heading">
                      <q-icon name="edit" size="16px" />
                      <span>Editar</span>
                    </div>
                  </th>

                  <th>
                    <div class="user-permissions__permission-heading">
                      <q-icon name="delete_outline" size="16px" />
                      <span>Eliminar</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="permiso in permisos" :key="permiso.modulo">
                  <td class="user-permissions__module">
                    <div class="user-permissions__module-icon">
                      <q-icon :name="obtenerIconoModulo(permiso.modulo)" size="17px" />
                    </div>

                    <span>
                      {{ obtenerLabelModulo(permiso.modulo) }}
                    </span>
                  </td>

                  <td>
                    <q-checkbox v-model="permiso.ver" dense color="primary" />
                  </td>

                  <td>
                    <q-checkbox
                      v-model="permiso.crear"
                      dense
                      color="primary"
                      :disable="!permiso.ver"
                    />
                  </td>

                  <td>
                    <q-checkbox
                      v-model="permiso.editar"
                      dense
                      color="primary"
                      :disable="!permiso.ver"
                    />
                  </td>

                  <td>
                    <q-checkbox
                      v-model="permiso.eliminar"
                      dense
                      color="primary"
                      :disable="!permiso.ver"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="user-permissions__scroll-hint">
            <q-icon name="swap_horiz" size="16px" />
            <span>Desliza horizontalmente para ver todas las acciones</span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="user-permissions__footer">
        <q-btn flat no-caps label="Cancelar" color="grey-7" :disable="guardando" @click="cerrar" />

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Guardar permisos"
          :loading="guardando"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ModuloPermiso, PermisosModulo, RolUsuario, Usuario } from '../types/user.types';

const props = defineProps<{
  modelValue: boolean;
  usuario: Usuario | null;
  guardando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  guardar: [permisos: PermisosModulo[]];
}>();

const permisos = ref<PermisosModulo[]>([]);

const cargarPermisos = (usuario: Usuario | null): void => {
  permisos.value = usuario
    ? usuario.permisos.map((permiso) => ({
        ...permiso,
      }))
    : [];
};

watch(
  [() => props.usuario, () => props.modelValue],
  ([usuario, abierto]) => {
    if (abierto) {
      cargarPermisos(usuario);
    }
  },
  {
    immediate: true,
  },
);

const modulosConAcceso = computed(() => {
  return permisos.value.filter((permiso) => permiso.ver).length;
});

const totalAcciones = computed(() => {
  return permisos.value.reduce((total, permiso) => {
    return (
      total +
      Number(permiso.ver) +
      Number(permiso.crear) +
      Number(permiso.editar) +
      Number(permiso.eliminar)
    );
  }, 0);
});

const obtenerLabelRol = (rol: RolUsuario): string => {
  const labels: Record<RolUsuario, string> = {
    superadministrador: 'Superadministrador',
    administrador: 'Administrador',
    gerente: 'Gerente',
    recepcionista: 'Recepcionista',
    profesional: 'Profesional',
  };

  return labels[rol];
};

const obtenerLabelModulo = (modulo: ModuloPermiso): string => {
  const labels: Record<ModuloPermiso, string> = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    citas: 'Citas',
    horario: 'Horario',
    disponibilidad: 'Disponibilidad',
    servicios: 'Servicios',
    empleados: 'Profesionales',
    pedidos: 'Pedidos',
    productos: 'Productos',
    inventario: 'Inventario',
    finanzas: 'Finanzas',
    conversaciones: 'Conversaciones',
    llamadas: 'Llamadas',
    whatsapp: 'WhatsApp',
    automatizaciones: 'Automatizaciones',
    recordatorios: 'Recordatorios',
    ai: 'Agente IA',
    integraciones: 'Integraciones',
    reportes: 'Reportes',
    usuarios: 'Usuarios',
    configuracion: 'Configuración',
    suscripcion: 'Suscripción',
  };

  return labels[modulo];
};

const obtenerIconoModulo = (modulo: ModuloPermiso): string => {
  const iconos: Record<ModuloPermiso, string> = {
    dashboard: 'dashboard',
    clientes: 'people',
    citas: 'event',
    horario: 'schedule',
    disponibilidad: 'event_available',
    servicios: 'design_services',
    empleados: 'badge',
    pedidos: 'shopping_cart',
    productos: 'inventory_2',
    inventario: 'warehouse',
    finanzas: 'account_balance',
    conversaciones: 'forum',
    llamadas: 'call',
    whatsapp: 'chat',
    automatizaciones: 'autorenew',
    recordatorios: 'notifications',
    ai: 'smart_toy',
    integraciones: 'extension',
    reportes: 'analytics',
    usuarios: 'group',
    configuracion: 'settings',
    suscripcion: 'card_membership',
  };

  return iconos[modulo];
};

const seleccionarTodos = (): void => {
  permisos.value.forEach((permiso) => {
    permiso.ver = true;
    permiso.crear = true;
    permiso.editar = true;
    permiso.eliminar = true;
  });
};

const guardar = (): void => {
  const permisosActualizados = permisos.value.map((permiso) => ({
    ...permiso,
    crear: permiso.ver ? permiso.crear : false,
    editar: permiso.ver ? permiso.editar : false,
    eliminar: permiso.ver ? permiso.eliminar : false,
  }));

  emit('guardar', permisosActualizados);
};

const cerrar = (): void => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.user-permissions {
  display: flex;
  flex-direction: column;
  width: min(980px, 96vw);
  max-width: 980px;
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
}

.user-permissions__header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.user-permissions__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.user-permissions__identity-content {
  min-width: 0;
}

.user-permissions__icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.user-permissions__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
}

.user-permissions__subtitle {
  margin-top: 4px;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.4;
  color: #6b7280;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-permissions__separator {
  margin: 0 5px;
  color: #9ca3af;
}

.user-permissions__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 22px 24px;
}

.user-permissions__intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.user-permissions__intro-content {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.user-permissions__intro-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f3f4f6;
  color: #4b5563;
}

.user-permissions__intro-title {
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.user-permissions__intro-text {
  margin-top: 3px;
  font-size: 13px;
  line-height: 1.45;
  color: #6b7280;
}

.user-permissions__select-all {
  flex: 0 0 auto;
}

.user-permissions__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.user-permissions__summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 11px 13px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
  color: #6b7280;
}

.user-permissions__summary-item > .q-icon {
  color: #6b7280;
}

.user-permissions__summary-item div {
  display: flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
}

.user-permissions__summary-item strong {
  color: #1f2937;
  font-size: 14px;
}

.user-permissions__summary-item span {
  font-size: 12px;
  white-space: nowrap;
}

.user-permissions__table-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: calc(90vh - 300px);
  min-height: 280px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
}

.user-permissions__table-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: auto;
  overflow-y: auto;
}

.user-permissions__table {
  width: 100%;
  min-width: 720px;
  border-collapse: separate;
  border-spacing: 0;
}

.user-permissions__table th,
.user-permissions__table td {
  padding: 11px 14px;
  border-bottom: 1px solid #edf0f3;
  text-align: center;
  white-space: nowrap;
}

.user-permissions__table th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #f8fafc;
  color: #4b5563;
  font-size: 12px;
  font-weight: 700;
}

.user-permissions__table tbody tr {
  transition: background 0.15s ease;
}

.user-permissions__table tbody tr:hover {
  background: #fafafa;
}

.user-permissions__table tbody tr:last-child td {
  border-bottom: none;
}

.user-permissions__module-column {
  width: 42%;
  min-width: 270px;
  text-align: left !important;
}

.user-permissions__table th:first-child {
  position: sticky;
  left: 0;
  z-index: 5;
  background: #f8fafc;
}

.user-permissions__table td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background: #ffffff;
}

.user-permissions__table tbody tr:hover td:first-child {
  background: #fafafa;
}

.user-permissions__permission-heading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.user-permissions__permission-heading .q-icon {
  color: #6b7280;
}

.user-permissions__module {
  text-align: left !important;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
}

.user-permissions__module-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-right: 8px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  vertical-align: middle;
}

.user-permissions__scroll-hint {
  display: none;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 10px;
  border-top: 1px solid #edf0f3;
  background: #fafafa;
  color: #9ca3af;
  font-size: 11px;
}

.user-permissions__footer {
  flex: 0 0 auto;
  gap: 8px;
  padding: 16px 24px;
  background: #ffffff;
}

@media (max-width: 700px) {
  .user-permissions {
    width: 96vw;
    max-height: 92vh;
  }

  .user-permissions__header,
  .user-permissions__body,
  .user-permissions__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .user-permissions__intro {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .user-permissions__select-all {
    align-self: flex-start;
  }

  .user-permissions__summary {
    grid-template-columns: 1fr;
  }

  .user-permissions__table-container {
    height: calc(92vh - 390px);
    min-height: 240px;
  }

  .user-permissions__scroll-hint {
    display: flex;
  }

  .user-permissions__footer {
    justify-content: stretch;
  }

  .user-permissions__footer .q-btn {
    flex: 1;
  }
}
</style>
