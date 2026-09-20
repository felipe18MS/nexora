<template>
  <q-card flat bordered class="ai-config-form">
    <q-card-section class="ai-config-form__header">
      <div>
        <div class="ai-config-form__title">Configuración del agente</div>

        <div class="ai-config-form__subtitle">
          Define cómo debe comportarse el asistente y en qué canales puede atender.
        </div>
      </div>

      <q-icon name="tune" size="24px" color="primary" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="ai-config-form__content" @submit.prevent="guardar">
        <div class="ai-config-form__section">
          <div class="ai-config-form__section-title">Información general</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.nombre"
                outlined
                label="Nombre del agente"
                placeholder="Ej. Nexora Assistant"
                :rules="[(valor) => !!valor?.trim() || 'El nombre es obligatorio']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tono"
                outlined
                emit-value
                map-options
                label="Tono de comunicación"
                :options="opcionesTono"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="formulario.objetivo"
                outlined
                type="textarea"
                autogrow
                label="Objetivo del agente"
                placeholder="Describe qué debe lograr el agente."
                :rules="[(valor) => !!valor?.trim() || 'El objetivo es obligatorio']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="formulario.instrucciones"
                outlined
                type="textarea"
                autogrow
                label="Instrucciones"
                placeholder="Indica cómo debe comportarse el agente."
                :rules="[(valor) => !!valor?.trim() || 'Las instrucciones son obligatorias']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="formulario.saludoInicial"
                outlined
                type="textarea"
                autogrow
                label="Saludo inicial"
                placeholder="Mensaje que utilizará al iniciar una conversación."
                :rules="[(valor) => !!valor?.trim() || 'El saludo inicial es obligatorio']"
              />
            </div>
          </div>
        </div>

        <q-separator />

        <div class="ai-config-form__section">
          <div class="ai-config-form__section-title">Canales de atención</div>

          <div class="ai-config-form__options">
            <q-checkbox
              v-for="opcion in opcionesCanales"
              :key="opcion.value"
              v-model="formulario.canales"
              :val="opcion.value"
              :label="opcion.label"
            />
          </div>
        </div>

        <q-separator />

        <div class="ai-config-form__section">
          <div class="ai-config-form__section-title">Capacidades</div>

          <div class="ai-config-form__capabilities">
            <q-checkbox
              v-for="opcion in opcionesCapacidades"
              :key="opcion.value"
              v-model="formulario.capacidades"
              :val="opcion.value"
              :label="opcion.label"
            />
          </div>
        </div>

        <q-separator />

        <div class="ai-config-form__section">
          <div class="ai-config-form__section-title">Comportamiento cuando no puede responder</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.comportamientoFallback"
                outlined
                emit-value
                map-options
                label="Acción de fallback"
                :options="opcionesFallback"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="formulario.mensajeFallback"
                outlined
                type="textarea"
                autogrow
                label="Mensaje de fallback"
              />
            </div>
          </div>
        </div>

        <q-separator />

        <div class="ai-config-form__section">
          <div class="ai-config-form__section-title">Horarios de atención</div>

          <div class="ai-config-form__schedule">
            <div v-for="dia in diasSemana" :key="dia.key" class="ai-config-form__day">
              <div class="ai-config-form__day-name">
                {{ dia.label }}
              </div>

              <q-toggle
                v-model="formulario.horarios[dia.key].habilitado"
                :label="formulario.horarios[dia.key].habilitado ? 'Disponible' : 'No disponible'"
              />

              <div class="ai-config-form__hours">
                <q-input
                  v-model="formulario.horarios[dia.key].horaInicio"
                  outlined
                  dense
                  type="time"
                  label="Inicio"
                  :disable="!formulario.horarios[dia.key].habilitado"
                />

                <q-input
                  v-model="formulario.horarios[dia.key].horaFin"
                  outlined
                  dense
                  type="time"
                  label="Fin"
                  :disable="!formulario.horarios[dia.key].habilitado"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="ai-config-form__actions">
          <q-btn outline no-caps label="Restablecer" :disable="guardando" @click="restablecer" />

          <q-btn
            unelevated
            color="primary"
            no-caps
            type="submit"
            label="Guardar configuración"
            :loading="guardando"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

import type {
  AgenteIA,
  CanalAgenteIA,
  CapacidadAgenteIA,
  ComportamientoFallbackIA,
  ConfiguracionAgenteIA,
  TonoAgenteIA,
} from '../types/ai.types';

interface Props {
  agente: AgenteIA | null;
  guardando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  guardando: false,
});

const emit = defineEmits<{
  guardar: [configuracion: ConfiguracionAgenteIA];
}>();

const crearFormulario = (): ConfiguracionAgenteIA => {
  const configuracion = props.agente?.configuracion;

  if (!configuracion) {
    return {
      nombre: '',
      tono: 'amigable',
      objetivo: '',
      instrucciones: '',
      saludoInicial: '',
      comportamientoFallback: 'transferir-humano',
      mensajeFallback: '',
      canales: [],
      capacidades: [],
      horarios: {
        lunes: {
          habilitado: false,
          horaInicio: '08:00',
          horaFin: '18:00',
        },
        martes: {
          habilitado: false,
          horaInicio: '08:00',
          horaFin: '18:00',
        },
        miercoles: {
          habilitado: false,
          horaInicio: '08:00',
          horaFin: '18:00',
        },
        jueves: {
          habilitado: false,
          horaInicio: '08:00',
          horaFin: '18:00',
        },
        viernes: {
          habilitado: false,
          horaInicio: '08:00',
          horaFin: '18:00',
        },
        sabado: {
          habilitado: false,
          horaInicio: '09:00',
          horaFin: '14:00',
        },
        domingo: {
          habilitado: false,
          horaInicio: '09:00',
          horaFin: '14:00',
        },
      },
    };
  }

  return {
    ...configuracion,
    canales: [...configuracion.canales],
    capacidades: [...configuracion.capacidades],
    horarios: {
      lunes: {
        ...configuracion.horarios.lunes,
      },
      martes: {
        ...configuracion.horarios.martes,
      },
      miercoles: {
        ...configuracion.horarios.miercoles,
      },
      jueves: {
        ...configuracion.horarios.jueves,
      },
      viernes: {
        ...configuracion.horarios.viernes,
      },
      sabado: {
        ...configuracion.horarios.sabado,
      },
      domingo: {
        ...configuracion.horarios.domingo,
      },
    },
  };
};

const formulario = reactive<ConfiguracionAgenteIA>(crearFormulario());

const opcionesTono: Array<{
  label: string;
  value: TonoAgenteIA;
}> = [
  {
    label: 'Profesional',
    value: 'profesional',
  },
  {
    label: 'Amigable',
    value: 'amigable',
  },
  {
    label: 'Cercano',
    value: 'cercano',
  },
  {
    label: 'Formal',
    value: 'formal',
  },
  {
    label: 'Casual',
    value: 'casual',
  },
];

const opcionesCanales: Array<{
  label: string;
  value: CanalAgenteIA;
}> = [
  {
    label: 'WhatsApp',
    value: 'whatsapp',
  },
  {
    label: 'Llamadas',
    value: 'llamada',
  },
  {
    label: 'Sitio web',
    value: 'web',
  },
];

const opcionesCapacidades: Array<{
  label: string;
  value: CapacidadAgenteIA;
}> = [
  {
    label: 'Gestionar citas',
    value: 'gestionar-citas',
  },
  {
    label: 'Consultar servicios',
    value: 'consultar-servicios',
  },
  {
    label: 'Consultar horarios',
    value: 'consultar-horarios',
  },
  {
    label: 'Consultar precios',
    value: 'consultar-precios',
  },
  {
    label: 'Responder preguntas',
    value: 'responder-preguntas',
  },
  {
    label: 'Confirmar citas',
    value: 'confirmar-citas',
  },
  {
    label: 'Cancelar citas',
    value: 'cancelar-citas',
  },
  {
    label: 'Reprogramar citas',
    value: 'reprogramar-citas',
  },
  {
    label: 'Capturar clientes',
    value: 'capturar-clientes',
  },
  {
    label: 'Transferir a un humano',
    value: 'transferir-humano',
  },
];

const opcionesFallback: Array<{
  label: string;
  value: ComportamientoFallbackIA;
}> = [
  {
    label: 'Transferir a un humano',
    value: 'transferir-humano',
  },
  {
    label: 'Crear seguimiento',
    value: 'crear-seguimiento',
  },
  {
    label: 'Solicitar más información',
    value: 'solicitar-mas-informacion',
  },
  {
    label: 'Informar que no está disponible',
    value: 'informar-no-disponible',
  },
];

const diasSemana: Array<{
  key: keyof ConfiguracionAgenteIA['horarios'];
  label: string;
}> = [
  {
    key: 'lunes',
    label: 'Lunes',
  },
  {
    key: 'martes',
    label: 'Martes',
  },
  {
    key: 'miercoles',
    label: 'Miércoles',
  },
  {
    key: 'jueves',
    label: 'Jueves',
  },
  {
    key: 'viernes',
    label: 'Viernes',
  },
  {
    key: 'sabado',
    label: 'Sábado',
  },
  {
    key: 'domingo',
    label: 'Domingo',
  },
];

watch(
  () => props.agente?.configuracion,
  () => {
    Object.assign(formulario, crearFormulario());
  },
  {
    deep: true,
  },
);

const obtenerConfiguracion = (): ConfiguracionAgenteIA => {
  return {
    ...formulario,
    nombre: formulario.nombre.trim(),
    objetivo: formulario.objetivo.trim(),
    instrucciones: formulario.instrucciones.trim(),
    saludoInicial: formulario.saludoInicial.trim(),
    mensajeFallback: formulario.mensajeFallback.trim(),
    canales: [...formulario.canales],
    capacidades: [...formulario.capacidades],
    horarios: {
      lunes: {
        ...formulario.horarios.lunes,
      },
      martes: {
        ...formulario.horarios.martes,
      },
      miercoles: {
        ...formulario.horarios.miercoles,
      },
      jueves: {
        ...formulario.horarios.jueves,
      },
      viernes: {
        ...formulario.horarios.viernes,
      },
      sabado: {
        ...formulario.horarios.sabado,
      },
      domingo: {
        ...formulario.horarios.domingo,
      },
    },
  };
};

const guardar = (): void => {
  emit('guardar', obtenerConfiguracion());
};

const restablecer = (): void => {
  Object.assign(formulario, crearFormulario());
};
</script>

<style scoped>
.ai-config-form {
  border-radius: 16px;
  background: #ffffff;
}

.ai-config-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ai-config-form__title {
  color: var(--q-dark);
  font-size: 17px;
  font-weight: 700;
}

.ai-config-form__subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.ai-config-form__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ai-config-form__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-config-form__section-title {
  color: var(--q-dark);
  font-size: 14px;
  font-weight: 700;
}

.ai-config-form__options,
.ai-config-form__capabilities {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 16px;
}

.ai-config-form__schedule {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-config-form__day {
  display: grid;
  grid-template-columns: 120px 150px 1fr;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid #edf0f4;
  border-radius: 12px;
  background: #fafbfc;
}

.ai-config-form__day-name {
  color: var(--q-dark);
  font-size: 13px;
  font-weight: 600;
}

.ai-config-form__hours {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 180px));
  gap: 12px;
}

.ai-config-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}

@media (max-width: 900px) {
  .ai-config-form__options,
  .ai-config-form__capabilities {
    grid-template-columns: repeat(2, 1fr);
  }

  .ai-config-form__day {
    grid-template-columns: 1fr;
  }

  .ai-config-form__hours {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .ai-config-form__options,
  .ai-config-form__capabilities {
    grid-template-columns: 1fr;
  }

  .ai-config-form__hours {
    grid-template-columns: 1fr;
  }

  .ai-config-form__actions {
    flex-direction: column-reverse;
  }

  .ai-config-form__actions .q-btn {
    width: 100%;
  }
}
</style>
