<template>
  <q-page class="q-pa-lg">
    <div class="construction-page">
      <div class="construction-icon">
        <q-icon name="chat" size="32px" />
      </div>

      <div class="text-h4 text-weight-bold q-mt-lg">WhatsApp</div>

      <div class="text-body1 text-grey-6 q-mt-sm">
        Conecta WhatsApp con NEXORA para automatizar conversaciones, reservas, confirmaciones y
        atención al cliente.
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
