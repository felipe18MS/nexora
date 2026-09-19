<template>
  <q-page class="q-pa-lg">
    <div class="construction-page">
      <div class="construction-icon">
        <q-icon name="manage_accounts" size="32px" />
      </div>

      <div class="text-h4 text-weight-bold q-mt-lg">Usuarios y permisos</div>

      <div class="text-body1 text-grey-6 q-mt-sm">
        Administra los usuarios de tu negocio y define los permisos y niveles de acceso de cada
        miembro del equipo.
      </div>

      <q-badge color="primary" label="Próximamente" rounded class="q-mt-lg" />
    </div>
  </q-page>
</template>

<style scoped>
.construction-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.construction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}
</style>
