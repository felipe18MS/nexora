<template>
  <header class="report-header">
    <div class="report-header__content">
      <div class="report-header__identity">
        <div class="report-header__icon">
          <q-icon name="analytics" size="24px" />
        </div>

        <div class="report-header__text">
          <h1 class="report-header__title">Reportes</h1>

          <p class="report-header__subtitle">
            Analiza el rendimiento y la información de tu negocio.
          </p>
        </div>
      </div>

      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Nuevo reporte"
        class="report-header__button"
        @click="emit('nuevo')"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  nuevo: [];
}>();
</script>

<style scoped>
.report-header {
  width: 100%;
  margin-bottom: 20px;
}

.report-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 72px;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.report-header__content:hover {
  border-color: #dbe1e8;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
}

.report-header__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.report-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.report-header__text {
  min-width: 0;
}

.report-header__title {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.25;
}

.report-header__subtitle {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.45;
}

.report-header__button {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  flex-shrink: 0;
  font-weight: 600;
}

@media (max-width: 700px) {
  .report-header__content {
    align-items: flex-start;
    padding: 16px;
    gap: 14px;
  }

  .report-header__identity {
    gap: 11px;
  }

  .report-header__icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }

  .report-header__title {
    font-size: 18px;
  }

  .report-header__subtitle {
    font-size: 12px;
  }

  .report-header__button {
    min-width: 40px;
    width: 40px;
    min-height: 40px;
    padding: 0;
  }

  .report-header__button :deep(.q-btn__content) {
    gap: 0;
  }

  .report-header__button :deep(.q-btn__content > span:not(.q-icon)) {
    display: none;
  }
}

@media (max-width: 420px) {
  .report-header__content {
    padding: 14px;
  }

  .report-header__identity {
    gap: 9px;
  }

  .report-header__icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .report-header__title {
    font-size: 17px;
  }

  .report-header__subtitle {
    max-width: 190px;
    font-size: 11px;
  }
}
</style>
