export type EstadoAgenteIA = 'activo' | 'inactivo' | 'configuracion-incompleta';

export type TonoAgenteIA = 'profesional' | 'amigable' | 'cercano' | 'formal' | 'casual';

export type CanalAgenteIA = 'whatsapp' | 'llamada' | 'web';

export type CapacidadAgenteIA =
  | 'gestionar-citas'
  | 'consultar-servicios'
  | 'consultar-horarios'
  | 'consultar-precios'
  | 'responder-preguntas'
  | 'confirmar-citas'
  | 'cancelar-citas'
  | 'reprogramar-citas'
  | 'capturar-clientes'
  | 'transferir-humano';

export type ComportamientoFallbackIA =
  | 'transferir-humano'
  | 'crear-seguimiento'
  | 'solicitar-mas-informacion'
  | 'informar-no-disponible';

export interface ConfiguracionHorarioIA {
  habilitado: boolean;
  horaInicio: string;
  horaFin: string;
}

export interface HorariosAgenteIA {
  lunes: ConfiguracionHorarioIA;
  martes: ConfiguracionHorarioIA;
  miercoles: ConfiguracionHorarioIA;
  jueves: ConfiguracionHorarioIA;
  viernes: ConfiguracionHorarioIA;
  sabado: ConfiguracionHorarioIA;
  domingo: ConfiguracionHorarioIA;
}

export interface ConfiguracionAgenteIA {
  nombre: string;
  tono: TonoAgenteIA;
  objetivo: string;
  instrucciones: string;
  saludoInicial: string;
  comportamientoFallback: ComportamientoFallbackIA;
  mensajeFallback: string;
  canales: CanalAgenteIA[];
  capacidades: CapacidadAgenteIA[];
  horarios: HorariosAgenteIA;
}

export interface AgenteIA {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoAgenteIA;
  configuracion: ConfiguracionAgenteIA;
  conversacionesAtendidas: number;
  citasGestionadas: number;
  ultimaActividad?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ActualizarAgenteIA {
  nombre?: string;
  descripcion?: string;
  estado?: EstadoAgenteIA;
  configuracion?: ConfiguracionAgenteIA;
}

export interface MensajePruebaIA {
  id: string;
  rol: 'usuario' | 'agente';
  contenido: string;
  creadoEn: string;
}

export interface SesionPruebaIA {
  id: string;
  mensajes: MensajePruebaIA[];
  creadaEn: string;
}

export interface ResumenAgenteIA {
  conversacionesAtendidas: number;
  citasGestionadas: number;
  capacidadesActivas: number;
  canalesActivos: number;
}
