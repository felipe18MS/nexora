<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card v-if="usuario" class="user-details">
      <!-- Header -->
      <q-card-section class="user-details__header">
        <div class="user-details__identity">
          <q-avatar size="58px" color="blue-1" text-color="primary" class="user-details__avatar">
            <span>{{ obtenerIniciales(usuario) }}</span>
          </q-avatar>

          <div class="user-details__identity-info">
            <div class="user-details__eyebrow">PERFIL DE USUARIO</div>

            <div class="user-details__name">{{ usuario.nombre }} {{ usuario.apellido }}</div>

            <div class="user-details__email">
              <q-icon name="mail_outline" size="15px" />
              <span>{{ usuario.email }}</span>
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" color="grey-7" aria-label="Cerrar" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <!-- Body -->
      <q-card-section class="user-details__body">
        <!-- Status -->
        <div class="user-details__status-row">
          <div class="user-details__status" :class="`user-details__status--${usuario.estado}`">
            <q-icon :name="obtenerIconoEstado(usuario.estado)" size="16px" />
            <span>{{ obtenerLabelEstado(usuario.estado) }}</span>
          </div>

          <div class="user-details__role">
            <q-icon name="admin_panel_settings" size="16px" />
            <span>{{ obtenerLabelRol(usuario.rol) }}</span>
          </div>
        </div>

        <!-- Información personal -->
        <div class="user-details__section">
          <div class="user-details__section-heading">
            <div class="user-details__section-icon">
              <q-icon name="person_outline" size="19px" />
            </div>

            <div>
              <div class="user-details__section-title">Información personal</div>

              <div class="user-details__section-subtitle">Datos principales del usuario.</div>
            </div>
          </div>

          <div class="user-details__info-grid">
            <div class="user-details__info-card">
              <div class="user-details__info-icon">
                <q-icon name="badge" size="18px" />
              </div>

              <div class="user-details__info-content">
                <span class="user-details__label">Cargo</span>
                <span class="user-details__value">
                  {{ usuario.cargo || 'No registrado' }}
                </span>
              </div>
            </div>

            <div class="user-details__info-card">
              <div class="user-details__info-icon">
                <q-icon name="phone" size="18px" />
              </div>

              <div class="user-details__info-content">
                <span class="user-details__label">Teléfono</span>
                <span class="user-details__value">
                  {{ usuario.telefono || 'No registrado' }}
                </span>
              </div>
            </div>

            <div class="user-details__info-card">
              <div class="user-details__info-icon">
                <q-icon name="login" size="18px" />
              </div>

              <div class="user-details__info-content">
                <span class="user-details__label">Último acceso</span>
                <span class="user-details__value">
                  {{ usuario.ultimoAcceso ? formatearFecha(usuario.ultimoAcceso) : 'Sin acceso' }}
                </span>
              </div>
            </div>

            <div class="user-details__info-card">
              <div class="user-details__info-icon">
                <q-icon name="calendar_today" size="18px" />
              </div>

              <div class="user-details__info-content">
                <span class="user-details__label">Usuario creado</span>
                <span class="user-details__value">
                  {{ formatearFecha(usuario.creadoEn) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Permisos -->
        <div class="user-details__section">
          <div class="user-details__section-heading">
            <div class="user-details__section-icon">
              <q-icon name="security" size="19px" />
            </div>

            <div>
              <div class="user-details__section-title">Acceso y permisos</div>

              <div class="user-details__section-subtitle">
                Configura el acceso del usuario a los módulos de NEXORA.
              </div>
            </div>
          </div>

          <div class="user-details__permissions-card">
            <div class="user-details__permissions-info">
              <div class="user-details__permissions-icon">
                <q-icon name="apps" size="21px" />
              </div>

              <div>
                <div class="user-details__permission-number">
                  {{ permisosActivos }}
                </div>

                <div class="user-details__permission-label">
                  {{ permisosActivos === 1 ? 'módulo con acceso' : 'módulos con acceso' }}
                </div>
              </div>
            </div>

            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="manage_accounts"
              label="Administrar permisos"
              class="user-details__permissions-btn"
              @click="$emit('permisos', usuario)"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer -->
      <q-card-actions align="right" class="user-details__footer">
        <q-btn flat no-caps color="grey-7" label="Cerrar" @click="cerrar" />

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="edit"
          label="Editar usuario"
          @click="$emit('editar', usuario)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatearFecha } from '../../../utils/date.utils';
import type { EstadoUsuario, RolUsuario, Usuario } from '../types/user.types';

const props = defineProps<{
  modelValue: boolean;
  usuario: Usuario | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  editar: [usuario: Usuario];
  permisos: [usuario: Usuario];
}>();

const permisosActivos = computed(() => {
  if (!props.usuario) {
    return 0;
  }

  return props.usuario.permisos.filter((permiso) => permiso.ver).length;
});

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

const cerrar = (): void => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.user-details {
  width: min(760px, 96vw);
  max-width: 760px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
}

.user-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
}

.user-details__identity {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
}

.user-details__avatar {
  flex-shrink: 0;
  font-size: 19px;
  font-weight: 700;
}

.user-details__identity-info {
  min-width: 0;
}

.user-details__eyebrow {
  margin-bottom: 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.user-details__name {
  font-size: 20px;
  line-height: 1.25;
  font-weight: 700;
  color: #111827;
}

.user-details__email {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 13px;
  color: #6b7280;
  min-width: 0;
}

.user-details__email span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-details__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
}

.user-details__status-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.user-details__status,
.user-details__role {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.user-details__status--activo {
  background: rgba(46, 125, 50, 0.09);
  color: #2e7d32;
}

.user-details__status--inactivo {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.user-details__status--pendiente {
  background: rgba(245, 124, 0, 0.1);
  color: #d97706;
}

.user-details__role {
  background: #eff6ff;
  color: #2563eb;
}

.user-details__section {
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.user-details__section + .user-details__section {
  margin-top: 16px;
}

.user-details__section-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 18px;
}

.user-details__section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
}

.user-details__section-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.user-details__section-subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: #6b7280;
}

.user-details__info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.user-details__info-card {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 13px;
  border: 1px solid #edf0f3;
  border-radius: 12px;
  background: #fafbfc;
}

.user-details__info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #ffffff;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.user-details__info-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.user-details__label {
  font-size: 11px;
  color: #6b7280;
}

.user-details__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.user-details__permissions-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px;
  border-radius: 13px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.user-details__permissions-info {
  display: flex;
  align-items: center;
  gap: 11px;
}

.user-details__permissions-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
}

.user-details__permission-number {
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  color: #111827;
}

.user-details__permission-label {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.user-details__permissions-btn {
  min-height: 40px;
  border-radius: 10px;
}

.user-details__footer {
  padding: 15px 24px;
  gap: 8px;
}

@media (max-width: 600px) {
  .user-details {
    width: 96vw;
    max-height: 92vh;
    border-radius: 18px;
  }

  .user-details__header,
  .user-details__body {
    padding-left: 18px;
    padding-right: 18px;
  }

  .user-details__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .user-details__name {
    font-size: 18px;
  }

  .user-details__info-grid {
    grid-template-columns: 1fr;
  }

  .user-details__permissions-card {
    align-items: stretch;
    flex-direction: column;
  }

  .user-details__permissions-btn {
    width: 100%;
  }

  .user-details__footer {
    justify-content: stretch;
  }

  .user-details__footer .q-btn {
    flex: 1;
  }
}
</style>
