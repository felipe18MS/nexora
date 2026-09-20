<template>
  <q-layout view="hHh Lpr lFf">
    <!-- HEADER -->
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          round
          dense
          icon="menu"
          aria-label="Abrir menú"
          class="q-mr-sm"
          @click="alternarMenu"
        />

        <div class="app-brand">
          <div class="app-brand__logo">
            <q-icon name="auto_awesome" size="22px" />
          </div>

          <div class="app-brand__name">NEXORA</div>
        </div>

        <q-space />

        <!-- NOTIFICACIONES -->
        <q-btn
          flat
          round
          dense
          icon="notifications_none"
          aria-label="Notificaciones"
          class="header-action"
        >
          <q-badge floating rounded color="negative" label="3" />

          <q-tooltip>Notificaciones</q-tooltip>
        </q-btn>

        <!-- PERFIL -->
        <q-btn flat no-caps class="profile-button q-ml-sm">
          <q-avatar size="36px" color="primary" text-color="white">
            {{ inicialesUsuario }}
          </q-avatar>

          <div class="profile-info">
            <div class="profile-name">
              {{ nombreUsuario }}
            </div>

            <div class="profile-role">
              {{ rolUsuario }}
            </div>
          </div>

          <q-icon name="keyboard_arrow_down" size="20px" class="q-ml-sm" />

          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
            <q-list style="min-width: 220px">
              <!-- IDENTIDAD -->
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="38px" color="primary" text-color="white">
                    {{ inicialesUsuario }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="menu-user-name">
                    {{ nombreUsuario }}
                  </q-item-label>

                  <q-item-label caption>
                    {{ usuario?.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header> Mi cuenta </q-item-label>

              <!-- PERFIL -->
              <q-item clickable v-close-popup to="/app/profile">
                <q-item-section avatar>
                  <q-icon name="person_outline" />
                </q-item-section>

                <q-item-section> Perfil </q-item-section>
              </q-item>

              <!-- CONFIGURACIÓN -->
              <q-item clickable v-close-popup to="/app/settings">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>

                <q-item-section> Configuración </q-item-section>
              </q-item>

              <q-separator />

              <!-- LOGOUT -->
              <q-item clickable v-close-popup class="logout-item" @click="cerrarSesion">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>

                <q-item-section> Cerrar sesión </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer v-model="menuAbierto" show-if-above bordered :width="260" class="app-drawer">
      <div class="drawer-content">
        <!-- MARCA -->
        <div class="drawer-brand">
          <div class="drawer-brand__icon">
            <q-icon name="auto_awesome" size="24px" />
          </div>

          <div>
            <div class="drawer-brand__name">NEXORA</div>

            <div class="drawer-brand__subtitle">Business Automation</div>
          </div>
        </div>

        <q-separator class="q-mx-md" />

        <q-scroll-area class="drawer-navigation">
          <!-- PRINCIPAL -->
          <q-list padding>
            <q-item-label class="navigation-title"> PRINCIPAL </q-item-label>

            <q-item
              clickable
              to="/app/dashboard"
              exact
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section> Dashboard </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/customers"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>

              <q-item-section> Clientes </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/appointments"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="event" />
              </q-item-section>

              <q-item-section> Citas </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/schedule"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="schedule" />
              </q-item-section>

              <q-item-section> Horario </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/availability"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="event_busy" />
              </q-item-section>

              <q-item-section> Disponibilidad </q-item-section>
            </q-item>
          </q-list>

          <!-- OPERACIONES -->
          <q-list padding>
            <q-item-label class="navigation-title"> OPERACIONES </q-item-label>

            <q-item
              clickable
              to="/app/services"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="content_cut" />
              </q-item-section>

              <q-item-section> Servicios </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/employees"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="badge" />
              </q-item-section>

              <q-item-section> Profesionales </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/orders"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="shopping_cart" />
              </q-item-section>

              <q-item-section> Pedidos </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/products"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="inventory_2" />
              </q-item-section>

              <q-item-section> Productos </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/inventory"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="warehouse" />
              </q-item-section>

              <q-item-section> Inventario </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/finance"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="payments" />
              </q-item-section>

              <q-item-section> Finanzas </q-item-section>
            </q-item>
          </q-list>

          <!-- COMUNICACIÓN -->
          <q-list padding>
            <q-item-label class="navigation-title"> COMUNICACIÓN </q-item-label>

            <q-item
              clickable
              to="/app/conversations"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="chat_bubble_outline" />
              </q-item-section>

              <q-item-section> Conversaciones </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/calls"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="phone_in_talk" />
              </q-item-section>

              <q-item-section> Llamadas </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/whatsapp"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="chat" />
              </q-item-section>

              <q-item-section> WhatsApp </q-item-section>
            </q-item>
          </q-list>

          <!-- AUTOMATIZACIÓN -->
          <q-list padding>
            <q-item-label class="navigation-title"> AUTOMATIZACIÓN </q-item-label>

            <q-item
              clickable
              to="/app/automations"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="auto_awesome" />
              </q-item-section>

              <q-item-section> Automatizaciones </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/reminders"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="notifications_active" />
              </q-item-section>

              <q-item-section> Recordatorios </q-item-section>
            </q-item>
          </q-list>

          <!-- INTELIGENCIA -->
          <q-list padding>
            <q-item-label class="navigation-title"> INTELIGENCIA </q-item-label>

            <q-item
              clickable
              to="/app/ai"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="smart_toy" />
              </q-item-section>

              <q-item-section> Agente IA </q-item-section>

              <q-item-section side>
                <q-badge color="primary" label="IA" rounded />
              </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/integrations"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="hub" />
              </q-item-section>

              <q-item-section> Integraciones </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/reports"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="bar_chart" />
              </q-item-section>

              <q-item-section> Reportes </q-item-section>
            </q-item>
          </q-list>

          <!-- CONFIGURACIÓN -->
          <q-list padding>
            <q-item-label class="navigation-title"> CONFIGURACIÓN </q-item-label>

            <q-item
              clickable
              to="/app/settings"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section> Configuración </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/users"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="manage_accounts" />
              </q-item-section>

              <q-item-section> Usuarios y permisos </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/app/subscription"
              active-class="navigation-item--active"
              class="navigation-item"
            >
              <q-item-section avatar>
                <q-icon name="workspace_premium" />
              </q-item-section>

              <q-item-section> Suscripción </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!-- FOOTER SIDEBAR -->
        <div class="drawer-footer">
          <q-item
            clickable
            to="/app/profile"
            active-class="navigation-item--active"
            class="navigation-item"
          >
            <q-item-section avatar>
              <q-icon name="person_outline" />
            </q-item-section>

            <q-item-section> Mi perfil </q-item-section>
          </q-item>

          <div class="drawer-version">NEXORA v1.0.0</div>
        </div>
      </div>
    </q-drawer>

    <!-- CONTENIDO -->
    <q-page-container class="app-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../modules/auth/composables/use-auth';

const router = useRouter();

const { usuario, cerrarSesion: cerrarSesionAuth } = useAuth();

const menuAbierto = ref(true);

const nombreUsuario = computed(() => {
  if (!usuario.value) {
    return 'Usuario';
  }

  return `${usuario.value.nombre} ${usuario.value.apellido}`;
});

const inicialesUsuario = computed(() => {
  if (!usuario.value) {
    return 'NX';
  }

  const nombre = usuario.value.nombre.trim();
  const apellido = usuario.value.apellido.trim();

  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
});

const rolUsuario = computed(() => {
  if (!usuario.value) {
    return 'Usuario';
  }

  const roles: Record<string, string> = {
    superadministrador: 'Superadministrador',
    administrador: 'Administrador',
    gerente: 'Gerente',
    recepcionista: 'Recepcionista',
    profesional: 'Profesional',
  };

  return roles[usuario.value.rol] ?? 'Usuario';
});

const alternarMenu = (): void => {
  menuAbierto.value = !menuAbierto.value;
};

const cerrarSesion = (): void => {
  cerrarSesionAuth();

  void router.replace('/auth/login');
};
</script>

<style scoped lang="scss">
.app-header {
  background: #ffffff;
  color: #172033;
  border-bottom: 1px solid #e8ebf0;
}

.app-toolbar {
  min-height: 68px;
  padding: 0 24px;
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-brand__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--q-primary);
  color: white;
}

.app-brand__name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.header-action {
  color: #64748b;
}

.profile-button {
  min-height: 48px;
  padding: 4px 8px;
  color: #172033;
  border-radius: 10px;
}

.profile-button:hover {
  background: #f5f7fa;
}

.profile-info {
  margin-left: 10px;
  text-align: left;
}

.profile-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
}

.profile-role {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.3;
}

.menu-user-name {
  font-weight: 700;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
}

.app-drawer {
  background: #ffffff;
  color: #475569;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
}

.drawer-brand__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--q-primary);
  color: white;
}

.drawer-brand__name {
  color: #172033;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.drawer-brand__subtitle {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 10px;
  letter-spacing: 0.04em;
}

.drawer-navigation {
  flex: 1;
  height: calc(100% - 150px);
}

.navigation-title {
  padding: 12px 16px 7px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.navigation-item {
  min-height: 44px;
  margin: 3px 10px;
  padding: 0 12px;
  border-radius: 9px;
  color: #64748b;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navigation-item :deep(.q-item__section--avatar) {
  min-width: 38px;
  color: #94a3b8;
}

.navigation-item:hover {
  background: #f5f7fa;
  color: #172033;
}

.navigation-item--active {
  background: #eef2ff;
  color: var(--q-primary);
  font-weight: 600;
}

.navigation-item--active :deep(.q-item__section--avatar) {
  color: var(--q-primary);
}

.drawer-footer {
  padding: 8px 0 12px;
  border-top: 1px solid #e8ebf0;
}

.drawer-version {
  padding: 8px 20px 0;
  color: #c0c7d1;
  font-size: 10px;
}

.app-page-container {
  background: #f8fafc;
}

@media (max-width: 700px) {
  .app-toolbar {
    padding: 0 12px;
  }

  .app-brand__name {
    font-size: 16px;
  }

  .profile-info {
    display: none;
  }

  .profile-button {
    padding: 4px;
  }
}
</style>
