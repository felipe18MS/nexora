import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlatformStore } from '../stores/platform.store';

import type { TipoDocumentoLegal } from '../types/platform.types';

export function usePlatform() {
  const platformStore = usePlatformStore();

  const { branding, documentosLegales, cargando, guardando, configuracionCargada } =
    storeToRefs(platformStore);

  const nombrePlataforma = computed(() => branding.value.nombre);

  const nombreCortoPlataforma = computed(() => branding.value.nombreCorto);

  const descripcionPlataforma = computed(() => branding.value.descripcion);

  const logoPlataforma = computed(() => branding.value.logo);

  const faviconPlataforma = computed(() => branding.value.favicon);

  const obtenerDocumentoLegal = (tipo: TipoDocumentoLegal) => {
    return documentosLegales.value.find((documento) => documento.tipo === tipo) ?? null;
  };

  const tieneDocumentoLegalPublicado = (tipo: TipoDocumentoLegal): boolean => {
    const documento = obtenerDocumentoLegal(tipo);

    return documento?.publicado ?? false;
  };

  return {
    // Estado
    branding,
    documentosLegales,
    cargando,
    guardando,
    configuracionCargada,

    // Branding
    nombrePlataforma,
    nombreCortoPlataforma,
    descripcionPlataforma,
    logoPlataforma,
    faviconPlataforma,

    // Documentos legales
    obtenerDocumentoLegal,
    tieneDocumentoLegalPublicado,

    // Acciones del store
    cargarConfiguracion: platformStore.cargarConfiguracion,
    actualizarBranding: platformStore.actualizarBranding,
    actualizarDocumentoLegal: platformStore.actualizarDocumentoLegal,
  };
}
