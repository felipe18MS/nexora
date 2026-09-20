<template>
  <section class="integration-header">
    <div class="integration-header__content">
      <div class="integration-header__heading">
        <div class="integration-header__icon">
          <q-icon name="extension" size="24px" />
        </div>

        <div>
          <h1 class="integration-header__title">Integraciones</h1>

          <p class="integration-header__subtitle">
            Conecta NEXORA con servicios externos para ampliar sus capacidades.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.integration-header {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.integration-header__content {
  display: flex;
  align-items: center;
}

.integration-header__heading {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.integration-header__icon {
  display: flex;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.integration-header__title {
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
}

.integration-header__subtitle {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .integration-header {
    padding: 16px;
  }

  .integration-header__icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }

  .integration-header__title {
    font-size: 17px;
  }

  .integration-header__subtitle {
    font-size: 12px;
  }
}
</style>
