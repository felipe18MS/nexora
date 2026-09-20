<template>
  <div class="login-form">
    <div class="login-form__heading">
      <div class="login-form__eyebrow">ACCESO A {{ nombrePlataforma || 'NEXORA' }}</div>

      <h1>Bienvenido de nuevo</h1>

      <p>Ingresa a tu cuenta para continuar gestionando tu negocio.</p>
    </div>

    <q-form class="login-form__form" @submit.prevent="autenticarUsuario">
      <q-input
        v-model="email"
        outlined
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        :rules="[reglaEmail]"
      >
        <template #prepend>
          <q-icon name="mail_outline" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        outlined
        label="Contraseña"
        :type="mostrarPassword ? 'text' : 'password'"
        autocomplete="current-password"
        :rules="[reglaPassword]"
      >
        <template #prepend>
          <q-icon name="lock_outline" />
        </template>

        <template #append>
          <q-btn
            flat
            round
            dense
            tabindex="-1"
            :icon="mostrarPassword ? 'visibility_off' : 'visibility'"
            :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="mostrarPassword = !mostrarPassword"
          />
        </template>
      </q-input>

      <div v-if="error" class="login-form__error">
        <q-icon name="error_outline" size="19px" />

        <span>{{ error }}</span>
      </div>

      <q-btn
        unelevated
        no-caps
        color="primary"
        size="lg"
        class="login-form__submit"
        label="Iniciar sesión"
        icon-right="arrow_forward"
        :loading="cargando"
        type="submit"
      />

      <div class="login-form__divider">
        <span></span>

        <small>o</small>

        <span></span>
      </div>

      <q-btn
        outline
        no-caps
        class="login-form__google"
        :loading="cargando"
        @click="iniciarConGoogle"
      >
        <span class="google-logo">G</span>

        <span>Continuar con Google</span>
      </q-btn>
    </q-form>

    <div class="login-form__footer">
      <q-icon name="shield" size="16px" />

      <span>Acceso seguro a tu espacio de trabajo</span>
    </div>

    <div class="login-form__register">
      <span>¿Aún no tienes una cuenta?</span>

      <q-btn flat no-caps color="dark" label="Crear cuenta" @click="irAlRegistro" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../composables/use-auth';
import { usePlatform } from '../../platform';

const router = useRouter();

const { iniciarSesion, iniciarSesionConGoogle, cargando, error } = useAuth();

const { nombrePlataforma } = usePlatform();

const email = ref('');
const password = ref('');
const mostrarPassword = ref(false);

const reglaEmail = (valor: string): true | string => {
  if (!valor) {
    return 'Ingresa tu correo electrónico.';
  }

  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return patron.test(valor) ? true : 'Ingresa un correo electrónico válido.';
};

const reglaPassword = (valor: string): true | string => {
  if (!valor) {
    return 'Ingresa tu contraseña.';
  }

  return true;
};

const autenticarUsuario = (): void => {
  const exitoso = iniciarSesion({
    email: email.value,
    password: password.value,
  });

  if (!exitoso) {
    return;
  }

  void router.replace('/app/dashboard');
};

const iniciarConGoogle = (): void => {
  const iniciado = iniciarSesionConGoogle();

  if (!iniciado) {
    return;
  }

  void router.replace('/app/dashboard');
};

const irAlRegistro = (): void => {
  void router.push('/auth/register');
};
</script>

<style scoped>
.login-form {
  width: min(430px, 100%);
}

.login-form__heading {
  margin-bottom: 30px;
}

.login-form__eyebrow {
  margin-bottom: 10px;
  color: #1976d2;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.login-form__heading h1 {
  margin: 0;
  color: #172033;
  font-size: 32px;
  font-weight: 750;
  line-height: 1.15;
}

.login-form__heading p {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.login-form__form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-form__form :deep(.q-field__control) {
  border-radius: 12px;
}

.login-form__form :deep(.q-field) {
  margin-bottom: 8px;
}

.login-form__error {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 4px 0 12px;
  padding: 11px 13px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  line-height: 1.4;
}

.login-form__submit {
  width: 100%;
  min-height: 52px;
  margin-top: 6px;
  border-radius: 12px;
  font-weight: 700;
}

.login-form__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

.login-form__divider span {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.login-form__divider small {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.login-form__google {
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  border-color: #d1d5db;
  color: #374151;
  font-weight: 600;
}

.google-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: 800;
}

.login-form__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 24px;
  color: #9ca3af;
  font-size: 12px;
}

.login-form__register {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 18px;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 600px) {
  .login-form__heading h1 {
    font-size: 28px;
  }
}
</style>
