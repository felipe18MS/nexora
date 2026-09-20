<template>
  <q-page class="platform-page">
    <div class="platform-page__container">
      <header class="platform-page__header">
        <div>
          <span class="platform-page__eyebrow"> ADMINISTRACIÓN DE PLATAFORMA </span>

          <h1>Configuración de NEXORA</h1>

          <p>Administra la identidad y los documentos legales de la plataforma.</p>
        </div>

        <q-icon name="admin_panel_settings" size="42px" class="platform-page__header-icon" />
      </header>

      <!-- IDENTIDAD -->
      <section class="platform-card">
        <div class="platform-card__header">
          <div class="platform-card__icon">
            <q-icon name="branding_watermark" />
          </div>

          <div>
            <h2>Identidad de plataforma</h2>

            <p>Información que representa a NEXORA dentro de la aplicación.</p>
          </div>
        </div>

        <div class="platform-card__body">
          <div class="branding-preview">
            <div class="branding-preview__logo">
              <img v-if="branding.logo" :src="branding.logo" :alt="branding.nombre" />

              <q-icon v-else name="auto_awesome" size="28px" />
            </div>

            <div class="branding-preview__content">
              <strong>
                {{ branding.nombre || 'NEXORA' }}
              </strong>

              <span>
                {{ branding.descripcion }}
              </span>
            </div>
          </div>

          <div class="branding-data">
            <div class="branding-data__item">
              <span>Nombre</span>

              <strong>
                {{ branding.nombre }}
              </strong>
            </div>

            <div class="branding-data__item">
              <span>Nombre corto</span>

              <strong>
                {{ branding.nombreCorto }}
              </strong>
            </div>

            <div class="branding-data__item">
              <span>Logo</span>

              <strong>
                {{ branding.logo ? 'Configurado' : 'Predeterminado' }}
              </strong>
            </div>

            <div class="branding-data__item">
              <span>Favicon</span>

              <strong>
                {{ branding.favicon ? 'Configurado' : 'Predeterminado' }}
              </strong>
            </div>
          </div>

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Editar identidad"
            class="platform-card__action"
            @click="abrirEdicionBranding"
          />
        </div>
      </section>

      <!-- DOCUMENTOS LEGALES -->
      <section class="platform-card">
        <div class="platform-card__header">
          <div class="platform-card__icon">
            <q-icon name="gavel" />
          </div>

          <div>
            <h2>Documentos legales</h2>

            <p>Administra las versiones publicadas de los documentos legales de NEXORA.</p>
          </div>
        </div>

        <div class="legal-list">
          <div v-for="documento in documentosLegales" :key="documento.id" class="legal-item">
            <div class="legal-item__main">
              <div class="legal-item__icon">
                <q-icon :name="iconoDocumento(documento.tipo)" />
              </div>

              <div>
                <strong>
                  {{ documento.titulo }}
                </strong>

                <span>
                  Versión {{ documento.version }}
                  ·
                  {{ formatearFecha(documento.actualizadoEn) }}
                </span>
              </div>
            </div>

            <q-badge
              :color="documento.publicado ? 'positive' : 'grey-6'"
              :label="documento.publicado ? 'Publicado' : 'Borrador'"
              rounded
            />

            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              :aria-label="`Editar ${documento.titulo}`"
              @click="abrirEdicionLegal(documento)"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- EDITAR IDENTIDAD -->
    <PlatformBrandingDialog
      v-model="mostrarBrandingDialog"
      :branding="branding"
      :loading="guardandoBranding"
      @guardar="solicitarGuardarBranding"
    />

    <PlatformLegalDialog
      v-model="mostrarLegalDialog"
      :documento="documentoLegalSeleccionado"
      :loading="guardandoLegal"
      @guardar="solicitarGuardarLegal"
    />

    <AppConfirmDialog
      v-model="mostrarConfirmacionLegal"
      titulo="Guardar documento legal"
      mensaje="Se actualizará el contenido de este documento legal. Si está publicado, los cambios quedarán visibles para los usuarios."
      texto-confirmar="Guardar cambios"
      tipo="primary"
      :loading="guardandoLegal"
      @confirm="confirmarGuardarLegal"
    />
    <!-- CONFIRMACIÓN -->
    <AppConfirmDialog
      v-model="mostrarConfirmacionBranding"
      titulo="Guardar cambios de identidad"
      mensaje="Se actualizará la identidad global de NEXORA. Estos cambios se reflejarán en la plataforma."
      texto-confirmar="Guardar cambios"
      tipo="primary"
      :loading="guardandoBranding"
      @confirm="confirmarGuardarBranding"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

import AppConfirmDialog from '../../components/common/app-confirm-dialog.vue';
import PlatformBrandingDialog from '../../modules/platform/components/platform-branding-dialog.vue';
import { usePlatformStore } from '../../modules/platform';
import type {
  ActualizarBranding,
  ActualizarDocumentoLegal,
  DocumentoLegal,
  TipoDocumentoLegal,
} from '../../modules/platform';
import PlatformLegalDialog from '../../modules/platform/components/platform-legal-dialog.vue';
const $q = useQuasar();

const platformStore = usePlatformStore();

const branding = computed(() => platformStore.branding);

const documentosLegales = computed(() => platformStore.documentosLegales);

const mostrarBrandingDialog = ref(false);

const mostrarConfirmacionBranding = ref(false);

const guardandoBranding = ref(false);

const mostrarLegalDialog = ref(false);

const documentoLegalSeleccionado = ref<DocumentoLegal | null>(null);

const mostrarConfirmacionLegal = ref(false);

const guardandoLegal = ref(false);

const cambiosLegalPendientes = ref<ActualizarDocumentoLegal | null>(null);

const cambiosBrandingPendientes = ref<ActualizarBranding | null>(null);

const iconoDocumento = (tipo: TipoDocumentoLegal): string => {
  const iconos: Record<TipoDocumentoLegal, string> = {
    terminos: 'description',
    privacidad: 'privacy_tip',
    cookies: 'cookie',
  };

  return iconos[tipo];
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(fecha));
};

const abrirEdicionBranding = (): void => {
  mostrarBrandingDialog.value = true;
};

const solicitarGuardarBranding = (cambios: ActualizarBranding): void => {
  cambiosBrandingPendientes.value = {
    ...cambios,
  };

  mostrarBrandingDialog.value = false;
  mostrarConfirmacionBranding.value = true;
};

const confirmarGuardarBranding = (): void => {
  if (!cambiosBrandingPendientes.value) {
    return;
  }

  guardandoBranding.value = true;

  platformStore.actualizarBranding(cambiosBrandingPendientes.value);

  guardandoBranding.value = false;
  mostrarConfirmacionBranding.value = false;
  cambiosBrandingPendientes.value = null;

  $q.notify({
    type: 'positive',
    message: 'Identidad de plataforma actualizada.',
    caption: 'Los cambios se guardaron correctamente.',
    icon: 'check_circle',
    position: 'top-right',
  });
};

const abrirEdicionLegal = (documento: DocumentoLegal): void => {
  documentoLegalSeleccionado.value = {
    ...documento,
  };

  mostrarLegalDialog.value = true;
};

const solicitarGuardarLegal = (cambios: ActualizarDocumentoLegal): void => {
  cambiosLegalPendientes.value = {
    ...cambios,
  };

  mostrarLegalDialog.value = false;
  mostrarConfirmacionLegal.value = true;
};

const confirmarGuardarLegal = (): void => {
  if (!cambiosLegalPendientes.value) {
    return;
  }

  guardandoLegal.value = true;

  platformStore.actualizarDocumentoLegal(cambiosLegalPendientes.value);

  guardandoLegal.value = false;
  mostrarConfirmacionLegal.value = false;
  cambiosLegalPendientes.value = null;
  documentoLegalSeleccionado.value = null;

  $q.notify({
    type: 'positive',
    message: 'Documento legal actualizado.',
    caption: 'Los cambios se guardaron correctamente.',
    icon: 'check_circle',
    position: 'top-right',
  });
};

onMounted(() => {
  platformStore.cargarConfiguracion();
});
</script>

<style scoped>
.platform-page {
  background: #f8fafc;
}

.platform-page__container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 32px 0 48px;
}

.platform-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.platform-page__eyebrow {
  color: #1976d2;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.platform-page__header h1 {
  margin: 7px 0 8px;
  color: #172033;
  font-size: 30px;
  font-weight: 750;
}

.platform-page__header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.platform-page__header-icon {
  color: #1976d2;
}

.platform-card {
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgb(15 23 42 / 4%);
}

.platform-card__header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px;
  border-bottom: 1px solid #eef1f5;
}

.platform-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #eff6ff;
  color: #1976d2;
  font-size: 20px;
}

.platform-card__header h2 {
  margin: 0;
  color: #172033;
  font-size: 17px;
  font-weight: 750;
}

.platform-card__header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.platform-card__body {
  padding: 24px;
}

.branding-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f8fafc;
}

.branding-preview__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 14px;
  background: #1976d2;
  color: #ffffff;
}

.branding-preview__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #ffffff;
}

.branding-preview__content {
  min-width: 0;
}

.branding-preview strong,
.branding-preview span {
  display: block;
}

.branding-preview strong {
  color: #172033;
  font-size: 16px;
}

.branding-preview span {
  margin-top: 3px;
  color: #64748b;
  font-size: 13px;
}

.branding-data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.branding-data__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1px solid #eef1f5;
  border-radius: 12px;
}

.branding-data__item span {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 650;
}

.branding-data__item strong {
  color: #334155;
  font-size: 13px;
  word-break: break-word;
}

.platform-card__action {
  margin-top: 18px;
  min-height: 42px;
  border-radius: 10px;
  font-weight: 650;
}

.legal-list {
  padding: 8px 24px 16px;
}

.legal-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 76px;
  padding: 12px 0;
  border-bottom: 1px solid #eef1f5;
}

.legal-item:last-child {
  border-bottom: 0;
}

.legal-item__main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.legal-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: #f1f5f9;
  color: #64748b;
}

.legal-item__main strong,
.legal-item__main span {
  display: block;
}

.legal-item__main strong {
  color: #334155;
  font-size: 13px;
}

.legal-item__main span {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}

@media (max-width: 700px) {
  .platform-page__container {
    width: min(100% - 28px, 600px);
    padding-top: 22px;
  }

  .platform-page__header h1 {
    font-size: 25px;
  }

  .branding-data {
    grid-template-columns: 1fr;
  }

  .legal-item {
    flex-wrap: wrap;
  }
}
</style>
