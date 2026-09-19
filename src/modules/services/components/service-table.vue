<template>
  <q-table
    flat
    bordered
    :rows="services"
    :columns="columns"
    row-key="id"
    :loading="loading"
    no-data-label="No hay servicios registrados"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <div
            v-if="props.row.color"
            class="service-color q-mr-sm"
            :style="{ backgroundColor: props.row.color }"
          />

          <div>
            <div class="text-weight-medium">
              {{ props.row.name }}
            </div>

            <div class="text-caption text-grey-6">
              {{ props.row.category || 'Sin categoría' }}
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-price="props">
      <q-td :props="props">
        {{ formatearPrecio(props.row.price) }}
      </q-td>
    </template>

    <template #body-cell-duration="props">
      <q-td :props="props"> {{ props.row.durationMinutes }} min </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <ServiceStatusBadge :is-active="props.row.isActive" />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round dense icon="visibility" color="primary" @click="$emit('ver', props.row)">
          <q-tooltip>Ver</q-tooltip>
        </q-btn>

        <q-btn flat round dense icon="edit" color="primary" @click="$emit('editar', props.row)">
          <q-tooltip>Editar</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          icon="delete"
          color="negative"
          @click="$emit('eliminar', props.row)"
        >
          <q-tooltip>Eliminar</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import ServiceStatusBadge from './service-status-badge.vue';

import type { Service } from '../types/service.types';

defineProps<{
  services: Service[];
  loading: boolean;
}>();

defineEmits<{
  ver: [service: Service];
  editar: [service: Service];
  eliminar: [service: Service];
}>();

const columns: QTableColumn<Service>[] = [
  {
    name: 'name',
    label: 'Servicio',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoría',
    field: 'category',
    align: 'left',
    sortable: true,
  },
  {
    name: 'duration',
    label: 'Duración',
    field: 'durationMinutes',
    align: 'left',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Precio',
    field: 'price',
    align: 'right',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'isActive',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'id',
    align: 'right',
  },
];

const formatearPrecio = (precio: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);
</script>

<style scoped>
.service-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
