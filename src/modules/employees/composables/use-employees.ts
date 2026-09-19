import { storeToRefs } from 'pinia';

import { useEmployeeStore } from '../stores/employee.store';

import type {
  CreateEmployeeRequest,
  Employee,
  EmployeeFilters,
  UpdateEmployeeRequest,
} from '../types/employee.types';

export function useEmployees() {
  const employeeStore = useEmployeeStore();

  const {
    employees,
    selectedEmployee,
    loading,
    error,
    filters,
    empleadosActivos,
    empleadosInactivos,
    profesionales,
    cantidadEmpleados,
    cantidadEmpleadosActivos,
  } = storeToRefs(employeeStore);

  const cargarEmpleados = (): Promise<void> => employeeStore.cargarEmpleados();

  const crearEmpleado = (data: CreateEmployeeRequest): Promise<Employee | null> =>
    employeeStore.crearEmpleado(data);

  const actualizarEmpleado = (id: string, data: UpdateEmployeeRequest): Promise<Employee | null> =>
    employeeStore.actualizarEmpleado(id, data);

  const eliminarEmpleado = (id: string): Promise<boolean> => employeeStore.eliminarEmpleado(id);

  const seleccionarEmpleado = (employee: Employee | null): void => {
    employeeStore.seleccionarEmpleado(employee);
  };

  const establecerFiltros = (newFilters: EmployeeFilters): void => {
    employeeStore.establecerFiltros(newFilters);
  };

  const limpiarFiltros = (): void => {
    employeeStore.limpiarFiltros();
  };

  const limpiarError = (): void => {
    employeeStore.limpiarError();
  };

  return {
    employees,
    selectedEmployee,
    loading,
    error,
    filters,
    empleadosActivos,
    empleadosInactivos,
    profesionales,
    cantidadEmpleados,
    cantidadEmpleadosActivos,

    cargarEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    seleccionarEmpleado,
    establecerFiltros,
    limpiarFiltros,
    limpiarError,
  };
}
