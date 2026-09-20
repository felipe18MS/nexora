import type { Automatizacion } from '../types/automation.types';

export const automatizacionesMock: Automatizacion[] = [
  {
    id: 'auto-001',
    nombre: 'Recordatorio de cita',
    descripcion: 'Envía un mensaje de WhatsApp al cliente antes de su cita.',
    estado: 'activa',
    disparador: 'recordatorio',
    condiciones: [
      {
        id: 'cond-001',
        campo: 'tiempoAntesCita',
        operador: 'igual',
        valor: '24 horas',
      },
    ],
    acciones: [
      {
        id: 'accion-001',
        tipo: 'enviar-whatsapp',
        nombre: 'Enviar recordatorio',
        configuracion: {
          mensaje: 'Hola {{cliente}}, te recordamos que tienes una cita mañana.',
        },
      },
    ],
    ejecuciones: 128,
    ultimaEjecucion: '2026-09-19T08:30:00',
    creadoEn: '2026-09-01T10:00:00',
    actualizadoEn: '2026-09-18T15:30:00',
  },

  {
    id: 'auto-002',
    nombre: 'Confirmación de cita',
    descripcion: 'Solicita al cliente confirmar su cita mediante WhatsApp.',
    estado: 'activa',
    disparador: 'cita-creada',
    condiciones: [
      {
        id: 'cond-002',
        campo: 'canalContacto',
        operador: 'igual',
        valor: 'whatsapp',
      },
    ],
    acciones: [
      {
        id: 'accion-002',
        tipo: 'enviar-whatsapp',
        nombre: 'Solicitar confirmación',
        configuracion: {
          mensaje: 'Hola {{cliente}}, tu cita ha sido creada. ¿Deseas confirmarla?',
        },
      },
      {
        id: 'accion-003',
        tipo: 'crear-recordatorio',
        nombre: 'Programar seguimiento',
        configuracion: {
          tiempo: '2 horas',
        },
      },
    ],
    ejecuciones: 94,
    ultimaEjecucion: '2026-09-18T17:20:00',
    creadoEn: '2026-09-03T09:15:00',
    actualizadoEn: '2026-09-18T11:40:00',
  },

  {
    id: 'auto-003',
    nombre: 'Seguimiento de llamada perdida',
    descripcion: 'Crea un recordatorio cuando una llamada de un cliente no es atendida.',
    estado: 'activa',
    disparador: 'llamada-perdida',
    condiciones: [
      {
        id: 'cond-003',
        campo: 'clienteRegistrado',
        operador: 'igual',
        valor: 'true',
      },
    ],
    acciones: [
      {
        id: 'accion-004',
        tipo: 'crear-recordatorio',
        nombre: 'Crear seguimiento',
        configuracion: {
          tiempo: '15 minutos',
        },
      },
      {
        id: 'accion-005',
        tipo: 'notificar-equipo',
        nombre: 'Notificar al equipo',
        configuracion: {
          mensaje: 'Se recibió una llamada perdida de {{cliente}}.',
        },
      },
    ],
    ejecuciones: 37,
    ultimaEjecucion: '2026-09-19T08:12:00',
    creadoEn: '2026-09-05T14:00:00',
    actualizadoEn: '2026-09-17T16:10:00',
  },

  {
    id: 'auto-004',
    nombre: 'Seguimiento después del servicio',
    descripcion: 'Contacta al cliente después de completar un servicio.',
    estado: 'inactiva',
    disparador: 'cita-confirmada',
    condiciones: [
      {
        id: 'cond-004',
        campo: 'estadoCita',
        operador: 'igual',
        valor: 'completada',
      },
    ],
    acciones: [
      {
        id: 'accion-006',
        tipo: 'enviar-whatsapp',
        nombre: 'Enviar seguimiento',
        configuracion: {
          mensaje: 'Hola {{cliente}}, queremos saber cómo fue tu experiencia con nuestro servicio.',
        },
      },
    ],
    ejecuciones: 62,
    ultimaEjecucion: '2026-09-15T10:00:00',
    creadoEn: '2026-09-06T09:30:00',
    actualizadoEn: '2026-09-15T10:20:00',
  },

  {
    id: 'auto-005',
    nombre: 'Aviso de pago pendiente',
    descripcion: 'Notifica al cliente cuando existe un pago pendiente.',
    estado: 'borrador',
    disparador: 'pago-pendiente',
    condiciones: [
      {
        id: 'cond-005',
        campo: 'diasVencido',
        operador: 'mayor',
        valor: '3',
      },
    ],
    acciones: [
      {
        id: 'accion-007',
        tipo: 'enviar-whatsapp',
        nombre: 'Avisar pago pendiente',
        configuracion: {
          mensaje: 'Hola {{cliente}}, tenemos registrado un pago pendiente.',
        },
      },
    ],
    ejecuciones: 0,
    creadoEn: '2026-09-10T11:00:00',
    actualizadoEn: '2026-09-10T11:00:00',
  },
];
