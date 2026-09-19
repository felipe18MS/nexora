import { defineStore } from 'pinia';

import type {
  AvailabilityBlock,
  AvailabilityBlockFilters,
  CreateAvailabilityBlockRequest,
  UpdateAvailabilityBlockRequest,
} from '../types/availability-block.types';

interface AvailabilityBlockState {
  blocks: AvailabilityBlock[];
  selectedBlock: AvailabilityBlock | null;
  loading: boolean;
  error: string | null;
  filters: AvailabilityBlockFilters;
}

const bloquesIniciales: AvailabilityBlock[] = [
  {
    id: 'block-1',
    date: '2026-09-20',
    startTime: null,
    endTime: null,
    isAllDay: true,
    reason: 'Día personal',
    notes: 'El negocio permanecerá cerrado durante todo el día.',
    employeeId: null,
    createdAt: '2026-09-10T10:00:00',
    updatedAt: '2026-09-10T10:00:00',
  },
  {
    id: 'block-2',
    date: '2026-09-22',
    startTime: '14:00',
    endTime: '18:00',
    isAllDay: false,
    reason: 'Motivos personales',
    notes: 'No recibir citas durante la tarde.',
    employeeId: null,
    createdAt: '2026-09-11T10:00:00',
    updatedAt: '2026-09-11T10:00:00',
  },
];

export const useAvailabilityBlockStore = defineStore('availability-blocks', {
  state: (): AvailabilityBlockState => ({
    blocks: structuredClone(bloquesIniciales),
    selectedBlock: null,
    loading: false,
    error: null,
    filters: {},
  }),

  getters: {
    cantidadBloqueos: (state): number => {
      return state.blocks.length;
    },

    bloqueosDiaCompleto: (state): AvailabilityBlock[] => {
      return state.blocks.filter((block) => block.isAllDay);
    },

    bloqueosParciales: (state): AvailabilityBlock[] => {
      return state.blocks.filter((block) => !block.isAllDay);
    },
  },

  actions: {
    cargarBloqueos(): void {
      this.loading = true;
      this.error = null;

      try {
        // Datos temporales mientras se conecta la API.
        this.blocks = structuredClone(bloquesIniciales);
      } catch {
        this.error = 'No fue posible cargar los bloqueos.';
      } finally {
        this.loading = false;
      }
    },

    crearBloqueo(data: CreateAvailabilityBlockRequest): void {
      this.loading = true;
      this.error = null;

      try {
        const ahora = new Date().toISOString();

        const nuevoBloqueo: AvailabilityBlock = {
          id: crypto.randomUUID(),
          date: data.date,
          startTime: data.isAllDay ? null : (data.startTime ?? null),
          endTime: data.isAllDay ? null : (data.endTime ?? null),
          isAllDay: data.isAllDay,
          reason: data.reason,
          notes: data.notes ?? null,
          employeeId: data.employeeId ?? null,
          createdAt: ahora,
          updatedAt: ahora,
        };

        this.blocks.push(nuevoBloqueo);
      } catch {
        this.error = 'No fue posible crear el bloqueo.';
      } finally {
        this.loading = false;
      }
    },

    actualizarBloqueo(id: string, data: UpdateAvailabilityBlockRequest): void {
      this.loading = true;
      this.error = null;

      try {
        const indice = this.blocks.findIndex((block) => block.id === id);

        if (indice === -1) {
          this.error = 'No fue posible encontrar el bloqueo.';
          return;
        }

        const bloqueoActual = this.blocks[indice];

        if (!bloqueoActual) {
          this.error = 'No fue posible encontrar el bloqueo.';
          return;
        }

        this.blocks[indice] = {
          ...bloqueoActual,
          date: data.date,
          startTime: data.isAllDay ? null : (data.startTime ?? null),
          endTime: data.isAllDay ? null : (data.endTime ?? null),
          isAllDay: data.isAllDay,
          reason: data.reason,
          notes: data.notes ?? null,
          employeeId: data.employeeId ?? null,
          updatedAt: new Date().toISOString(),
        };
      } catch {
        this.error = 'No fue posible actualizar el bloqueo.';
      } finally {
        this.loading = false;
      }
    },

    eliminarBloqueo(id: string): void {
      this.loading = true;
      this.error = null;

      try {
        const existe = this.blocks.some((block) => block.id === id);

        if (!existe) {
          this.error = 'No fue posible encontrar el bloqueo.';
          return;
        }

        this.blocks = this.blocks.filter((block) => block.id !== id);

        if (this.selectedBlock?.id === id) {
          this.selectedBlock = null;
        }
      } catch {
        this.error = 'No fue posible eliminar el bloqueo.';
      } finally {
        this.loading = false;
      }
    },

    seleccionarBloqueo(block: AvailabilityBlock | null): void {
      this.selectedBlock = block;
    },

    establecerFiltros(filters: AvailabilityBlockFilters): void {
      this.filters = filters;
    },

    limpiarFiltros(): void {
      this.filters = {};
    },

    limpiarError(): void {
      this.error = null;
    },
  },
});
