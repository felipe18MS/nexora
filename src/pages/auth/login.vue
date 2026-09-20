<template>
  <div class="login-page">
    <aside class="login-page__visual">
      <LoginVisual />
    </aside>

    <main class="login-page__content">
      <div class="login-page__mobile-brand">
        <div class="login-page__mobile-icon">
          <q-img
            v-if="logoPlataforma"
            :src="logoPlataforma"
            :alt="nombrePlataforma"
            fit="contain"
            width="22px"
            height="22px"
          />

          <q-icon v-else name="auto_awesome" size="20px" />
        </div>

        <span>{{ nombreCortoPlataforma || nombrePlataforma || 'NEXORA' }}</span>
      </div>

      <LoginForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import LoginForm from '../../modules/auth/components/login-form.vue';
import LoginVisual from '../../modules/auth/components/login-visual.vue';
import { usePlatform } from '../../modules/platform';

const { nombrePlataforma, nombreCortoPlataforma, logoPlataforma, cargarConfiguracion } =
  usePlatform();

onMounted(() => {
  if (!nombrePlataforma.value) {
    cargarConfiguracion();
  }
});
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(420px, 1.05fr) minmax(480px, 0.95fr);
  min-height: 100vh;
  background: #ffffff;
}

/* =========================================================
   VISUAL
   ========================================================= */

.login-page__visual {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

/* =========================================================
   FORMULARIO
   ========================================================= */

.login-page__content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 70px;
  background: #ffffff;
}

.login-page__mobile-brand {
  display: none;
}

/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 1100px) {
  .login-page {
    grid-template-columns: minmax(360px, 0.9fr) minmax(420px, 1.1fr);
  }

  .login-page__content {
    padding: 50px 40px;
  }
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 900px) {
  .login-page {
    display: block;
    min-height: 100vh;
  }

  .login-page__visual {
    display: none;
  }

  .login-page__content {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: 100vh;
    padding: 32px 22px 40px;
  }

  .login-page__mobile-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-bottom: 34px;
    color: #172033;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .login-page__mobile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #1976d2;
    color: #ffffff;
    overflow: hidden;
  }

  .login-page__content {
    flex-direction: column;
  }

  .login-page__mobile-brand,
  :deep(.login-form) {
    width: min(430px, 100%);
  }
}

/* =========================================================
   MOBILE PEQUEÑO
   ========================================================= */

@media (max-width: 480px) {
  .login-page__content {
    padding: 24px 18px 32px;
  }

  .login-page__mobile-brand {
    margin-bottom: 28px;
  }
}
</style>
