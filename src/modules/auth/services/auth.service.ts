import {
  autenticarConGoogleMock,
  autenticarUsuarioMock,
  registrarUsuarioMock,
} from '../mocks/auth.mock';

import type {
  CredencialesLogin,
  CredencialesRegistro,
  ResultadoLogin,
  ResultadoRegistro,
} from '../types/auth.types';

export const authService = {
  iniciarSesion(credenciales: CredencialesLogin): ResultadoLogin {
    return autenticarUsuarioMock(credenciales);
  },

  iniciarSesionConGoogle(): ResultadoLogin {
    return autenticarConGoogleMock();
  },

  registrar(datos: CredencialesRegistro): ResultadoRegistro {
    return registrarUsuarioMock(datos);
  },
};
