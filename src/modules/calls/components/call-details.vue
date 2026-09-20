<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="row items-center no-wrap">
          <q-avatar size="44px" color="grey-2" text-color="grey-8" class="q-mr-md">
            <q-icon
              :name="llamada?.direccion === 'entrante' ? 'call_received' : 'call_made'"
              size="22px"
            />
          </q-avatar>

          <div class="col">
            <div class="text-h6 text-weight-bold">Detalle de llamada</div>

            <div v-if="llamada" class="text-caption text-grey-6">
              {{ llamada.clienteNombre }}
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrar" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="llamada" class="modal-body">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <div class="detail-card__label">Cliente</div>

              <div class="detail-card__value">
                {{ llamada.clienteNombre }}
              </div>

              <div class="detail-card__secondary">
                {{ llamada.telefono }}
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="detail-card">
              <div class="detail-card__label">Dirección</div>

              <div class="detail-card__value row items-center">
                <q-icon
                  :name="llamada.direccion === 'entrante' ? 'call_received' : 'call_made'"
                  size="18px"
                  class="q-mr-sm"
                />

                {{ llamada.direccion === 'entrante' ? 'Llamada entrante' : 'Llamada saliente' }}
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="detail-card">
              <div class="detail-card__label">Estado</div>

              <div class="q-mt-sm">
                <q-badge outline :color="obtenerColorEstado(llamada.estado)">
                  <q-icon :name="obtenerIconoEstado(llamada.estado)" size="14px" class="q-mr-xs" />

                  {{ obtenerLabelEstado(llamada.estado) }}
                </q-badge>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="detail-card">
              <div class="detail-card__label">Duración</div>

              <div class="detail-card__value">
                {{ formatearDuracion(llamada.duracionSegundos) }}
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="detail-card">
              <div class="detail-card__label">Fecha y hora</div>

              <div class="detail-card__value">
                {{ formatearFecha(llamada.fechaHora) }}
              </div>

              <div class="detail-card__secondary">
                {{ formatearHora(llamada.fechaHora) }}
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="detail-card">
              <div class="detail-card__label">Resultado</div>

              <div class="detail-card__value">
                {{ llamada.resultado ? obtenerLabelResultado(llamada.resultado) : 'Sin resultado' }}
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="detail-card">
              <div class="detail-card__label">Notas</div>

              <div
                class="detail-card__notes"
                :class="{
                  'text-grey-5': !llamada.notas,
                }"
              >
                {{ llamada.notas || 'Sin notas registradas.' }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="modal-footer">
        <q-btn flat label="Cerrar" color="grey-7" @click="cerrar" />

        <q-btn
          unelevated
          label="Editar llamada"
          icon="edit"
          color="primary"
          :disable="!llamada"
          @click="editar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { EstadoLlamada, Llamada, ResultadoLlamada } from '../types/call.types';

const props = defineProps<{
  modelValue: boolean;
  llamada: Llamada | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [llamada: Llamada];
}>();

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const editar = (): void => {
  if (!props.llamada) {
    return;
  }

  emit('edit', props.llamada);
};

const formatearDuracion = (segundos: number): string => {
  if (segundos <= 0) {
    return 'Sin duración';
  }

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  if (minutos === 0) {
    return `${segundosRestantes}s`;
  }

  return `${minutos}m ${segundosRestantes.toString().padStart(2, '0')}s`;
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(fecha));
};

const formatearHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'short',
  }).format(new Date(fecha));
};

const obtenerLabelEstado = (estado: EstadoLlamada): string => {
  const labels: Record<EstadoLlamada, string> = {
    completada: 'Completada',
    perdida: 'Perdida',
    rechazada: 'Rechazada',
    'en-curso': 'En curso',
    programada: 'Programada',
  };

  return labels[estado];
};

const obtenerIconoEstado = (estado: EstadoLlamada): string => {
  const iconos: Record<EstadoLlamada, string> = {
    completada: 'check_circle',
    perdida: 'phone_missed',
    rechazada: 'call_end',
    'en-curso': 'phone_in_talk',
    programada: 'schedule',
  };

  return iconos[estado];
};

const obtenerColorEstado = (estado: EstadoLlamada): string => {
  const colores: Record<EstadoLlamada, string> = {
    completada: 'positive',
    perdida: 'warning',
    rechazada: 'negative',
    'en-curso': 'primary',
    programada: 'grey-7',
  };

  return colores[estado];
};

const obtenerLabelResultado = (resultado: ResultadoLlamada): string => {
  const labels: Record<ResultadoLlamada, string> = {
    'cita-agendada': 'Cita agendada',
    consulta: 'Consulta',
    seguimiento: 'Seguimiento',
    'sin-respuesta': 'Sin respuesta',
    otro: 'Otro',
  };

  return labels[resultado];
};
</script>

<style scoped>
.modal-card {
  width: min(720px, 95vw);
  max-width: 720px;
  border-radius: 16px;
}

.modal-header {
  padding: 20px 24px;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
}

.detail-card {
  height: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.detail-card__label {
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-card__value {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.detail-card__secondary {
  margin-top: 3px;
  color: #6b7280;
  font-size: 13px;
}

.detail-card__notes {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
