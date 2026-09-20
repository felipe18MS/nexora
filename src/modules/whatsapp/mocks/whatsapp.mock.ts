import type {
  ConfiguracionWhatsApp,
  ConexionWhatsApp,
  MensajeWhatsApp,
} from '../types/whatsapp.types';

export const conexionWhatsAppMock: ConexionWhatsApp = {
  id: 'wa-001',
  nombreCuenta: 'NEXORA Business',
  numero: '+57 300 123 4567',
  estado: 'conectado',
  ultimaConexion: '2026-09-19T10:30:00',
  mensajesEnviados: 128,
  mensajesRecibidos: 96,
};

export const mensajesWhatsAppMock: MensajeWhatsApp[] = [
  {
    id: 'wam-001',
    clienteId: 'cli-001',
    clienteNombre: 'María González',
    telefono: '+57 300 123 4567',
    contenido: 'Hola, quisiera confirmar mi cita para mañana.',
    direccion: 'entrante',
    estado: 'leido',
    creadoEn: '2026-09-19T09:10:00',
  },
  {
    id: 'wam-002',
    clienteId: 'cli-001',
    clienteNombre: 'María González',
    telefono: '+57 300 123 4567',
    contenido: 'Claro, tu cita está confirmada para mañana.',
    direccion: 'saliente',
    estado: 'entregado',
    creadoEn: '2026-09-19T09:20:00',
  },
  {
    id: 'wam-003',
    clienteId: 'cli-002',
    clienteNombre: 'Carlos Rodríguez',
    telefono: '+57 301 234 5678',
    contenido: '¿Cuánto cuesta el servicio?',
    direccion: 'entrante',
    estado: 'leido',
    creadoEn: '2026-09-19T08:30:00',
  },
  {
    id: 'wam-004',
    clienteId: 'cli-003',
    clienteNombre: 'Laura Martínez',
    telefono: '+57 302 345 6789',
    contenido: 'Gracias por la información.',
    direccion: 'entrante',
    estado: 'leido',
    creadoEn: '2026-09-18T16:20:00',
  },
];

export const configuracionWhatsAppMock: ConfiguracionWhatsApp = {
  nombreCuenta: 'NEXORA Business',
  numero: '+57 300 123 4567',
  webhookActivo: true,
  respuestasAutomaticas: true,
};
