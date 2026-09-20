import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useWhatsAppStore } from '../stores/whatsapp.store';

import type {
  ConfiguracionWhatsApp,
  CrearMensajeWhatsApp,
  ConexionWhatsApp,
} from '../types/whatsapp.types';

export const useWhatsApp = () => {
  const whatsappStore = useWhatsAppStore();

  const { conexion, mensajes, configuracion, cargando } = storeToRefs(whatsappStore);

  const conectado = computed(() => whatsappStore.conectado);

  const totalMensajes = computed(() => whatsappStore.totalMensajes);

  const mensajesEnviados = computed(() => whatsappStore.mensajesEnviados);

  const mensajesRecibidos = computed(() => whatsappStore.mensajesRecibidos);

  const cargarWhatsApp = (): void => {
    whatsappStore.cargarWhatsApp();
  };

  const enviarMensaje = (datos: CrearMensajeWhatsApp): boolean => {
    return whatsappStore.enviarMensaje(datos);
  };

  const actualizarConfiguracion = (datos: ConfiguracionWhatsApp): void => {
    whatsappStore.actualizarConfiguracion(datos);
  };

  const cambiarEstadoConexion = (estado: ConexionWhatsApp['estado']): void => {
    whatsappStore.cambiarEstadoConexion(estado);
  };

  return {
    conexion,
    mensajes,
    configuracion,
    cargando,
    conectado,
    totalMensajes,
    mensajesEnviados,
    mensajesRecibidos,
    cargarWhatsApp,
    enviarMensaje,
    actualizarConfiguracion,
    cambiarEstadoConexion,
  };
};
