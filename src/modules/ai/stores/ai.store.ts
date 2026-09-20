import { defineStore } from 'pinia';

import {
  actualizarAgenteIA,
  cambiarEstadoAgenteIA,
  enviarMensajePruebaIA,
  obtenerAgenteIA,
  obtenerSesionPruebaIA,
  reiniciarSesionPruebaIA,
} from '../services/ai.service';

import type {
  AgenteIA,
  ActualizarAgenteIA,
  MensajePruebaIA,
  SesionPruebaIA,
} from '../types/ai.types';

interface AiState {
  agente: AgenteIA | null;
  sesionPrueba: SesionPruebaIA | null;
  cargando: boolean;
  guardando: boolean;
  procesandoMensaje: boolean;
}

export const useAiStore = defineStore('ai', {
  state: (): AiState => ({
    agente: null,
    sesionPrueba: null,
    cargando: false,
    guardando: false,
    procesandoMensaje: false,
  }),

  getters: {
    agenteActivo: (state): boolean => {
      return state.agente?.estado === 'activo';
    },

    configuracionCompleta: (state): boolean => {
      return state.agente !== null && state.agente.estado !== 'configuracion-incompleta';
    },

    conversacionesAtendidas: (state): number => {
      return state.agente?.conversacionesAtendidas ?? 0;
    },

    citasGestionadas: (state): number => {
      return state.agente?.citasGestionadas ?? 0;
    },

    capacidadesActivas: (state): number => {
      return state.agente?.configuracion.capacidades.length ?? 0;
    },

    canalesActivos: (state): number => {
      return state.agente?.configuracion.canales.length ?? 0;
    },

    mensajesPrueba: (state): MensajePruebaIA[] => {
      return state.sesionPrueba?.mensajes ?? [];
    },
  },

  actions: {
    cargarAgente(): void {
      this.cargando = true;

      this.agente = obtenerAgenteIA();
      this.sesionPrueba = obtenerSesionPruebaIA();

      this.cargando = false;
    },

    actualizar(datos: ActualizarAgenteIA): AgenteIA {
      this.guardando = true;

      const agente = actualizarAgenteIA(datos);

      this.agente = agente;
      this.guardando = false;

      return agente;
    },

    cambiarEstado(estado: AgenteIA['estado']): AgenteIA {
      this.guardando = true;

      const agente = cambiarEstadoAgenteIA(estado);

      this.agente = agente;
      this.guardando = false;

      return agente;
    },

    enviarMensajePrueba(contenido: string): MensajePruebaIA | null {
      const mensaje = contenido.trim();

      if (!mensaje) {
        return null;
      }

      this.procesandoMensaje = true;

      const respuesta = enviarMensajePruebaIA(mensaje);

      this.sesionPrueba = obtenerSesionPruebaIA();

      this.procesandoMensaje = false;

      return respuesta;
    },

    reiniciarPrueba(): void {
      this.sesionPrueba = reiniciarSesionPruebaIA();
    },
  },
});
