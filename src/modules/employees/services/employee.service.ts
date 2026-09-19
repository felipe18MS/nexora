import { empleadosIniciales } from '../mocks/employee.mock';

import type {
  CreateEmployeeRequest,
  Employee,
  EmployeeFilters,
  UpdateEmployeeRequest,
} from '../types/employee.types';

export interface ServicioEmpleados {
  obtenerEmpleados(filtros?: EmployeeFilters): Promise<Employee[]>;
  obtenerEmpleadoPorId(id: string): Promise<Employee>;
  crearEmpleado(data: CreateEmployeeRequest): Promise<Employee>;
  actualizarEmpleado(id: string, data: UpdateEmployeeRequest): Promise<Employee>;
  eliminarEmpleado(id: string): Promise<void>;
}

const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let empleadosMock: Employee[] = structuredClone(empleadosIniciales);

export const servicioEmpleados: ServicioEmpleados = {
  async obtenerEmpleados(filtros = {}): Promise<Employee[]> {
    await delay();

    const search = filtros.search?.trim().toLowerCase();

    return empleadosMock.filter((employee) => {
      const nombreCompleto = `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const coincideBusqueda =
        !search ||
        nombreCompleto.includes(search) ||
        employee.email?.toLowerCase().includes(search) ||
        employee.phone?.includes(search) ||
        employee.specialty?.toLowerCase().includes(search);

      const coincideRol = !filtros.role || employee.role === filtros.role;

      const coincideEstado =
        filtros.isActive === null ||
        filtros.isActive === undefined ||
        employee.isActive === filtros.isActive;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  },

  async obtenerEmpleadoPorId(id: string): Promise<Employee> {
    await delay();

    const employee = empleadosMock.find((item) => item.id === id);

    if (!employee) {
      throw new Error('Empleado no encontrado.');
    }

    return structuredClone(employee);
  },

  async crearEmpleado(data: CreateEmployeeRequest): Promise<Employee> {
    await delay();

    const ahora = new Date().toISOString();

    const nuevoEmpleado: Employee = {
      id: crypto.randomUUID(),
      tenantId: 'demo',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ?? null,
      phone: data.phone ?? null,
      documentNumber: data.documentNumber ?? null,
      role: data.role,
      specialty: data.specialty ?? null,
      color: data.color ?? null,
      isActive: true,
      serviceIds: data.serviceIds ?? [],
      createdAt: ahora,
      updatedAt: ahora,
    };

    empleadosMock.unshift(nuevoEmpleado);

    return structuredClone(nuevoEmpleado);
  },

  async actualizarEmpleado(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    await delay();

    const index = empleadosMock.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Empleado no encontrado.');
    }

    const actual = empleadosMock[index];

    if (!actual) {
      throw new Error('Empleado no encontrado.');
    }

    const actualizado: Employee = {
      ...actual,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ?? null,
      phone: data.phone ?? null,
      documentNumber: data.documentNumber ?? null,
      role: data.role,
      specialty: data.specialty ?? null,
      color: data.color ?? null,
      serviceIds: data.serviceIds ?? [],
      updatedAt: new Date().toISOString(),
    };

    empleadosMock[index] = actualizado;

    return structuredClone(actualizado);
  },

  async eliminarEmpleado(id: string): Promise<void> {
    await delay();

    const existe = empleadosMock.some((item) => item.id === id);

    if (!existe) {
      throw new Error('Empleado no encontrado.');
    }

    empleadosMock = empleadosMock.filter((item) => item.id !== id);
  },
};
