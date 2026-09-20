import { recordatoriosMock } from '../mocks/reminder.mock';
import type {
  ActualizarRecordatorio,
  CrearRecordatorio,
  EstadoRecordatorio,
  Recordatorio,
} from '../types/reminder.types';

export const obtenerRecordatorios = (): Recordatorio[] => [...recordatoriosMock];

export const obtenerRecordatorioPorId = (id: string): Recordatorio | undefined => {
  return recordatoriosMock.find((recordatorio) => recordatorio.id === id);
};

export const crearRecordatorio = (datos: CrearRecordatorio): Recordatorio => {
  const ahora = new Date().toISOString();

  const recordatorio: Recordatorio = {
    id: `rem-${Date.now()}`,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    titulo: datos.titulo,
    mensaje: datos.mensaje,
    tipo: datos.tipo,
    canal: datos.canal,
    fechaProgramada: datos.fechaProgramada,
    estado: 'pendiente',
    ...(datos.referenciaId ? { referenciaId: datos.referenciaId } : {}),
    creadoEn: ahora,
  };

  recordatoriosMock.unshift(recordatorio);

  return { ...recordatorio };
};

export const actualizarRecordatorio = (datos: ActualizarRecordatorio): Recordatorio | null => {
  const recordatorio = recordatoriosMock.find((item) => item.id === datos.id);

  if (!recordatorio) {
    return null;
  }

  if (datos.titulo !== undefined) {
    recordatorio.titulo = datos.titulo;
  }

  if (datos.mensaje !== undefined) {
    recordatorio.mensaje = datos.mensaje;
  }

  if (datos.tipo !== undefined) {
    recordatorio.tipo = datos.tipo;
  }

  if (datos.canal !== undefined) {
    recordatorio.canal = datos.canal;
  }

  if (datos.fechaProgramada !== undefined) {
    recordatorio.fechaProgramada = datos.fechaProgramada;
  }

  return { ...recordatorio };
};

export const actualizarEstadoRecordatorio = (
  id: string,
  estado: EstadoRecordatorio,
): Recordatorio | null => {
  const recordatorio = recordatoriosMock.find((item) => item.id === id);

  if (!recordatorio) {
    return null;
  }

  recordatorio.estado = estado;

  return { ...recordatorio };
};

export const cancelarRecordatorio = (id: string): Recordatorio | null => {
  return actualizarEstadoRecordatorio(id, 'cancelado');
};
