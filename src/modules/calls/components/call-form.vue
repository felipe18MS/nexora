<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="row items-center no-wrap">
          <q-avatar size="44px" color="grey-2" text-color="grey-8" class="q-mr-md">
            <q-icon name="phone" size="22px" />
          </q-avatar>

          <div class="col">
            <div class="text-h6 text-weight-bold">
              {{ llamada ? 'Editar llamada' : 'Registrar llamada' }}
            </div>

            <div class="text-caption text-grey-6">
              {{
                llamada
                  ? 'Actualiza la información de la llamada.'
                  : 'Registra una llamada realizada o recibida.'
              }}
            </div>
          </div>

          <q-btn flat round dense icon="close" color="grey-7" @click="cerrar" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="modal-body">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="formulario.clienteNombre"
              outlined
              label="Cliente"
              :rules="[reglaRequerido]"
            >
              <template #prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="formulario.telefono"
              outlined
              label="Teléfono"
              :rules="[reglaRequerido]"
            >
              <template #prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="formulario.direccion"
              outlined
              emit-value
              map-options
              label="Dirección"
              :options="opcionesDireccion"
              :rules="[reglaSeleccion]"
            />
          </div>

          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
            <q-input
              v-model="formulario.fechaHora"
              outlined
              type="datetime-local"
              label="Fecha y hora"
              stack-label
              :rules="[reglaRequerido]"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model.number="formulario.duracionSegundos"
              outlined
              type="number"
              min="0"
              label="Duración (segundos)"
            />
          </div>

          <div class="col-12">
            <q-select
              v-model="formulario.resultado"
              outlined
              clearable
              emit-value
              map-options
              label="Resultado"
              :options="opcionesResultado"
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="formulario.notas"
              outlined
              type="textarea"
              autogrow
              label="Notas"
              placeholder="Agrega información adicional sobre la llamada..."
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="modal-footer">
        <q-btn flat label="Cancelar" color="grey-7" @click="cerrar" />

        <q-btn
          unelevated
          color="primary"
          :label="llamada ? 'Guardar cambios' : 'Registrar llamada'"
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
  CrearLlamada,
  DireccionLlamada,
  EstadoLlamada,
  Llamada,
  ResultadoLlamada,
} from '../types/call.types';

const props = defineProps<{
  modelValue: boolean;
  llamada: Llamada | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [datos: CrearLlamada];
  update: [
    datos: {
      id: string;
      estado: EstadoLlamada;
      resultado?: ResultadoLlamada;
      notas: string;
    },
  ];
}>();

const guardando = ref(false);

const formulario = ref<{
  clienteNombre: string;
  telefono: string;
  direccion: DireccionLlamada;
  estado: EstadoLlamada;
  fechaHora: string;
  duracionSegundos: number;
  resultado: ResultadoLlamada | null;
  notas: string;
}>({
  clienteNombre: '',
  telefono: '',
  direccion: 'entrante',
  estado: 'completada',
  fechaHora: '',
  duracionSegundos: 0,
  resultado: null,
  notas: '',
});

const opcionesDireccion: Array<{
  label: string;
  value: DireccionLlamada;
}> = [
  {
    label: 'Entrante',
    value: 'entrante',
  },
  {
    label: 'Saliente',
    value: 'saliente',
  },
];

const opcionesEstado: Array<{
  label: string;
  value: EstadoLlamada;
}> = [
  {
    label: 'Completada',
    value: 'completada',
  },
  {
    label: 'Perdida',
    value: 'perdida',
  },
  {
    label: 'Rechazada',
    value: 'rechazada',
  },
  {
    label: 'En curso',
    value: 'en-curso',
  },
  {
    label: 'Programada',
    value: 'programada',
  },
];

const opcionesResultado: Array<{
  label: string;
  value: ResultadoLlamada;
}> = [
  {
    label: 'Cita agendada',
    value: 'cita-agendada',
  },
  {
    label: 'Consulta',
    value: 'consulta',
  },
  {
    label: 'Seguimiento',
    value: 'seguimiento',
  },
  {
    label: 'Sin respuesta',
    value: 'sin-respuesta',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 ? true : 'Este campo es obligatorio';
};

const reglaSeleccion = (valor: unknown): true | string => {
  return valor !== null && valor !== undefined && valor !== '' ? true : 'Selecciona una opción';
};

const convertirFechaParaInput = (fecha: string): string => {
  const fechaLocal = new Date(fecha);

  if (Number.isNaN(fechaLocal.getTime())) {
    return '';
  }

  const offset = fechaLocal.getTimezoneOffset() * 60000;

  return new Date(fechaLocal.getTime() - offset).toISOString().slice(0, 16);
};

const reiniciarFormulario = (): void => {
  formulario.value = {
    clienteNombre: '',
    telefono: '',
    direccion: 'entrante',
    estado: 'completada',
    fechaHora: '',
    duracionSegundos: 0,
    resultado: null,
    notas: '',
  };
};

const cargarLlamada = (llamada: Llamada): void => {
  formulario.value = {
    clienteNombre: llamada.clienteNombre,
    telefono: llamada.telefono,
    direccion: llamada.direccion,
    estado: llamada.estado,
    fechaHora: convertirFechaParaInput(llamada.fechaHora),
    duracionSegundos: llamada.duracionSegundos,
    resultado: llamada.resultado ?? null,
    notas: llamada.notas,
  };
};

watch(
  () => props.llamada,
  (llamada) => {
    if (llamada) {
      cargarLlamada(llamada);
      return;
    }

    reiniciarFormulario();
  },
  { immediate: true },
);

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const guardar = (): void => {
  if (
    !formulario.value.clienteNombre.trim() ||
    !formulario.value.telefono.trim() ||
    !formulario.value.fechaHora
  ) {
    return;
  }

  guardando.value = true;

  if (props.llamada) {
    emit('update', {
      id: props.llamada.id,
      estado: formulario.value.estado,
      ...(formulario.value.resultado
        ? {
            resultado: formulario.value.resultado,
          }
        : {}),
      notas: formulario.value.notas.trim(),
    });
  } else {
    const datos: CrearLlamada = {
      clienteId: `cli-${Date.now()}`,
      clienteNombre: formulario.value.clienteNombre.trim(),
      telefono: formulario.value.telefono.trim(),
      direccion: formulario.value.direccion,
      estado: formulario.value.estado,
      duracionSegundos: Math.max(0, Number(formulario.value.duracionSegundos) || 0),
      fechaHora: new Date(formulario.value.fechaHora).toISOString(),
      ...(formulario.value.resultado
        ? {
            resultado: formulario.value.resultado,
          }
        : {}),
      notas: formulario.value.notas.trim(),
    };

    emit('save', datos);
  }

  guardando.value = false;
};
</script>

<style scoped>
.modal-card {
  width: min(680px, 95vw);
  max-width: 680px;
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

@media (max-width: 600px) {
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
