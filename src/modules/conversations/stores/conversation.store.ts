import { defineStore } from 'pinia';

import {
  crearConversacion,
  enviarMensaje,
  marcarConversacionLeida,
  obtenerConversaciones,
  obtenerConversacionPorId,
  obtenerMensajesPorConversacion,
} from '../services/conversation.service';

import type {
  Conversacion,
  CrearConversacion,
  EnviarMensaje,
  MensajeConversacion,
} from '../types/conversation.types';

interface ConversationState {
  conversaciones: Conversacion[];
  mensajes: MensajeConversacion[];
  cargando: boolean;
}

export const useConversationStore = defineStore('conversations', {
  state: (): ConversationState => ({
    conversaciones: [],
    mensajes: [],
    cargando: false,
  }),

  getters: {
    totalConversaciones: (state) => state.conversaciones.length,

    abiertas: (state) =>
      state.conversaciones.filter((conversacion) => conversacion.estado === 'abierta').length,

    pendientes: (state) =>
      state.conversaciones.filter((conversacion) => conversacion.estado === 'pendiente').length,

    noLeidas: (state) =>
      state.conversaciones.filter((conversacion) => conversacion.mensajesNoLeidos > 0).length,
  },

  actions: {
    cargarConversaciones(): void {
      this.cargando = true;
      this.conversaciones = obtenerConversaciones();
      this.cargando = false;
    },

    cargarMensajes(conversacionId: string): void {
      this.mensajes = obtenerMensajesPorConversacion(conversacionId);
    },

    obtenerConversacion(id: string): Conversacion | undefined {
      return obtenerConversacionPorId(id);
    },

    crearConversacion(datos: CrearConversacion): Conversacion {
      const conversacion = crearConversacion(datos);

      this.conversaciones = obtenerConversaciones();

      return conversacion;
    },

    enviarMensaje(datos: EnviarMensaje): boolean {
      const mensaje = enviarMensaje(datos);

      if (!mensaje) {
        return false;
      }

      this.mensajes = obtenerMensajesPorConversacion(datos.conversacionId);

      this.conversaciones = obtenerConversaciones();

      return true;
    },

    marcarLeida(id: string): boolean {
      const conversacion = marcarConversacionLeida(id);

      if (!conversacion) {
        return false;
      }

      this.conversaciones = obtenerConversaciones();

      return true;
    },
  },
});
