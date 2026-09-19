import type { AvailabilityBlock } from '../types/availability-block.types';

interface AvailabilityRange {
  date: string;
  startTime: string;
  endTime: string;
  employeeId?: string | null;
}

const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number);

  return (horas ?? 0) * 60 + (minutos ?? 0);
};

const existeSolapamientoHorario = (
  inicioA: string,
  finA: string,
  inicioB: string,
  finB: string,
): boolean => {
  const inicioAMinutos = convertirHoraAMinutos(inicioA);
  const finAMinutos = convertirHoraAMinutos(finA);
  const inicioBMinutos = convertirHoraAMinutos(inicioB);
  const finBMinutos = convertirHoraAMinutos(finB);

  return inicioAMinutos < finBMinutos && finAMinutos > inicioBMinutos;
};

export const estaFechaBloqueada = (
  bloque: AvailabilityBlock,
  fecha: string,
  employeeId?: string | null,
): boolean => {
  if (bloque.date !== fecha) {
    return false;
  }

  if (bloque.employeeId !== null && bloque.employeeId !== employeeId) {
    return false;
  }

  return true;
};

export const estaHorarioBloqueado = (
  bloque: AvailabilityBlock,
  horario: AvailabilityRange,
): boolean => {
  if (!estaFechaBloqueada(bloque, horario.date, horario.employeeId)) {
    return false;
  }

  if (bloque.isAllDay) {
    return true;
  }

  if (!bloque.startTime || !bloque.endTime) {
    return false;
  }

  return existeSolapamientoHorario(
    horario.startTime,
    horario.endTime,
    bloque.startTime,
    bloque.endTime,
  );
};

export const encontrarBloqueoConflicto = (
  bloques: AvailabilityBlock[],
  horario: AvailabilityRange,
): AvailabilityBlock | null => {
  return bloques.find((bloque) => estaHorarioBloqueado(bloque, horario)) ?? null;
};
