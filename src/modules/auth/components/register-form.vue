<template>
  <div class="register-form">
    <div class="register-form__heading">
      <span class="register-form__eyebrow">CREA TU CUENTA</span>

      <h1>Comienza con {{ nombrePlataforma || 'NEXORA' }}</h1>

      <p>Crea tu negocio y disfruta de 7 días de prueba gratuita.</p>
    </div>

    <q-form class="register-form__form" @submit.prevent="registrar">
      <div class="form-grid">
        <q-input
          v-model="formulario.nombre"
          outlined
          label="Nombre"
          autocomplete="given-name"
          :rules="[reglaRequerido]"
        />

        <q-input
          v-model="formulario.apellido"
          outlined
          label="Apellido"
          autocomplete="family-name"
          :rules="[reglaRequerido]"
        />
      </div>

      <q-input
        v-model="formulario.negocioNombre"
        outlined
        label="Nombre del negocio"
        autocomplete="organization"
        :rules="[reglaRequerido]"
      >
        <template #prepend>
          <q-icon name="business" />
        </template>
      </q-input>

      <q-input
        v-model="formulario.telefono"
        outlined
        label="Teléfono"
        autocomplete="tel"
        :rules="[reglaRequerido]"
      >
        <template #prepend>
          <q-icon name="phone" />
        </template>
      </q-input>

      <q-input
        v-model="formulario.email"
        outlined
        type="email"
        label="Correo electrónico"
        autocomplete="email"
        :rules="[reglaRequerido, reglaEmail]"
      >
        <template #prepend>
          <q-icon name="mail_outline" />
        </template>
      </q-input>

      <q-input
        v-model="formulario.password"
        outlined
        :type="mostrarPassword ? 'text' : 'password'"
        label="Contraseña"
        autocomplete="new-password"
        :rules="[reglaRequerido, reglaPassword]"
      >
        <template #prepend>
          <q-icon name="lock_outline" />
        </template>

        <template #append>
          <q-btn
            flat
            round
            dense
            type="button"
            :icon="mostrarPassword ? 'visibility_off' : 'visibility'"
            :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="mostrarPassword = !mostrarPassword"
          />
        </template>
      </q-input>

      <div class="register-form__terms">
        <q-checkbox v-model="aceptaTerminos" color="primary" />

        <span>
          Acepto los

          <button type="button" class="register-form__legal-link" @click="mostrarTerminos = true">
            Términos y condiciones
          </button>

          de {{ nombrePlataforma || 'NEXORA' }}. También acepto la

          <button type="button" class="register-form__legal-link" @click="mostrarPrivacidad = true">
            Política de privacidad
          </button>

          y la

          <button type="button" class="register-form__legal-link" @click="mostrarCookies = true">
            Política de cookies
          </button>
          .
        </span>
      </div>

      <div v-if="error" class="register-form__error">
        <q-icon name="error_outline" size="20px" />

        <span>{{ error }}</span>
      </div>

      <q-btn
        type="submit"
        unelevated
        no-caps
        color="dark"
        class="register-form__submit"
        label="Crear cuenta"
        :loading="cargando"
      />

      <div class="register-form__divider">
        <span></span>
        <small>o</small>
        <span></span>
      </div>

      <q-btn
        outline
        no-caps
        class="register-form__google"
        :loading="cargando"
        @click="registrarConGoogle"
      >
        <span class="google-logo">G</span>
        <span>Continuar con Google</span>
      </q-btn>
    </q-form>

    <div class="register-form__footer">
      <span>¿Ya tienes una cuenta?</span>

      <q-btn flat no-caps color="dark" label="Iniciar sesión" @click="irAlLogin" />
    </div>

    <!-- Documentos legales -->
    <LegalTermsDialog v-model="mostrarTerminos" />

    <PrivacyPolicyDialog v-model="mostrarPrivacidad" />

    <CookiePolicyDialog v-model="mostrarCookies" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../composables/use-auth';

import LegalTermsDialog from './legal-terms-dialog.vue';

import PrivacyPolicyDialog from '../../platform/components/privacy-policy-dialog.vue';
import CookiePolicyDialog from '../../platform/components/cookie-policy-dialog.vue';

import { usePlatform } from '../../platform';

const router = useRouter();

const { registrar: registrarUsuario, iniciarSesionConGoogle, cargando, error } = useAuth();

const { nombrePlataforma } = usePlatform();

const formulario = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  negocioNombre: '',
  telefono: '',
});

const mostrarPassword = ref(false);

const aceptaTerminos = ref(false);

const mostrarTerminos = ref(false);
const mostrarPrivacidad = ref(false);
const mostrarCookies = ref(false);

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 ? true : 'Este campo es obligatorio.';
};

const reglaEmail = (valor: string): true | string => {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return patron.test(valor) ? true : 'Ingresa un correo válido.';
};

const reglaPassword = (valor: string): true | string => {
  return valor.length >= 8 ? true : 'La contraseña debe tener mínimo 8 caracteres.';
};

const registrar = (): void => {
  if (!aceptaTerminos.value) {
    return;
  }

  const creado = registrarUsuario({
    nombre: formulario.nombre,
    apellido: formulario.apellido,
    email: formulario.email,
    password: formulario.password,
    negocioNombre: formulario.negocioNombre,
    telefono: formulario.telefono,
  });

  if (!creado) {
    return;
  }

  void router.replace('/app/dashboard');
};

const registrarConGoogle = (): void => {
  const iniciado = iniciarSesionConGoogle();

  if (!iniciado) {
    return;
  }

  void router.replace('/app/dashboard');
};

const irAlLogin = (): void => {
  void router.push('/auth/login');
};
</script>

<style scoped>
.register-form {
  width: min(100%, 480px);
}

.register-form__heading {
  margin-bottom: 28px;
}

.register-form__eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: #1976d2;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.register-form__heading h1 {
  margin: 0;
  color: #111827;
  font-size: 34px;
  line-height: 1.15;
  font-weight: 800;
}

.register-form__heading p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.register-form__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.register-form__terms {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 4px 0 16px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.register-form__terms :deep(.q-checkbox) {
  flex-shrink: 0;
  margin-top: -4px;
}

.register-form__legal-link {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #1976d2;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.register-form__legal-link:hover {
  text-decoration: underline;
}

.register-form__error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

.register-form__submit {
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  font-weight: 700;
}

.register-form__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
}

.register-form__divider span {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.register-form__divider small {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.register-form__google {
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

.register-form__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 22px;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 520px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .register-form__heading h1 {
    font-size: 30px;
  }

  .register-form__terms {
    font-size: 11.5px;
  }
}
</style>
