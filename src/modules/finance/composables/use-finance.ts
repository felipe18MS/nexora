import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useFinanceStore } from '../stores/finance.store';

import type {
  ActualizarMovimientoFinanciero,
  CrearMovimientoFinanciero,
  FiltrosFinanzas,
} from '../types/finance.types';

export const useFinance = () => {
  const financeStore = useFinanceStore();

  const { movimientos, movimientoSeleccionado, filtros, resumen, cargando, guardando } =
    storeToRefs(financeStore);

  const movimientosFiltrados = computed(() => financeStore.movimientosFiltrados);

  const hayFiltrosActivos = computed(() => financeStore.hayFiltrosActivos);

  const totalMovimientos = computed(() => financeStore.totalMovimientos);

  const cargarMovimientos = (): void => {
    financeStore.cargarMovimientos();
  };

  const establecerFiltros = (nuevosFiltros: Partial<FiltrosFinanzas>): void => {
    financeStore.establecerFiltros(nuevosFiltros);
  };

  const limpiarFiltros = (): void => {
    financeStore.limpiarFiltros();
  };

  const seleccionarMovimiento = (id: string) => {
    return financeStore.seleccionarMovimiento(id);
  };

  const limpiarSeleccion = (): void => {
    financeStore.limpiarSeleccion();
  };

  const crear = (datos: CrearMovimientoFinanciero) => {
    return financeStore.crear(datos);
  };

  const actualizar = (datos: ActualizarMovimientoFinanciero) => {
    return financeStore.actualizar(datos);
  };

  const anular = (id: string) => {
    return financeStore.anular(id);
  };

  const eliminar = (id: string): boolean => {
    return financeStore.eliminar(id);
  };

  return {
    movimientos,
    movimientoSeleccionado,
    filtros,
    resumen,
    cargando,
    guardando,
    movimientosFiltrados,
    hayFiltrosActivos,
    totalMovimientos,
    cargarMovimientos,
    establecerFiltros,
    limpiarFiltros,
    seleccionarMovimiento,
    limpiarSeleccion,
    crear,
    actualizar,
    anular,
    eliminar,
  };
};
