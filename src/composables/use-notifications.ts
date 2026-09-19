import { Notify } from 'quasar';

interface ConfiguracionNotificacion {
  mensaje: string;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  timeout?: number;
}

export function useNotifications() {
  const mostrarExito = (
    mensaje: string,
    configuracion?: Omit<ConfiguracionNotificacion, 'mensaje'>,
  ): void => {
    Notify.create({
      type: 'positive',
      message: mensaje,
      position: configuracion?.position ?? 'top-right',
      timeout: configuracion?.timeout ?? 2500,
    });
  };

  const mostrarError = (
    mensaje: string,
    configuracion?: Omit<ConfiguracionNotificacion, 'mensaje'>,
  ): void => {
    Notify.create({
      type: 'negative',
      message: mensaje,
      position: configuracion?.position ?? 'top-right',
      timeout: configuracion?.timeout ?? 3500,
    });
  };

  const mostrarAdvertencia = (
    mensaje: string,
    configuracion?: Omit<ConfiguracionNotificacion, 'mensaje'>,
  ): void => {
    Notify.create({
      type: 'warning',
      message: mensaje,
      position: configuracion?.position ?? 'top-right',
      timeout: configuracion?.timeout ?? 3000,
    });
  };

  const mostrarInformacion = (
    mensaje: string,
    configuracion?: Omit<ConfiguracionNotificacion, 'mensaje'>,
  ): void => {
    Notify.create({
      type: 'info',
      message: mensaje,
      position: configuracion?.position ?? 'top-right',
      timeout: configuracion?.timeout ?? 3000,
    });
  };

  return {
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInformacion,
  };
}
