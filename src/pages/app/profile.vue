<template>
  <q-page class="profile-page q-pa-lg">
    <div class="profile-page__container">
      <!-- HEADER -->
      <div class="profile-header">
        <div>
          <div class="profile-header__eyebrow">MI CUENTA</div>

          <h1 class="profile-header__title">Mi perfil</h1>

          <p class="profile-header__description">
            Administra tu información personal y los datos de acceso a NEXORA.
          </p>
        </div>
      </div>

      <!-- PERFIL -->
      <div class="profile-grid">
        <!-- IDENTIDAD -->
        <q-card flat bordered class="profile-card profile-card--identity">
          <q-card-section class="profile-card__identity">
            <q-avatar size="88px" color="primary" text-color="white" class="profile-avatar">
              {{ iniciales }}
            </q-avatar>

            <div class="profile-identity__info">
              <h2>
                {{ nombreCompleto }}
              </h2>

              <div class="profile-identity__email">
                <q-icon name="email" size="16px" />

                {{ usuario?.email }}
              </div>

              <q-badge rounded color="primary" :label="rol" class="q-mt-sm" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="profile-business">
              <div class="profile-business__icon">
                <q-icon name="business" size="20px" />
              </div>

              <div>
                <div class="profile-business__label">Negocio</div>

                <div class="profile-business__value">
                  {{ usuario?.negocioNombre ?? 'NEXORA' }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- INFORMACIÓN -->
        <q-card flat bordered class="profile-card">
          <q-card-section>
            <div class="section-heading">
              <div class="section-heading__icon">
                <q-icon name="person_outline" size="20px" />
              </div>

              <div>
                <h2>Información personal</h2>

                <p>Datos asociados a tu cuenta.</p>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="profile-fields">
            <div class="profile-field">
              <span>Nombre</span>
              <strong>{{ usuario?.nombre }}</strong>
            </div>

            <div class="profile-field">
              <span>Apellido</span>
              <strong>{{ usuario?.apellido }}</strong>
            </div>

            <div class="profile-field">
              <span>Correo electrónico</span>
              <strong>{{ usuario?.email }}</strong>
            </div>

            <div class="profile-field">
              <span>Teléfono</span>
              <strong>
                {{ usuario?.telefono || 'No registrado' }}
              </strong>
            </div>

            <div class="profile-field">
              <span>Cargo</span>
              <strong>{{ usuario?.cargo }}</strong>
            </div>

            <div class="profile-field">
              <span>Rol</span>
              <strong>{{ rol }}</strong>
            </div>
          </q-card-section>
        </q-card>

        <!-- SEGURIDAD -->
        <q-card flat bordered class="profile-card">
          <q-card-section>
            <div class="section-heading">
              <div class="section-heading__icon">
                <q-icon name="shield" size="20px" />
              </div>

              <div>
                <h2>Seguridad</h2>

                <p>Protege el acceso a tu cuenta.</p>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="security-row">
              <div>
                <div class="security-row__title">Contraseña</div>

                <div class="security-row__description">
                  Mantén actualizada tu contraseña de acceso.
                </div>
              </div>

              <q-btn
                outline
                no-caps
                color="primary"
                label="Cambiar contraseña"
                icon="lock_outline"
                disable
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- PERMISOS -->
        <q-card flat bordered class="profile-card">
          <q-card-section>
            <div class="section-heading">
              <div class="section-heading__icon">
                <q-icon name="verified_user" size="20px" />
              </div>

              <div>
                <h2>Acceso</h2>

                <p>Información sobre los permisos de tu cuenta.</p>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="access-summary">
              <div class="access-summary__number">
                {{ cantidadPermisos }}
              </div>

              <div>
                <div class="access-summary__title">Permisos disponibles</div>

                <div class="access-summary__description">
                  {{
                    usuario?.rol === 'superadministrador'
                      ? 'Acceso global a la plataforma.'
                      : 'Permisos asignados a tu cuenta.'
                  }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useAuth } from '../../modules/auth/composables/use-auth';

const { usuario } = useAuth();

const nombreCompleto = computed(() => {
  if (!usuario.value) {
    return 'Usuario';
  }

  return `${usuario.value.nombre} ${usuario.value.apellido}`;
});

const iniciales = computed(() => {
  if (!usuario.value) {
    return 'NX';
  }

  return `${usuario.value.nombre.charAt(0)}${usuario.value.apellido.charAt(0)}`.toUpperCase();
});

const rol = computed(() => {
  const roles: Record<string, string> = {
    superadministrador: 'Superadministrador',
    administrador: 'Administrador',
    gerente: 'Gerente',
    recepcionista: 'Recepcionista',
    profesional: 'Profesional',
  };

  return roles[usuario.value?.rol ?? ''] ?? 'Usuario';
});

const cantidadPermisos = computed(() => {
  if (!usuario.value) {
    return 0;
  }

  if (usuario.value.rol === 'superadministrador') {
    return 'Global';
  }

  return usuario.value.permisos.length;
});
</script>

<style scoped lang="scss">
.profile-page {
  min-height: calc(100vh - 68px);
  background: #f8fafc;
}

.profile-page__container {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 24px;
}

.profile-header__eyebrow {
  margin-bottom: 6px;
  color: var(--q-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.profile-header__title {
  margin: 0;
  color: #172033;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.profile-header__description {
  max-width: 650px;
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.profile-card {
  border-radius: 16px;
  background: #ffffff;
}

.profile-card--identity {
  grid-column: span 2;
}

.profile-card__identity {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
}

.profile-avatar {
  flex: 0 0 auto;
  font-size: 26px;
  font-weight: 700;
}

.profile-identity__info h2 {
  margin: 0;
  color: #172033;
  font-size: 21px;
  font-weight: 800;
}

.profile-identity__email {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
  color: #64748b;
  font-size: 13px;
}

.profile-business {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-business__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
}

.profile-business__label {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.profile-business__value {
  margin-top: 2px;
  color: #172033;
  font-size: 14px;
  font-weight: 700;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-heading__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border-radius: 10px;
  background: #eef2ff;
  color: var(--q-primary);
}

.section-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 16px;
  font-weight: 800;
}

.section-heading p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.profile-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.profile-field span {
  display: block;
  margin-bottom: 5px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-field strong {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.security-row__title {
  color: #172033;
  font-size: 14px;
  font-weight: 700;
}

.security-row__description {
  max-width: 430px;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.access-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.access-summary__number {
  min-width: 70px;
  color: var(--q-primary);
  font-size: 27px;
  font-weight: 800;
}

.access-summary__title {
  color: #172033;
  font-size: 14px;
  font-weight: 700;
}

.access-summary__description {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 800px) {
  .profile-page {
    padding: 20px !important;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-card--identity {
    grid-column: span 1;
  }

  .security-row {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 550px) {
  .profile-page {
    padding: 16px !important;
  }

  .profile-header__title {
    font-size: 24px;
  }

  .profile-card__identity {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px;
  }

  .profile-fields {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .security-row .q-btn {
    width: 100%;
  }
}
</style>
