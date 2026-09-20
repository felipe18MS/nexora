import type { AgenteIA, SesionPruebaIA } from '../types/ai.types';

export const agenteIAMock: AgenteIA = {
  id: 'ai-001',
  nombre: 'Nexora Assistant',
  descripcion:
    'Agente virtual encargado de atender clientes, gestionar citas y resolver consultas frecuentes.',
  estado: 'activo',

  configuracion: {
    nombre: 'Nexora Assistant',
    tono: 'amigable',
    objetivo:
      'Atender automáticamente a los clientes, resolver sus consultas y ayudarles a gestionar sus citas.',

    instrucciones:
      'Saluda de forma cordial, identifica la necesidad del cliente y proporciona información clara. Antes de agendar una cita, verifica la disponibilidad. Si no puedes resolver una solicitud, ofrece transferir la conversación a un miembro del equipo.',

    saludoInicial: '¡Hola! Soy el asistente virtual de nuestro negocio. ¿En qué puedo ayudarte?',

    comportamientoFallback: 'transferir-humano',

    mensajeFallback:
      'No puedo resolver esta solicitud directamente. Voy a comunicarte con un miembro de nuestro equipo para ayudarte.',

    canales: ['whatsapp', 'llamada', 'web'],

    capacidades: [
      'gestionar-citas',
      'consultar-servicios',
      'consultar-horarios',
      'consultar-precios',
      'responder-preguntas',
      'confirmar-citas',
      'cancelar-citas',
      'reprogramar-citas',
      'capturar-clientes',
      'transferir-humano',
    ],

    horarios: {
      lunes: {
        habilitado: true,
        horaInicio: '08:00',
        horaFin: '18:00',
      },

      martes: {
        habilitado: true,
        horaInicio: '08:00',
        horaFin: '18:00',
      },

      miercoles: {
        habilitado: true,
        horaInicio: '08:00',
        horaFin: '18:00',
      },

      jueves: {
        habilitado: true,
        horaInicio: '08:00',
        horaFin: '18:00',
      },

      viernes: {
        habilitado: true,
        horaInicio: '08:00',
        horaFin: '18:00',
      },

      sabado: {
        habilitado: true,
        horaInicio: '09:00',
        horaFin: '14:00',
      },

      domingo: {
        habilitado: false,
        horaInicio: '09:00',
        horaFin: '14:00',
      },
    },
  },

  conversacionesAtendidas: 342,
  citasGestionadas: 87,
  ultimaActividad: '2026-09-19T10:42:00',
  creadoEn: '2026-09-01T09:00:00',
  actualizadoEn: '2026-09-19T10:42:00',
};

export const sesionPruebaIAMock: SesionPruebaIA = {
  id: 'session-ai-001',

  mensajes: [
    {
      id: 'msg-ai-001',
      rol: 'agente',
      contenido: '¡Hola! Soy el asistente virtual de nuestro negocio. ¿En qué puedo ayudarte?',
      creadoEn: '2026-09-19T10:40:00',
    },

    {
      id: 'msg-ai-002',
      rol: 'usuario',
      contenido: 'Hola, quisiera saber qué servicios tienen disponibles.',
      creadoEn: '2026-09-19T10:40:18',
    },

    {
      id: 'msg-ai-003',
      rol: 'agente',
      contenido:
        'Claro. Tenemos diferentes servicios disponibles. Puedo ayudarte a consultar los servicios, precios y horarios disponibles.',
      creadoEn: '2026-09-19T10:40:24',
    },

    {
      id: 'msg-ai-004',
      rol: 'usuario',
      contenido: 'Perfecto, quiero agendar una cita.',
      creadoEn: '2026-09-19T10:40:41',
    },

    {
      id: 'msg-ai-005',
      rol: 'agente',
      contenido:
        'Con gusto. Primero necesito saber qué servicio deseas y qué día te gustaría reservar.',
      creadoEn: '2026-09-19T10:40:47',
    },
  ],

  creadaEn: '2026-09-19T10:40:00',
};
