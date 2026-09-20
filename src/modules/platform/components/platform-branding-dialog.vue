<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="branding-dialog">
      <!-- HEADER -->
      <header class="branding-dialog__header">
        <div class="branding-dialog__heading">
          <div class="branding-dialog__icon">
            <q-icon name="palette" size="22px" />
          </div>

          <div class="branding-dialog__title">
            <span class="branding-dialog__eyebrow"> IDENTIDAD DE PLATAFORMA </span>

            <h2>Editar identidad</h2>

            <p>Configura la identidad global de NEXORA.</p>
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Cerrar"
          class="branding-dialog__close"
          @click="cerrar"
        />
      </header>

      <!-- BODY -->
      <div class="branding-dialog__body">
        <!-- PREVIEW -->
        <section class="branding-preview">
          <div class="branding-preview__label">VISTA PREVIA</div>

          <div class="branding-preview__card">
            <div class="branding-preview__logo">
              <img
                v-if="formulario.logo"
                :src="formulario.logo"
                :alt="`Logo de ${formulario.nombre}`"
              />

              <q-icon v-else name="auto_awesome" size="28px" />
            </div>

            <div class="branding-preview__content">
              <strong>
                {{ formulario.nombre || 'NEXORA' }}
              </strong>

              <span>
                {{ formulario.descripcion || 'Automatización inteligente para tu negocio.' }}
              </span>
            </div>
          </div>
        </section>

        <!-- INFORMACIÓN -->
        <section class="branding-form">
          <div class="branding-form__section-title">
            <q-icon name="business" size="18px" />

            <span>Información principal</span>
          </div>

          <div class="branding-form__grid">
            <q-input
              v-model="formulario.nombre"
              outlined
              label="Nombre de la plataforma"
              maxlength="80"
              counter
              :rules="[reglaRequerido]"
            />

            <q-input
              v-model="formulario.nombreCorto"
              outlined
              label="Nombre corto"
              maxlength="30"
              counter
              :rules="[reglaRequerido]"
            />
          </div>

          <q-input
            v-model="formulario.descripcion"
            outlined
            type="textarea"
            label="Descripción"
            maxlength="180"
            counter
            autogrow
            :rules="[reglaRequerido]"
          />
        </section>

        <!-- RECURSOS VISUALES -->
        <section class="branding-assets">
          <div class="branding-form__section-title">
            <q-icon name="image" size="18px" />

            <span>Recursos visuales</span>
          </div>

          <div class="branding-assets__grid">
            <!-- LOGO -->
            <div class="branding-asset">
              <div class="branding-asset__header">
                <div>
                  <strong>Logo</strong>

                  <span> Se mostrará en la plataforma. </span>
                </div>

                <q-icon name="photo" size="20px" />
              </div>

              <div class="branding-asset__preview">
                <img
                  v-if="formulario.logo"
                  :src="formulario.logo"
                  :alt="`Logo de ${formulario.nombre}`"
                />

                <div v-else class="branding-asset__empty">
                  <q-icon name="image" size="30px" />

                  <span>Sin logo</span>
                </div>
              </div>

              <q-file
                v-model="archivoLogo"
                outlined
                clearable
                accept="image/*"
                label="Seleccionar logo"
                prepend-icon="upload"
                @update:model-value="seleccionarLogo"
              />
            </div>

            <!-- FAVICON -->
            <div class="branding-asset">
              <div class="branding-asset__header">
                <div>
                  <strong>Favicon</strong>

                  <span> Icono de la pestaña del navegador. </span>
                </div>

                <q-icon name="web" size="20px" />
              </div>

              <div class="branding-asset__preview branding-asset__preview--favicon">
                <img
                  v-if="formulario.favicon"
                  :src="formulario.favicon"
                  :alt="`Favicon de ${formulario.nombre}`"
                />

                <div v-else class="branding-asset__empty">
                  <q-icon name="web" size="30px" />

                  <span>Sin favicon</span>
                </div>
              </div>

              <q-file
                v-model="archivoFavicon"
                outlined
                clearable
                accept="image/*"
                label="Seleccionar favicon"
                prepend-icon="upload"
                @update:model-value="seleccionarFavicon"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- FOOTER -->
      <footer class="branding-dialog__footer">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          class="branding-dialog__cancel"
          :disable="loading"
          @click="cerrar"
        />

        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Guardar cambios"
          icon="save"
          class="branding-dialog__save"
          :loading="loading"
          :disable="loading"
          @click="guardar"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

import type { PlataformaBranding } from '../types/platform.types';

interface Props {
  modelValue: boolean;
  branding: PlataformaBranding;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];

  guardar: [
    cambios: {
      nombre: string;
      nombreCorto: string;
      descripcion: string;
      logo: string | null;
      favicon: string | null;
    },
  ];
}>();

const formulario = reactive({
  nombre: '',
  nombreCorto: '',
  descripcion: '',
  logo: null as string | null,
  favicon: null as string | null,
});

const archivoLogo = ref<File | null>(null);

const archivoFavicon = ref<File | null>(null);

const cargarFormulario = (branding: PlataformaBranding): void => {
  formulario.nombre = branding.nombre;
  formulario.nombreCorto = branding.nombreCorto;
  formulario.descripcion = branding.descripcion;
  formulario.logo = branding.logo;
  formulario.favicon = branding.favicon;

  archivoLogo.value = null;
  archivoFavicon.value = null;
};

watch(
  () => props.modelValue,
  (abierto) => {
    if (!abierto) {
      return;
    }

    cargarFormulario(props.branding);
  },
  {
    immediate: true,
  },
);

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 ? true : 'Este campo es obligatorio.';
};

const convertirImagenABase64 = (archivo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = () => {
      if (typeof lector.result === 'string') {
        resolve(lector.result);
        return;
      }

      reject(new Error('No se pudo procesar la imagen.'));
    };

    lector.onerror = () => {
      reject(new Error('No se pudo leer el archivo.'));
    };

    lector.readAsDataURL(archivo);
  });
};

const seleccionarLogo = async (archivo: File | null): Promise<void> => {
  if (!archivo) {
    formulario.logo = null;
    return;
  }

  formulario.logo = await convertirImagenABase64(archivo);
};

const seleccionarFavicon = async (archivo: File | null): Promise<void> => {
  if (!archivo) {
    formulario.favicon = null;
    return;
  }

  formulario.favicon = await convertirImagenABase64(archivo);
};

const cerrar = (): void => {
  if (props.loading) {
    return;
  }

  emit('update:modelValue', false);
};

const guardar = (): void => {
  if (
    !formulario.nombre.trim() ||
    !formulario.nombreCorto.trim() ||
    !formulario.descripcion.trim()
  ) {
    return;
  }

  emit('guardar', {
    nombre: formulario.nombre.trim(),
    nombreCorto: formulario.nombreCorto.trim(),
    descripcion: formulario.descripcion.trim(),
    logo: formulario.logo,
    favicon: formulario.favicon,
  });
};
</script>

<style scoped>
.branding-dialog {
  display: flex;
  flex-direction: column;

  width: min(900px, 94vw);
  max-width: 900px;
  max-height: 90vh;

  overflow: hidden;

  border-radius: 22px;
  background: #ffffff;
}

/* HEADER */

.branding-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  flex: 0 0 auto;

  padding: 22px 24px;

  border-bottom: 1px solid #edf0f4;
}

.branding-dialog__heading {
  display: flex;
  align-items: center;

  gap: 13px;

  min-width: 0;
}

.branding-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  border-radius: 13px;

  background: #eaf3ff;
  color: #1976d2;
}

.branding-dialog__title {
  min-width: 0;
}

.branding-dialog__eyebrow {
  display: block;

  margin-bottom: 3px;

  color: #1976d2;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.branding-dialog h2 {
  margin: 0;

  color: #172033;

  font-size: 21px;
  font-weight: 750;

  line-height: 1.25;
}

.branding-dialog__heading p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 13px;

  line-height: 1.4;
}

.branding-dialog__close {
  flex: 0 0 auto;

  color: #64748b;
}

/* BODY */

.branding-dialog__body {
  flex: 1 1 auto;

  min-height: 0;

  overflow-y: auto;

  padding: 24px;

  scrollbar-width: thin;
}

/* PREVIEW */

.branding-preview {
  margin-bottom: 26px;
}

.branding-preview__label {
  margin-bottom: 9px;

  color: #94a3b8;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.1em;
}

.branding-preview__card {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 17px;

  border: 1px solid #e5eaf0;
  border-radius: 15px;

  background: #f8fafc;
}

.branding-preview__logo {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

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
  display: flex;
  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.branding-preview__content strong {
  overflow: hidden;

  color: #172033;

  font-size: 17px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.branding-preview__content span {
  display: -webkit-box;

  overflow: hidden;

  color: #64748b;

  font-size: 12px;

  line-height: 1.5;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* FORM */

.branding-form__section-title {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  color: #172033;

  font-size: 14px;
  font-weight: 750;
}

.branding-form__section-title .q-icon {
  color: #1976d2;
}

.branding-form__grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 14px;
}

/* ASSETS */

.branding-assets {
  margin-top: 8px;
}

.branding-assets__grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 16px;
}

.branding-asset {
  min-width: 0;

  padding: 16px;

  border: 1px solid #e5eaf0;
  border-radius: 15px;

  background: #ffffff;
}

.branding-asset__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 14px;
}

.branding-asset__header div {
  display: flex;
  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.branding-asset__header strong {
  color: #172033;

  font-size: 13px;
}

.branding-asset__header span {
  color: #94a3b8;

  font-size: 11px;

  line-height: 1.4;
}

.branding-asset__header > .q-icon {
  flex: 0 0 auto;

  color: #94a3b8;
}

.branding-asset__preview {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 105px;

  margin-bottom: 13px;

  overflow: hidden;

  border: 1px dashed #d7dee8;
  border-radius: 12px;

  background: #f8fafc;
}

.branding-asset__preview img {
  max-width: 85%;
  max-height: 85%;

  object-fit: contain;
}

.branding-asset__preview--favicon img {
  width: 58px;
  height: 58px;
}

.branding-asset__empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  color: #94a3b8;

  font-size: 11px;
}

/* FOOTER */

.branding-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;

  flex: 0 0 auto;

  padding: 14px 24px;

  border-top: 1px solid #edf0f4;

  background: #ffffff;
}

.branding-dialog__cancel {
  min-width: 100px;

  color: #64748b;
}

.branding-dialog__save {
  min-width: 155px;
  min-height: 42px;

  border-radius: 10px;

  font-weight: 700;
}

/* TABLET */

@media (max-width: 700px) {
  .branding-dialog {
    width: 96vw;
    max-width: 96vw;

    max-height: 94vh;

    border-radius: 18px;
  }

  .branding-dialog__header {
    padding: 18px;
  }

  .branding-dialog__body {
    padding: 18px;
  }

  .branding-form__grid,
  .branding-assets__grid {
    grid-template-columns: 1fr;
  }

  .branding-dialog__footer {
    padding: 13px 18px;
  }

  .branding-asset__preview {
    height: 120px;
  }
}

/* MOBILE */

@media (max-width: 480px) {
  .branding-dialog {
    width: 100vw;
    max-width: 100vw;

    max-height: 100dvh;

    border-radius: 18px 18px 0 0;
  }

  .branding-dialog__header {
    gap: 12px;

    padding: 16px;
  }

  .branding-dialog__heading {
    align-items: flex-start;

    gap: 10px;
  }

  .branding-dialog__icon {
    width: 38px;
    height: 38px;

    border-radius: 11px;
  }

  .branding-dialog__eyebrow {
    font-size: 9px;
  }

  .branding-dialog h2 {
    font-size: 18px;
  }

  .branding-dialog__heading p {
    max-width: 210px;

    font-size: 11px;
  }

  .branding-dialog__body {
    padding: 16px;
  }

  .branding-preview {
    margin-bottom: 22px;
  }

  .branding-preview__card {
    align-items: flex-start;

    padding: 14px;
  }

  .branding-preview__logo {
    width: 46px;
    height: 46px;

    border-radius: 12px;
  }

  .branding-preview__content strong {
    font-size: 15px;
  }

  .branding-preview__content span {
    font-size: 11px;
  }

  .branding-asset {
    padding: 14px;
  }

  .branding-asset__preview {
    height: 100px;
  }

  .branding-dialog__footer {
    flex-direction: column-reverse;

    gap: 8px;

    padding: 12px 16px;

    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .branding-dialog__cancel,
  .branding-dialog__save {
    width: 100%;
  }
}
</style>
