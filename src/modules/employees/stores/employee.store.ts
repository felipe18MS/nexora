import { defineStore } from 'pinia';

import { servicioEmpleados } from '../services/employee.service';

import type {
  CreateEmployeeRequest,
  Employee,
  EmployeeFilters,
  UpdateEmployeeRequest,
} from '../types/employee.types';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;
}

export const useEmployeeStore = defineStore('employees', {
  state: (): EmployeeState => ({
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null,
    filters: {},
  }),

  getters: {
    empleadosActivos: (state): Employee[] =>
      state.employees.filter((employee) => employee.isActive),

    empleadosInactivos: (state): Employee[] =>
      state.employees.filter((employee) => !employee.isActive),

    profesionales: (state): Employee[] =>
      state.employees.filter((employee) => employee.role === 'professional' && employee.isActive),

    cantidadEmpleados: (state): number => state.employees.length,

    cantidadEmpleadosActivos: (state): number =>
      state.employees.filter((employee) => employee.isActive).length,
  },

  actions: {
    async cargarEmpleados(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        this.employees = await servicioEmpleados.obtenerEmpleados(this.filters);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible cargar los empleados.';
      } finally {
        this.loading = false;
      }
    },

    async crearEmpleado(data: CreateEmployeeRequest): Promise<Employee | null> {
      this.loading = true;
      this.error = null;

      try {
        const employee = await servicioEmpleados.crearEmpleado(data);

        this.employees.unshift(employee);
        this.selectedEmployee = employee;

        return employee;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'No fue posible crear el empleado.';

        return null;
      } finally {
        this.loading = false;
      }
    },

    async actualizarEmpleado(id: string, data: UpdateEmployeeRequest): Promise<Employee | null> {
      this.loading = true;
      this.error = null;

      try {
        const employee = await servicioEmpleados.actualizarEmpleado(id, data);

        const index = this.employees.findIndex((item) => item.id === id);

        if (index !== -1) {
          this.employees[index] = employee;
        }

        this.selectedEmployee = employee;

        return employee;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible actualizar el empleado.';

        return null;
      } finally {
        this.loading = false;
      }
    },

    async eliminarEmpleado(id: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        await servicioEmpleados.eliminarEmpleado(id);

        this.employees = this.employees.filter((employee) => employee.id !== id);

        if (this.selectedEmployee?.id === id) {
          this.selectedEmployee = null;
        }

        return true;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'No fue posible eliminar el empleado.';

        return false;
      } finally {
        this.loading = false;
      }
    },

    seleccionarEmpleado(employee: Employee | null): void {
      this.selectedEmployee = employee;
    },

    establecerFiltros(filters: EmployeeFilters): void {
      this.filters = {
        ...this.filters,
        ...filters,
      };
    },

    limpiarFiltros(): void {
      this.filters = {};
    },

    limpiarError(): void {
      this.error = null;
    },
  },
});
