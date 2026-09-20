import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useConversationStore } from '../stores/conversation.store';

import type { CrearConversacion, EnviarMensaje } from '../types/conversation.types';

export const useConversations = () => {
  const conversationStore = useConversationStore();

  const { conversaciones, mensajes, cargando } = storeToRefs(conversationStore);

  const totalConversaciones = computed(() => conversationStore.totalConversaciones);

  const abiertas = computed(() => conversationStore.abiertas);

  const pendientes = computed(() => conversationStore.pendientes);

  const noLeidas = computed(() => conversationStore.noLeidas);

  const cargarConversaciones = (): void => {
    conversationStore.cargarConversaciones();
  };

  const cargarMensajes = (conversacionId: string): void => {
    conversationStore.cargarMensajes(conversacionId);
  };

  const crearConversacion = (datos: CrearConversacion) => {
    return conversationStore.crearConversacion(datos);
  };

  const enviarMensaje = (datos: EnviarMensaje): boolean => {
    return conversationStore.enviarMensaje(datos);
  };

  const marcarLeida = (id: string): boolean => {
    return conversationStore.marcarLeida(id);
  };

  return {
    conversaciones,
    mensajes,
    cargando,
    totalConversaciones,
    abiertas,
    pendientes,
    noLeidas,
    cargarConversaciones,
    cargarMensajes,
    crearConversacion,
    enviarMensaje,
    marcarLeida,
  };
};
