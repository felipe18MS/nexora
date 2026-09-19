<template>
  <q-dialog v-model="abierto">
    <q-card style="width: 650px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{ employee ? 'Editar empleado' : 'Nuevo empleado' }}
        </div>

        <q-space />

        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="guardar">
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.firstName"
                outlined
                label="Nombres"
                :rules="[(value) => !!value || 'Los nombres son obligatorios']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.lastName"
                outlined
                label="Apellidos"
                :rules="[(value) => !!value || 'Los apellidos son obligatorios']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.phone" outlined label="Teléfono" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.email" outlined type="email" label="Correo electrónico" />
            </div>
          </div>

          <q-input v-model="form.documentNumber" outlined label="Número de documento" />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.role"
                outlined
                emit-value
                map-options
                label="Rol"
                :options="roleOptions"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.specialty"
                outlined
                label="Especialidad"
                placeholder="Ej. Barbería"
              />
            </div>
          </div>

          <q-input v-model="form.color" outlined label="Color identificador" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancelar" />

          <q-btn type="submit" color="primary" label="Guardar" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from '../types/employee.types';

const props = defineProps<{
  modelValue: boolean;
  employee: Employee | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  guardar: [data: CreateEmployeeRequest | UpdateEmployeeRequest];
}>();

const abierto = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = reactive<CreateEmployeeRequest>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  documentNumber: '',
  role: 'professional',
  specialty: '',
  color: '#1976D2',
  serviceIds: [],
});

const roleOptions = [
  { label: 'Administrador', value: 'owner' },
  { label: 'Gerente', value: 'manager' },
  { label: 'Profesional', value: 'professional' },
  { label: 'Asistente', value: 'assistant' },
];

watch(
  () => props.employee,
  (employee) => {
    if (employee) {
      form.firstName = employee.firstName;
      form.lastName = employee.lastName;
      form.email = employee.email;
      form.phone = employee.phone;
      form.documentNumber = employee.documentNumber;
      form.role = employee.role;
      form.specialty = employee.specialty;
      form.color = employee.color;
      form.serviceIds = [...employee.serviceIds];

      return;
    }

    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.phone = '';
    form.documentNumber = '';
    form.role = 'professional';
    form.specialty = '';
    form.color = '#1976D2';
    form.serviceIds = [];
  },
  { immediate: true },
);
const guardar = (): void => {
  const data: CreateEmployeeRequest | UpdateEmployeeRequest = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email?.trim() || null,
    phone: form.phone?.trim() || null,
    documentNumber: form.documentNumber?.trim() || null,
    role: form.role,
    specialty: form.specialty?.trim() || null,

    ...(form.color !== undefined
      ? {
          color: form.color,
        }
      : {}),

    ...(form.serviceIds !== undefined
      ? {
          serviceIds: form.serviceIds,
        }
      : {}),
  };

  emit('guardar', data);
};
</script>
