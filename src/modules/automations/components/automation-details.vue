<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="row items-center no-wrap">
          <q-avatar size="44px" color="grey-2" text-color="grey-8" class="q-mr-md">
            <q-icon name="auto_awesome" size="22px" />
          </q-avatar>

          <div class="col">
            <div class="text-h6 text-weight-bold">Detalle de automatización</div>

            <div v-if="automatizacion" class="text-caption text-grey-6">
              {{ automatizacion.nombre }}
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrar" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="automatizacion" class="modal-body">
        <!-- Información general -->
        <div class="section-title">Información general</div>

        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-8">
            <div class="detail-card">
              <div class="detail-card__label">Nombre</div>

              <div class="detail-card__value">
                {{ automatizacion.nombre }}
              </div>

              <div class="detail-card__secondary">
                {{ automatizacion.descripcion }}
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="detail-card">
              <div class="detail-card__label">Estado</div>

              <div class="q-mt-sm">
                <q-badge outline :color="obtenerColorEstado(automatizacion.estado)">
                  <q-icon
                    :name="obtenerIconoEstado(automatizacion.estado)"
                    size="14px"
                    class="q-mr-xs"
                  />

                  {{ obtenerLabelEstado(automatizacion.estado) }}
                </q-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Flujo -->
        <div class="section-title">Flujo de automatización</div>

        <div class="flow">
          <!-- Disparador -->
          <div class="flow-step">
            <div class="flow-step__icon">
              <q-icon :name="obtenerIconoDisparador(automatizacion.disparador)" size="22px" />
            </div>

            <div class="flow-step__content">
              <div class="flow-step__label">Disparador</div>

              <div class="flow-step__title">
                {{ obtenerLabelDisparador(automatizacion.disparador) }}
              </div>
            </div>
          </div>

          <div class="flow-connector">
            <q-icon name="arrow_downward" size="20px" />
          </div>

          <!-- Condiciones -->
          <div class="flow-section">
            <div class="flow-section__header">
              <div class="flow-section__title">
                <q-icon name="filter_alt" size="18px" class="q-mr-sm" />
                Condiciones
              </div>

              <span class="text-caption text-grey-6">
                {{ automatizacion.condiciones.length }}
              </span>
            </div>

            <div v-if="automatizacion.condiciones.length" class="flow-list">
              <div
                v-for="condicion in automatizacion.condiciones"
                :key="condicion.id"
                class="flow-item"
              >
                <div class="flow-item__main">
                  <span class="flow-item__field">
                    {{ obtenerLabelCampo(condicion.campo) }}
                  </span>

                  <span class="flow-item__operator">
                    {{ obtenerLabelOperador(condicion.operador) }}
                  </span>

                  <span class="flow-item__value">
                    {{ condicion.valor }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="empty-message">Esta automatización no tiene condiciones.</div>
          </div>

          <div class="flow-connector">
            <q-icon name="arrow_downward" size="20px" />
          </div>

          <!-- Acciones -->
          <div class="flow-section">
            <div class="flow-section__header">
              <div class="flow-section__title">
                <q-icon name="bolt" size="18px" class="q-mr-sm" />
                Acciones
              </div>

              <span class="text-caption text-grey-6">
                {{ automatizacion.acciones.length }}
              </span>
            </div>

            <div v-if="automatizacion.acciones.length" class="flow-list">
              <div v-for="accion in automatizacion.acciones" :key="accion.id" class="flow-item">
                <div class="flow-item__icon">
                  <q-icon :name="obtenerIconoAccion(accion.tipo)" size="20px" />
                </div>

                <div class="flow-item__main">
                  <div class="flow-item__title">
                    {{ accion.nombre }}
                  </div>

                  <div class="flow-item__secondary">
                    {{ obtenerLabelAccion(accion.tipo) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-message">Esta automatización no tiene acciones.</div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="section-title q-mt-lg">Ejecuciones</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <div class="detail-card">
              <div class="detail-card__label">Total de ejecuciones</div>

              <div class="detail-card__value">
                {{ automatizacion.ejecuciones }}
              </div>
            </div>
          </div>

          <div class="col-12 col-sm-6">
            <div class="detail-card">
              <div class="detail-card__label">Última ejecución</div>

              <div class="detail-card__value">
                {{
                  automatizacion.ultimaEjecucion
                    ? formatearFecha(automatizacion.ultimaEjecucion)
                    : 'Nunca'
                }}
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
          label="Editar automatización"
          icon="edit"
          color="primary"
          :disable="!automatizacion"
          @click="editar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type {
  AccionAutomatizacion,
  Automatizacion,
  EstadoAutomatizacion,
  TipoAccionAutomatizacion,
  TipoDisparadorAutomatizacion,
} from '../types/automation.types';

const props = defineProps<{
  modelValue: boolean;
  automatizacion: Automatizacion | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [automatizacion: Automatizacion];
}>();

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const editar = (): void => {
  if (!props.automatizacion) {
    return;
  }

  emit('edit', props.automatizacion);
};

const obtenerLabelEstado = (estado: EstadoAutomatizacion): string => {
  const labels: Record<EstadoAutomatizacion, string> = {
    activa: 'Activa',
    inactiva: 'Inactiva',
    borrador: 'Borrador',
  };

  return labels[estado];
};

const obtenerIconoEstado = (estado: EstadoAutomatizacion): string => {
  const iconos: Record<EstadoAutomatizacion, string> = {
    activa: 'check_circle',
    inactiva: 'pause_circle',
    borrador: 'edit_note',
  };

  return iconos[estado];
};

const obtenerColorEstado = (estado: EstadoAutomatizacion): string => {
  const colores: Record<EstadoAutomatizacion, string> = {
    activa: 'positive',
    inactiva: 'grey-7',
    borrador: 'warning',
  };

  return colores[estado];
};

const obtenerLabelDisparador = (disparador: TipoDisparadorAutomatizacion): string => {
  const labels: Record<TipoDisparadorAutomatizacion, string> = {
    'cita-creada': 'Cita creada',
    'cita-confirmada': 'Cita confirmada',
    'cita-cancelada': 'Cita cancelada',
    recordatorio: 'Recordatorio',
    'cliente-creado': 'Cliente creado',
    'pago-pendiente': 'Pago pendiente',
    'mensaje-recibido': 'Mensaje recibido',
    'llamada-perdida': 'Llamada perdida',
    manual: 'Manual',
  };

  return labels[disparador];
};

const obtenerIconoDisparador = (disparador: TipoDisparadorAutomatizacion): string => {
  const iconos: Record<TipoDisparadorAutomatizacion, string> = {
    'cita-creada': 'event',
    'cita-confirmada': 'event_available',
    'cita-cancelada': 'event_busy',
    recordatorio: 'notifications_active',
    'cliente-creado': 'person_add',
    'pago-pendiente': 'payments',
    'mensaje-recibido': 'chat',
    'llamada-perdida': 'phone_missed',
    manual: 'touch_app',
  };

  return iconos[disparador];
};

const obtenerLabelCampo = (campo: string): string => {
  const labels: Record<string, string> = {
    tiempoAntesCita: 'Tiempo antes de la cita',
    canalContacto: 'Canal de contacto',
    clienteRegistrado: 'Cliente registrado',
    estadoCita: 'Estado de la cita',
    diasVencido: 'Días vencido',
  };

  return labels[campo] ?? campo;
};

const obtenerLabelOperador = (
  operador: 'igual' | 'diferente' | 'contiene' | 'mayor' | 'menor',
): string => {
  const labels = {
    igual: 'es igual a',
    diferente: 'es diferente de',
    contiene: 'contiene',
    mayor: 'es mayor que',
    menor: 'es menor que',
  };

  return labels[operador];
};

const obtenerLabelAccion = (tipo: TipoAccionAutomatizacion): string => {
  const labels: Record<TipoAccionAutomatizacion, string> = {
    'enviar-whatsapp': 'Enviar mensaje por WhatsApp',
    'enviar-email': 'Enviar correo electrónico',
    'crear-recordatorio': 'Crear recordatorio',
    'crear-tarea': 'Crear tarea',
    'actualizar-cita': 'Actualizar cita',
    'notificar-equipo': 'Notificar al equipo',
  };

  return labels[tipo];
};

const obtenerIconoAccion = (tipo: AccionAutomatizacion['tipo']): string => {
  const iconos: Record<TipoAccionAutomatizacion, string> = {
    'enviar-whatsapp': 'chat',
    'enviar-email': 'email',
    'crear-recordatorio': 'notifications_active',
    'crear-tarea': 'task_alt',
    'actualizar-cita': 'event',
    'notificar-equipo': 'groups',
  };

  return iconos[tipo];
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};
</script>

<style scoped>
.modal-card {
  width: min(760px, 95vw);
  max-width: 760px;
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

.section-title {
  margin-bottom: 12px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.flow {
  display: flex;
  flex-direction: column;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.flow-step__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #f3f4f6;
  color: #4b5563;
}

.flow-step__label {
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.flow-step__title {
  margin-top: 2px;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.flow-connector {
  display: flex;
  justify-content: center;
  padding: 7px 0;
  color: #9ca3af;
}

.flow-section {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.flow-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.flow-section__title {
  display: flex;
  align-items: center;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
}

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
}

.flow-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f3f4f6;
  color: #4b5563;
}

.flow-item__main {
  min-width: 0;
}

.flow-item__field,
.flow-item__operator,
.flow-item__value {
  font-size: 13px;
}

.flow-item__field {
  color: #374151;
  font-weight: 600;
}

.flow-item__operator {
  margin: 0 5px;
  color: #6b7280;
}

.flow-item__value {
  color: #111827;
  font-weight: 600;
}

.flow-item__title {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.flow-item__secondary {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.empty-message {
  color: #9ca3af;
  font-size: 13px;
}

@media (max-width: 600px) {
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .flow-item__main {
    overflow: hidden;
  }

  .flow-item__field,
  .flow-item__operator,
  .flow-item__value {
    font-size: 12px;
  }
}
</style>
