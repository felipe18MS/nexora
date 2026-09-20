import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { platformService } from '../services/platform.service';

import type {
  ActualizarBranding,
  ActualizarDocumentoLegal,
  DocumentoLegal,
  PlataformaBranding,
} from '../types/platform.types';

export const usePlatformStore = defineStore('platform', () => {
  const branding = ref<PlataformaBranding>({
    nombre: '',
    nombreCorto: '',
    descripcion: '',
    logo: null,
    favicon: null,
  });

  const documentosLegales = ref<DocumentoLegal[]>([]);

  const cargando = ref(false);
  const guardando = ref(false);

  const configuracionCargada = computed(() => branding.value.nombre.length > 0);

  const cargarConfiguracion = (): void => {
    cargando.value = true;

    const configuracion = platformService.obtenerConfiguracion();

    branding.value = {
      ...configuracion.branding,
    };

    documentosLegales.value = configuracion.documentosLegales.map((documento) => ({
      ...documento,
    }));

    cargando.value = false;
  };

  const actualizarBranding = (cambios: ActualizarBranding): PlataformaBranding => {
    guardando.value = true;

    const actualizado = platformService.actualizarBranding(cambios);

    branding.value = {
      ...actualizado,
    };

    guardando.value = false;

    return actualizado;
  };

  const actualizarDocumentoLegal = (cambios: ActualizarDocumentoLegal): DocumentoLegal | null => {
    guardando.value = true;

    const actualizado = platformService.actualizarDocumentoLegal(cambios);

    if (actualizado) {
      const indice = documentosLegales.value.findIndex(
        (documento) => documento.id === actualizado.id,
      );

      if (indice !== -1) {
        documentosLegales.value[indice] = {
          ...actualizado,
        };
      }
    }

    guardando.value = false;

    return actualizado;
  };

  const obtenerDocumentoLegal = (id: string): DocumentoLegal | null => {
    return documentosLegales.value.find((documento) => documento.id === id) ?? null;
  };

  return {
    branding,
    documentosLegales,
    cargando,
    guardando,
    configuracionCargada,
    cargarConfiguracion,
    actualizarBranding,
    actualizarDocumentoLegal,
    obtenerDocumentoLegal,
  };
});
