export interface PlataformaBranding {
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  logo: string | null;
  favicon: string | null;
}

export type TipoDocumentoLegal = 'terminos' | 'privacidad' | 'cookies';

export interface DocumentoLegal {
  id: string;
  tipo: TipoDocumentoLegal;
  titulo: string;
  version: string;
  contenido: string;
  actualizadoEn: string;
  publicado: boolean;
}

export interface ConfiguracionPlataforma {
  branding: PlataformaBranding;
  documentosLegales: DocumentoLegal[];
}

export interface ActualizarBranding {
  nombre?: string;
  nombreCorto?: string;
  descripcion?: string;
  logo?: string | null;
  favicon?: string | null;
}

export interface ActualizarDocumentoLegal {
  id: string;
  titulo?: string;
  version?: string;
  contenido?: string;
  publicado?: boolean;
}
