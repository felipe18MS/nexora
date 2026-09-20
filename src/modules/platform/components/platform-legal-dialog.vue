<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="legal-dialog">
      <!-- HEADER -->
      <header class="legal-dialog__header">
        <div class="legal-dialog__heading">
          <div class="legal-dialog__icon">
            <q-icon :name="iconoDocumento(documento?.tipo)" size="22px" />
          </div>

          <div class="legal-dialog__title">
            <span class="legal-dialog__eyebrow"> DOCUMENTO LEGAL </span>

            <h2>
              {{ documento?.titulo || 'Editar documento' }}
            </h2>

            <p>Administra el contenido y publicación del documento.</p>
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Cerrar"
          class="legal-dialog__close"
          :disable="loading"
          @click="cerrar"
        />
      </header>

      <!-- BODY -->
      <div class="legal-dialog__body">
        <!-- ESTADO -->
        <section class="legal-status">
          <div class="legal-status__content">
            <div class="legal-status__icon">
              <q-icon :name="formulario.publicado ? 'public' : 'edit_note'" size="20px" />
            </div>

            <div>
              <strong>
                {{ formulario.publicado ? 'Documento publicado' : 'Documento en borrador' }}
              </strong>

              <span>
                {{
                  formulario.publicado
                    ? 'Los usuarios pueden consultar esta versión.'
                    : 'Los cambios todavía no son visibles para los usuarios.'
                }}
              </span>
            </div>
          </div>

          <q-toggle
            v-model="formulario.publicado"
            color="primary"
            label="Publicado"
            :disable="loading"
          />
        </section>

        <!-- INFORMACIÓN -->
        <section class="legal-form">
          <div class="legal-form__section-title">
            <q-icon name="description" size="18px" />

            <span>Información del documento</span>
          </div>

          <div class="legal-form__grid">
            <q-input
              v-model="formulario.titulo"
              outlined
              label="Título"
              maxlength="120"
              counter
              :rules="[reglaRequerido]"
              :disable="loading"
            />

            <q-input
              v-model="formulario.version"
              outlined
              label="Versión"
              maxlength="20"
              placeholder="Ej. 1.1"
              :rules="[reglaRequerido]"
              :disable="loading"
            />
          </div>
        </section>

        <!-- CONTENIDO -->
        <section class="legal-content">
          <div class="legal-form__section-title">
            <q-icon name="article" size="18px" />

            <span>Contenido</span>
          </div>

          <q-input
            v-model="formulario.contenido"
            outlined
            type="textarea"
            label="Contenido del documento"
            placeholder="Escribe aquí el contenido legal..."
            maxlength="30000"
            counter
            autogrow
            class="legal-content__input"
            :rules="[reglaContenido]"
            :disable="loading"
          />

          <div class="legal-content__hint">
            <q-icon name="info" size="15px" />

            <span>
              Puedes utilizar texto plano y separar las secciones mediante saltos de línea.
            </span>
          </div>
        </section>

        <!-- INFORMACIÓN DE PUBLICACIÓN -->
        <section v-if="documento" class="legal-meta">
          <div class="legal-meta__item">
            <span>Tipo</span>

            <strong>
              {{ nombreTipo(documento.tipo) }}
            </strong>
          </div>

          <div class="legal-meta__item">
            <span>Última actualización</span>

            <strong>
              {{ formatearFecha(documento.actualizadoEn) }}
            </strong>
          </div>
        </section>
      </div>

      <!-- FOOTER -->
      <footer class="legal-dialog__footer">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          class="legal-dialog__cancel"
          :disable="loading"
          @click="cerrar"
        />

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Guardar cambios"
          class="legal-dialog__save"
          :loading="loading"
          :disable="loading"
          @click="guardar"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type { DocumentoLegal, TipoDocumentoLegal } from '../types/platform.types';

interface Props {
  modelValue: boolean;
  documento: DocumentoLegal | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];

  guardar: [
    cambios: {
      id: string;
      titulo: string;
      version: string;
      contenido: string;
      publicado: boolean;
    },
  ];
}>();

const formulario = reactive({
  id: '',
  titulo: '',
  version: '',
  contenido: '',
  publicado: false,
});

const cargarFormulario = (documento: DocumentoLegal | null): void => {
  if (!documento) {
    formulario.id = '';
    formulario.titulo = '';
    formulario.version = '';
    formulario.contenido = '';
    formulario.publicado = false;

    return;
  }

  formulario.id = documento.id;
  formulario.titulo = documento.titulo;
  formulario.version = documento.version;
  formulario.contenido = documento.contenido;
  formulario.publicado = documento.publicado;
};

watch(
  () => props.modelValue,
  (abierto) => {
    if (!abierto) {
      return;
    }

    cargarFormulario(props.documento);
  },
  {
    immediate: true,
  },
);

watch(
  () => props.documento,
  (documento) => {
    if (!props.modelValue) {
      return;
    }

    cargarFormulario(documento);
  },
);

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 ? true : 'Este campo es obligatorio.';
};

const reglaContenido = (valor: string): true | string => {
  return valor.trim().length >= 20 ? true : 'El contenido debe tener al menos 20 caracteres.';
};

const iconoDocumento = (tipo?: TipoDocumentoLegal): string => {
  if (!tipo) {
    return 'description';
  }

  const iconos: Record<TipoDocumentoLegal, string> = {
    terminos: 'description',
    privacidad: 'privacy_tip',
    cookies: 'cookie',
  };

  return iconos[tipo];
};

const nombreTipo = (tipo: TipoDocumentoLegal): string => {
  const nombres: Record<TipoDocumentoLegal, string> = {
    terminos: 'Términos y condiciones',
    privacidad: 'Política de privacidad',
    cookies: 'Política de cookies',
  };

  return nombres[tipo];
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const cerrar = (): void => {
  if (props.loading) {
    return;
  }

  emit('update:modelValue', false);
};

const guardar = (): void => {
  if (
    !formulario.id ||
    !formulario.titulo.trim() ||
    !formulario.version.trim() ||
    formulario.contenido.trim().length < 20
  ) {
    return;
  }

  emit('guardar', {
    id: formulario.id,
    titulo: formulario.titulo.trim(),
    version: formulario.version.trim(),
    contenido: formulario.contenido.trim(),
    publicado: formulario.publicado,
  });
};
</script>

<style scoped>
.legal-dialog {
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

.legal-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  flex: 0 0 auto;

  padding: 22px 24px;

  border-bottom: 1px solid #edf0f4;
}

.legal-dialog__heading {
  display: flex;
  align-items: center;

  gap: 13px;

  min-width: 0;
}

.legal-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  border-radius: 13px;

  background: #f1f5f9;
  color: #475569;
}

.legal-dialog__title {
  min-width: 0;
}

.legal-dialog__eyebrow {
  display: block;

  margin-bottom: 3px;

  color: #64748b;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.legal-dialog h2 {
  margin: 0;

  overflow: hidden;

  color: #172033;

  font-size: 21px;
  font-weight: 750;

  line-height: 1.25;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.legal-dialog__title p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 13px;

  line-height: 1.4;
}

.legal-dialog__close {
  flex: 0 0 auto;

  color: #64748b;
}

/* BODY */

.legal-dialog__body {
  flex: 1 1 auto;

  min-height: 0;

  overflow-y: auto;

  padding: 24px;

  scrollbar-width: thin;
}

/* STATUS */

.legal-status {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 26px;
  padding: 15px 16px;

  border: 1px solid #e5eaf0;
  border-radius: 14px;

  background: #f8fafc;
}

.legal-status__content {
  display: flex;
  align-items: center;

  gap: 12px;

  min-width: 0;
}

.legal-status__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  flex: 0 0 auto;

  border-radius: 11px;

  background: #ffffff;
  color: #64748b;
}

.legal-status__content div:last-child {
  display: flex;
  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.legal-status__content strong {
  color: #334155;

  font-size: 13px;
}

.legal-status__content span {
  color: #94a3b8;

  font-size: 11px;

  line-height: 1.4;
}

/* FORM */

.legal-form__section-title {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  color: #172033;

  font-size: 14px;
  font-weight: 750;
}

.legal-form__section-title .q-icon {
  color: #1976d2;
}

.legal-form__grid {
  display: grid;

  grid-template-columns: 1fr 180px;

  gap: 14px;
}

.legal-content {
  margin-top: 8px;
}

.legal-content__input :deep(textarea) {
  min-height: 260px;

  line-height: 1.6;
}

.legal-content__hint {
  display: flex;
  align-items: flex-start;

  gap: 6px;

  margin-top: -8px;
  margin-bottom: 24px;

  color: #94a3b8;

  font-size: 11px;

  line-height: 1.5;
}

.legal-content__hint .q-icon {
  flex: 0 0 auto;

  margin-top: 1px;
}

/* META */

.legal-meta {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

  padding-top: 4px;
}

.legal-meta__item {
  display: flex;
  flex-direction: column;

  gap: 4px;

  padding: 13px 14px;

  border: 1px solid #eef1f5;
  border-radius: 12px;
}

.legal-meta__item span {
  color: #94a3b8;

  font-size: 10px;
  font-weight: 700;
}

.legal-meta__item strong {
  color: #475569;

  font-size: 12px;
}

/* FOOTER */

.legal-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;

  flex: 0 0 auto;

  padding: 14px 24px;

  border-top: 1px solid #edf0f4;

  background: #ffffff;
}

.legal-dialog__cancel {
  min-width: 100px;

  color: #64748b;
}

.legal-dialog__save {
  min-width: 155px;
  min-height: 42px;

  border-radius: 10px;

  font-weight: 700;
}

/* TABLET */

@media (max-width: 700px) {
  .legal-dialog {
    width: 96vw;
    max-width: 96vw;

    max-height: 94vh;

    border-radius: 18px;
  }

  .legal-dialog__header {
    padding: 18px;
  }

  .legal-dialog__body {
    padding: 18px;
  }

  .legal-dialog__footer {
    padding: 13px 18px;
  }

  .legal-form__grid {
    grid-template-columns: 1fr;
  }

  .legal-meta {
    grid-template-columns: 1fr;
  }

  .legal-content__input :deep(textarea) {
    min-height: 220px;
  }
}

/* MOBILE */

@media (max-width: 480px) {
  .legal-dialog {
    width: 100vw;
    max-width: 100vw;

    max-height: 100dvh;

    border-radius: 18px 18px 0 0;
  }

  .legal-dialog__header {
    gap: 12px;

    padding: 16px;
  }

  .legal-dialog__heading {
    align-items: flex-start;

    gap: 10px;
  }

  .legal-dialog__icon {
    width: 38px;
    height: 38px;

    border-radius: 11px;
  }

  .legal-dialog__eyebrow {
    font-size: 9px;
  }

  .legal-dialog h2 {
    max-width: 210px;

    font-size: 18px;
  }

  .legal-dialog__title p {
    font-size: 11px;
  }

  .legal-dialog__body {
    padding: 16px;
  }

  .legal-status {
    align-items: flex-start;
    flex-direction: column;

    gap: 12px;

    padding: 14px;
  }

  .legal-status .q-toggle {
    align-self: flex-end;
  }

  .legal-content__input :deep(textarea) {
    min-height: 240px;
  }

  .legal-dialog__footer {
    flex-direction: column-reverse;

    gap: 8px;

    padding: 12px 16px;

    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .legal-dialog__cancel,
  .legal-dialog__save {
    width: 100%;
  }
}
</style>
