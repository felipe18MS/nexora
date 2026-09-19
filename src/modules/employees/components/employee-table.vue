<template>
  <q-table
    flat
    bordered
    :rows="employees"
    :columns="columns"
    row-key="id"
    :loading="loading"
    no-data-label="No hay empleados registrados"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar
            size="36px"
            :style="{
              backgroundColor: props.row.color || '#1976D2',
              color: '#fff',
            }"
            class="q-mr-sm"
          >
            {{ obtenerIniciales(props.row) }}
          </q-avatar>

          <div>
            <div class="text-weight-medium">{{ props.row.firstName }} {{ props.row.lastName }}</div>

            <div class="text-caption text-grey-6">
              {{ props.row.specialty || 'Sin especialidad' }}
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-role="props">
      <q-td :props="props">
        {{ obtenerNombreRol(props.row.role) }}
      </q-td>
    </template>

    <template #body-cell-contact="props">
      <q-td :props="props">
        <div>{{ props.row.phone || 'Sin teléfono' }}</div>
        <div class="text-caption text-grey-6">
          {{ props.row.email || 'Sin correo' }}
        </div>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <EmployeeStatusBadge :is-active="props.row.isActive" />
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

import EmployeeStatusBadge from './employee-status-badge.vue';

import type { Employee } from '../types/employee.types';

defineProps<{
  employees: Employee[];
  loading: boolean;
}>();

defineEmits<{
  ver: [employee: Employee];
  editar: [employee: Employee];
  eliminar: [employee: Employee];
}>();

const columns: QTableColumn<Employee>[] = [
  {
    name: 'name',
    label: 'Empleado',
    field: 'firstName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Rol',
    field: 'role',
    align: 'left',
  },
  {
    name: 'contact',
    label: 'Contacto',
    field: 'phone',
    align: 'left',
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

const obtenerIniciales = (employee: Employee): string =>
  `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

const obtenerNombreRol = (role: Employee['role']): string => {
  const roles: Record<Employee['role'], string> = {
    owner: 'Administrador',
    manager: 'Gerente',
    professional: 'Profesional',
    assistant: 'Asistente',
  };

  return roles[role];
};
</script>
