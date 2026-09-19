<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Empleados</div>

        <div class="text-grey-6">Administra los profesionales y colaboradores de tu negocio.</div>
      </div>

      <q-space />

      <q-btn color="primary" icon="person_add" label="Nuevo empleado" @click="abrirCrear" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Total empleados</div>

            <div class="text-h5 text-weight-bold">
              {{ cantidadEmpleados }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Activos</div>

            <div class="text-h5 text-weight-bold text-positive">
              {{ cantidadEmpleadosActivos }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-6">Profesionales</div>

            <div class="text-h5 text-weight-bold text-primary">
              {{ profesionales.length }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <EmployeeFilters :filters="filters" @update:filters="actualizarFiltros" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <EmployeeTable
          :employees="employees"
          :loading="loading"
          @ver="verEmpleado"
          @editar="editarEmpleado"
          @eliminar="solicitarEliminar"
        />
      </q-card-section>
    </q-card>

    <EmployeeForm
      v-model="mostrarFormulario"
      :employee="selectedEmployee"
      :loading="loading"
      @guardar="guardarEmpleado"
    />

    <q-dialog v-model="mostrarDetalles">
      <q-card style="width: 500px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Detalle del empleado</div>

          <q-space />

          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedEmployee">
          <div class="row items-center q-mb-lg">
            <q-avatar
              size="60px"
              :style="{
                backgroundColor: selectedEmployee.color || '#1976D2',
                color: '#fff',
              }"
            >
              {{ selectedEmployee.firstName.charAt(0) + selectedEmployee.lastName.charAt(0) }}
            </q-avatar>

            <div class="q-ml-md">
              <div class="text-h6">
                {{ selectedEmployee.firstName }}
                {{ selectedEmployee.lastName }}
              </div>

              <div class="text-grey-6">
                {{ selectedEmployee.specialty || 'Sin especialidad' }}
              </div>
            </div>
          </div>

          <div class="q-gutter-md">
            <div>
              <div class="text-caption text-grey-6">Rol</div>

              <div>
                {{ obtenerNombreRol(selectedEmployee.role) }}
              </div>
            </div>

            <div>
              <div class="text-caption text-grey-6">Teléfono</div>

              <div>
                {{ selectedEmployee.phone || 'No registrado' }}
              </div>
            </div>

            <div>
              <div class="text-caption text-grey-6">Correo</div>

              <div>
                {{ selectedEmployee.email || 'No registrado' }}
              </div>
            </div>

            <div>
              <div class="text-caption text-grey-6">Estado</div>

              <EmployeeStatusBadge :is-active="selectedEmployee.isActive" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <AppConfirmDialog
      v-model="mostrarConfirmacion"
      title="Eliminar empleado"
      message="¿Estás seguro de que deseas eliminar este empleado?"
      confirm-label="Eliminar"
      @confirm="confirmarEliminacion"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import EmployeeFilters from '../../modules/employees/components/employee-filters.vue';
import EmployeeForm from '../../modules/employees/components/employee-form.vue';
import EmployeeStatusBadge from '../../modules/employees/components/employee-status-badge.vue';
import EmployeeTable from '../../modules/employees/components/employee-table.vue';
import { useEmployees } from '../../modules/employees/composables/use-employees';

import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from '../../modules/employees/types/employee.types';

const {
  employees,
  selectedEmployee,
  loading,
  filters,
  profesionales,
  cantidadEmpleados,
  cantidadEmpleadosActivos,
  cargarEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  seleccionarEmpleado,
  establecerFiltros,
} = useEmployees();

const mostrarFormulario = ref(false);
const mostrarDetalles = ref(false);
const mostrarConfirmacion = ref(false);

const empleadoPendienteEliminar = ref<Employee | null>(null);

const actualizarFiltros = (nuevosFiltros: typeof filters.value): void => {
  establecerFiltros(nuevosFiltros);
  void cargarEmpleados();
};

const abrirCrear = (): void => {
  seleccionarEmpleado(null);
  mostrarFormulario.value = true;
};

const verEmpleado = (employee: Employee): void => {
  seleccionarEmpleado(employee);
  mostrarDetalles.value = true;
};

const editarEmpleado = (employee: Employee): void => {
  seleccionarEmpleado(employee);
  mostrarFormulario.value = true;
};

const guardarEmpleado = async (
  data: CreateEmployeeRequest | UpdateEmployeeRequest,
): Promise<void> => {
  if (selectedEmployee.value) {
    await actualizarEmpleado(selectedEmployee.value.id, data);
  } else {
    await crearEmpleado(data);
  }

  mostrarFormulario.value = false;
};

const solicitarEliminar = (employee: Employee): void => {
  empleadoPendienteEliminar.value = employee;
  mostrarConfirmacion.value = true;
};

const confirmarEliminacion = async (): Promise<void> => {
  if (!empleadoPendienteEliminar.value) return;

  await eliminarEmpleado(empleadoPendienteEliminar.value.id);

  empleadoPendienteEliminar.value = null;
  mostrarConfirmacion.value = false;
};

const obtenerNombreRol = (role: Employee['role']): string => {
  const roles: Record<Employee['role'], string> = {
    owner: 'Administrador',
    manager: 'Gerente',
    professional: 'Profesional',
    assistant: 'Asistente',
  };

  return roles[role] ?? 'Sin rol';
};

onMounted(() => {
  void cargarEmpleados();
});
</script>
