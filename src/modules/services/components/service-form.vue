<template>
  <q-dialog v-model="abierto">
    <q-card style="width: 600px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{ service ? 'Editar servicio' : 'Nuevo servicio' }}
        </div>

        <q-space />

        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="guardar">
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="form.name"
            outlined
            label="Nombre"
            :rules="[(value) => !!value || 'El nombre es obligatorio']"
          />

          <q-input
            v-model="form.description"
            outlined
            type="textarea"
            label="Descripción"
            autogrow
          />

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                v-model.number="form.durationMinutes"
                outlined
                type="number"
                min="5"
                label="Duración (minutos)"
                :rules="[(value) => value > 0 || 'Debe ser mayor que 0']"
              />
            </div>

            <div class="col-6">
              <q-input
                v-model.number="form.price"
                outlined
                type="number"
                min="0"
                label="Precio"
                prefix="$"
              />
            </div>
          </div>

          <q-select
            v-model="form.category"
            outlined
            clearable
            label="Categoría"
            :options="categoryOptions"
          />

          <q-input v-model="form.color" outlined label="Color">
            <template #append>
              <q-icon name="palette" />
            </template>
          </q-input>
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

import type { CreateServiceRequest, Service, UpdateServiceRequest } from '../types/service.types';

const props = defineProps<{
  modelValue: boolean;
  service: Service | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  guardar: [data: CreateServiceRequest | UpdateServiceRequest];
}>();

const abierto = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = reactive<CreateServiceRequest>({
  name: '',
  description: '',
  durationMinutes: 30,
  price: 0,
  category: null,
  color: '#1976D2',
  employeeIds: [],
});

const categoryOptions = ['Cabello', 'Uñas', 'Barbería', 'Bienestar', 'Estética'];

watch(
  () => props.service,
  (service) => {
    if (service) {
      form.name = service.name;
      form.description = service.description;
      form.durationMinutes = service.durationMinutes;
      form.price = service.price;
      form.category = service.category;
      form.color = service.color;
      form.employeeIds = [...service.employeeIds];
      return;
    }

    form.name = '';
    form.description = '';
    form.durationMinutes = 30;
    form.price = 0;
    form.category = null;
    form.color = '#1976D2';
    form.employeeIds = [];
  },
  { immediate: true },
);

const guardar = (): void => {
  const data: CreateServiceRequest | UpdateServiceRequest = {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    durationMinutes: Number(form.durationMinutes),
    price: Number(form.price),

    ...(form.category !== undefined ? { category: form.category } : {}),

    ...(form.color !== undefined ? { color: form.color } : {}),

    ...(form.employeeIds !== undefined ? { employeeIds: form.employeeIds } : {}),
  };

  emit('guardar', data);
};
</script>
