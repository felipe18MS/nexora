import { defineStore } from 'pinia';

import {
  actualizarConfiguracionWhatsApp,
  cambiarEstadoConexionWhatsApp,
  enviarMensajeWhatsApp,
  obtenerConfiguracionWhatsApp,
  obtenerConexionWhatsApp,
  obtenerMensajesWhatsApp,
} from '../services/whatsapp.service';

import type {
  ConfiguracionWhatsApp,
  CrearMensajeWhatsApp,
  ConexionWhatsApp,
  MensajeWhatsApp,
} from '../types/whatsapp.types';

interface WhatsAppState {
  conexion: ConexionWhatsApp | null;
  mensajes: MensajeWhatsApp[];
  configuracion: ConfiguracionWhatsApp | null;
  cargando: boolean;
}

export const useWhatsAppStore = defineStore('whatsapp', {
  state: (): WhatsAppState => ({
    conexion: null,
    mensajes: [],
    configuracion: null,
    cargando: false,
  }),

  getters: {
    conectado: (state) => state.conexion?.estado === 'conectado',

    totalMensajes: (state) => state.mensajes.length,

    mensajesEnviados: (state) =>
      state.mensajes.filter((mensaje) => mensaje.direccion === 'saliente').length,

    mensajesRecibidos: (state) =>
      state.mensajes.filter((mensaje) => mensaje.direccion === 'entrante').length,
  },

  actions: {
    cargarWhatsApp(): void {
      this.cargando = true;

      this.conexion = obtenerConexionWhatsApp();
      this.mensajes = obtenerMensajesWhatsApp();
      this.configuracion = obtenerConfiguracionWhatsApp();

      this.cargando = false;
    },

    enviarMensaje(datos: CrearMensajeWhatsApp): boolean {
      const mensaje = enviarMensajeWhatsApp(datos);

      if (!mensaje) {
        return false;
      }

      this.mensajes = obtenerMensajesWhatsApp();
      this.conexion = obtenerConexionWhatsApp();

      return true;
    },

    actualizarConfiguracion(datos: ConfiguracionWhatsApp): void {
      this.configuracion = actualizarConfiguracionWhatsApp(datos);

      this.conexion = obtenerConexionWhatsApp();
    },

    cambiarEstadoConexion(estado: ConexionWhatsApp['estado']): void {
      this.conexion = cambiarEstadoConexionWhatsApp(estado);
    },
  },
});
