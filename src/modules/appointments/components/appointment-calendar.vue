<template>
  <q-card flat bordered class="appointment-calendar">
    <!-- HEADER -->
    <q-card-section class="calendar-toolbar">
      <div class="calendar-toolbar__title">
        <div class="text-h6 text-weight-bold">Calendario</div>

        <div class="text-caption text-grey-6">Consulta y administra las citas programadas.</div>
      </div>

      <div class="calendar-toolbar__actions">
        <q-btn flat dense no-caps icon="chevron_left" label="Anterior" @click="irPeriodoAnterior" />

        <q-btn unelevated dense no-caps color="primary" label="Hoy" @click="irAHoy" />

        <q-btn
          flat
          dense
          no-caps
          label="Siguiente"
          icon-right="chevron_right"
          @click="irPeriodoSiguiente"
        />

        <q-btn-toggle
          v-model="vistaActual"
          unelevated
          toggle-color="primary"
          no-caps
          :options="opcionesVista"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- PERIODO ACTUAL -->
    <q-card-section class="calendar-period">
      <div class="row items-center no-wrap">
        <q-icon name="event" color="primary" size="20px" class="q-mr-sm" />

        <div class="text-subtitle1 text-weight-medium">
          {{ tituloPeriodo }}
        </div>
      </div>

      <div class="text-caption text-grey-6">{{ cantidadCitasPeriodo }} {{ textoCitasPeriodo }}</div>
    </q-card-section>

    <q-separator />

    <!-- ========================= -->
    <!-- VISTA SEMANA -->
    <!-- ========================= -->

    <q-card-section v-if="vistaActual === 'week'" class="calendar-content">
      <div class="week-calendar">
        <!-- CABECERA DE DÍAS -->
        <div class="week-header">
          <div class="week-time-column week-time-column--header">
            <q-icon name="schedule" size="18px" color="grey-6" />
          </div>

          <div
            v-for="dia in diasSemana"
            :key="dia.fecha"
            class="week-day-header"
            :class="{
              'week-day-header--today': dia.esHoy,
            }"
          >
            <div class="text-caption text-uppercase">
              {{ dia.nombre }}
            </div>

            <div
              class="week-day-header__number"
              :class="{
                'week-day-header__number--today': dia.esHoy,
              }"
            >
              {{ dia.numero }}
            </div>
          </div>
        </div>

        <!-- CUERPO DEL CALENDARIO -->
        <div class="week-body">
          <!-- HORAS -->
          <div class="week-time-column">
            <div v-for="hora in horasCalendario" :key="hora" class="time-slot-label">
              {{ hora }}
            </div>
          </div>

          <!-- DÍAS -->
          <div
            v-for="dia in diasSemana"
            :key="`body-${dia.fecha}`"
            class="week-day-column"
            :class="{
              'week-day-column--today': dia.esHoy,
            }"
          >
            <!-- LÍNEAS DE HORAS -->
            <div v-for="hora in horasCalendario" :key="`${dia.fecha}-${hora}`" class="time-slot" />

            <!-- BLOQUEOS -->
            <div
              v-for="bloqueo in obtenerBloqueosDelDia(dia.fecha)"
              :key="`block-${bloqueo.id}`"
              class="calendar-block"
              :class="{
                'calendar-block--all-day': bloqueo.isAllDay,
              }"
              :style="obtenerEstiloBloqueo(bloqueo)"
            >
              <div class="calendar-block__content">
                <q-icon name="block" size="14px" />

                <span class="calendar-block__reason ellipsis">
                  {{ bloqueo.reason }}
                </span>
              </div>
            </div>

            <!-- CITAS -->
            <button
              v-for="cita in obtenerCitasDelDia(dia.fecha)"
              :key="cita.id"
              type="button"
              class="calendar-event"
              :class="`calendar-event--${cita.status}`"
              :style="obtenerEstiloCita(cita)"
              @click="emit('seleccionar', cita)"
            >
              <div class="calendar-event__time">{{ cita.startTime }} - {{ cita.endTime }}</div>

              <div class="calendar-event__customer ellipsis">
                {{ cita.customerName }}
              </div>

              <div class="calendar-event__service ellipsis">
                {{ cita.serviceName }}
              </div>
            </button>

            <!-- LÍNEA DE HORA ACTUAL -->
            <div v-if="dia.esHoy" class="current-time-line" />
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- ========================= -->
    <!-- VISTA MES -->
    <!-- ========================= -->

    <q-card-section v-else-if="vistaActual === 'month'" class="calendar-content">
      <div class="month-calendar">
        <!-- DÍAS DE LA SEMANA -->
        <div class="month-weekdays">
          <div v-for="dia in nombresDias" :key="dia" class="month-weekday">
            {{ dia }}
          </div>
        </div>

        <!-- DÍAS -->
        <div class="month-grid">
          <button
            v-for="dia in diasMes"
            :key="dia.fecha"
            type="button"
            class="month-day"
            :class="{
              'month-day--outside': !dia.esMesActual,
              'month-day--today': dia.esHoy,
              'month-day--selected': dia.esSeleccionable,
              'month-day--blocked': obtenerBloqueosDelDia(dia.fecha).length > 0,
            }"
            @click="seleccionarDia(dia.fecha)"
          >
            <div class="month-day__header">
              <span
                class="month-day__number"
                :class="{
                  'month-day__number--today': dia.esHoy,
                }"
              >
                {{ dia.numero }}
              </span>

              <div class="month-day__indicators">
                <!-- CANTIDAD DE CITAS -->
                <span v-if="dia.cantidadCitas > 0" class="month-day__count">
                  {{ dia.cantidadCitas }}
                </span>

                <!-- CANTIDAD DE BLOQUEOS -->
                <span
                  v-if="obtenerBloqueosDelDia(dia.fecha).length > 0"
                  class="month-day__block-indicator"
                >
                  <q-icon name="block" size="13px" />

                  {{ obtenerBloqueosDelDia(dia.fecha).length }}
                </span>
              </div>
            </div>

            <div class="month-day__appointments">
              <!-- CITAS -->
              <div
                v-for="cita in obtenerCitasDelDia(dia.fecha).slice(0, 3)"
                :key="cita.id"
                class="month-event"
                :class="`month-event--${cita.status}`"
                @click.stop="emit('seleccionar', cita)"
              >
                <span class="month-event__time">
                  {{ cita.startTime }}
                </span>

                <span class="ellipsis">
                  {{ cita.customerName }}
                </span>
              </div>

              <!-- MÁS CITAS -->
              <div v-if="dia.cantidadCitas > 3" class="month-more">
                +{{ dia.cantidadCitas - 3 }} más
              </div>
            </div>
          </button>
        </div>
      </div>
    </q-card-section>

    <!-- ========================= -->
    <!-- VISTA AGENDA -->
    <!-- ========================= -->

    <q-card-section v-else class="calendar-content">
      <div v-if="agendaCompleta.length" class="agenda-list">
        <div v-for="grupo in agendaCompleta" :key="grupo.fecha" class="agenda-day">
          <!-- HEADER DEL DÍA -->
          <div
            class="agenda-day__header"
            :class="{
              'agenda-day__header--today': grupo.esHoy,
            }"
          >
            <div>
              <div class="text-caption text-grey-6 text-uppercase">
                {{ grupo.nombreDia }}
              </div>

              <div class="text-subtitle1 text-weight-bold">
                {{ grupo.fechaFormateada }}
              </div>
            </div>

            <q-badge
              color="primary"
              :label="`${grupo.citas.length} ${grupo.citas.length === 1 ? 'cita' : 'citas'}`"
            />
          </div>

          <!-- CONTENIDO DEL DÍA -->
          <div class="agenda-day__appointments">
            <!-- BLOQUEOS -->
            <div
              v-for="bloqueo in obtenerBloqueosDelDia(grupo.fecha)"
              :key="`agenda-block-${bloqueo.id}`"
              class="agenda-block"
            >
              <div class="agenda-block__indicator">
                <q-icon name="block" size="18px" />
              </div>

              <div class="agenda-block__content">
                <div class="text-weight-medium">
                  {{ bloqueo.reason }}
                </div>

                <div class="text-caption text-grey-6">
                  <span v-if="bloqueo.isAllDay"> Todo el día </span>

                  <span v-else> {{ bloqueo.startTime }} - {{ bloqueo.endTime }} </span>
                </div>

                <div v-if="bloqueo.notes" class="text-caption text-grey-6">
                  {{ bloqueo.notes }}
                </div>
              </div>

              <q-badge
                color="grey-7"
                outline
                :label="bloqueo.employeeId ? 'Profesional' : 'Global'"
              />
            </div>

            <!-- CITAS -->
            <button
              v-for="cita in grupo.citas"
              :key="cita.id"
              type="button"
              class="agenda-event"
              @click="emit('seleccionar', cita)"
            >
              <div class="agenda-event__time">
                <div class="text-weight-bold">
                  {{ cita.startTime }}
                </div>

                <div class="text-caption text-grey-6">
                  {{ cita.endTime }}
                </div>
              </div>

              <div class="agenda-event__indicator" />

              <div class="agenda-event__content">
                <div class="text-weight-medium">
                  {{ cita.customerName }}
                </div>

                <div class="text-body2 text-grey-7">
                  {{ cita.serviceName }}
                </div>

                <div class="text-caption text-grey-6">
                  <q-icon name="person" size="14px" />

                  {{ cita.employeeName }}
                </div>
              </div>

              <div class="agenda-event__status">
                <AppointmentStatusBadge :status="cita.status" />
              </div>

              <q-icon name="chevron_right" color="grey-5" size="20px" />
            </button>
          </div>
        </div>
      </div>

      <!-- SIN RESULTADOS -->
      <div v-else class="calendar-empty-state">
        <q-icon name="event_busy" size="48px" color="grey-5" />

        <div class="text-subtitle1 text-weight-medium q-mt-md">
          No hay citas ni bloqueos en este periodo
        </div>

        <div class="text-caption text-grey-6">Prueba navegando a otro periodo.</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import AppointmentStatusBadge from './appointment-status-badge.vue';

import type { Appointment } from '../types/appointment.types';
import type { AvailabilityBlock } from '../../availability-blocks/types/availability-block.types';

interface Props {
  appointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
}

type VistaCalendario = 'week' | 'month' | 'agenda';

interface DiaCalendario {
  fecha: string;
  numero: number;
  nombre: string;
  esHoy: boolean;
  esMesActual: boolean;
  cantidadCitas: number;
  esSeleccionable: boolean;
}

interface GrupoAgenda {
  fecha: string;
  fechaFormateada: string;
  nombreDia: string;
  esHoy: boolean;
  citas: Appointment[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  seleccionar: [cita: Appointment];
}>();

/* =========================
   ESTADO
========================= */

const fechaReferencia = ref(new Date());

const vistaActual = ref<VistaCalendario>('week');

const opcionesVista = [
  {
    label: 'Semana',
    value: 'week',
  },
  {
    label: 'Mes',
    value: 'month',
  },
  {
    label: 'Agenda',
    value: 'agenda',
  },
];

const horasCalendario = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/* =========================
   FECHAS
========================= */

const formatearFechaISO = (fecha: Date): string => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${año}-${mes}-${dia}`;
};

const obtenerFechaDesdeISO = (fecha: string): Date => {
  const [año, mes, dia] = fecha.split('-').map(Number);

  return new Date(año ?? 0, (mes ?? 1) - 1, dia ?? 1);
};

const obtenerInicioSemana = (fecha: Date): Date => {
  const resultado = new Date(fecha);

  const diaSemana = resultado.getDay();

  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;

  resultado.setDate(resultado.getDate() + diferencia);

  resultado.setHours(0, 0, 0, 0);

  return resultado;
};

const obtenerFinSemana = (fecha: Date): Date => {
  const inicio = obtenerInicioSemana(fecha);

  const fin = new Date(inicio);

  fin.setDate(fin.getDate() + 6);

  return fin;
};

const obtenerInicioMes = (fecha: Date): Date => {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
};

const obtenerFinMes = (fecha: Date): Date => {
  return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
};

/* =========================
   CITAS
========================= */

const obtenerCitasDelDia = (fecha: string): Appointment[] => {
  return props.appointments
    .filter((cita) => cita.date === fecha)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

/* =========================
   BLOQUEOS
========================= */

const obtenerBloqueosDelDia = (fecha: string): AvailabilityBlock[] => {
  return props.availabilityBlocks
    .filter((bloqueo) => bloqueo.date === fecha)
    .sort((a, b) => {
      const inicioA = a.startTime ? convertirHoraAMinutos(a.startTime) : 0;

      const inicioB = b.startTime ? convertirHoraAMinutos(b.startTime) : 0;

      return inicioA - inicioB;
    });
};

/* =========================
   SEMANA
========================= */

const diasSemana = computed<DiaCalendario[]>(() => {
  const inicio = obtenerInicioSemana(fechaReferencia.value);

  return Array.from({ length: 7 }, (_, indice) => {
    const dia = new Date(inicio);

    dia.setDate(inicio.getDate() + indice);

    const fecha = formatearFechaISO(dia);

    return {
      fecha,
      numero: dia.getDate(),

      nombre: dia
        .toLocaleDateString('es-CO', {
          weekday: 'short',
        })
        .replace('.', ''),

      esHoy: fecha === formatearFechaISO(new Date()),

      esMesActual: true,

      cantidadCitas: obtenerCitasDelDia(fecha).length,

      esSeleccionable: false,
    };
  });
});

/* =========================
   MES
========================= */

const diasMes = computed<DiaCalendario[]>(() => {
  const inicioMes = obtenerInicioMes(fechaReferencia.value);

  const primerDiaSemana = inicioMes.getDay() === 0 ? 6 : inicioMes.getDay() - 1;

  const inicioCalendario = new Date(inicioMes);

  inicioCalendario.setDate(inicioMes.getDate() - primerDiaSemana);

  const finMes = obtenerFinMes(fechaReferencia.value);

  const ultimoDiaSemana = finMes.getDay() === 0 ? 6 : finMes.getDay() - 1;

  const diasRestantes = 6 - ultimoDiaSemana;

  const totalDias = primerDiaSemana + finMes.getDate() + diasRestantes;

  return Array.from({ length: totalDias }, (_, indice) => {
    const dia = new Date(inicioCalendario);

    dia.setDate(inicioCalendario.getDate() + indice);

    const fecha = formatearFechaISO(dia);

    const esMesActual =
      dia.getMonth() === fechaReferencia.value.getMonth() &&
      dia.getFullYear() === fechaReferencia.value.getFullYear();

    const esHoy = fecha === formatearFechaISO(new Date());

    const cantidadCitas = obtenerCitasDelDia(fecha).length;

    return {
      fecha,
      numero: dia.getDate(),

      nombre: dia
        .toLocaleDateString('es-CO', {
          weekday: 'short',
        })
        .replace('.', ''),

      esHoy,
      esMesActual,
      cantidadCitas,

      esSeleccionable: cantidadCitas > 0,
    };
  });
});

/* =========================
   AGENDA
========================= */

const obtenerGrupoAgenda = (fecha: string): GrupoAgenda => {
  const dia = obtenerFechaDesdeISO(fecha);

  const citas = props.appointments
    .filter((cita) => cita.date === fecha)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return {
    fecha,

    fechaFormateada: dia.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),

    nombreDia: dia
      .toLocaleDateString('es-CO', {
        weekday: 'long',
      })
      .replace(/^./, (letra) => letra.toUpperCase()),

    esHoy: fecha === formatearFechaISO(new Date()),

    citas,
  };
};

const agendaCompleta = computed<GrupoAgenda[]>(() => {
  let inicio: Date;
  let fin: Date;

  if (vistaActual.value === 'agenda') {
    inicio = obtenerInicioSemana(fechaReferencia.value);

    fin = new Date(inicio);

    fin.setDate(fin.getDate() + 13);
  } else {
    inicio = obtenerInicioSemana(fechaReferencia.value);

    fin = obtenerFinSemana(fechaReferencia.value);
  }

  const fechaInicio = formatearFechaISO(inicio);

  const fechaFin = formatearFechaISO(fin);

  const fechas = new Set<string>();

  /* CITAS */
  props.appointments
    .filter((cita) => cita.date >= fechaInicio && cita.date <= fechaFin)
    .forEach((cita) => {
      fechas.add(cita.date);
    });

  /* BLOQUEOS */
  props.availabilityBlocks
    .filter((bloqueo) => bloqueo.date >= fechaInicio && bloqueo.date <= fechaFin)
    .forEach((bloqueo) => {
      fechas.add(bloqueo.date);
    });

  return Array.from(fechas).sort().map(obtenerGrupoAgenda);
});

/* =========================
   TÍTULOS
========================= */

const tituloPeriodo = computed(() => {
  if (vistaActual.value === 'month') {
    return fechaReferencia.value
      .toLocaleDateString('es-CO', {
        month: 'long',
        year: 'numeric',
      })
      .replace(/^./, (letra) => letra.toUpperCase());
  }

  const inicio = obtenerInicioSemana(fechaReferencia.value);

  const fin = obtenerFinSemana(fechaReferencia.value);

  const mismoMes =
    inicio.getMonth() === fin.getMonth() && inicio.getFullYear() === fin.getFullYear();

  if (mismoMes) {
    return `${inicio.getDate()} - ${fin.getDate()} de ${fin.toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    })}`;
  }

  return `${inicio.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
  })} - ${fin.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
});

const cantidadCitasPeriodo = computed(() => {
  if (vistaActual.value === 'month') {
    const inicio = formatearFechaISO(obtenerInicioMes(fechaReferencia.value));

    const fin = formatearFechaISO(obtenerFinMes(fechaReferencia.value));

    return props.appointments.filter((cita) => cita.date >= inicio && cita.date <= fin).length;
  }

  if (vistaActual.value === 'agenda') {
    return agendaCompleta.value.reduce((total, grupo) => total + grupo.citas.length, 0);
  }

  return diasSemana.value.reduce((total, dia) => total + dia.cantidadCitas, 0);
});

const textoCitasPeriodo = computed(() => {
  return cantidadCitasPeriodo.value === 1 ? 'cita' : 'citas';
});

/* =========================
   NAVEGACIÓN
========================= */

const irPeriodoAnterior = (): void => {
  const nuevaFecha = new Date(fechaReferencia.value);

  if (vistaActual.value === 'month') {
    nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
  } else {
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
  }

  fechaReferencia.value = nuevaFecha;
};

const irPeriodoSiguiente = (): void => {
  const nuevaFecha = new Date(fechaReferencia.value);

  if (vistaActual.value === 'month') {
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
  } else {
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
  }

  fechaReferencia.value = nuevaFecha;
};

const irAHoy = (): void => {
  fechaReferencia.value = new Date();
};

const seleccionarDia = (fecha: string): void => {
  const fechaSeleccionada = obtenerFechaDesdeISO(fecha);

  fechaReferencia.value = fechaSeleccionada;

  const citasDelDia = obtenerCitasDelDia(fecha);

  if (citasDelDia.length === 1) {
    const cita = citasDelDia[0];

    if (cita) {
      emit('seleccionar', cita);
      return;
    }
  }

  vistaActual.value = 'week';
};

/* =========================
   HORAS
========================= */

const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number);

  return (horas ?? 0) * 60 + (minutos ?? 0);
};

/* =========================
   ESTILO DE CITAS
========================= */

const obtenerEstiloCita = (cita: Appointment): Record<string, string> => {
  const inicioCalendario = 7 * 60;

  const minutosPorHora = 60;
  const alturaHora = 60;

  const inicio = convertirHoraAMinutos(cita.startTime);

  const fin = convertirHoraAMinutos(cita.endTime);

  const top = ((inicio - inicioCalendario) / minutosPorHora) * alturaHora;

  const altura = Math.max(((fin - inicio) / minutosPorHora) * alturaHora, 42);

  return {
    top: `${top}px`,
    height: `${altura}px`,
  };
};

/* =========================
   ESTILO DE BLOQUEOS
========================= */

const obtenerEstiloBloqueo = (bloqueo: AvailabilityBlock): Record<string, string> => {
  const inicioCalendario = 7 * 60;

  const minutosPorHora = 60;
  const alturaHora = 60;

  /*
   * Bloqueo de día completo.
   *
   * Se extiende por todo el horario
   * visible del calendario.
   */
  if (bloqueo.isAllDay || !bloqueo.startTime || !bloqueo.endTime) {
    return {
      top: '0px',
      height: `${horasCalendario.length * alturaHora}px`,
    };
  }

  const inicio = convertirHoraAMinutos(bloqueo.startTime);

  const fin = convertirHoraAMinutos(bloqueo.endTime);

  const top = ((inicio - inicioCalendario) / minutosPorHora) * alturaHora;

  const altura = Math.max(((fin - inicio) / minutosPorHora) * alturaHora, 30);

  return {
    top: `${top}px`,
    height: `${altura}px`,
  };
};
</script>

<style scoped>
.appointment-calendar {
  border-radius: 16px;
  overflow: hidden;
}

.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 24px;
}

.calendar-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.calendar-period {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
}

.calendar-content {
  padding: 0;
  overflow-x: auto;
}

/* =========================
   SEMANA
========================= */

.week-calendar {
  min-width: 900px;
}

.week-header,
.week-body {
  display: grid;
  grid-template-columns:
    64px
    repeat(7, minmax(120px, 1fr));
}

.week-header {
  border-bottom: 1px solid #e5e7eb;
}

.week-time-column {
  border-right: 1px solid #e5e7eb;
}

.week-time-column--header {
  min-height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.015);
}

.week-day-header {
  min-height: 78px;
  padding: 10px;

  text-align: center;

  border-right: 1px solid #e5e7eb;

  background: rgba(0, 0, 0, 0.015);
}

.week-day-header--today {
  background: rgba(25, 118, 210, 0.05);
}

.week-day-header__number {
  width: 36px;
  height: 36px;

  margin: 4px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  font-size: 18px;
  font-weight: 600;
}

.week-day-header__number--today {
  color: white;
  background: var(--q-primary);
}

.week-body {
  min-height: 840px;
  max-height: 720px;

  overflow-y: auto;
}

.week-time-column {
  background: rgba(0, 0, 0, 0.015);
}

.time-slot-label {
  height: 60px;

  padding: 6px 8px;

  color: #8a8a8a;

  font-size: 11px;
  text-align: right;

  border-bottom: 1px solid #eef0f2;
}

.week-day-column {
  position: relative;

  min-height: 840px;

  border-right: 1px solid #e5e7eb;
}

.week-day-column--today {
  background: rgba(25, 118, 210, 0.018);
}

.time-slot {
  height: 60px;

  border-bottom: 1px solid #eef0f2;
}

/* =========================
   BLOQUEOS SEMANA
========================= */

.calendar-block {
  position: absolute;

  left: 0;
  right: 0;

  z-index: 1;

  overflow: hidden;

  padding: 6px 8px;

  border-left: 3px solid #94a3b8;

  background: repeating-linear-gradient(
    -45deg,
    rgba(148, 163, 184, 0.14),
    rgba(148, 163, 184, 0.14) 6px,
    rgba(148, 163, 184, 0.07) 6px,
    rgba(148, 163, 184, 0.07) 12px
  );

  pointer-events: none;
}

.calendar-block--all-day {
  background: repeating-linear-gradient(
    -45deg,
    rgba(100, 116, 139, 0.16),
    rgba(100, 116, 139, 0.16) 6px,
    rgba(100, 116, 139, 0.08) 6px,
    rgba(100, 116, 139, 0.08) 12px
  );
}

.calendar-block__content {
  display: flex;
  align-items: center;
  gap: 5px;

  color: #64748b;

  font-size: 10px;
  font-weight: 600;
}

.calendar-block__reason {
  min-width: 0;
}

/* =========================
   EVENTOS
========================= */

.calendar-event {
  position: absolute;

  left: 4px;
  right: 4px;

  z-index: 2;

  padding: 6px 8px;

  overflow: hidden;

  border: 0;
  border-left: 3px solid;

  border-radius: 7px;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.calendar-event:hover {
  z-index: 3;

  transform: translateY(-1px);

  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.calendar-event__time {
  margin-bottom: 2px;

  font-size: 10px;
  font-weight: 600;
}

.calendar-event__customer {
  font-size: 12px;
  font-weight: 600;
}

.calendar-event__service {
  margin-top: 2px;

  font-size: 10px;

  opacity: 0.75;
}

/* =========================
   ESTADOS CITAS
========================= */

.calendar-event--pending {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
}

.calendar-event--confirmed {
  border-left-color: #22c55e;
  background: rgba(34, 197, 94, 0.12);
}

.calendar-event--in_progress {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}

.calendar-event--completed {
  border-left-color: #64748b;
  background: rgba(100, 116, 139, 0.12);
}

.calendar-event--cancelled {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
}

.calendar-event--no_show {
  border-left-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.12);
}

/* =========================
   HORA ACTUAL
========================= */

.current-time-line {
  position: absolute;

  top: 180px;
  left: 0;
  right: 0;

  z-index: 4;

  height: 2px;

  background: var(--q-negative);

  opacity: 0.5;
}

/* =========================
   MES
========================= */

.month-calendar {
  min-width: 720px;
}

.month-weekdays,
.month-grid {
  display: grid;

  grid-template-columns: repeat(7, 1fr);
}

.month-weekday {
  padding: 12px 8px;

  color: #777;

  font-size: 12px;
  font-weight: 600;

  text-align: center;
  text-transform: uppercase;

  border-bottom: 1px solid #e5e7eb;

  background: rgba(0, 0, 0, 0.015);
}

.month-day {
  min-height: 120px;

  padding: 8px;

  border: 0;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;

  background: transparent;

  text-align: left;

  cursor: pointer;

  transition: background 0.15s ease;
}

.month-day:hover {
  background: rgba(25, 118, 210, 0.035);
}

.month-day--outside {
  background: rgba(0, 0, 0, 0.018);
}

.month-day--today {
  background: rgba(25, 118, 210, 0.04);
}

.month-day--blocked {
  background: repeating-linear-gradient(
    -45deg,
    rgba(100, 116, 139, 0.035),
    rgba(100, 116, 139, 0.035) 6px,
    rgba(100, 116, 139, 0.015) 6px,
    rgba(100, 116, 139, 0.015) 12px
  );
}

.month-day__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 7px;
}

.month-day__number {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  color: #555;

  border-radius: 50%;

  font-size: 13px;
  font-weight: 600;
}

.month-day--outside .month-day__number {
  color: #aaa;
}

.month-day__number--today {
  color: white;

  background: var(--q-primary);
}

.month-day__indicators {
  display: flex;
  align-items: center;
  gap: 4px;
}

.month-day__count {
  padding: 2px 6px;

  color: var(--q-primary);

  border-radius: 10px;

  background: rgba(25, 118, 210, 0.1);

  font-size: 10px;
  font-weight: 600;
}

.month-day__block-indicator {
  display: inline-flex;
  align-items: center;
  gap: 2px;

  padding: 2px 5px;

  color: #64748b;

  border-radius: 10px;

  background: rgba(100, 116, 139, 0.1);

  font-size: 10px;
  font-weight: 600;
}

.month-event {
  display: flex;
  align-items: center;
  gap: 5px;

  width: 100%;

  margin-bottom: 4px;
  padding: 4px 6px;

  border-left: 3px solid;

  border-radius: 4px;

  font-size: 10px;

  cursor: pointer;
}

.month-event--pending {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.month-event--confirmed {
  border-left-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.month-event--in_progress {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.month-event--completed {
  border-left-color: #64748b;
  background: rgba(100, 116, 139, 0.1);
}

.month-event--cancelled {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.month-event--no_show {
  border-left-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.month-event__time {
  flex-shrink: 0;

  font-weight: 600;
}

.month-more {
  color: var(--q-primary);

  font-size: 10px;
  font-weight: 600;
}

/* =========================
   AGENDA
========================= */

.agenda-list {
  padding: 20px 24px;
}

.agenda-day {
  margin-bottom: 24px;
}

.agenda-day:last-child {
  margin-bottom: 0;
}

.agenda-day__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 14px;

  border-radius: 10px;

  background: rgba(0, 0, 0, 0.025);
}

.agenda-day__header--today {
  background: rgba(25, 118, 210, 0.07);
}

.agenda-day__appointments {
  margin-top: 8px;
}

/* =========================
   BLOQUEO AGENDA
========================= */

.agenda-block {
  display: flex;
  align-items: center;

  gap: 14px;

  min-height: 68px;

  margin-bottom: 8px;
  padding: 12px 14px;

  border: 1px dashed #cbd5e1;

  border-radius: 10px;

  background: repeating-linear-gradient(
    -45deg,
    rgba(100, 116, 139, 0.06),
    rgba(100, 116, 139, 0.06) 6px,
    rgba(100, 116, 139, 0.025) 6px,
    rgba(100, 116, 139, 0.025) 12px
  );
}

.agenda-block__indicator {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  flex-shrink: 0;

  color: #64748b;

  border-radius: 8px;

  background: rgba(100, 116, 139, 0.1);
}

.agenda-block__content {
  flex: 1;
  min-width: 0;
}

/* =========================
   EVENTO AGENDA
========================= */

.agenda-event {
  display: flex;
  align-items: center;

  gap: 16px;

  width: 100%;
  min-height: 76px;

  padding: 12px 14px;

  border: 1px solid #e8eaed;

  border-radius: 10px;

  margin-bottom: 8px;

  background: white;

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.agenda-event:hover {
  border-color: rgba(25, 118, 210, 0.35);

  background: rgba(25, 118, 210, 0.025);
}

.agenda-event__time {
  width: 64px;

  flex-shrink: 0;

  text-align: center;
}

.agenda-event__indicator {
  width: 4px;

  align-self: stretch;

  border-radius: 4px;

  background: var(--q-primary);
}

.agenda-event__content {
  flex: 1;

  min-width: 0;
}

.agenda-event__status {
  flex-shrink: 0;
}

/* =========================
   VACÍO
========================= */

.calendar-empty-state {
  min-height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {
  .calendar-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .calendar-toolbar__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .calendar-period {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .agenda-list {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .calendar-toolbar {
    padding: 16px;
  }

  .calendar-toolbar__actions {
    display: grid;

    grid-template-columns: 1fr 1fr 1fr;

    width: 100%;
  }

  .calendar-toolbar__actions .q-btn-toggle {
    grid-column: 1 / -1;

    width: 100%;
  }

  .agenda-event {
    gap: 10px;

    padding: 10px;
  }

  .agenda-event__time {
    width: 50px;
  }

  .agenda-event__status {
    display: none;
  }

  .agenda-block {
    gap: 10px;

    padding: 10px;
  }
}
</style>
