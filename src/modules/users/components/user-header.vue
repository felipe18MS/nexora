<template>
  <q-card flat bordered class="user-header">
    <q-card-section class="user-header__content">
      <div class="user-header__identity">
        <div class="user-header__icon">
          <q-icon name="group" size="24px" />
        </div>

        <div>
          <div class="user-header__title">Usuarios y permisos</div>

          <div class="user-header__subtitle">
            Administra los usuarios y controla sus permisos dentro de NEXORA.
          </div>
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="person_add"
        label="Nuevo usuario"
        no-caps
        @click="$emit('crear')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineEmits<{
  crear: [];
}>();
</script>

<style scoped>
.user-header {
  border-radius: 16px;
  background: #ffffff;
}

.user-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
}

.user-header__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.user-header__icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.user-header__title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
}

.user-header__subtitle {
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
}

@media (max-width: 600px) {
  .user-header__content {
    align-items: stretch;
    flex-direction: column;
    padding: 20px;
  }

  .user-header__identity {
    align-items: flex-start;
  }

  .user-header__subtitle {
    font-size: 13px;
  }

  .user-header__content .q-btn {
    width: 100%;
  }
}
</style>
