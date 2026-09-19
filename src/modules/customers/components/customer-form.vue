<template>
  <q-dialog v-model="dialogoAbierto" persistent @hide="manejarCerrar">
    <q-card class="customer-form">
      <!-- Header -->
      <q-card-section class="customer-form__header">
        <div class="customer-form__identity">
          <div class="customer-form__avatar">
            <q-icon :name="modoEdicion ? 'edit' : 'person_add'" size="24px" />
          </div>

          <div>
            <div class="customer-form__title">
              {{ modoEdicion ? 'Editar cliente' : 'Nuevo cliente' }}
            </div>

            <div class="customer-form__subtitle">
              {{
                modoEdicion
                  ? 'Actualiza la información registrada del cliente.'
                  : 'Registra un nuevo cliente en NEXORA.'
              }}
            </div>
          </div>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Cerrar"
          class="customer-form__close"
          @click="cerrarFormulario"
        >
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-separator />

      <!-- Formulario -->
      <q-card-section class="customer-form__body">
        <q-form @submit.prevent="manejarGuardar">
          <!-- Información personal -->
          <div class="form-section">
            <div class="form-section__header">
              <div class="form-section__icon">
                <q-icon name="person_outline" />
              </div>

              <div>
                <div class="form-section__title">Información personal</div>

                <div class="form-section__description">Datos básicos del cliente.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.firstName"
                  outlined
                  label="Nombre"
                  :rules="[reglaRequerido]"
                  hide-bottom-space
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.lastName"
                  outlined
                  label="Apellido"
                  :rules="[reglaRequerido]"
                  hide-bottom-space
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.documentNumber"
                  outlined
                  label="Número de documento"
                  hide-bottom-space
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.phone"
                  outlined
                  label="Teléfono"
                  :rules="[reglaRequerido]"
                  hide-bottom-space
                >
                  <template #prepend>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="formulario.email"
                  outlined
                  type="email"
                  label="Correo electrónico"
                  hide-bottom-space
                >
                  <template #prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Ubicación -->
          <div class="form-section">
            <div class="form-section__header">
              <div class="form-section__icon">
                <q-icon name="location_on" />
              </div>

              <div>
                <div class="form-section__title">Ubicación</div>

                <div class="form-section__description">Información de contacto y ubicación.</div>
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.city" outlined label="Ciudad" hide-bottom-space />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.address"
                  outlined
                  label="Dirección"
                  hide-bottom-space
                />
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Notas -->
          <div class="form-section">
            <div class="form-section__header">
              <div class="form-section__icon">
                <q-icon name="notes" />
              </div>

              <div>
                <div class="form-section__title">Información adicional</div>

                <div class="form-section__description">
                  Agrega notas relevantes sobre este cliente.
                </div>
              </div>
            </div>

            <q-input
              v-model="formulario.notes"
              class="q-mt-md"
              outlined
              type="textarea"
              label="Notas"
              placeholder="Escribe alguna observación..."
              autogrow
              hide-bottom-space
            />
          </div>

          <!-- Footer -->
          <div class="customer-form__footer">
            <q-btn
              flat
              no-caps
              label="Cancelar"
              color="grey-7"
              :disable="guardando"
              @click="cerrarFormulario"
            />

            <q-btn
              unelevated
              no-caps
              color="primary"
              type="submit"
              :loading="guardando"
              :label="modoEdicion ? 'Guardar cambios' : 'Crear cliente'"
            >
              <template #loading>
                <q-spinner-dots />
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Confirmación de actualización -->
    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      titulo="Confirmar cambios"
      :mensaje="
        props.customer
          ? `¿Deseas guardar los cambios realizados en ${props.customer.firstName} ${props.customer.lastName}?`
          : '¿Deseas guardar los cambios realizados en este cliente?'
      "
      texto-confirmar="Actualizar"
      tipo="primary"
      :loading="guardando"
      @confirm="confirmarActualizacion"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

import AppConfirmDialog from '@/components/common/app-confirm-dialog.vue';

import { useCustomers } from '../composables/use-customers';

import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
} from '../types/customer.types';

interface Props {
  modelValue: boolean;
  customer: Customer | null;
}

interface FormularioCliente {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  address: string;
  city: string;
  notes: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [];
}>();

const { crearCliente, actualizarCliente, loading } = useCustomers();

const formulario = reactive<FormularioCliente>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  documentNumber: '',
  address: '',
  city: '',
  notes: '',
});

const mostrarConfirmacion = ref(false);

const guardando = computed(() => loading.value);

const dialogoAbierto = computed({
  get: () => props.modelValue,

  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

const modoEdicion = computed(() => {
  return props.customer !== null;
});

const reglaRequerido = (valor: string): true | string => {
  return valor.trim().length > 0 || 'Este campo es obligatorio';
};

const limpiarFormulario = (): void => {
  formulario.firstName = '';
  formulario.lastName = '';
  formulario.email = '';
  formulario.phone = '';
  formulario.documentNumber = '';
  formulario.address = '';
  formulario.city = '';
  formulario.notes = '';
};

const cargarClienteEnFormulario = (cliente: Customer): void => {
  formulario.firstName = cliente.firstName;
  formulario.lastName = cliente.lastName;
  formulario.email = cliente.email ?? '';
  formulario.phone = cliente.phone;
  formulario.documentNumber = cliente.documentNumber ?? '';
  formulario.address = cliente.address ?? '';
  formulario.city = cliente.city ?? '';
  formulario.notes = cliente.notes ?? '';
};

const construirDatosFormulario = (): CreateCustomerRequest | UpdateCustomerRequest => {
  const datosCliente: CreateCustomerRequest = {
    firstName: formulario.firstName.trim(),
    lastName: formulario.lastName.trim(),
    phone: formulario.phone.trim(),
  };

  if (formulario.email.trim()) {
    datosCliente.email = formulario.email.trim();
  }

  if (formulario.documentNumber.trim()) {
    datosCliente.documentNumber = formulario.documentNumber.trim();
  }

  if (formulario.address.trim()) {
    datosCliente.address = formulario.address.trim();
  }

  if (formulario.city.trim()) {
    datosCliente.city = formulario.city.trim();
  }

  if (formulario.notes.trim()) {
    datosCliente.notes = formulario.notes.trim();
  }

  return datosCliente;
};

const manejarGuardar = (): void => {
  if (modoEdicion.value) {
    mostrarConfirmacion.value = true;
    return;
  }

  const datosCliente = construirDatosFormulario();

  crearCliente(datosCliente);

  emit('saved');
  dialogoAbierto.value = false;
};

const confirmarActualizacion = (): void => {
  if (!props.customer) {
    return;
  }

  const datosCliente = construirDatosFormulario();

  actualizarCliente(props.customer.id, datosCliente);

  mostrarConfirmacion.value = false;
  dialogoAbierto.value = false;

  emit('saved');
};

const cerrarFormulario = (): void => {
  if (guardando.value) {
    return;
  }

  mostrarConfirmacion.value = false;
  dialogoAbierto.value = false;
};

const manejarCerrar = (): void => {
  mostrarConfirmacion.value = false;
  limpiarFormulario();
};

watch(
  () => props.customer,
  (cliente) => {
    if (cliente) {
      cargarClienteEnFormulario(cliente);
      return;
    }

    limpiarFormulario();
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="scss">
.customer-form {
  width: 760px;
  max-width: calc(100vw - 32px);
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.customer-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 26px;
}

.customer-form__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.customer-form__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: #eef2ff;
  color: var(--q-primary);
}

.customer-form__title {
  color: #172033;
  font-size: 18px;
  font-weight: 750;
  line-height: 1.3;
}

.customer-form__subtitle {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.customer-form__close {
  color: #94a3b8;
}

.customer-form__body {
  max-height: calc(90vh - 95px);
  overflow-y: auto;
  padding: 26px;
}

.form-section__header {
  display: flex;
  align-items: center;
  gap: 11px;
}

.form-section__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f8fafc;
  color: #64748b;
}

.form-section__title {
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.form-section__description {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
}

.customer-form :deep(.q-field--outlined .q-field__control) {
  border-radius: 10px;
}

.customer-form :deep(.q-field__label) {
  color: #64748b;
}

.customer-form :deep(.q-field--focused .q-field__control:before) {
  border-width: 2px;
}

.customer-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e8ebf0;
}

.customer-form__footer :deep(.q-btn) {
  min-width: 120px;
  border-radius: 9px;
}

@media (max-width: 700px) {
  .customer-form {
    width: 100%;
    max-width: calc(100vw - 20px);
    border-radius: 14px;
  }

  .customer-form__header {
    padding: 18px;
  }

  .customer-form__body {
    padding: 18px;
  }

  .customer-form__subtitle {
    max-width: 230px;
  }

  .customer-form__footer {
    flex-direction: column-reverse;
  }

  .customer-form__footer :deep(.q-btn) {
    width: 100%;
  }

  .customer-form__footer :deep(.q-btn) {
    width: 100%;
  }
}
</style>
