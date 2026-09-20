<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="row items-center no-wrap">
          <q-avatar size="44px" color="grey-2" text-color="grey-8" class="q-mr-md">
            <q-icon name="auto_awesome" size="22px" />
          </q-avatar>

          <div class="col">
            <div class="text-h6 text-weight-bold">
              {{ automatizacion ? 'Editar automatización' : 'Nueva automatización' }}
            </div>

            <div class="text-caption text-grey-6">
              Configura el disparador, las condiciones y las acciones.
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrar" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="modal-body">
        <!-- Información general -->
        <div class="section-title">Información general</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-input
              v-model="formulario.nombre"
              outlined
              label="Nombre"
              placeholder="Ej. Recordatorio de cita"
              :rules="[reglaRequerido]"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="formulario.estado"
              outlined
              emit-value
              map-options
              label="Estado"
              :options="opcionesEstado"
              :rules="[reglaSeleccion]"
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="formulario.descripcion"
              outlined
              type="textarea"
              autogrow
              label="Descripción"
              placeholder="Describe qué hace esta automatización..."
            />
          </div>
        </div>

        <!-- Disparador -->
        <div class="section-title q-mt-lg">Disparador</div>

        <div class="trigger-card">
          <div class="trigger-card__icon">
            <q-icon :name="obtenerIconoDisparador(formulario.disparador)" size="22px" />
          </div>

          <div class="trigger-card__content">
            <div class="trigger-card__label">Ejecutar cuando ocurra</div>

            <q-select
              v-model="formulario.disparador"
              outlined
              emit-value
              map-options
              :options="opcionesDisparador"
              :rules="[reglaSeleccion]"
            />
          </div>
        </div>

        <!-- Condiciones -->
        <div class="section-title q-mt-lg">
          <div class="row items-center justify-between">
            <span>Condiciones</span>

            <q-btn
              flat
              dense
              no-caps
              icon="add"
              label="Agregar condición"
              color="primary"
              @click="agregarCondicion"
            />
          </div>
        </div>

        <div v-if="formulario.condiciones.length" class="dynamic-list">
          <div
            v-for="(condicion, indice) in formulario.condiciones"
            :key="condicion.id"
            class="dynamic-card"
          >
            <div class="dynamic-card__header">
              <div class="text-weight-medium">Condición {{ indice + 1 }}</div>

              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                color="negative"
                @click="eliminarCondicion(indice)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="condicion.campo"
                  outlined
                  dense
                  label="Campo"
                  placeholder="Ej. estadoCita"
                  :rules="[reglaRequerido]"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="condicion.operador"
                  outlined
                  dense
                  emit-value
                  map-options
                  label="Operador"
                  :options="opcionesOperador"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="condicion.valor"
                  outlined
                  dense
                  label="Valor"
                  placeholder="Ej. completada"
                  :rules="[reglaRequerido]"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-card">
          <q-icon name="filter_alt" size="24px" color="grey-5" />

          <div>
            <div class="text-weight-medium text-grey-7">Sin condiciones</div>

            <div class="text-caption text-grey-5">
              La automatización se ejecutará cada vez que ocurra el disparador.
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="section-title q-mt-lg">
          <div class="row items-center justify-between">
            <span>Acciones</span>

            <q-btn
              flat
              dense
              no-caps
              icon="add"
              label="Agregar acción"
              color="primary"
              @click="agregarAccion"
            />
          </div>
        </div>

        <div v-if="formulario.acciones.length" class="dynamic-list">
          <div
            v-for="(accion, indice) in formulario.acciones"
            :key="accion.id"
            class="dynamic-card"
          >
            <div class="dynamic-card__header">
              <div class="text-weight-medium">Acción {{ indice + 1 }}</div>

              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                color="negative"
                @click="eliminarAccion(indice)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-5">
                <q-select
                  v-model="accion.tipo"
                  outlined
                  dense
                  emit-value
                  map-options
                  label="Tipo de acción"
                  :options="opcionesAccion"
                />
              </div>

              <div class="col-12 col-md-7">
                <q-input
                  v-model="accion.nombre"
                  outlined
                  dense
                  label="Nombre"
                  placeholder="Ej. Enviar recordatorio"
                  :rules="[reglaRequerido]"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="accion.configuracion.mensaje"
                  outlined
                  dense
                  type="textarea"
                  autogrow
                  label="Mensaje / configuración"
                  placeholder="Configura el contenido de la acción..."
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-card">
          <q-icon name="bolt" size="24px" color="grey-5" />

          <div>
            <div class="text-weight-medium text-grey-7">Sin acciones</div>

            <div class="text-caption text-grey-5">
              Agrega al menos una acción para definir qué hará la automatización.
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="modal-footer">
        <q-btn flat label="Cancelar" color="grey-7" @click="cerrar" />

        <q-btn
          unelevated
          color="primary"
          :label="automatizacion ? 'Guardar cambios' : 'Crear automatización'"
          :loading="guardando"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type {
  AccionAutomatizacion,
  Automatizacion,
  CondicionAutomatizacion,
  CrearAutomatizacion,
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
  save: [datos: CrearAutomatizacion];
  update: [
    datos: {
      id: string;
      nombre: string;
      descripcion: string;
      estado: EstadoAutomatizacion;
      disparador: TipoDisparadorAutomatizacion;
      condiciones: CondicionAutomatizacion[];
      acciones: AccionAutomatizacion[];
    },
  ];
}>();

const guardando = ref(false);

const crearCondicion = (): CondicionAutomatizacion => ({
  id: `cond-${Date.now()}-${Math.random()}`,
  campo: '',
  operador: 'igual',
  valor: '',
});

const crearAccion = (): AccionAutomatizacion => ({
  id: `accion-${Date.now()}-${Math.random()}`,
  tipo: 'enviar-whatsapp',
  nombre: '',
  configuracion: {
    mensaje: '',
  },
});

interface FormularioAutomatizacion {
  nombre: string;
  descripcion: string;
  estado: EstadoAutomatizacion;
  disparador: TipoDisparadorAutomatizacion;
  condiciones: CondicionAutomatizacion[];
  acciones: AccionAutomatizacion[];
}

const formulario = ref<FormularioAutomatizacion>({
  nombre: '',
  descripcion: '',
  estado: 'borrador',
  disparador: 'cita-creada',
  condiciones: [],
  acciones: [],
});

const opcionesEstado: Array<{
  label: string;
  value: EstadoAutomatizacion;
}> = [
  {
    label: 'Activa',
    value: 'activa',
  },
  {
    label: 'Inactiva',
    value: 'inactiva',
  },
  {
    label: 'Borrador',
    value: 'borrador',
  },
];

const opcionesDisparador: Array<{
  label: string;
  value: TipoDisparadorAutomatizacion;
}> = [
  {
    label: 'Cita creada',
    value: 'cita-creada',
  },
  {
    label: 'Cita confirmada',
    value: 'cita-confirmada',
  },
  {
    label: 'Cita cancelada',
    value: 'cita-cancelada',
  },
  {
    label: 'Recordatorio',
    value: 'recordatorio',
  },
  {
    label: 'Cliente creado',
    value: 'cliente-creado',
  },
  {
    label: 'Pago pendiente',
    value: 'pago-pendiente',
  },
  {
    label: 'Mensaje recibido',
    value: 'mensaje-recibido',
  },
  {
    label: 'Llamada perdida',
    value: 'llamada-perdida',
  },
  {
    label: 'Manual',
    value: 'manual',
  },
];

const opcionesOperador = [
  {
    label: 'Es igual a',
    value: 'igual',
  },
  {
    label: 'Es diferente de',
    value: 'diferente',
  },
  {
    label: 'Contiene',
    value: 'contiene',
  },
  {
    label: 'Es mayor que',
    value: 'mayor',
  },
  {
    label: 'Es menor que',
    value: 'menor',
  },
];

const opcionesAccion: Array<{
  label: string;
  value: TipoAccionAutomatizacion;
}> = [
  {
    label: 'Enviar WhatsApp',
    value: 'enviar-whatsapp',
  },
  {
    label: 'Enviar email',
    value: 'enviar-email',
  },
  {
    label: 'Crear recordatorio',
    value: 'crear-recordatorio',
  },
  {
    label: 'Crear tarea',
    value: 'crear-tarea',
  },
  {
    label: 'Actualizar cita',
    value: 'actualizar-cita',
  },
  {
    label: 'Notificar al equipo',
    value: 'notificar-equipo',
  },
];

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 ? true : 'Este campo es obligatorio';
};

const reglaSeleccion = (valor: unknown): true | string => {
  return valor !== null && valor !== undefined && valor !== '' ? true : 'Selecciona una opción';
};

const reiniciarFormulario = (): void => {
  formulario.value = {
    nombre: '',
    descripcion: '',
    estado: 'borrador',
    disparador: 'cita-creada',
    condiciones: [],
    acciones: [],
  };
};

const cargarAutomatizacion = (automatizacion: Automatizacion): void => {
  formulario.value = {
    nombre: automatizacion.nombre,
    descripcion: automatizacion.descripcion,
    estado: automatizacion.estado,
    disparador: automatizacion.disparador,
    condiciones: automatizacion.condiciones.map((condicion) => ({
      ...condicion,
    })),
    acciones: automatizacion.acciones.map((accion) => ({
      ...accion,
      configuracion: {
        ...accion.configuracion,
      },
    })),
  };
};

watch(
  () => props.automatizacion,
  (automatizacion) => {
    if (automatizacion) {
      cargarAutomatizacion(automatizacion);
      return;
    }

    reiniciarFormulario();
  },
  { immediate: true },
);

const agregarCondicion = (): void => {
  formulario.value.condiciones.push(crearCondicion());
};

const eliminarCondicion = (indice: number): void => {
  formulario.value.condiciones.splice(indice, 1);
};

const agregarAccion = (): void => {
  formulario.value.acciones.push(crearAccion());
};

const eliminarAccion = (indice: number): void => {
  formulario.value.acciones.splice(indice, 1);
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

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const guardar = (): void => {
  if (!formulario.value.nombre.trim() || !formulario.value.disparador) {
    return;
  }

  guardando.value = true;

  const datos = {
    nombre: formulario.value.nombre.trim(),
    descripcion: formulario.value.descripcion.trim(),
    estado: formulario.value.estado,
    disparador: formulario.value.disparador,
    condiciones: formulario.value.condiciones,
    acciones: formulario.value.acciones,
  };

  if (props.automatizacion) {
    emit('update', {
      id: props.automatizacion.id,
      ...datos,
    });
  } else {
    emit('save', datos);
  }

  guardando.value = false;
};
</script>

<style scoped>
.modal-card {
  width: min(820px, 95vw);
  max-width: 820px;
  border-radius: 16px;
}

.modal-header {
  padding: 20px 24px;
}

.modal-body {
  max-height: 75vh;
  overflow-y: auto;
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

.trigger-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.trigger-card__icon {
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

.trigger-card__content {
  flex: 1;
  min-width: 0;
}

.trigger-card__label {
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}

.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dynamic-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.dynamic-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.empty-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
}

@media (max-width: 600px) {
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .trigger-card {
    align-items: flex-start;
  }

  .modal-body {
    max-height: 78vh;
  }
}
</style>
