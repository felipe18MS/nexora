<template>
  <q-table
    flat
    bordered
    :rows="customers"
    :columns="columns"
    :loading="loading"
    row-key="id"
    no-data-label="No hay clientes registrados"
    loading-label="Cargando clientes..."
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <div class="text-weight-medium">{{ props.row.firstName }} {{ props.row.lastName }}</div>

        <div class="text-caption text-grey-7">
          {{ props.row.phone }}
        </div>
      </q-td>
    </template>

    <template #body-cell-email="props">
      <q-td :props="props">
        {{ props.row.email || '—' }}
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge
          :color="props.row.isActive ? 'positive' : 'grey'"
          :label="props.row.isActive ? 'Activo' : 'Inactivo'"
        />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          dense
          icon="visibility"
          aria-label="Ver cliente"
          @click="emit('ver', props.row)"
        >
          <q-tooltip>Ver cliente</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          icon="edit"
          aria-label="Editar cliente"
          @click="emit('editar', props.row)"
        >
          <q-tooltip>Editar cliente</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          color="negative"
          icon="delete"
          aria-label="Eliminar cliente"
          @click="emit('eliminar', props.row)"
        >
          <q-tooltip>Eliminar cliente</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

import type { Customer } from '../types/customer.types';

interface Props {
  customers: Customer[];
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  ver: [cliente: Customer];
  editar: [cliente: Customer];
  eliminar: [cliente: Customer];
}>();

const columns: QTableColumn<Customer>[] = [
  {
    name: 'name',
    label: 'Cliente',
    field: 'firstName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Correo',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Teléfono',
    field: 'phone',
    align: 'left',
    sortable: true,
  },
  {
    name: 'city',
    label: 'Ciudad',
    field: 'city',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'isActive',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'id',
    align: 'right',
  },
];
</script>
