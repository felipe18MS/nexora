<template>
  <Transition name="platform-legal">
    <div
      v-if="modelValue"
      class="platform-legal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @click.self="cerrar"
    >
      <article class="platform-legal-card">
        <header class="platform-legal-card__header">
          <div class="platform-legal-card__title">
            <div class="platform-legal-card__icon">
              <q-icon name="description" size="20px" />
            </div>

            <div>
              <span class="platform-legal-card__eyebrow">
                {{ nombrePlataforma || 'NEXORA' }}
              </span>

              <h2 :id="titleId">
                {{ documento?.titulo || tituloPredeterminado }}
              </h2>
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            :aria-label="`Cerrar ${tituloPredeterminado}`"
            class="platform-legal-card__close"
            @click="cerrar"
          />
        </header>

        <div v-if="documento" class="platform-legal-card__meta">
          <div class="platform-legal-card__date">
            <q-icon name="update" size="16px" />

            <span>
              Última actualización:
              {{ formatearFecha(documento.actualizadoEn) }}
            </span>
          </div>

          <span class="platform-legal-card__version"> v{{ documento.version }} </span>
        </div>

        <div class="platform-legal-card__content">
          <div
            v-if="documento?.contenido"
            class="platform-legal-card__document"
            v-html="documento.contenido"
          />

          <div v-else class="platform-legal-card__empty">
            <q-icon name="description" size="42px" />

            <strong> Documento no disponible </strong>

            <span>
              {{ mensajeDocumentoNoDisponible }}
            </span>
          </div>

          <div v-if="documento" class="platform-legal-card__notice">
            <q-icon name="info_outline" size="18px" />

            <span>
              {{ mensajeConfirmacion }}
            </span>
          </div>
        </div>

        <footer class="platform-legal-card__footer">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Entendido"
            icon-right="check"
            class="platform-legal-card__button"
            @click="cerrar"
          />
        </footer>
      </article>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePlatform } from '../composables/use-platform';

import type { TipoDocumentoLegal } from '../types/platform.types';

interface Props {
  modelValue: boolean;
  tipo: TipoDocumentoLegal;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { nombrePlataforma, obtenerDocumentoLegal } = usePlatform();

const documento = computed(() => {
  return obtenerDocumentoLegal(props.tipo);
});

const titleId = computed(() => {
  return `platform-legal-title-${props.tipo}`;
});

const tituloPredeterminado = computed(() => {
  switch (props.tipo) {
    case 'terminos':
      return 'Términos y condiciones';

    case 'privacidad':
      return 'Política de privacidad';

    case 'cookies':
      return 'Política de cookies';

    default:
      return 'Documento legal';
  }
});

const mensajeDocumentoNoDisponible = computed(() => {
  switch (props.tipo) {
    case 'terminos':
      return 'Los términos y condiciones todavía no han sido configurados.';

    case 'privacidad':
      return 'La política de privacidad todavía no ha sido configurada.';

    case 'cookies':
      return 'La política de cookies todavía no ha sido configurada.';

    default:
      return 'Este documento legal todavía no ha sido configurado.';
  }
});

const mensajeConfirmacion = computed(() => {
  switch (props.tipo) {
    case 'terminos':
      return 'Al continuar con el registro confirmas que has leído y aceptas estos términos.';

    case 'privacidad':
      return 'Este documento describe cómo se recopila, utiliza y protege la información del usuario.';

    case 'cookies':
      return 'Este documento describe el uso de cookies y tecnologías similares en la plataforma.';

    default:
      return 'Has consultado el documento legal de la plataforma.';
  }
});

const formatearFecha = (fecha: string): string => {
  if (!fecha) {
    return 'Fecha no disponible';
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
  }).format(fechaConvertida);
};

const cerrar = (): void => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
/* =========================================================
   OVERLAY
   ========================================================= */

.platform-legal-overlay {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 40px;

  background: rgb(15 23 42 / 38%);

  backdrop-filter: blur(3px);
}

/* =========================================================
   CARD
   ========================================================= */

.platform-legal-card {
  display: flex;
  flex-direction: column;

  width: min(540px, calc(55vw - 80px));
  max-height: calc(100vh - 80px);

  overflow: hidden;

  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 22px;

  background: rgb(255 255 255 / 98%);

  box-shadow:
    0 30px 80px rgb(15 23 42 / 30%),
    0 10px 30px rgb(15 23 42 / 15%);
}

/* =========================================================
   HEADER
   ========================================================= */

.platform-legal-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  padding: 22px 24px 18px;

  border-bottom: 1px solid #eef1f5;
}

.platform-legal-card__title {
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 0;
}

.platform-legal-card__icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border-radius: 12px;

  background: #eaf3ff;
  color: #1976d2;
}

.platform-legal-card__eyebrow {
  display: block;

  margin-bottom: 3px;

  overflow: hidden;

  color: #1976d2;

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;

  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.platform-legal-card h2 {
  margin: 0;

  color: #172033;

  font-size: 20px;
  font-weight: 750;
  line-height: 1.2;
}

.platform-legal-card__close {
  flex: 0 0 auto;

  color: #64748b;
}

/* =========================================================
   META
   ========================================================= */

.platform-legal-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 11px 24px;

  background: #f8fafc;

  color: #64748b;

  font-size: 12px;
}

.platform-legal-card__date {
  display: flex;
  align-items: center;
  gap: 7px;
}

.platform-legal-card__version {
  margin-left: auto;

  padding: 3px 8px;

  border-radius: 999px;

  background: #eaf3ff;

  color: #1976d2;

  font-size: 10px;
  font-weight: 700;
}

/* =========================================================
   CONTENT
   ========================================================= */

.platform-legal-card__content {
  overflow-y: auto;

  padding: 22px 24px;
}

.platform-legal-card__document {
  color: #64748b;

  font-size: 13px;
  line-height: 1.65;
}

.platform-legal-card__document :deep(section + section) {
  margin-top: 20px;
}

.platform-legal-card__document :deep(h2) {
  margin: 0 0 12px;

  color: #172033;

  font-size: 18px;
  font-weight: 750;
}

.platform-legal-card__document :deep(h3) {
  margin: 0 0 6px;

  color: #172033;

  font-size: 14px;
  font-weight: 750;
}

.platform-legal-card__document :deep(p) {
  margin: 0 0 12px;
}

.platform-legal-card__document :deep(ul),
.platform-legal-card__document :deep(ol) {
  margin: 0 0 14px;

  padding-left: 22px;
}

.platform-legal-card__document :deep(li) {
  margin-bottom: 6px;
}

.platform-legal-card__document :deep(strong) {
  color: #334155;

  font-weight: 700;
}

.platform-legal-card__document :deep(a) {
  color: #1976d2;

  text-decoration: none;
}

.platform-legal-card__document :deep(a:hover) {
  text-decoration: underline;
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

.platform-legal-card__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 220px;

  color: #94a3b8;

  text-align: center;
}

.platform-legal-card__empty .q-icon {
  margin-bottom: 8px;

  color: #cbd5e1;
}

.platform-legal-card__empty strong {
  color: #475569;

  font-size: 14px;
}

.platform-legal-card__empty span {
  max-width: 300px;

  font-size: 12px;
  line-height: 1.5;
}

/* =========================================================
   NOTICE
   ========================================================= */

.platform-legal-card__notice {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  margin-top: 24px;
  padding: 13px 14px;

  border: 1px solid #dbeafe;
  border-radius: 12px;

  background: #f8fbff;

  color: #475569;

  font-size: 12px;
  line-height: 1.5;
}

.platform-legal-card__notice .q-icon {
  flex: 0 0 auto;

  color: #1976d2;
}

/* =========================================================
   FOOTER
   ========================================================= */

.platform-legal-card__footer {
  display: flex;
  justify-content: flex-end;

  padding: 14px 24px;

  border-top: 1px solid #eef1f5;

  background: #ffffff;
}

.platform-legal-card__button {
  min-width: 120px;
  min-height: 42px;

  border-radius: 10px;

  font-weight: 700;
}

/* =========================================================
   ANIMACIÓN
   ========================================================= */

.platform-legal-enter-active,
.platform-legal-leave-active {
  transition: opacity 0.22s ease;
}

.platform-legal-enter-active .platform-legal-card,
.platform-legal-leave-active .platform-legal-card {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.platform-legal-enter-from,
.platform-legal-leave-to {
  opacity: 0;
}

.platform-legal-enter-from .platform-legal-card,
.platform-legal-leave-to .platform-legal-card {
  opacity: 0;

  transform: translateX(-25px) scale(0.97);
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 900px) {
  .platform-legal-overlay {
    align-items: flex-end;
    justify-content: center;

    padding: 12px;

    background: rgb(15 23 42 / 48%);
  }

  .platform-legal-card {
    width: 100%;
    max-width: 620px;

    max-height: calc(100vh - 24px);

    border-radius: 20px;
  }

  .platform-legal-enter-from .platform-legal-card,
  .platform-legal-leave-to .platform-legal-card {
    transform: translateY(30px) scale(0.98);
  }
}

@media (max-width: 600px) {
  .platform-legal-card__header {
    padding: 20px 20px 16px;
  }

  .platform-legal-card__meta {
    flex-wrap: wrap;

    padding: 11px 20px;
  }

  .platform-legal-card__date {
    max-width: 100%;
  }

  .platform-legal-card__version {
    margin-left: 0;
  }

  .platform-legal-card__content {
    padding: 20px;
  }

  .platform-legal-card__footer {
    padding: 14px 20px;
  }

  .platform-legal-card__button {
    width: 100%;
  }

  .platform-legal-card h2 {
    font-size: 19px;
  }
}
</style>
