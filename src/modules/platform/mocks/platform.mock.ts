import type {
  ActualizarBranding,
  ActualizarDocumentoLegal,
  ConfiguracionPlataforma,
  DocumentoLegal,
  PlataformaBranding,
} from '../types/platform.types';

const PLATFORM_CONFIG_KEY = 'nexora_platform_config';

const brandingInicial: PlataformaBranding = {
  nombre: 'NEXORA',
  nombreCorto: 'NEXORA',
  descripcion: 'Automatización inteligente para tu negocio.',
  logo: null,
  favicon: null,
};

const documentosLegalesIniciales: DocumentoLegal[] = [
  {
    id: 'legal-terminos',
    tipo: 'terminos',
    titulo: 'Términos y condiciones',
    version: '1.0',
    actualizadoEn: '2026-09-01T00:00:00.000Z',
    publicado: true,
    contenido: `
      <h3>1. Aceptación de los términos</h3>
      <p>
        Al crear una cuenta en NEXORA, aceptas estos términos y condiciones
        de uso de la plataforma. Si no estás de acuerdo con ellos, no debes
        completar el proceso de registro.
      </p>

      <h3>2. Uso de NEXORA</h3>
      <p>
        NEXORA proporciona herramientas para la gestión y automatización de
        negocios, incluyendo la administración de clientes, citas, servicios,
        comunicaciones y otras funcionalidades disponibles según el plan
        contratado.
      </p>

      <h3>3. Cuenta de usuario</h3>
      <p>
        El usuario es responsable de proporcionar información correcta durante
        el registro y de mantener la confidencialidad de sus credenciales
        de acceso.
      </p>

      <h3>4. Prueba gratuita</h3>
      <p>
        Las nuevas cuentas pueden disponer de un período de prueba gratuito
        de acuerdo con las condiciones vigentes de NEXORA. Durante o después
        de este período pueden aplicarse restricciones de acceso si no existe
        una suscripción activa.
      </p>

      <h3>5. Suscripciones y pagos</h3>
      <p>
        Las funcionalidades disponibles pueden depender del plan de
        suscripción seleccionado. Los precios, períodos de facturación y
        condiciones comerciales serán informados antes de realizar un pago.
      </p>

      <h3>6. Uso responsable</h3>
      <p>
        El usuario debe utilizar NEXORA de forma lícita y responsable.
        No está permitido utilizar la plataforma para actividades
        fraudulentas, abusivas o que puedan afectar a otros usuarios,
        terceros o a la infraestructura del servicio.
      </p>

      <h3>7. Disponibilidad del servicio</h3>
      <p>
        NEXORA busca mantener la disponibilidad y funcionamiento de sus
        servicios, aunque determinadas funcionalidades pueden experimentar
        interrupciones por mantenimiento, actualizaciones o circunstancias
        técnicas.
      </p>

      <h3>8. Modificaciones</h3>
      <p>
        Estos términos pueden actualizarse cuando sea necesario para reflejar
        cambios en el servicio, funcionalidades, obligaciones legales o
        condiciones comerciales.
      </p>
    `.trim(),
  },

  {
    id: 'legal-privacidad',
    tipo: 'privacidad',
    titulo: 'Política de privacidad',
    version: '1.0',
    actualizadoEn: '2026-09-01T00:00:00.000Z',
    publicado: true,
    contenido: `
      <h3>1. Información que recopilamos</h3>
      <p>
        NEXORA puede recopilar información necesaria para crear y administrar
        cuentas, negocios y servicios dentro de la plataforma.
      </p>

      <h3>2. Uso de la información</h3>
      <p>
        La información puede utilizarse para proporcionar funcionalidades,
        mantener la seguridad, mejorar el servicio y gestionar la relación
        con los usuarios.
      </p>

      <h3>3. Datos de clientes</h3>
      <p>
        Los negocios que utilizan NEXORA pueden registrar información
        relacionada con sus propios clientes. El negocio es responsable
        de utilizar dicha información de acuerdo con la legislación aplicable.
      </p>

      <h3>4. Seguridad</h3>
      <p>
        NEXORA busca aplicar medidas razonables para proteger la información
        almacenada y procesada dentro de la plataforma.
      </p>

      <h3>5. Derechos</h3>
      <p>
        Los usuarios pueden ejercer los derechos que les correspondan
        respecto al tratamiento de sus datos conforme a la normativa aplicable.
      </p>

      <h3>6. Modificaciones</h3>
      <p>
        Esta política puede actualizarse cuando sea necesario para reflejar
        cambios en el servicio o en las obligaciones legales aplicables.
      </p>
    `.trim(),
  },

  {
    id: 'legal-cookies',
    tipo: 'cookies',
    titulo: 'Política de cookies',
    version: '1.0',
    actualizadoEn: '2026-09-01T00:00:00.000Z',
    publicado: true,
    contenido: `
      <h3>1. Uso de cookies y almacenamiento local</h3>
      <p>
        NEXORA puede utilizar tecnologías de almacenamiento local y cookies
        necesarias para proporcionar funcionalidades, mantener sesiones
        y mejorar la experiencia de usuario.
      </p>

      <h3>2. Tecnologías utilizadas</h3>
      <p>
        Las tecnologías utilizadas dependerán de las funcionalidades activas
        y de las integraciones configuradas en la plataforma.
      </p>

      <h3>3. Finalidad</h3>
      <p>
        Estas tecnologías pueden utilizarse para mantener la sesión del
        usuario, recordar determinadas preferencias y permitir el correcto
        funcionamiento de las funcionalidades de NEXORA.
      </p>
    `.trim(),
  },
];

const clonarConfiguracion = (configuracion: ConfiguracionPlataforma): ConfiguracionPlataforma => {
  return {
    branding: {
      ...configuracion.branding,
    },

    documentosLegales: configuracion.documentosLegales.map((documento) => ({
      ...documento,
    })),
  };
};

const obtenerConfiguracionGuardada = (): ConfiguracionPlataforma | null => {
  const configuracion = localStorage.getItem(PLATFORM_CONFIG_KEY);

  if (!configuracion) {
    return null;
  }

  try {
    return JSON.parse(configuracion) as ConfiguracionPlataforma;
  } catch {
    localStorage.removeItem(PLATFORM_CONFIG_KEY);

    return null;
  }
};

const guardarConfiguracion = (configuracion: ConfiguracionPlataforma): void => {
  localStorage.setItem(PLATFORM_CONFIG_KEY, JSON.stringify(configuracion));
};

export const obtenerConfiguracionPlataformaMock = (): ConfiguracionPlataforma => {
  const configuracionGuardada = obtenerConfiguracionGuardada();

  if (configuracionGuardada) {
    return clonarConfiguracion(configuracionGuardada);
  }

  const configuracionInicial: ConfiguracionPlataforma = {
    branding: {
      ...brandingInicial,
    },

    documentosLegales: documentosLegalesIniciales.map((documento) => ({
      ...documento,
    })),
  };

  guardarConfiguracion(configuracionInicial);

  return clonarConfiguracion(configuracionInicial);
};

export const actualizarBrandingMock = (cambios: ActualizarBranding): PlataformaBranding => {
  const configuracion = obtenerConfiguracionPlataformaMock();

  configuracion.branding = {
    ...configuracion.branding,
    ...cambios,
  };

  guardarConfiguracion(configuracion);

  return {
    ...configuracion.branding,
  };
};

export const obtenerDocumentosLegalesMock = (): DocumentoLegal[] => {
  const configuracion = obtenerConfiguracionPlataformaMock();

  return configuracion.documentosLegales.map((documento) => ({
    ...documento,
  }));
};

export const obtenerDocumentoLegalMock = (id: string): DocumentoLegal | null => {
  const documentos = obtenerDocumentosLegalesMock();

  return documentos.find((documento) => documento.id === id) ?? null;
};

export const actualizarDocumentoLegalMock = (
  cambios: ActualizarDocumentoLegal,
): DocumentoLegal | null => {
  const configuracion = obtenerConfiguracionPlataformaMock();

  const indice = configuracion.documentosLegales.findIndex(
    (documento) => documento.id === cambios.id,
  );

  if (indice === -1) {
    return null;
  }

  const documentoActual = configuracion.documentosLegales[indice];

  if (!documentoActual) {
    return null;
  }

  const documentoActualizado: DocumentoLegal = {
    id: documentoActual.id,
    tipo: documentoActual.tipo,
    titulo: cambios.titulo ?? documentoActual.titulo,
    version: cambios.version ?? documentoActual.version,
    contenido: cambios.contenido ?? documentoActual.contenido,
    actualizadoEn: new Date().toISOString(),
    publicado: cambios.publicado ?? documentoActual.publicado,
  };

  configuracion.documentosLegales[indice] = documentoActualizado;

  guardarConfiguracion(configuracion);

  return {
    ...documentoActualizado,
  };
};
export const obtenerBrandingMock = (): PlataformaBranding => {
  const configuracion = obtenerConfiguracionPlataformaMock();

  return {
    ...configuracion.branding,
  };
};
