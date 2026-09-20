import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAiStore } from '../stores/ai.store';

import type { ActualizarAgenteIA, EstadoAgenteIA } from '../types/ai.types';

export const useAi = () => {
  const aiStore = useAiStore();

  const { agente, sesionPrueba, cargando, guardando, procesandoMensaje } = storeToRefs(aiStore);

  const agenteActivo = computed(() => aiStore.agenteActivo);

  const configuracionCompleta = computed(() => aiStore.configuracionCompleta);

  const conversacionesAtendidas = computed(() => aiStore.conversacionesAtendidas);

  const citasGestionadas = computed(() => aiStore.citasGestionadas);

  const capacidadesActivas = computed(() => aiStore.capacidadesActivas);

  const canalesActivos = computed(() => aiStore.canalesActivos);

  const mensajesPrueba = computed(() => aiStore.mensajesPrueba);

  const cargarAgente = (): void => {
    aiStore.cargarAgente();
  };

  const actualizar = (datos: ActualizarAgenteIA) => {
    return aiStore.actualizar(datos);
  };

  const cambiarEstado = (estado: EstadoAgenteIA) => {
    return aiStore.cambiarEstado(estado);
  };

  const enviarMensajePrueba = (contenido: string) => {
    return aiStore.enviarMensajePrueba(contenido);
  };

  const reiniciarPrueba = (): void => {
    aiStore.reiniciarPrueba();
  };

  return {
    agente,
    sesionPrueba,
    cargando,
    guardando,
    procesandoMensaje,
    agenteActivo,
    configuracionCompleta,
    conversacionesAtendidas,
    citasGestionadas,
    capacidadesActivas,
    canalesActivos,
    mensajesPrueba,
    cargarAgente,
    actualizar,
    cambiarEstado,
    enviarMensajePrueba,
    reiniciarPrueba,
  };
};
