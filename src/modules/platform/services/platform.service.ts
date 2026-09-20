import {
  actualizarBrandingMock,
  actualizarDocumentoLegalMock,
  obtenerBrandingMock,
  obtenerConfiguracionPlataformaMock,
  obtenerDocumentoLegalMock,
  obtenerDocumentosLegalesMock,
} from '../mocks/platform.mock';

import type {
  ActualizarBranding,
  ActualizarDocumentoLegal,
  ConfiguracionPlataforma,
  DocumentoLegal,
  PlataformaBranding,
} from '../types/platform.types';

export const platformService = {
  obtenerConfiguracion(): ConfiguracionPlataforma {
    return obtenerConfiguracionPlataformaMock();
  },

  obtenerBranding(): PlataformaBranding {
    return obtenerBrandingMock();
  },

  actualizarBranding(cambios: ActualizarBranding): PlataformaBranding {
    return actualizarBrandingMock(cambios);
  },

  obtenerDocumentosLegales(): DocumentoLegal[] {
    return obtenerDocumentosLegalesMock();
  },

  obtenerDocumentoLegal(id: string): DocumentoLegal | null {
    return obtenerDocumentoLegalMock(id);
  },

  actualizarDocumentoLegal(cambios: ActualizarDocumentoLegal): DocumentoLegal | null {
    return actualizarDocumentoLegalMock(cambios);
  },
};
