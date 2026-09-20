<template>
  <div class="register-page">
    <aside class="register-page__visual">
      <LoginVisual />
    </aside>

    <main class="register-page__content">
      <div class="register-page__mobile-brand">
        <div class="register-page__mobile-icon">
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

        <span>
          {{ nombreCortoPlataforma || nombrePlataforma || 'NEXORA' }}
        </span>
      </div>

      <RegisterForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import LoginVisual from '../../modules/auth/components/login-visual.vue';
import RegisterForm from '../../modules/auth/components/register-form.vue';
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
.register-page {
  display: grid;
  grid-template-columns: minmax(420px, 1.05fr) minmax(480px, 0.95fr);
  min-height: 100vh;
  background: #ffffff;
}

/* =========================================================
   VISUAL
   ========================================================= */

.register-page__visual {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

/* =========================================================
   FORMULARIO
   ========================================================= */

.register-page__content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 70px;
  background: #ffffff;
}

.register-page__mobile-brand {
  display: none;
}

/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 1100px) {
  .register-page {
    grid-template-columns: minmax(360px, 0.9fr) minmax(420px, 1.1fr);
  }

  .register-page__content {
    padding: 50px 40px;
  }
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 900px) {
  .register-page {
    display: block;
    min-height: 100vh;
  }

  .register-page__visual {
    display: none;
  }

  .register-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 32px 22px 40px;
  }

  .register-page__mobile-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: min(480px, 100%);
    margin-bottom: 34px;
    color: #172033;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .register-page__mobile-icon {
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

  :deep(.register-form) {
    width: min(480px, 100%);
  }
}

/* =========================================================
   MOBILE PEQUEÑO
   ========================================================= */

@media (max-width: 480px) {
  .register-page__content {
    padding: 24px 18px 32px;
  }

  .register-page__mobile-brand {
    margin-bottom: 28px;
  }
}
</style>
